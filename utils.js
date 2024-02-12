import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
/*---------------------------------------------------------------------------------
*                                     __dirname                                   *
*_________________________________________________________________________________*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;
/*---------------------------------------------------------------------------------
*                                       Multer                                    *
*_________________________________________________________________________________*/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/src/public/img`)
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})
/*---------------------------------------------------------------------------------
*                                      Uploader                                   *
*_________________________________________________________________________________*/
export const uploader = multer({
    storage,
    onError: function (err, next) {
        console.log(err);
        next();
    }
})