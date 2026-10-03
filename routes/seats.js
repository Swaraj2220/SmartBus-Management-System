const express = require("express");
const Bus = require("../models/Bus");
const router = express.Router();

router.get("/", async (req, res) => {
  const bus = await Bus.findById(req.query.busId);
  if (!bus) return res.status(404).json({ message: "Bus not found" });
  const seats = [];
  for (let i = 1; i <= bus.totalSeats; i++) {
    seats.push({ seat: i, status: i <= bus.totalSeats - bus.availableSeats ? "booked" : "available" });
  }
  res.json({ busId: bus._id, availableSeats: bus.availableSeats, seats });
});

module.exports = router;