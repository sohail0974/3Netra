require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Reportroute = require('./routes/Report')

const app = express();

app.use(express.json());
app.use(cors());
//any request coming from frontend is handled is by the Reportroute which is the Report.js file
app.use('/api/reports',Reportroute);

app.use((err, req, res, next) => {
    console.error(" Server Error:", err); 

    // 1. Handle errors that are just strings (like from our checkFileType function)
    if (typeof err === 'string') {
        return res.status(400).json({ error: err });
    }
    
    // 2. Handle standard Multer errors (like "File too large")
    if (err.name === 'MulterError') {
        return res.status(400).json({ error: err.message });
    }

    // 3. Handle any other unexpected server errors
    // Check if headers have already been sent to avoid another error
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: 'An unexpected internal server error occurred.' });
});

const startServer = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to DB");

        app.listen(process.env.PORT,()=>{
            console.log(`app is listening at ${process.env.PORT}`);
        })
    
    }
    catch(error){
        console.log("error in connecting",error.message); 
        process.exit(1);
    }
}
startServer();