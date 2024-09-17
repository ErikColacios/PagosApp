export class Response {
    constructor(success, message = "", error = 0) {
        this.success = success;
        this.message = message || "";
        this.error = error;
    }
}
