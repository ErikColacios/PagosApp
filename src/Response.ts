export class Response {
    success:boolean;
    message:string;
    error:number;
    
    constructor(success:boolean, message:string)
    constructor(success:boolean, message:string, error:number)

    constructor(success: boolean, message: string = "", error: number = 0) {
        this.success = success;
        this.message = message || "";
        this.error = error;
    }

}