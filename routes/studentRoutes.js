const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const studentController = require("../controllers/studentController");
const scheduleController = require("../controllers/scheduleController");
const gradesController = require("../controllers/gradesController");
const documentsController = require("../controllers/documentsController");

router.get("/profile", authMiddleware, studentController.getProfile);

router.get("/schedule/week", authMiddleware, scheduleController.getWeeklySchedule);
router.get("/schedule/today", authMiddleware, scheduleController.getTodaySchedule);

router.get("/grades", authMiddleware, gradesController.getStudentGrades);

router.get("/documents", authMiddleware, documentsController.getStudentDocuments);

module.exports = router;
