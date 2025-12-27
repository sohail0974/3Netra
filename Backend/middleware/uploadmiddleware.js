const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'3Netra_Evidence',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
})


const upload = multer({
    storage:storage,
    limits: {fileSize:5000000},
    fileFilter:function(req,file,cb){
        checkFileType(file,cb);
    }
})
function checkFileType(file,cb){
    const filetypes = /jpeg|jpg|png/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    const mimetype = filetypes.test(file.mimetype);

    if(extname && mimetype){
        return cb(null,true);
    }
    else{
       cb('Error : images only!');
    }
}
module.exports = upload;