var express = require("express");
var router = express.Router();
var Book = require("../models/book");
var moment = require("moment");
const checkToken = require("../middleware/checkToken");
const checkAuth = require("../middleware/checkAuth");
const define = require("../lib/define");

// Get products by Category
// router.get("/category/:_idCat", (req, res, next) => {
//   Product.find({ category: req.params["_idCat"] })
//     .populate("category")
//     .exec()
//     .then((docs) => {
//       const response = {
//         success: true,
//         count: docs.length,
//         products: docs.map((doc) => {
//           return {
//             // user: doc.user,
//             _id: doc._id,
//             name: doc.name,
//             category: doc.category.name,
//             price: doc.price + "đ",
//             // quantity: doc.quantity,
//             // description: doc.description,
//             created_at: moment(doc.created_at).format("dddd"),
//             image: `http://localhost:3000/${doc.images[0]}`,
//           };
//         }),
//       };
//       res.status(200).json(response);
//     })
//     .catch((err) => {
//       res.status(200).json({
//         success: false,
//         message: err,
//       });
//     });
// });

// Post a product - check if login - check if permission
router.post("/", async (req, res, next) => {
  const book = new Book({
    ...req.body,
  });
  book
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Created product successfully",
        data: {
          book,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: err,
      });
    });
});

router.get("/discover", async (req, res, next) => {
  try {
    const books = await Book.find({});
    return res.status(200).json({
      data: {
        books,
      },
    });
  } catch (error) {
    throw Error(error);
  }
});

router.get("/", async (req, res, next) => {
  console.log(req.query.search);
  try {
    const books = await Book.find({
      title: { $regex: req.query.search, $options: "i" },
    });
    return res.status(200).json({
      data: {
        books,
      },
    });
  } catch (error) {
    throw Error(error);
  }
});

// Get product by id
// router.get("/:_id", (req, res, next) => {
//   const _id = req.params._id;
//   Product.findOne({ _id: _id })
//     .populate("user")
//     .populate("category")
//     .exec()
//     .then((product) => {
//       res.json({
//         success: true,
//         name: product.name,
//         price: new Intl.NumberFormat("de-DE", {
//           style: "currency",
//           currency: "VND",
//         }).format(product.price),
//         images: product.images.map((image) => "http://localhost:3000/" + image),
//         quantity: product.quantity,
//         category: product.category.name,
//         user_name: product.user.email,
//         description: product.description,
//       });
//     })
//     .catch((err) => {
//       res.json({
//         success: false,
//         message: "No Product",
//       });
//     });
// });

module.exports = router;
