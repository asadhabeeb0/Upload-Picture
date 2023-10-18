const express = require('express');
const multer = require("multer");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() +
      path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single("myImage");

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Allowed Only!');
  }
}

const staticpath = path.join(__dirname, "../public");
const templatepath = path.join(__dirname, "../templates/views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticpath));
app.set("view engine", "ejs");
app.set("views", templatepath);
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
})

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render("index", {
        msg: err
      });
    } else {
      if (req.file == undefined) {
        res.render('index', {
          msg: 'Error: No File Selected!'
        });
      } else {
        res.render('index', {
          msg: 'Uploaded Successfully!',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});