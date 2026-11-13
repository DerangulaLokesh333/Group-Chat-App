
require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const sequelize = require("./config/database");

const User = require("./models/user");
const Message = require("./models/message");

const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"));
});

// User and Message relationship
User.hasMany(Message, {
    foreignKey: "userId"
});

Message.belongsTo(User, {
    foreignKey: "userId"
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
