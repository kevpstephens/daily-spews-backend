import multer from "multer";

const storage = multer.memoryStorage(); // prepares for cloud upload like Supabase
const upload = multer({ storage });

export default upload;
