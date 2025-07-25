const express = require("express");
const router = express.Router();
const { getMediaFiles, streamFileById } = require("../controllers/fileController");

router.get("/", getMediaFiles);
router.get("/stream/:fileId", streamFileById);




module.exports = router;
