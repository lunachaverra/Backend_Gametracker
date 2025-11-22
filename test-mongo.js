require("dotenv").config();
const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;
console.log("MONGODB_URI existe?:", !!uri);

async function main(){
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS:10000 });
    console.log("Conexión a MongoDB: OK");
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error("Fallo al conectar a MongoDB:");
    console.error(e && e.message ? e.message : e);
    process.exit(1);
  }
}
main();
