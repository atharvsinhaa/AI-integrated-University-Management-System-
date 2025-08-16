class ApiError extends Error {          //extends the Error class // this is a custom error class
    constructor(
        statusCode,
        message= "SOmething went wrong!",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null  //learn about this
        this.message = message
        this.success = false
        this.errors = errors

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}