"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSchema = void 0;
class TaskSchema {
    constructor() {
        this.postAddTaskOptions = {
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
                            createdDate: { type: 'string' }
                        },
                    },
                },
            },
        };
        this.postAddTaskFileOptions = {
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
                            createdDate: { type: 'string' },
                        },
                    },
                },
            },
        };
        this.postTaskFileByIdOptions = {
            schema: {
                params: {
                    type: 'object',
                    required: ['id'],
                    properties: {
                        id: { type: 'string' }
                    }
                },
                response: {
                    201: {
                        type: 'string',
                    },
                },
            }
        };
        this.getTaskFileByIdOptions = {
            schema: {
                params: {
                    type: 'object',
                    required: ['id'],
                    properties: {
                        id: { type: 'string' }
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
        this.delTaskFileByIdOptions = {
            schema: {
                params: {
                    type: 'object',
                    required: ['id'],
                    properties: {
                        id: { type: 'string' }
                    }
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                        },
                    },
                },
            }
        };
        this.getAllTasksOptions = {
            schema: {
                response: {
                    200: {
                        type: 'array',
                        properties: {
                            user_id: { type: 'string' },
                            task_id: { type: 'string' },
                            title: { type: 'string' },
                            description: { type: 'string' },
                            createdDate: { type: 'string' },
                            updatedDate: { type: 'string' }
                        }
                    }
                }
            }
        };
        this.getTaskByIdOptions = {
            schema: {
                params: {
                    type: 'object',
                    required: ['id'],
                    properties: {
                        id: { type: 'string' }
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
                            createdDate: { type: 'string' },
                            updatedDate: { type: 'string' }
                        },
                    },
                },
            }
        };
        this.getMyTaskOptions = {
            schema: {
                querystring: {
                    type: 'object',
                    properties: {
                        page: { type: 'integer' },
                        size: { type: 'integer' },
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
                            createdDate: { type: 'string' },
                            updatedDate: { type: 'string' }
                        },
                    },
                },
            },
        };
        this.getTaskByUserIdOptions = {
            schema: {
                querystring: {
                    type: 'object',
                    required: ['userId'],
                    properties: {
                        userId: { type: 'string' },
                        page: { type: 'integer' },
                        size: { type: 'integer' },
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
                            createdDate: { type: 'string' },
                            updatedDate: { type: 'string' }
                        },
                    },
                },
            },
        };
        this.putUpdateTaskOptions = {
            schema: {
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                    },
                    required: ['id'],
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
                            updatedDate: { type: 'string' }
                        },
                    },
                },
            },
        };
        this.deleteTaskByIdOptions = {
            schema: {
                params: {
                    type: 'object',
                    required: ['id'],
                    properties: {
                        id: { type: 'string' }
                    }
                },
                response: {
                    200: {
                        type: 'string',
                    },
                },
            }
        };
    }
}
exports.TaskSchema = TaskSchema;
//# sourceMappingURL=taskModel.js.map