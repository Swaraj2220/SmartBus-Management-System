const express = require("express");
const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { busId, scheduleId, seats, passengerDetails } = req.body;
    const count = Number(seats);
    if (!busId || !count || count < 1) return res.status(400).json({ message: "Bus and seats are required" });

    // Atomic update: only books when enough seats remain.
    const bus = await Bus.findOneAndUpdate(
      { _id: busId, availableSeats: { $gte: count } },
      { $inc: { availableSeats: -count } },
      { new: true }
    );
    if (!bus) return res.status(400).json({ message: "Not enough seats available" });

    const booking = await Booking.create({
      user: req.user.id,
      bus: bus._id,
      schedule: scheduleId || null,
      seats: count,
      passengerDetails: passengerDetails || req.user.name,
      amount: bus.price * count
    });

    const io = req.app.get("io");
    io.to(`bus-${bus._id}`).emit("seatUpdate", { busId: bus._id, availableSeats: bus.availableSeats });

    res.status(201).json(booking);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get("/", auth, async (req, res) => {
  const q = req.user.role === "admin" ? {} : { user: req.user.id };
  res.json(await Booking.find(q).populate("user bus schedule").sort({ createdAt: -1 }));
});

router.get("/:id", auth, async (req, res) => {
  const b = await Booking.findById(req.params.id).populate("bus schedule user");
  if (!b) return res.status(404).json({ message: "Booking not found" });
  res.json(b);
});

router.delete("/:id", auth, async (req, res) => {
  const b = await Booking.findById(req.params.id);
  if (!b) return res.status(404).json({ message: "Booking not found" });
  if (String(b.user) !== req.user.id && req.user.role !== "admin") return res.status(403).json({ message: "Not allowed" });
  if (b.status === "cancelled") return res.status(400).json({ message: "Already cancelled" });

  await Bus.findByIdAndUpdate(b.bus, { $inc: { availableSeats: b.seats } });
  b.status = "cancelled";
  await b.save();

  const bus = await Bus.findById(b.bus);
  const io = req.app.get("io");
  io.to(`bus-${b.bus}`).emit("seatUpdate", { busId: b.bus, availableSeats: bus.availableSeats });

  res.json({ message: "Booking cancelled and refund status updated", refundStatus: "refunded", booking: b });
});

module.exports = router;