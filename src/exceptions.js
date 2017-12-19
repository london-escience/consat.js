/**
 * Custom exceptions for use in the CSPSolver.
 */

class CSPSolverValueError extends Error { };

class VariableValueError extends Error { };

class InvalidVariableError extends Error { };

class InvalidSolutionError extends Error { };

class NotImplementedError extends Error { };

export { CSPSolverValueError, VariableValueError, InvalidVariableError,
    InvalidSolutionError, NotImplementedError };
