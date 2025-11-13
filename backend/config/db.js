import mongoose  from "mongoose";

export const connectDB = async () => {
     await mongoose.connect('mongodb+srv://mukeshkviitk_db_user:Xo5D7f680c6QMRxo@cluster0.bhjkljo.mongodb.net/Food-Delivery').then(()=>console.log("MongoDB connected"))
}