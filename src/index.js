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

}

export default CSPSolver;
