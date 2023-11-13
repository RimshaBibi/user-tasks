"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const uuid_1 = require("uuid");
class TaskController {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async addTasks(request, reply) {
        const { title, description, user_id } = request.body;
        // console.log(request.body)
        try {
            const task_id = (0, uuid_1.v4)();
            const user = await this.taskRepository.userExist(user_id);
            if (!user) {
                //unauthorized user
                return reply.status(401).send("user not exist");
            }
            else {
                const data = await this.taskRepository.addTask(task_id, title, description, user_id);
                //   console.log(data)
                return reply.status(201).send(data);
            }
        }
        catch (e) {
            reply.status(500).send('Internal Server Error');
        }
    }
    async getAllTasks(reply) {
        try {
            const data = await this.taskRepository.getAllTasks();
            if (!data) {
                return reply.status(404).send("No Data Found");
            }
            return reply.status(200).send(data);
        }
        catch (e) {
            return reply.status(500).send('Internal Server Error');
        }
    }
    async getOneTask(request, reply) {
        const { task_id } = request.params;
        try {
            const data = await this.taskRepository.getOneTask(task_id);
            if (!data) {
                return reply.status(404).send("No task Found");
            }
            return reply.status(200).send(data);
        }
        catch (e) {
            return reply.status(500).send('Internal Server Error');
        }
    }
    async updateTask(request, reply) {
        const { task_id } = request.params;
        const { title, description } = request.body;
        try {
            const data = await this.taskRepository.checkTask(task_id);
            if (!data) {
                return reply.status(404).send("No task Found");
            }
            const result = await this.taskRepository.updateTask(task_id, title, description);
            return reply.status(200).send(result);
        }
        catch (e) {
            return reply.status(500).send(e);
        }
    }
    async deleteTask(request, reply) {
        const { task_id } = request.params;
        try {
            const data = await this.taskRepository.checkTask(task_id);
            if (!data) {
                return reply.status(404).send("No task Found");
            }
            const result = await this.taskRepository.deleteTask(task_id);
            return reply.status(200).send(result);
        }
        catch (e) {
            return reply.status(500).send(e);
        }
    }
}
exports.TaskController = TaskController;
