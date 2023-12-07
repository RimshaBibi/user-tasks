import { Pool } from "pg";
import pool from "../database/database.js"
import { TaskInterface } from "../interfaces/taskInterface.js";
import { Interfaces } from "../interfaces/userInterface.js";
import prisma from "../prismaclient.js";
import { file_type_enum } from "@prisma/client";


export class TaskRepository {

    async userExist(user_id: any): Promise<Interfaces.ISignInReply | null> {
        const data = await prisma.users.findUnique({
            where: {
                user_id: user_id
            }
        })
        return data || null
    }
    ///////////////////////////add task////////////////////////////////////
    async addTask(
        title: string,
        description: string,
        user_id: string
    ): Promise<TaskInterface.ITaskRep | null> {
        const data = await prisma.tasks.create({
            data: {
                title: title,
                description: description,
                user_id: user_id,
            }
        })
        return data || null

    }

    fileTypeChange = (file_type: string) => {
        if (file_type === "application/pdf") {
            return 'application_pdf'
        }
        else if (file_type === "image/png") {
            return 'image_png'
        }
        else if (file_type === "image/jpeg") {
            return 'image_jpeg'
        }
        else {
            return 'image_webp'
        }
    }

    //////////////////////////add files in the task ///////////////////////////
    async addFiles(file: Buffer, file_name: string, file_type: string, file_path: string, task_id: string): Promise<TaskInterface.ITaskFileAddRep | null> {
        const file_type_change = this.fileTypeChange(file_type.toLowerCase())
        // console.log(file_type_change)
        const data = await prisma.tasks.update({
            where: {
                task_id: task_id
            },
            data: {
                filename: file_name,
                file_path: file_path,
                file_type: file_type_change,
                file: file
            }
        })
        // console.log(data)
        return data || null
    }

    //////////////////////////get files of the task ///////////////////////////
    async getFiles(task_id: string): Promise<TaskInterface.ITaskFileRep | null> {
        const data = await prisma.tasks.findUnique({
            where: {
                task_id: task_id
            },
            select: {
                user_id: true,
                filename: true,
                file_type: true,
                file: true,
            },
        })
        // console.log(data)
        return data || null
    }

    //////////////////////////delete files of the task ///////////////////////////
    async deleteFiles(task_id: string): Promise<string> {
        const data = await prisma.tasks.update({
            where: {
                task_id: task_id
            },
            data: {
                file: null,
                filename: null,
                file_path: null,
                file_type: null
            }
        })

        return "Tasks file deleted successfully"
    }
    //////////////////////////get all tasks///////////////////////////////////////////
    // page the number of the page and size is how much data is shown 
    async getAllTasks(page: number, size: number): Promise<TaskInterface.ITaskRepFile[] | null> {
        //offset means how much data is skip
        // console.log(page)
        // console.log(size)
        const offset = (page - 1) * size;
        const data = await prisma.tasks.findMany({
            orderBy: {
                updatedDate: "asc"
            },
            take: Number(size), skip: offset
        })
        return data || null
    }
    ///////////////////////////// Get single task//////////////////////////
    async getOneTask(task_id: string): Promise<TaskInterface.ITaskRepFile | null> {
        const data = await prisma.tasks.findUnique({
            where: {
                task_id: task_id
            }
        })
        return data || null
    }


    ///////////////////////// get one user task ///////////////////////////////////
    async userTasks(user_id: string, page: number, size: number): Promise<TaskInterface.ITaskRepFile[] | null> {

        const offset = (page - 1) * size;
        const data = await prisma.tasks.findMany({
            where: {
                user_id: user_id
            },
            orderBy: {
                updatedDate: "asc"
            },
            take: Number(size), skip: offset
        })
        return data || null
    }


    ///////////////////////// update the task ///////////////////////////////////
    async updateTask(
        task_id: string,
        title: string,
        description: string
    ): Promise<TaskInterface.ITaskRepFile | null> {
        const data = await prisma.tasks.update({
            where: {
                task_id: task_id
            },
            data: {
                title: title,
                description: description,
            }
        })
        console.log(data)
        return data || null
    }

    ////////////////////////delete the task///////////////////////////////
    async deleteTask(
        task_id: string,
    ): Promise<string> {
        await prisma.tasks.delete({
            where: {
                task_id: task_id
            }
        })
        return "Task deleted successfully"
    }



}