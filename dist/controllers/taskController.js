"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const uuid_1 = require("uuid");
class TaskController {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async addTasks(request, reply) {
        const { title, description } = request.body;
        const { user_id } = request.user;
        // console.log(request.body)
        if (!await this.taskRepository.userExist(user_id)) {
            return reply.status(404).send("No user Exist");
        }
        else {
            try {
                const task_id = (0, uuid_1.v4)();
                const user = await this.taskRepository.userExist(user_id);
                if (!user) {
                    //unauthorized user
                    return reply.status(404).send("user not exist");
                }
                else {
                    const currentDate = new Date().toISOString().slice(0, 10);
                    const data = await this.taskRepository.addTask(task_id, title, description, user_id, currentDate);
                    //   console.log(data)
                    return reply.status(201).send(data);
                }
            }
            catch (e) {
                reply.status(500).send('Internal Server Error');
            }
        }
    }
    async getAllTasks(request, reply) {
        const { user_id } = request.user;
        const { page, size } = request.query;
        if (page === null || page === undefined) {
            return reply.status(400).send('Page is required as query parameter');
        }
        else if (size === null || size === undefined) {
            return reply.status(400).send('Size is required as query parameter');
        }
        else if (isNaN(request.query.page) || isNaN(request.query.size) || page < 1) {
            return reply.status(400).send('Page and size must be a number');
        }
        else if (!await this.taskRepository.userExist(user_id)) {
            return reply.status(404).send("No user Exist");
        }
        else if (!await this.taskRepository.getAllTasks(page, size)) {
            return reply.status(404).send("No Data Found");
        }
        else {
            try {
                const data = await this.taskRepository.getAllTasks(page, size); //page,//no of data shown
                return reply.status(200).send(data);
            }
            catch (e) {
                return reply.status(500).send("Internal Server Error");
            }
        }
    }
    async getOneTask(request, reply) {
        const { task_id } = request.params;
        const { user_id } = request.user;
        if (!await this.taskRepository.userExist(user_id)) {
            return reply.status(404).send("No user Exist");
        }
        else if (!await this.taskRepository.getOneTask(task_id)) {
            return reply.status(404).send("No task Found");
        }
        else {
            try {
                const data = await this.taskRepository.getOneTask(task_id);
                if ((data === null || data === void 0 ? void 0 : data.user_id) !== user_id) {
                    return reply.status(401).send("Unauthorized user");
                }
                return reply.status(200).send(data);
            }
            catch (e) {
                return reply.status(500).send('Internal Server Error');
            }
        }
    }
    async getUserTask(request, reply) {
        const { user_id } = request.user;
        const { page, size } = request.query;
        if (page === null || page === undefined) {
            return reply.status(400).send('Page is required as query parameter');
        }
        else if (size === null || size === undefined) {
            return reply.status(400).send('Size is required as query parameter');
        }
        else if (isNaN(request.query.page) || isNaN(request.query.size) || page < 1) {
            return reply.status(400).send('Page and size must be a number');
        }
        else if (!await this.taskRepository.userExist(user_id)) {
            return reply.status(404).send("No user Exist");
        }
        else if (!await this.taskRepository.userTasks(user_id, page, size)) {
            return reply.status(404).send("No task Found");
        }
        else {
            try {
                const data = await this.taskRepository.userTasks(user_id, page, size);
                return reply.status(200).send(data);
            }
            catch (e) {
                return reply.status(500).send("Internal Server Error");
            }
        }
    }
    async updateTask(request, reply) {
        const { task_id } = request.params;
        const { title, description } = request.body;
        const { user_id } = request.user;
        if (!request.params.task_id || request.params.task_id === ':task_id') {
            return reply.status(400).send("Task Id is required in params");
        }
        else if (!await this.taskRepository.userExist(user_id)) {
            return reply.status(404).send("No user Exist");
        }
        else if (!await this.taskRepository.checkTask(task_id)) {
            return reply.status(404).send("No task Found");
        }
        else {
            try {
                const data = await this.taskRepository.checkTask(task_id);
                if ((data === null || data === void 0 ? void 0 : data.user_id) === user_id) {
                    const currentDate = new Date().toISOString().slice(0, 10);
                    const result = await this.taskRepository.updateTask(task_id, title, description, currentDate);
                    return reply.status(200).send(result);
                }
                else {
                    return reply.status(401).send("Unauthorized user");
                }
            }
            catch (e) {
                return reply.status(500).send("Internal Server Error");
            }
        }
    }
    async deleteTask(request, reply) {
        const { task_id } = request.params;
        const { user_id } = request.user;
        if (!request.params.task_id || request.params.task_id === ':task_id') {
            return reply.status(400).send("Task Id is required in params");
        }
        else if (!await this.taskRepository.userExist(user_id)) {
            return reply.status(404).send("No user Exist");
        }
        else if (!await this.taskRepository.checkTask(task_id)) {
            return reply.status(404).send("No task Found");
        }
        else {
            try {
                const data = await this.taskRepository.checkTask(task_id);
                if ((data === null || data === void 0 ? void 0 : data.user_id) !== user_id) {
                    return reply.status(401).send("Unauthorized user");
                }
                else {
                    const result = await this.taskRepository.deleteTask(task_id);
                    return reply.status(200).send(result);
                }
            }
            catch (e) {
                return reply.status(500).send("Internal server error");
            }
        }
    }
}
exports.TaskController = TaskController;
