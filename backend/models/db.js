const mongoose = require('mongoose');
const mongo_url = process.env.MONGO_URI;
console.log(mongo_url);
mongoose.connect(mongo_url)
.then(()=>console.log("database connected"))
.catch((error)=>console.log(error))
