require('dotenv').config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl ="mongodb+srv://rajesh26012004:rajesh2004@cluster0.vqzhhfz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

main()
  .then(() => {
    console.log("Connection success");
  })
  .catch((err) => console.log("Connection error:", err));

async function main() {
  await mongoose.connect(dbUrl);
}
const initDB=async ()=>
    {
       await Listing.deleteMany({});
   initData.data =   initData.data.map((obj)=>
    ({
        ...obj,owner:'66a4909554d50d2df8296cde'
    }));
     await Listing.insertMany(initData.data);
       console.log("data was initilized");
    };
    initDB();