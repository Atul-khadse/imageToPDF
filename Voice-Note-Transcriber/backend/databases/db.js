const mongoose = require("mongoose");
require("dotenv").config();



const connectDB = async() => {
    try {
        await mongoose.connect(process.env.DATABASE_URL,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
        });

        console.log('database connection succecfully');
    } catch (error) {
        console.log("database connection issue");
        process.exit(1);
    }
};



module.exports = connectDB;