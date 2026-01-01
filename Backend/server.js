require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const AuthRouter = require('./routes/AuthRouter');
const Reportroute = require('./routes/Report');


const app = express();

app.use(express.json());
app.use(cors());
//any request coming from frontend is handled is by the Reportroute which is the Report.js file
app.use('/api/reports',Reportroute);
app.use('/auth',AuthRouter);

app.use((err, req, res, next) => {
    console.error(" Server Error:", err); 

    
    if (typeof err === 'string') {
        return res.status(400).json({ error: err });
    }
    
    
    if (err.name === 'MulterError') {
        return res.status(400).json({ error: err.message });
    }

    
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