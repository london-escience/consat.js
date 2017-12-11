/**
 * Custom exceptions for use in the CSPSolver.
 */

class CSPSolverValueError extends Error {

    constructor(...params) {
        super(...params);
    }

};

class VariableValueError extends Error {

    constructor(...params) {
        super(...params);
    }

};

class InvalidVariableError extends Error {

    constructor(...params) {
        super(...params);
    }

};

class NotImplementedError extends Error {

    constructor(...params) {
        super(...params);
    }

};

export { CSPSolverValueError, VariableValueError, InvalidVariableError, 
    NotImplementedError };
