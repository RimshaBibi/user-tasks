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
    async noUserFound(user_id: string) {
        if (!await this.taskRepository.userExist(user_id)) {
            return { message: "No User Exist" };
        }
        else {
            return null
        }
    }

    async addTasks(request: FastifyRequest<{ Body: { title: string; description: string; user_id: string } }>, reply: FastifyReply) {
        const { title, description } = request.body;
        const { user_id } = (request as any).user
        // console.log(request.body)
        if (!title.trim()) {
            return reply.status(400).send({ "message": "Title is required" })
        }
        else if (!description.trim()) {
            return reply.status(400).send({ "message": "Description is required" })
        }
        if (!await this.taskRepository.userExist(user_id)) {
            return reply.status(404).send({ "message": "No User Exist" })
        }
        else {
            try {
                const task_id = uuid();
                const currentDate = new Date().toISOString().slice(0, 10);
                const data = await this.taskRepository.addTask(task_id, title, description, user_id, currentDate);
                //   console.log(data)
                return reply.status(201).send(data)
            }
            catch (e) {
                reply.status(500).send({ "message": 'Internal Server Error' });
            }
        }

    }

    async uploadFile(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        const { user_id } = (request as any).user
        const { id } = request.params
        const file = request.file;
        const filePath = request.file?.path;

        // console.log(file)
        if (!file) {
            return reply.status(400).send({ "message": 'No file uploaded' });
        }
        //del the file at path if no task_id is present
        else if (!request.params.id.trim() || request.params.id === ':id') {
            await this.deleteFile(filePath)
            return reply.status(400).send({ "message": "Task Id is required in params" });
        }
        else {
            const result = await this.noUserFound(user_id)
            if (result !== null) {
                await this.deleteFile(filePath)
                return reply.status(404).send(result)
            }
            const data = await this.taskRepository.getOneTask(id)
            if (!data) {
                await this.deleteFile(filePath)
                return reply.status(404).send({ "message": "No Task Found" })
            }
            else if (data?.user_id !== user_id) {
                await this.deleteFile(filePath)
                return reply.status(401).send({ "message": "Unauthorized user" })
            }
            else {
                // console.log(data?.file_path)
                try {

                    if (data?.filename) {
                        //del the previous file at path file that is present
                        await this.deleteFile(data.file_path)
                        //then add the new file 
                        const fileContent = fs.readFileSync(filePath);// it will convert the file as buffer
                        const result = await this.taskRepository.addFiles(fileContent, file.filename, file.mimetype, file.path, id);
                        // console.log(data)
                        return reply.status(201).send(JSON.stringify({ "message": `File uploaded successfully ${result?.filename}` }));

                    }
                    else {
                        // console.log("no file is present")
                        const fileContent = fs.readFileSync(filePath);
                        const result = await this.taskRepository.addFiles(fileContent, file.filename, file.mimetype, file.path, id);
                        // console.log(data)
                        return reply.status(201).send(JSON.stringify({ "message": `File uploaded successfully ${result?.filename}` }));
                    }
                }
                catch (e) {
                    //del the file at path if any error occur while this code execution
                    await this.deleteFile(filePath)
                    return reply.status(500).send({ "message": "Internal Server Error" });
                }
            }
        }

    }

    async getTaskFile(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        const { user_id } = (request as any).user
        const { id } = request.params
        if (!request.params.id.trim()) {
            return reply.status(400).send({ "message": "Task Id is required in params" });
        }
        else {
            const result = await this.noUserFound(user_id)
            if (result !== null) {
                return reply.status(404).send(result)
            }
            const data = await this.taskRepository.getOneTask(id)
            if (!data) {
                return reply.status(404).send({ "message": "No Task Found" })
            }

            try {
                const result = await this.taskRepository.getFiles(id)
                if (!result) {
                    return reply.status(404).send({ "message": "File not found" });
                }
                else if (result?.user_id !== user_id) {
                    return reply.status(401).send({ "message": "Unauthorized user" })
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
                return reply.status(500).send({ "message": "Internal Server Error" });
            }
        }

    }

    async deleteTaskFile(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        const { user_id } = (request as any).user
        const { id } = request.params
        if (!request.params.id.trim() || request.params.id === ':id') {
            return reply.status(400).send({ "message": "Task Id is required in params" });
        }
        else {
            const userInfo = await this.noUserFound(user_id)
            if (userInfo !== null) {
                return reply.send(userInfo)
            }
            try {
                const data = await this.taskRepository.getOneTask(id)
                if (!data) {
                    return reply.status(404).send({ "message": "No Task Found" })
                }
                else if (data.user_id !== user_id) {
                    return reply.status(401).send({ "message": "Unauthorized user" })
                }
                else if (!data.filename) {
                    return reply.status(404).send({ "message": "No Task File Found" })
                }
                else {
                    await this.deleteFile(data.file_path)
                    const result = await this.taskRepository.deleteFiles(id)
                    return reply.status(200).send({ "message": result })
                }
            }
            catch (e) {
                return reply.status(500).send({ "message": "Internal Server Error" });
            }

        }
    }

    async getAllTasks(request: FastifyRequest<{ Querystring: { page: number, size: number } }>, reply: FastifyReply) {
        const { user_id } = (request as any).user
        var { page = 1, size = 3 } = request.query
        if (request.query.page !== undefined && isNaN(request.query.page)) {
            return reply.status(400).send({ "message": 'Page must be a number' });
        }
        else if (request.query.size !== undefined && isNaN(request.query.size)) {
            return reply.status(400).send({ "message": 'Size must be a number' });
        }
        else {
            const result = await this.noUserFound(user_id)
            if (result !== null) {
                return reply.status(404).send(result)
            }
            try {
                const data = await this.taskRepository.getAllTasks(page, size);//page,//no of data shown
                if (!data) {
                    return reply.status(404).send({ "message": "No Tasks Found" })
                }
                return reply.status(200).send(data);
            }
            catch (e) {
                return reply.status(500).send({ "message": "Internal Server Error" });
            }
        }

    }

    async getOneTask(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        const { id } = request.params
        const { user_id } = (request as any).user;
        if (!request.params.id || request.params.id === ':id') {
            return reply.status(400).send({ "message": "Task Id is required in params" });
        }
        else {
            const result = await this.noUserFound(user_id)
            if (result !== null) {
                return reply.status(404).send(result)
            }
            try {
                const data = await this.taskRepository.getOneTask(id)
                if (!data) {
                    return reply.status(404).send({ "message": "No Task Found" })
                }
                else if (data.user_id !== user_id) {
                    return reply.status(401).send({ "message": "Unauthorized user" })
                }
                return reply.status(200).send(data)
            }
            catch (e) {
                return reply.status(500).send({ "message": 'Internal Server Error' });
            }
        }
    }

    async getMyTasks(request: FastifyRequest<{ Querystring: { page: number, size: number } }>, reply: FastifyReply) {
        const { user_id } = (request as any).user;
        var { page = 1, size = 3 } = request.query
        if (request.query.page !== undefined && isNaN(request.query.page)) {
            return reply.status(400).send({ "message": 'Page must be a number' });
        }
        else if (request.query.size !== undefined && isNaN(request.query.size)) {
            return reply.status(400).send({ "message": 'Size must be a number' });
        }
        else {
            const result = await this.noUserFound(user_id)
            if (result !== null) {
                return reply.status(404).send(result)
            }
            try {
                const data = await this.taskRepository.userTasks(user_id, page, size)
                if (!data) {
                    return reply.status(404).send({ "message": "No task Found" })
                }
                return reply.status(200).send(data);
            }
            catch (e) {
                return reply.status(500).send({ "message": "Internal Server Error" });
            }
        }
    }

    async getUserTasks(request: FastifyRequest<{ Querystring: { userId: string, page: number, size: number } }>, reply: FastifyReply) {
        const { user_id } = (request as any).user;
        var { page = 1, size = 3, userId } = request.query

        if (request.query.page !== undefined && isNaN(request.query.page)) {
            return reply.status(400).send({ "message": 'Page must be a number' });
        }
        else if (request.query.size !== undefined && isNaN(request.query.size)) {
            return reply.status(400).send({ "message": 'Size must be a number' });
        }
        else {
            const result = await this.noUserFound(user_id)
            if (result !== null) {
                return reply.status(404).send(result)
            }
            const userInfo = await this.noUserFound(userId)
            if (userInfo !== null) {
                return reply.status(404).send(userInfo)
            }
            try {
                const data = await this.taskRepository.userTasks(userId, page, size)
                if (!data) {
                    return reply.status(404).send({ "message": "No task Found" })
                }
                return reply.status(200).send(data);
            }
            catch (e) {
                return reply.status(500).send({ "message": "Internal Server Error" });
            }
        }
    }

    async updateTask(request: FastifyRequest<{ Params: { id: string }, Body: { title: string; description: string; } }>, reply: FastifyReply) {
        const { id } = request.params
        const { title, description } = request.body;
        const { user_id } = (request as any).user;
        if (!request.params.id || request.params.id === ':id') {
            return reply.status(400).send({ "message": "Task Id is required in params" });
        }
        else if (!title.trim()) {
            return reply.status(400).send({ "message": "Title is required" })
        }
        else if (!description.trim()) {
            return reply.status(400).send({ "message": "Description is required" })
        }
        else {
            const result = await this.noUserFound(user_id)
            if (result !== null) {
                return reply.status(404).send(result)
            }
            try {
                const data = await this.taskRepository.getOneTask(id)
                if (!data) {
                    return reply.status(404).send({ "message": "No Task Found" })
                }
                else if (data.user_id !== user_id) {
                    return reply.status(401).send({ "message": "Unauthorized user" })
                }
                else {
                    const currentDate = new Date().toISOString().slice(0, 10);
                    const result = await this.taskRepository.updateTask(id, title, description, currentDate);
                    return reply.status(200).send(result);
                }
            }
            catch (e) {
                return reply.status(500).send({ "message": "Internal Server Error" });
            }
        }
    }

    async deleteTask(request: FastifyRequest<{ Params: { id: string }, }>, reply: FastifyReply) {
        const { id } = request.params
        const { user_id } = (request as any).user
        if (!request.params.id || request.params.id === ':id') {
            return reply.status(400).send({ "message": "Task Id is required in params" });
        }
        else {
            const result = await this.noUserFound(user_id)
            if (result !== null) {
                return reply.status(404).send(result)
            }
            try {
                const data = await this.taskRepository.getOneTask(id)
                if (!data) {
                    return reply.status(404).send({ "message": "No Task Found" })
                }
                else if (data.user_id !== user_id) {
                    return reply.status(401).send({ "message": "Unauthorized user" })
                }
                else {
                    const result = await this.taskRepository.deleteTask(id);
                    return reply.status(200).send(JSON.stringify({ "message": result }));
                }
            }
            catch (e) {
                return reply.status(500).send({ "message": "Internal server error" });
            }
        }
    }

}
