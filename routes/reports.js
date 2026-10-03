const express = require("express");
const Booking = require("../models/Booking");
const { auth, admin } = require("../middleware/auth");
const router = express.Router();

router.get("/bookings", auth, admin, async (req, res) => {
  const data = await Booking.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  res.json(data);
});

router.get("/revenue", auth, admin, async (req, res) => {
  const data = await Booking.aggregate([
    { $match: { status: "confirmed" } },
    { $group: { _id: null, revenue: { $sum: "$amount" }, tickets: { $sum: "$seats" } } }
  ]);
  res.json(data[0] || { revenue: 0, tickets: 0 });
});

router.get("/cancellations", auth, admin, async (req, res) => {
  const data = await Booking.countDocuments({ status: "cancelled" });
  res.json({ cancellations: data });
});

module.exports = router;