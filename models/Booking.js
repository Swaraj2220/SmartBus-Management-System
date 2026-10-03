const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  schedule: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule" },
  seats: { type: Number, required: true, min: 1 },
  passengerDetails: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["confirmed", "cancelled", "refunded"], default: "confirmed" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", schema);