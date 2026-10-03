const express = require("express");
const Bus = require("../models/Bus");
const { auth, admin } = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const q = {};
    if (req.query.from) q.from = new RegExp(req.query.from, "i");
    if (req.query.to) q.to = new RegExp(req.query.to, "i");
    const buses = await Bus.find(q).sort({ createdAt: -1 });
    res.json(buses);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get("/:id", async (req, res) => {
  try { res.json(await Bus.findById(req.params.id)); }
  catch (e) { res.status(404).json({ message: "Bus not found" }); }
});

router.post("/", auth, admin, async (req, res) => {
  try {
    const bus = await Bus.create({ ...req.body, availableSeats: req.body.totalSeats });
    res.status(201).json(bus);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put("/:id", auth, admin, async (req, res) => {
  try { res.json(await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete("/:id", auth, admin, async (req, res) => {
  try { await Bus.findByIdAndDelete(req.params.id); res.json({ message: "Bus deleted" }); }
  catch (e) { res.status(400).json({ message: e.message }); }
});

module.exports = router;