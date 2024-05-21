/**
 * @class ApiResponseHandler
 * @description This class is used to handle API responses.
 */
class ApiResponseHandler {
    /**
     * @constructor
     * @param {number} statusCode - The HTTP status code of the response.
     * @param {any} data - The data to be included in the response.
     * @param {string} [message="Success"] - The message to be included in the response. Defaults to "Success".
     */
    constructor(
        statusCode,
        data=null,
        message="Success"
    ) {
        this.data = data;
        this.statusCode = statusCode;
        this.message = message;
        this.success = this.statusCode < 400;
    }
}

export default ApiResponseHandler;