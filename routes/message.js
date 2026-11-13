
const express = require("express");
const Message = require("../models/message");
const User = require("../models/user");
const authenticateUser = require("../middleware/auth");

const router = express.Router();

// API to save a chat message
router.post("/send", authenticateUser, async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        const userId = req.user.id;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const newMessage = await Message.create({
            message: message.trim(),
            userId: userId
        });

        return res.status(201).json({
            success: true,
            message: "Message saved successfully",
            data: newMessage
        });

    } catch (error) {
        console.error("Error saving message:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save message"
        });
    }
});

module.exports = router;
