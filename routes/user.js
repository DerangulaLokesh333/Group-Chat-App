const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const User = require("../models/user");

const router = express.Router();

// Signup API
router.post("/signup", async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { phone }]
            }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email or phone number already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            phone,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {
        console.error("Signup error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

// Login API
router.post("/login", async (req, res) => {
    try {
        const { emailOrPhone, password } = req.body;

        if (!emailOrPhone || !password) {
            return res.status(400).json({
                message: "Email/phone and password are required"
            });
        }

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: emailOrPhone },
                    { phone: emailOrPhone }
                ]
            }
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email/phone or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email/phone or password"
            });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;