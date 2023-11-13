"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const database_js_1 = __importDefault(require("../database/database.js"));
class TaskRepository {
    constructor(db) {
        this.db = db;
    }
    async userExist(user_id) {
        const data = await database_js_1.default.query("SELECT * FROM usertable WHERE user_id = $1", [user_id]);
        // console.log(data)
        //it means user exist
        if (data.rows.length !== 0) {
            // console.log(data)
            return data.rows[0];
        }
        return null;
    }
    ///////////////////////////add task////////////////////////////////////
    async addTask(task_id, title, description, user_id) {
        // console.log(user.rows[0])
        const data = await database_js_1.default.query('INSERT INTO usertasks(task_id,title,description,user_id) VALUES ($1, $2, $3, $4) Returning *', [task_id, title, description, user_id]);
        //    console.log( data.rows[0] )
        return data.rows[0] || null;
    }
    //////////////////////////get all tasks///////////////////////////////////////////
    async getAllTasks() {
        const data = await database_js_1.default.query('SELECT * FROM usertasks');
        // console.log(data.rows)
        return data.rows || null;
    }
    ///////////////////////////// Get single task//////////////////////////
    async getOneTask(task_id) {
        const data = await database_js_1.default.query('SELECT * FROM usertasks where task_id = $1', [task_id]);
        return data.rows[0] || null;
    }
    ///////////////////////// update the task ///////////////////////////////////
    async checkTask(task_id) {
        const data = await database_js_1.default.query('SELECT * FROM usertasks WHERE task_id = $1', [task_id]);
        if (data.rows.length !== 0) {
            // console.log(data.rows[0] )
            return data.rows[0];
        }
        return null;
    }
    async updateTask(task_id, title, description) {
        const data = await database_js_1.default.query('UPDATE usertasks SET title = $1, description = $2 WHERE task_id = $3 RETURNING *', [title, description, task_id]);
        return data.rows[0] || null;
    }
    ////////////////////////delete the task///////////////////////////////
    async deleteTask(task_id) {
        await database_js_1.default.query('DELETE FROM usertasks WHERE task_id = $1 ', [task_id]);
        return "Task deleted successfully";
    }
}
exports.TaskRepository = TaskRepository;
