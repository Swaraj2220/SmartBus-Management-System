const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/send", auth, async (req, res) => {
  res.json({
    message: "Notification simulated successfully",
    to: req.body.to || req.user.email,
    text: req.body.message || "Your SmartBus booking is confirmed."
  });
});

module.exports = router;