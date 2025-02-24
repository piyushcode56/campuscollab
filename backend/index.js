const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
require('dotenv').config();
require('./models/db.js')
const projectRouter = require('./routes/projectRouter.js');
const userRouter = require('./routes/userRouter.js')
const bodyParser = require('body-parser');
const editProjectRouter = require('./routes/EditProjectRouter.js')
app.use(bodyParser.json())
const cors = require('cors');
const path = require('path');
app.use(cors());
app.use(express.urlencoded({ extended: true })); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/projects', projectRouter)
app.use('/user', userRouter)
app.use('/editproject', editProjectRouter)

app.listen(PORT ,()=>{
    console.log(`server is running on port ${PORT}`);
})