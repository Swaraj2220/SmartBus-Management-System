const express = require("express");
const Route = require("../models/Route");
const { auth, admin } = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => res.json(await Route.find().sort({ createdAt: -1 })));
router.get("/:id", async (req, res) => res.json(await Route.findById(req.params.id)));
router.post("/", auth, admin, async (req, res) => res.status(201).json(await Route.create(req.body)));
router.put("/:id", auth, admin, async (req, res) => res.json(await Route.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete("/:id", auth, admin, async (req, res) => { await Route.findByIdAndDelete(req.params.id); res.json({ message: "Route deleted" }); });

module.exports = router;