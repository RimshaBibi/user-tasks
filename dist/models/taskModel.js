"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSchema = void 0;
class TaskSchema {
}
exports.TaskSchema = TaskSchema;
TaskSchema.postAddTaskOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['title', 'description'],
            properties: {
                title: { type: 'string', },
                description: { type: 'string' },
            },
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    user_id: { type: 'string' },
                    task_id: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                },
            },
        },
    },
};
TaskSchema.getAllTasksOptions = {
    schema: {
        response: {
            200: {
                type: 'array',
                properties: {
                    user_id: { type: 'string' },
                    task_id: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                }
            }
        }
    }
};
TaskSchema.getTaskByIdOptions = {
    schema: {
        params: {
            type: 'object',
            required: ['task_id'],
            properties: {
                task_id: { type: 'string' }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    user_id: { type: 'string' },
                    task_id: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                },
            },
        },
    }
};
TaskSchema.putUpdateTaskOptions = {
    schema: {
        params: {
            type: 'object',
            properties: {
                task_id: { type: 'string' },
            },
            required: ['task_id'],
        },
        body: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                description: { type: 'string' },
            },
            required: ['title', 'description'],
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    task_id: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    user_id: { type: 'string' }
                },
            },
        },
    },
};
TaskSchema.deleteTaskByIdOptions = {
    schema: {
        params: {
            type: 'object',
            required: ['task_id'],
            properties: {
                task_id: { type: 'string' }
            }
        },
        response: {
            200: {
                type: 'string',
            },
        },
    }
};
TaskSchema.getTaskByUserIdOptions = {
    schema: {
        response: {
            200: {
                type: 'array',
                properties: {
                    user_id: { type: 'string' },
                    task_id: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                },
            },
        },
    },
};
