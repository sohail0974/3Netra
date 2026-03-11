const express = require('express');
const router = express.Router();
const Report = require('../models/submitReport');
const upload = require('../middleware/uploadmiddleware');
const ensureAuthenticated = require('../middleware/Auth');
const { getMyReports, submitReport } = require('../controllers/ReportController');

router.get('/',async (req,res)=>{
    try{
        const reports = await Report.find().sort({createdAt : -1});
        res.status(200).json(reports);
    }
    catch(error){
        res.status(500).json({error : error.message});
    }
})

// ensureAuthenticated reads the token so userId can be saved with the report
router.post('/', ensureAuthenticated, upload.single('evidence'), submitReport);

// Protected route - only logged-in users can see their own reports
router.get('/my-reports', ensureAuthenticated, getMyReports);

module.exports = router;