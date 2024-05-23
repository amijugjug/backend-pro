import multer from "multer";
import { separateFilename } from "../utils/Validations.js";

// Saving the file in diskStorage.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/static");
  },
  filename: function (req, filename, cb) {
    const [name, extension] = separateFilename(filename.originalname);

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, name + "-" + uniqueSuffix + "." + extension);
  },
});

export const upload = multer({
  storage,
});
