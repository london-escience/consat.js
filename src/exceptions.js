/**
 * Custom exceptions for use in the CSPSolver.
 */
class BaseException {

    constructor(message) {
        this.message = message;
    }

    toString() {
        return this.message;
    }

}

export class CSPSolverValueException extends BaseException {};
