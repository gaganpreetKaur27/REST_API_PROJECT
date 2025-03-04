//import multer
import multer from "multer";

//configure storage with file name & location
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./uploads/");
  },
  //   filename: (req, file, cb) => {
  //     cb(null, new Date().toISOString() + file.originalname);
  //   }, works on mac
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, "_") + file.originalname);
  },
});

export const upload = multer({ storage });
