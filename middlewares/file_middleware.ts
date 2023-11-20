import multer from 'fastify-multer';
import { MultipartFile } from '@tsed/common';

declare module 'fastify' {
    export interface FastifyRequest {
        file: MultipartFile;
    }
}
export default class FileMiddleware {
    static store = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });
    // Add file size limit (in bytes)
    static fileSizeLimit = 5 * 1024 * 1024; // 5 MB

    //  Multer middleware with file size limit
    static uploadImage = multer({
        storage: FileMiddleware.store,
        limits: { fileSize: FileMiddleware.fileSizeLimit },
        fileFilter: (req, file, cb) => {
            const allowedFileTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];

            if (!allowedFileTypes.includes(file.mimetype)) {
                cb(new Error('Invalid file type'));
            }
            else if (file.size! > FileMiddleware.fileSizeLimit) {
                cb(new Error('File size is greater than 5 MB'));
            }
            else {
                cb(null, true);
            }
        }
    });
}
