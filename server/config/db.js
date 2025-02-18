const mongoose = require("mongoose");

const connectDB = async () => {
    const conn = await mongoose.connect(
        "mongodb+srv://rajnisandhu487:hKfb01TFbTAMnJwm@cluster0.tqmrt1s.mongodb.net/edusphere?retryWrites=true&w=majority&appName=Cluster0" 
         
    );
    console.log(`MongoDB connected ${conn.connection.host}`);
};

module.exports = connectDB;