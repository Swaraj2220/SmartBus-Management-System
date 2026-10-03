const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  from: String,
  to: String,
  stops: [String]
}, { timestamps: true });

module.exports = mongoose.model("Route", schema);