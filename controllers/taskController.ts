import { FastifyRequest, FastifyReply } from 'fastify';
import { TaskRepository } from "../repository/taskRepository.js";
import { v4 as uuid } from 'uuid';
import fs, { promises as fsPromises } from 'fs';
export class TaskController {

    constructor(private taskRepository: TaskRepository) { }

    async deleteFile(filePath: string) {
        try {
            await fsPromises.unlink(filePath);
        } catch (error) {
            console.error(`Error deleting file at path ${filePath}:`, error);
        }
    }

    async addTasks(request: FastifyRequest<{ Body: { title: string; description: string; user_id: string } }>, reply: FastifyReply) {
        const { title, description } = request.body;
        const { user_id } = (request as any).user
        // console.log(request.body)
        if (!await this.taskRepository.userExist(user_id)) {
            return reply.status(404).send("No user Exist")
        }
        else {
            try {
                const task_id = uuid();
                const user = await this.taskRepository.userExist(user_id);

                if (!user) {
                    //unauthorized user
                    return reply.status(404).send("user not exist")
                }
                else {
                    const currentDate = new Date().toISOString().slice(0, 10);
                    const data = await this.taskRepository.addTask(task_id, title, description, user_id, currentDate);
                    //   console.log(data)
                    return reply.status(201).send(data)
                }
            }
            catch (e) {
                reply.status(500).send('Internal Server Error');
            }
        }

    }

    async uploadFile(request: FastifyRequest<{ Params: { task_id: string } }>, reply: FastifyReply) {
        const { user_id } = (request as any).user
        const { task_id } = request.params
        const file = request.file;
        const filePath = request.file?.path;
        // console.log(file)
         if (!file) {
            return reply.status(400).send('No file uploaded');
        }
        //del the file at path if no task_id is present
        else if (!request.params.task_id || request.params.task_id === ':task_id') {
            await this.deleteFile(filePath)
            return reply.status(400).send("Task Id is required in params");
        }
        //if no user exist del file at path
        else if (!await this.taskRepository.userExist(user_id)) {
            await this.deleteFile(filePath)
            return reply.status(404).send("No user Exist")
        }
        //if no task found del file at path
        else if (!await this.taskRepository.getOneTask(task_id)) {
            await this.deleteFile(filePath)
            return reply.status(404).send("No task Found")
        }
        else {
            const data = await this.taskRepository.getOneTask(task_id)
            // console.log(data)
            //del file at path in case of unauthorized user
            if (data?.user_id !== user_id) {
                await this.deleteFile(filePath)
                return reply.status(401).send("Unauthorized user")
            }
            else {
                // console.log(data.file_path)
                try {
                    if (data?.filename) {
                        //del the previous file at path file that is present
                        await this.deleteFile(data.file_path)
                        //then add the new file 
                        const fileContent = fs.readFileSync(filePath);// it will convert the file as buffer
                        const result = await this.taskRepository.addFiles(fileContent, file.filename, file.mimetype, file.path, task_id);
                        // console.log(data)
                        return reply.status(201).send(`File uploaded successfully, ${result?.filename}`);
                    }
                    else {
                        // console.log("no file is present")
                        const fileContent = fs.readFileSync(filePath);
                        const result = await this.taskRepository.addFiles(fileContent, file.filename, file.mimetype, file.path, task_id);
                        // console.log(data)
                        return reply.status(201).send(`File uploaded successfully, ${result?.filename}`);
                    }
                }
                catch (e) {
                    //del the file at path if any error occur while this code execution
                    await this.deleteFile(filePath)
                    return reply.status(500).send(e);
                }


            }
        }

    }

    async getTaskFile(request: FastifyRequest<{ Params: { task_id: string } }>, reply: FastifyReply) {
        const { user_id } = (request as any).user
        const { task_id } = request.params
        if (!request.params.task_id || request.params.task_id === ':task_id') {
            return reply.status(400).send("Task Id is required in params");
        }
        else if (!await this.taskRepository.userExist(user_id)) {
            return reply.status(404).send("No user Exist")
        }
        else if (!await this.taskRepository.getOneTask(task_id)) {
            return reply.status(404).send("No task Found")
        }
        else {
            try {
                const result = await this.taskRepository.getFiles(task_id)
                if (!result) {
                    return reply.status(404).send("File not found");
                }
                else if (result?.user_id !== user_id) {
                    return reply.status(401).send("Unauthorized user")
                }
                else {

                    const { file, filename, file_type } = result
                    // Set the response headers
                    reply.header('Content-Type', file_type)
                    reply.header('Content-Disposition', `attachment; filename=${filename}`)
                    // console.log(file, filename, file_type)
                    return reply.status(200).send(file)
                }
            }
            catch (e) {
                return reply.status(500).send("Internal Server Error");
            }
        }

    }

    async getAllTasks(request: FastifyRequest<{ Querystring: { page: number, size: number } }>, reply: FastifyReply) {
        const { user_id } = (request as any).user
        const { page, size } = request.query
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
            return reply.status(404).send("No user Exist")
        }
        else if (!await this.taskRepository.getAllTasks(page, size)) {
            return reply.status(404).send("No Data Found")
        }
        else {
            try {
                const data = await this.taskRepository.getAllTasks(page, size);//page,//no of data shown
                return reply.status(200).send(data);
            }
            catch (e) {
                return reply.status(500).send("Internal Server Error");
            }
        }

    }

    async getOneTask(request: FastifyRequest<{ Params: { task_id: string } }>, reply: FastifyReply) {
        const { task_id } = request.params
        const { user_id } = (request as any).user;
        if (!request.params.task_id || request.params.task_id === ':task_id') {
            return reply.status(400).send("Task Id is required in params");
        }
        else if (!await this.taskRepository.userExist(user_id)) {
            return reply.status(404).send("No user Exist")
        }
        else if (!await this.taskRepository.getOneTask(task_id)) {
            return reply.status(404).send("No task Found")
        }
        else {
            try {
                const data = await this.taskRepository.getOneTask(task_id)
                if (data?.user_id !== user_id) {
                    return reply.status(401).send("Unauthorized user")
                }
                return reply.status(200).send(data)
            }
            catch (e) {
                return reply.status(500).send('Internal Server Error');
            }
        }
    }

    async getUserTask(request: FastifyRequest<{ Querystring: { page: number, size: number } }>, reply: FastifyReply) {
        const { user_id } = (request as any).user;
        const { page, size } = request.query
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
            return reply.status(404).send("No user Exist")
        }
        else if (!await this.taskRepository.userTasks(user_id, page, size)) {
            return reply.status(404).send("No task Found")
        }
        else {
            try {
                const data = await this.taskRepository.userTasks(user_id, page, size)
                return reply.status(200).send(data);
            }
            catch (e) {
                return reply.status(500).send("Internal Server Error");
            }
        }
    }

    async updateTask(request: FastifyRequest<{ Params: { task_id: string }, Body: { title: string; description: string; } }>, reply: FastifyReply) {
        const { task_id } = request.params
        const { title, description } = request.body;
        const { user_id } = (request as any).user;
        if (!request.params.task_id || request.params.task_id === ':task_id') {
            return reply.status(400).send("Task Id is required in params");
        }
        else if (!await this.taskRepository.userExist(user_id)) {
            return reply.status(404).send("No user Exist")
        }
        else if (!await this.taskRepository.checkTask(task_id)) {
            return reply.status(404).send("No task Found")
        }
        else {
            try {
                const data = await this.taskRepository.checkTask(task_id)
                if (data?.user_id === user_id) {
                    const currentDate = new Date().toISOString().slice(0, 10);
                    const result = await this.taskRepository.updateTask(task_id, title, description, currentDate);
                    return reply.status(200).send(result);
                }
                else {
                    return reply.status(401).send("Unauthorized user")
                }
            }
            catch (e) {
                return reply.status(500).send("Internal Server Error");
            }
        }
    }

    async deleteTask(request: FastifyRequest<{ Params: { task_id: string }, }>, reply: FastifyReply) {
        const { task_id } = request.params
        const { user_id } = (request as any).user
        if (!request.params.task_id || request.params.task_id === ':task_id') {
            return reply.status(400).send("Task Id is required in params");
        }
        else if (!await this.taskRepository.userExist(user_id)) {
            return reply.status(404).send("No user Exist")
        }
        else if (!await this.taskRepository.checkTask(task_id)) {
            return reply.status(404).send("No task Found")
        }
        else {
            try {
                const data = await this.taskRepository.checkTask(task_id)

                if (data?.user_id !== user_id) {
                    return reply.status(401).send("Unauthorized user")
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
