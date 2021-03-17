var mongoose = require("mongoose");

const BookItem = mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: Number,
  notes: String,
  finishDate: Date,
  startDate: Date,
});

module.exports = mongoose.model("BookItem", BookItem, "bookItems");
