import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/userRoute.js';
import authRouter from './routes/authRoute.js';
import listingRouter from './routes/listingRoute.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import Razorpay from 'razorpay';
import cors from 'cors';
import crypto from 'crypto'

dotenv.config();
const __dirname = path.resolve();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
    });

// Set up CORS
app.use(cors());

// Routers
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// Checkout API
app.post("/order", async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET,
        });

        const options = req.body;
        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).send("Something went wrong");
        }

        res.json(order);
    } catch (err) {
        console.error("Error creating order", err);
        res.status(500).send("Internal Server Error");
    }
});


// app.post("/order/validate",async(req,res)=>{
// const {razorpay_order_id,razorpay_payment_id} = req.body;

// const sha=crypto.createHmac("sha256",process.env.KEY_SECRET);

// sha.update(`${razorpay_order_id} | ${razorpay_payment_id}`);
// const digest=sha.digest("hex");
// if (digest!==razorpay_signature){
//     return res.status(400).json({msg:"Transaction is not legit!"});
// }

// res.json({
//     msg : "Payment verified",
//     orderId:razorpay_order_id,
//     paymentId:razorpay_payment_id,
// })

// })
// Serve static files
app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

// Start the server
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
