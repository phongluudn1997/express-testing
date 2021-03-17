var express = require("express");
var router = express.Router();
var Book = require("../models/book");
var moment = require("moment");
const checkToken = require("../middleware/checkToken");
const BookItem = require("../models/bookItem");

router.post("/", checkToken, async (req, res, next) => {
  const { userId } = req.decoded;
  const { bookId } = req.body;
  const bookItem = new BookItem({
    bookId,
    ownerId: userId,
    startDate: Date.now(),
  });
  try {
    const savedBookItem = await bookItem.save();
    return res.status(200).json({
      message: "Add to bookItem",
      data: savedBookItem,
    });
  } catch (error) {
    throw Error(error);
  }
});

module.exports = router;
