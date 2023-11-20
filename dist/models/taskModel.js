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
                    createddate: { type: 'string' }
                },
            },
        },
    },
};
TaskSchema.postAddTaskFileOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['title', 'description'],
            properties: {
                file: { type: 'string', format: 'binary' }
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
                    file: { type: 'binary' },
                    createddate: { type: 'string' },
                },
            },
        },
    },
};
TaskSchema.postTaskFileByIdOptions = {
    schema: {
        params: {
            type: 'object',
            required: ['task_id'],
            properties: {
                task_id: { type: 'string' }
            }
        },
        response: {
            201: {
                type: 'string',
            },
        },
    }
};
TaskSchema.getTaskFileByIdOptions = {
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
                    file: { type: 'string', format: 'binary' },
                    filename: { type: 'string' },
                    file_type: { type: 'string' },
                },
            },
        },
    }
};
TaskSchema.getAllTasksOptions = {
    schema: {
        Querystring: {
            type: 'object',
            required: ['page', 'size'],
            properties: {
                page: { type: 'integer' },
                size: { type: 'integer' }
            }
        },
        response: {
            200: {
                type: 'array',
                properties: {
                    user_id: { type: 'string' },
                    task_id: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    createddate: { type: 'string' },
                    updateddate: { type: 'string' }
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
                    createddate: { type: 'string' },
                    updateddate: { type: 'string' }
                },
            },
        },
    }
};
TaskSchema.getTaskByUserIdOptions = {
    schema: {
        Querystring: {
            type: 'object',
            required: ['page', 'size'],
            properties: {
                page: { type: 'integer' },
                size: { type: 'integer' }
            }
        },
        response: {
            200: {
                type: 'array',
                properties: {
                    user_id: { type: 'string' },
                    task_id: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    createddate: { type: 'string' },
                    updateddate: { type: 'string' }
                },
            },
        },
    },
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
                    user_id: { type: 'string' },
                    updateddate: { type: 'string' }
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
