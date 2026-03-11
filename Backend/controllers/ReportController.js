const Report = require('../models/submitReport');

const submitReport = async (req, res) => {
    try {
        // userId comes from the ensureAuthenticated middleware via the JWT token
        const userId = req.user._id;

        const { location, description, dateandtime, address } = req.body;
        const evidencePath = req.file ? req.file.path : null;

        const newReport = await Report.create({
            userId,
            location: JSON.parse(location),
            address: address || "Unknown Location",
            description,
            dateandtime,
            evidence: evidencePath
        });

        res.status(201).json(newReport);
    } catch (error) {
        console.error("Error saving report:", error);
        res.status(400).json({ error: error.message });
    }
};

const getMyReports = async (req, res) => {
    try {
        // req.user._id is attached by the ensureAuthenticated middleware
        const userId = req.user._id;

        const reports = await Report.find({ userId: userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: reports
        });
    } catch (error) {
        console.error("Error fetching user reports:", error);
        res.status(500).json({ success: false, message: "Server error while fetching reports" });
    }
};

module.exports = { submitReport, getMyReports };
