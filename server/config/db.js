const mongoose = require("mongoose");

const connectDB = async () => {
    const conn = await mongoose.connect(
        "mongodb+srv://AnnaAshok:Aparna%401997@cluster0.g2jmq0q.mongodb.net/edusphere?retryWrites=true&w=majority&appName=Cluster0y"  );
    console.log(`MongoDB connected ${conn.connection.host}`);
};

module.exports = connectDB;