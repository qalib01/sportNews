const db = require('../../models/index');
const { sequelize } = require('../../models/index');
const moment = require('moment');
const multer = require('multer');

let img;
let storageImg = multer.diskStorage({ // Set the storage engine for multer
  destination: (req, file, callback) => {
    callback(null, 'public/images/products/flowers'); // Define the destination folder for uploaded files
  },
  filename: (req, file, callback) => {
    // let fileName = req.body.flowerName;
    let fileExtension = path.extname(file.originalname).toLowerCase();
    img = Date.now() + fileExtension;
    callback(null, img); // Define the filename for uploaded files
  },
});
let upload = multer({ // Initialize the multer middleware
  storage: storageImg,
  limits: { fileSize: 5000000 }, // Define the maximum file size
  timeout: 30000, // 30 seconds
});

const createNews = async (req, res, next) => {
    upload.single('flowerImage');
    console.log('Test');
}

module.exports = { createNews }