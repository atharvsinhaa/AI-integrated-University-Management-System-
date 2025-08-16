class ApiResponse { // // This class is used to create a standardized API response format
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode 
        this.data= data 
        this.message = message
        this.success = statusCode < 400 // // true if status code is less than 400 (indicating success)
    }
}

export {ApiResponse}