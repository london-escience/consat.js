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

class CSPSolverValueException extends BaseException {};

class VariableValueException extends BaseException {};

export { CSPSolverValueException, VariableValueException };
