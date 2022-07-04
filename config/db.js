const mongoose = require("mongoose");

module.exports = async function connection() {
    try {
        const connectionParams = {
            useNewUrlParser: true,
        };
        await mongoose.connect("mongodb+srv://zeeshan:Attornea@attornea.1s7ub.mongodb.net/test", connectionParams);
        console.log("connected to database.");
    } catch (error) {
        console.log(error, "could not connect to database.");
    }
};
