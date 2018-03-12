const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const searchtermSchema = new Schema({
  "term": String,
  "when" : { type: Date, default: Date.now() }
});

const SearchTerm = mongoose.model("SearchTerm", searchtermSchema);

module.exports = SearchTerm;
