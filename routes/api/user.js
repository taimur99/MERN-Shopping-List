const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

// Register a new user
router.post("/", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: "please enter all fields" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "user already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await new User({ name, email, password: hashedPassword }).save();
        const token = jwt.sign({ id: user.id }, config.get("jwtSecret"), { expiresIn: 3600 });

        return res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (err) {
        return res.status(500).json({ msg: "server error" });
    }
});

module.exports = router;
