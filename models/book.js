var mongoose = require("mongoose");

const Book = mongoose.Schema({
  title: { type: String },
  author: { type: String },
  coverImageUrl: { type: String },
  pageCount: { type: Number },
  publisher: String,
  synopsis: String,
});

module.exports = mongoose.model("Book", Book, "books");
