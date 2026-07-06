require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require("path");

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server Running' });
});

// Serve Frontend
app.use(express.static(path.join(__dirname, "..")));

// SPA Fallback
app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
        return res.status(404).json({success:false});
    }

    res.sendFile(path.join(__dirname, "..", "index.html"));
});

module.exports = app;
