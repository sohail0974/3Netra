const express = require('express');
const router = express.Router();
const Report = require('../models/submitReport');
const upload = require('../middleware/uploadmiddleware')

router.get('/',async (req,res)=>{
    try{
        const reports = await Report.find().sort({createdAt : -1});
        res.status(200).json(reports);
    }
    catch(error){
        res.status(500).json({error : error.message});
    }
})
router.post('/',upload.single('evidence'), async (req,res)=>{
    const {location,description,dateandtime} = req.body;
    const evidencePath = req.file? req.file.path : null;
    console.log(req.file);
    try{
    const newReport = await Report.create({
        location:JSON.parse(location),
        address :address || "Unknown Location",
        description,
        dateandtime,
        evidence:evidencePath
    })
    res.status(201).json(newReport);
    }
    catch(error){
        console.error("Error saving report:", error);
        res.status(400).json({error:error.message});
    }
});
module.exports = router;