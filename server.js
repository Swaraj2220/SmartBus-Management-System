const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.set("io", io);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/buses", require("./routes/buses"));
app.use("/api/routes", require("./routes/routes"));
app.use("/api/schedules", require("./routes/schedules"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/seats", require("./routes/seats"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/notifications", require("./routes/notifications"));

app.get("/api/health", (req, res) => {
  res.json({ message: "SmartBus API is running", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("joinBus", (busId) => socket.join(`bus-${busId}`));
  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`SmartBus running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });