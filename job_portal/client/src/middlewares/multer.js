import multer from "multer"
const storage = multer.memeryStorage();
export const singleUpload = multer({storage}).single("file")