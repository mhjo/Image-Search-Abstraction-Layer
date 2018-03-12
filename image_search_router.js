const express = require('express');
const GoogleImages = require('google-images');
const mongoose = require('mongoose');

const SearchTerm = require('./image_search_model');
const router = express.Router();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', console.error.bind(console, "Connection Error: "));
mongoose.connection.once('open', () => console.log("MongoDB Connected!"));

const imageClient = new GoogleImages(process.env.CSE_ID, process.env.CSE_KEY);

router.get('/imagesearch/:keyword', handleGetImagesearch);
router.get('/latest/imagesearch', handleGetLatestImagesearch);

module.exports = router;

function handleGetImagesearch(req, res) {
  const keyword = req.params.keyword;
  const offset = Number(req.query.offset);
  
  const term = new SearchTerm({
    term: keyword
  });
  term.save((err, result) => {
    if (err) throw err;
    console.log(result);
  });

  imageClient.search(keyword, {page: offset || 1})
    .then((images) => {
      res.json(images);
    });
}

function handleGetLatestImagesearch(req, res) {
  // DB에서 최근 10개의 데이터를 가져와서 API로 출력
  SearchTerm.find({}, {"term": true, "when": true, "_id": false}).sort({"when": -1}).limit(10).exec((err, result) => {
    res.json(result);
  });
}
