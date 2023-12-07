export namespace TaskInterface {
  export interface ITaskReq {
    user_id: string,
    title: string,
    description: string
  }
  export interface ITaskRepFile {
    user_id: string,
    task_id: string,
    title: string,
    description: string,
    createdDate: Date,
    updatedDate: Date,
    filename: string | null,
    file_path: string | null,
  }
  export interface ITaskRep {
    user_id: string,
    title: string,
    description: string,
  }
  export interface ITaskFileAddRep {
    user_id: string,
    task_id: string,
    title: string,
    description: string,
    createdDate: Date,
    updatedDate: Date
    filename: string | null,
    file_path: string | null,
    file: Buffer | null
    file_type: string | null
  }
  export interface ITaskByIdReq {
    id: string
  }

  export interface ITaskFileRep {
    user_id: string,
    filename: string | null;
    file_type: string | null;
    file: Buffer | null;
  }
  export interface ITaskBodyReq {
    task_id: string,
    title: string,
    description: string

  }
  export interface ITaskQueryReq {
    page: number,
    size: number,
    userId: string
  }
}