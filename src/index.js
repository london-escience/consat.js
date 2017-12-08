/**
 * Entry point for the consat.js Constraint Satisfaction Solver library.
 *
 * This library provides support for solving constraint satisfaction problems
 * either by formulating the problem programmatically or by loading in a
 * problem description in XML format that can be used to define the problem.
 *
 * At present, this class provides a basic solver for discrete variables with
 * finite domains.
 */
import Variable from './variable';
import Constraint from './constraint';
import * as log from 'loglevel';

class CSPSolver {

    /**
     * This is an "abstract" class in that clients should instantiate a
     * specific solver implementation and this class contains only common
     * top-level implementation for CSP solvers. new.target is therefore used
     * to check if an attempt is made to instantiate this class directly.
     */
    constructor() {
        if(this.constructor === CSPSolver) {
            throw TypeError('CSPSolver is an abstract class and can\'t be ' +
                    'instantiated directly.');
        }

        log.debug('Initialising CSPSolver object...');
        this._variables = [];
        this._constraints = [];
    }

    addVariable(v) {
        log.debug('Adding variable named [' + v.getName() + '] to var list');
        this._variables.push(v);
    }

    addConstraint(c) {
        log.debug('Adding constraint between variable [' + c.getV2Name() +
                '] and variable [' + c.getV1Name() + '] to constraint list.');
        this._variables.push(c);
    }

    /**
     * The solve function is not implemented here - an implementation of
     * solve must be provided in subclasses of this CSPSolver class
     */
    solve() {
        // This is a placeholder function - implement in subclasses
    }

    /**
     * Check if the provided assignment - an instance of the Assignment class
     * is consistent - that is, it does not violate any constraints. Note
     * that this does not mean that the assignment is complete, some
     * variables may still be unassigned.
     */
    isConsistent(assignment) {
        // Check through each of the constraints to see if we have variables.
        const varList = assignment.getVarList();
        // Create a map containing the constraints for each variable.
    }

    /**
     * Check if the provided assignment is a solution. An assignment that is
     * a solution is one that is complete (i.e. all variables have values)
     * and where all constraints are satisfied.
     */
    completeAssignment(assignment) {
        const varList = assignment.getVarList();
        for(const v in varList) {
            if(v.getValue() === null) return false;
        }
        return true;
    }

    /**
     * Check if the provided assignment is a solution. An assignment that is
     * a solution is one that is complete (i.e. all variables have values)
     * and where all constraints are satisfied.
     */
    isSolution(assignment) {
        return completeAssignment(assignment) && isConsistent(assignment);
    }

}

export { CSPSolver, Variable, Constraint };
