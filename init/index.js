const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const listing = require("../model/listing");
const initdata = require("./data");

main()
  .then(async () => {
    console.log("connection database succesfully");
    await initData();
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initData = async () => {
  await listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "6aa2db0e82b39de847e7f56c",
  })); //its create new obj, doesnt change initData>data
  await listing.insertMany(initdata.data);
  console.log(`data intialization success`);
};
