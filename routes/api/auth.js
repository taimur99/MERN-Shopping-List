const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
const User = require("../../models/user");

// Authenticate a user
router.post("/", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: "please enter all fields" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "user does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "invalid credentials" });
        }

        const token = jwt.sign({ id: user.id }, config.get("jwtSecret"), { expiresIn: 3600 });
        return res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (err) {
        return res.status(500).json({ msg: "server error" });
    }
});

// Get authenticated user data
router.get("/user", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "user not found" });
        }
        return res.json(user);
    } catch (err) {
        return res.status(500).json({ msg: "server error" });
    }
});

module.exports = router;
