const mongoose = require("mongoose");

const connectDB = async () => {
    const conn = await mongoose.connect(
        "mongodb+srv://susmi0008:Y5SJ8Ou9ChANxBUf@clustersusmi.2kxo8lf.mongodb.net/edusphere?retryWrites=true&w=majority&appName=ClusterSusmi"  
    );
    

    console.log(`MongoDB connected ${conn.connection.host}`);
};

module.exports = connectDB;