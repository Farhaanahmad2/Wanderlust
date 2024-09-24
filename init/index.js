const mongoose=require("mongoose");
const initdata=require("./data.js");
const listing=require("../models/listing.js")



// mongoose.connect("mongodb://127.0.0.1:27017/wonderlust")

const dburl=process.env.ATLASDB_URL
async function main(){
    await mongoose.connect(dburl)
}


async function  init(){
  //  await listing.deleteMany({});
   initdata.data=initdata.data.map((obj)=>({
     ...obj,
   owner: "66c388a284ad5dea8a628c62", 
}))

   await listing.insertMany(initdata.data);
     console.log("data initialized")
}

init();
// app.listen(8000,()=>{
//     console.log("server is running port 8000");
// })
