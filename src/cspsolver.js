/**
 * This is the base (abstract) CSPSolver class for the consat.js constraint
 * satisfaction solver library.
 *
 * This library provides support for solving constraint satisfaction problems
 * either by formulating the problem programmatically or by loading in a
 * problem description in XML format that can be used to define the problem.
 *
 * At present, this module provides a basic backtracking solver for discrete
 * variables with finite domains.
 */
import { InvalidVariableError } from './exceptions';
import * as log from 'loglevel';

const logger = log.noConflict();
logger.setLevel(logger.levels.INFO);

class CSPSolver {

    /**
     * This is an "abstract" class in that clients should instantiate a
     * specific solver implementation and this class contains only common
     * top-level implementation for CSP solvers. new.target is therefore used
     * to check if an attempt is made to instantiate this class directly.
     */
    constructor() {
        logger.debug('Constructor name: ' + this.constructor);
        if(this.constructor === CSPSolver) {
            throw TypeError('CSPSolver is an abstract class and can\'t be ' +
                    'instantiated directly.');
        }

        logger.debug('Initialising CSPSolver object...');
        this._constraints = [];
        this._variables = {};
        this.varConstraintMap = {};
        this._solutions = [];
    }

    addVariable(v) {
        logger.debug('Adding variable named [' + v.getName() + '] with ID [' +
                v.getId() + '] to var list');
        logger.debug('Variables list: ' + JSON.stringify(this._variables));
        // Check of this variable has already been added
        if(v.getId() in this._variables) return false;
        this._variables[v.getId()] = v;
        return true;
    }

    addConstraint(c) {
        logger.debug('Adding constraint between variable [' + c.getV2Name() +
                '] and variable [' + c.getV1Name() + '] to constraint list.');
        // Add the two variables to the list of variables for this constraint
        // if they are not already present.
        if(!(c.getV1Name() in this._variables)) {
            this._variables[c.getV1Name()] = c.getV1();
        }
        if(!(c.getV2Name() in this._variables)) {
            this._variables[c.getV2Name()] = c.getV2();
        }

        // Add entry to the varConstraintsMap for the variables that this
        // constraint is involved with.
        if(!(c.getV1Id() in this.varConstraintMap)) {
            this.varConstraintMap[c.getV1Id()] = [];
        }
        if(!(c.getV2Id() in this.varConstraintMap)) {
            this.varConstraintMap[c.getV2Id()] = [];
        }
        this.varConstraintMap[c.getV1Id()].push(c);
        this.varConstraintMap[c.getV2Id()].push(c);

        return true;
    }

    /**
     * The solve function is not implemented here - an implementation of
     * solve must be provided in subclasses of this CSPSolver class
     */
    solve(initialAssignment = null, getAllSolutions = true) {
        this.getAllSolutions = getAllSolutions;
        this.initialAssignment = initialAssignment;
        this._solutions = [];
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
        logger.trace('Value of varlist is: ' + JSON.stringify(varList));
        const assignedVarMap = {};
        for(const v of varList) {
            // If the variable provided is not in our list of variables for
            // this solve, then we throw an error.
            if(!(v.getId() in this._variables)) {
                throw InvalidVariableError('Variable found in the ' +
                    'assigned variables with ID [' + v.getId() + '] and ' +
                    'name [' + v.getName() + '] is not registered for ' +
                    'this solver instance.');
            }
            assignedVarMap[v.getId()] = v;
        }
        for(const v of varList) {
            // If this variable is not present in any constraints then we
            // can ignore it and continue with the next variable. We can also
            // ignore the variable if it is unset (i.e. value is null)
            logger.debug('Value of v is: ' + v.getValue());
            if((!(v.getId() in this.varConstraintMap)) ||
                    v.getValue() === null) continue;

            // For a variable that exists in the constraint map, we need to
            // check whether the variable's value is consistent with that of
            // corresponding values of any variables in related constraints
            const relatedConstraints = this.varConstraintMap[v.getId()];
            for(const relConst of relatedConstraints) {
                let otherVar = null;
                if(relConst.getV1Id() === v.getId()) {
                    otherVar = relConst.getV2();
                }
                else {
                    otherVar = relConst.getV1();
                }

                // Now we need to check if the value of "otherVar" is in the
                // list of target values for v. We need to find otherVar in
                // the assignment since the instance of the variable with the
                // value is in the assignment list.
                const targetVarValue = assignment.getValueForVarById(otherVar.getId());
                if(targetVarValue === null) {
                    logger.debug('Target var value is null, don\'t need ' +
                            'check if the value is consistent.');
                    continue;
                }
                const tgt = relConst.getTargetValues(v.getId(), v.getValue());
                if(!(tgt.indexOf(assignment.getValueForVarById(otherVar.getId())) >= 0)) {
                    logger.debug('The value of the corresponding ' +
                            'variable in this constraint is not valid.');
                    logger.debug('Variable value is <',
                        assignment.getValueForVarById(otherVar.getId()),
                        '>, source var is <', v.getId(), ', ',
                        v.getValue(), '>, target values are ',
                        relConst.getTargetValues(v.getId(), v.getValue()));
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Check if the provided assignment is a solution. An assignment that is
     * a solution is one that is complete (i.e. all variables have values)
     * and where all constraints are satisfied.
     */
    isSolution(assignment) {
        return assignment.isComplete() && this.isConsistent(assignment);
    }

}

export default CSPSolver;
