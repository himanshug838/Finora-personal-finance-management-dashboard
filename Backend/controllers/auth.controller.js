import express from "express"
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import verificationToken from "../middleware/verifyToken.middle.js";

const authController = express();

authController.post("/register", async(req,res) => {

    try{
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)
        
        if( !username || !email || !password ) return;

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: "User already existed" });
        }

        const user = new User({ username, email, password: hashedPassword })
        const savedUser = await user.save();

        res.status(201).json({ message: " User created successfully "});
        console.log(savedUser);

    } catch(err){
        res.status(400).json({ message: err.message })
    }
})

authController.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User does not have an account"
            });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username},
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        )
        console.log(token);
        res.cookie("token",token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

authController.get("/users",verificationToken ,(req,res) => {
    res.end("hi")
})

authController.put("/update", (req,res) => {
    res.json({
        message: "Update Endpoint"
    })
})

authController.delete("/delete", (req,res) => {
    res.json({
        message: "Delete Endpoint"
    })
})


export default authController;