const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const tweetRoutes = require("./routes/tweetRoutes");
const userRoutes = require("./routes/userRoutes");
const searchRoutes = require("./routes/searchRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const trendingRoutes = require("./routes/trendingRoutes");

const errorHandler = require("./middleware/errorMiddleware");
const protect = require("./middleware/authMiddleware");

dotenv.config();

// Connect DB
connectDB();

// Connect Redis
require("./config/redis");

const app = express();

// Security
app.use(helmet());

// Compress all responses
app.use(compression());
app.use(morgan("dev"));
// Enable CORS
app.use(cors());

// Parse JSON
app.use(express.json());


/* =========================
   Routes
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/tweets", tweetRoutes);
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/trending", trendingRoutes);
app.get("/", (req, res) => {
  res.send("Twitter Feed System API Running");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

/* =========================
   Error Middleware
========================= */

app.use(errorHandler);

/* =========================
   Socket.IO
========================= */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.set("io", io);

/* =========================
   Start Server
========================= */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});