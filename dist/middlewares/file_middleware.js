"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_multer_1 = __importDefault(require("fastify-multer"));
class FileMiddleware {
}
FileMiddleware.store = fastify_multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
// Add file size limit (in bytes)
FileMiddleware.fileSizeLimit = 5 * 1024 * 1024; // 5 MB
//  Multer middleware with file size limit
FileMiddleware.uploadImage = (0, fastify_multer_1.default)({
    storage: FileMiddleware.store,
    limits: { fileSize: FileMiddleware.fileSizeLimit },
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
        if (!allowedFileTypes.includes(file.mimetype)) {
            cb(new Error('Invalid file type'));
        }
        else if (file.size > FileMiddleware.fileSizeLimit) {
            cb(new Error('File size is greater than 5 MB'));
        }
        else {
            cb(null, true);
        }
    }
});
exports.default = FileMiddleware;
