const mongoose = require("mongoose");

const connectDB = async () => {
    const conn = await mongoose.connect(
<<<<<<< HEAD
        "mongodb+srv://susmi0008:Y5SJ8Ou9ChANxBUf@clustersusmi.2kxo8lf.mongodb.net/edusphere?retryWrites=true&w=majority&appName=ClusterSusmi"  
=======
        "mongodb+srv://susmi0008:Y5SJ8Ou9ChANxBUf@clustersusmi.2kxo8lf.mongodb.net/edusphere?retryWrites=true&w=majority&appName=ClusterSusmi"
  
>>>>>>> e5a72646935e9bfb2c28f6e3912ac87ec1b6b184
    );
    console.log(`MongoDB connected ${conn.connection.host}`);
};

module.exports = connectDB;