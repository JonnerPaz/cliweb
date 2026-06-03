/**
 * @template T - Tipo de dato en caso de éxito
 * @template E - Tipo de dato en caso de error
 */
export class Result {
    /**
     * @param {boolean} isSuccess
     * @param {T} [value]
     * @param {E} [error]
     */
    constructor(isSuccess, value, error) {
        this.isSuccess = isSuccess;
        this.isError = !isSuccess;
        this.value = value;
        this.error = error;
    }

    /**
     * @template U
     * @param {U} value 
     * @returns {Result<U, null>}
     */
    static ok(value) {
        return new Result(true, value, null);
    }

    /**
     * @template errType
     * @param {errType} error 
     * @returns {Result<null, errType>}
     */
    static err(error) {
        return new Result(false, null, error);
    }
}
