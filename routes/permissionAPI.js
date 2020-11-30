var express = require("express");
var router = express.Router();
var Permission = require("../models/permission");

router.post("/", (req, res) => {
  const permission = new Permission({
    action_code: req.body.action_code,
    action_name: req.body.action_name,
  });
  permission
    .save()
    .then((result) => {
      res.status(200).json({
        message: "success",
        permission: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "error",
        error: err,
      });
    });
});

router.get("/", (req, res) => {
  Permission.find((err, result) => {
    if (err) {
      res.status(500).json({
        message: "error",
        error: err,
      });
    } else {
      res.status(200).json({
        message: "success",
        permissions: result,
      });
    }
  });
});

module.exports = router;
