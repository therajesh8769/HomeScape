const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

main()
.then((res)=>
{
    console.log("connection success");

})
.catch((err)=>console.log(err));
async function main()
{
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderLust");

};
const initDB=async ()=>
    {
       await Listing.deleteMany({});
   initData.data =   initData.data.map((obj)=>
    ({
        ...obj,owner:'668940c504368e4d8262c144'
    }));
       await Listing.insertMany(initData.data);
       console.log("data was initilized");
    };
    initDB();