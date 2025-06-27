const multer = require("multer");

const storage = multer.memoryStorage(); // prepares for cloud upload like Supabase
const upload = multer({ storage });

module.exports = upload;
