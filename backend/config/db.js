const mongoose = require("mongoose");
const seedDatabase = require("./seed");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected");
        await seedDatabase();
    } catch (error) {
        console.log("❌ Database Connection Failed");
        console.log(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;