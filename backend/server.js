import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";

// app config
const app = express();
const PORT = 4000;

// middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// api endPoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"))

app.get('/', (rea, res)=>{
    res.send("API working")
})

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})