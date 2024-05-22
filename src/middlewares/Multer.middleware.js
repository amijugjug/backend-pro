import multer from "multer";

// Saving the file in diskStorage.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/static");
  },
  filename: function (req, filename, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalName + "-" + uniqueSuffix);
  },
});

export const upload = multer({
  storage,
});
