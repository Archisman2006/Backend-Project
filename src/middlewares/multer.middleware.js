import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
    //cb(null,file.originalname)
    }
})
const fileFilter=(req,file,cb)=>{
    const isVideo=file.fieldname==="videoFile";
    const isImage=file.fieldname==="thumbnail" || file.fieldname==="image" || 
    file.fieldname==="avatar" || file.fieldname==="coverImage";
    const videoTypes=["video/mp4","video/webm","video/quicktime"];
    const imageTypes=["image/jpeg","image/png","image/webp"];
    if(isVideo && videoTypes.includes(file.mimetype)) return cb(null,true)
    if(isImage && imageTypes.includes(file.mimetype)) return cb(null,true)
    cb(new Error("invalid file type for field: "+ file.fieldname),false);
};
export const upload = multer({ storage: storage,fileFilter})