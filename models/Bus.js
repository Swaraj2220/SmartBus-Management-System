const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  operator: { type: String, default: "SmartBus" },
  from: { type: String, required: true },
  to: { type: String, required: true },
  totalSeats: { type: Number, required: true, min: 1 },
  availableSeats: { type: Number, required: true, min: 0 },
  price: { type: Number, default: 100 },
  status: { type: String, default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("Bus", schema);