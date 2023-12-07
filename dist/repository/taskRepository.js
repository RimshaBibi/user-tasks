"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const prismaclient_js_1 = __importDefault(require("../prismaclient.js"));
class TaskRepository {
    constructor() {
        this.fileTypeChange = (file_type) => {
            if (file_type === "application/pdf") {
                return 'application_pdf';
            }
            else if (file_type === "image/png") {
                return 'image_png';
            }
            else if (file_type === "image/jpeg") {
                return 'image_jpeg';
            }
            else {
                return 'image_webp';
            }
        };
    }
    async userExist(user_id) {
        const data = await prismaclient_js_1.default.users.findUnique({
            where: {
                user_id: user_id
            }
        });
        return data || null;
    }
    ///////////////////////////add task////////////////////////////////////
    async addTask(title, description, user_id) {
        const data = await prismaclient_js_1.default.tasks.create({
            data: {
                title: title,
                description: description,
                user_id: user_id,
            }
        });
        return data || null;
    }
    //////////////////////////add files in the task ///////////////////////////
    async addFiles(file, file_name, file_type, file_path, task_id) {
        const file_type_change = this.fileTypeChange(file_type.toLowerCase());
        // console.log(file_type_change)
        const data = await prismaclient_js_1.default.tasks.update({
            where: {
                task_id: task_id
            },
            data: {
                filename: file_name,
                file_path: file_path,
                file_type: file_type_change,
                file: file
            }
        });
        // console.log(data)
        return data || null;
    }
    //////////////////////////get files of the task ///////////////////////////
    async getFiles(task_id) {
        const data = await prismaclient_js_1.default.tasks.findUnique({
            where: {
                task_id: task_id
            },
            select: {
                user_id: true,
                filename: true,
                file_type: true,
                file: true,
            },
        });
        // console.log(data)
        return data || null;
    }
    //////////////////////////delete files of the task ///////////////////////////
    async deleteFiles(task_id) {
        const data = await prismaclient_js_1.default.tasks.update({
            where: {
                task_id: task_id
            },
            data: {
                file: null,
                filename: null,
                file_path: null,
                file_type: null
            }
        });
        return "Tasks file deleted successfully";
    }
    //////////////////////////get all tasks///////////////////////////////////////////
    // page the number of the page and size is how much data is shown 
    async getAllTasks(page, size) {
        //offset means how much data is skip
        // console.log(page)
        // console.log(size)
        const offset = (page - 1) * size;
        const data = await prismaclient_js_1.default.tasks.findMany({
            orderBy: {
                updatedDate: "asc"
            },
            take: Number(size), skip: offset
        });
        return data || null;
    }
    ///////////////////////////// Get single task//////////////////////////
    async getOneTask(task_id) {
        const data = await prismaclient_js_1.default.tasks.findUnique({
            where: {
                task_id: task_id
            }
        });
        return data || null;
    }
    ///////////////////////// get one user task ///////////////////////////////////
    async userTasks(user_id, page, size) {
        const offset = (page - 1) * size;
        const data = await prismaclient_js_1.default.tasks.findMany({
            where: {
                user_id: user_id
            },
            orderBy: {
                updatedDate: "asc"
            },
            take: Number(size), skip: offset
        });
        return data || null;
    }
    ///////////////////////// update the task ///////////////////////////////////
    async updateTask(task_id, title, description) {
        const data = await prismaclient_js_1.default.tasks.update({
            where: {
                task_id: task_id
            },
            data: {
                title: title,
                description: description,
            }
        });
        console.log(data);
        return data || null;
    }
    ////////////////////////delete the task///////////////////////////////
    async deleteTask(task_id) {
        await prismaclient_js_1.default.tasks.delete({
            where: {
                task_id: task_id
            }
        });
        return "Task deleted successfully";
    }
}
exports.TaskRepository = TaskRepository;
//# sourceMappingURL=taskRepository.js.map