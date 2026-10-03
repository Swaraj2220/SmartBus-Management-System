const express = require("express");
const Schedule = require("../models/Schedule");
const { auth, admin } = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => res.json(await Schedule.find().populate("bus route").sort({ date: 1, time: 1 })));
router.get("/:id", async (req, res) => res.json(await Schedule.findById(req.params.id).populate("bus route")));
router.post("/", auth, admin, async (req, res) => res.status(201).json(await Schedule.create(req.body)));
router.put("/:id", auth, admin, async (req, res) => res.json(await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete("/:id", auth, admin, async (req, res) => { await Schedule.findByIdAndDelete(req.params.id); res.json({ message: "Schedule deleted" }); });

module.exports = router;