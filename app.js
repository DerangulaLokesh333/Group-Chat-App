require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const sequelize = require("./config/database");
const User = require("./models/user");
const userRoutes = require("./routes/user");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"));
});

const PORT = 3000;

sequelize.sync()
    .then(() => {
        console.log("Database connected and tables synchronized");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });