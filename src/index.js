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
        this._constraints = [];
        this._variables = {};
        this.varConstraintMap = {};
    }

    addVariable(v) {
        log.debug('Adding variable named [' + v.getName() + '] with ID [' +
                v.getId() + '] to var list');
        // Check of this variable has already been added
        if(v.getId() in this._variables) return false;
        this.variables[v.getId()] = v;
        return true;
    }

    addConstraint(c) {
        log.debug('Adding constraint between variable [' + c.getV2Name() +
                '] and variable [' + c.getV1Name() + '] to constraint list.');
        this._variables.push(c);
        // Add entry to the varConstraintsMap for the variables that this
        // constraint is involved with.
        if( !(c.getV1Id() in this.varConstraintMap) ) {
            this.varConstraintMap[c.getV1Id()] = [];
        }
        if( !(c.getV2Id() in this.varConstraintMap) ) {
            this.varConstraintMap[c.getV2Id()] = [];
        }
        this.varConstraintMap[c.getV1Id()].push(c);
        this.varConstraintMap[c.getV2Id()].push(c);
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
        const assignedVarMap = {}
        for(const v in varList) {
            // If the variable provided is not in our list of variables for 
            // this solve, then we throw an error.
            if( !(v.getId() in this._variables) ) { 
                throw InvalidVariableException('Variable found in the ' +
                    'assigned variables with ID [' + v.getId() + '] and ' +
                    'name [' + v.getName() + '] is not registered for ' +
                    'this solver instance.');
            }
            assignedVarMap[v.getId()] = v;
        }
        for(const v in varList) {
            // If this variable is not present in any constraints then we  
            // can ignore it and continue with the next variable. We can also
            // ignore the variable if it is unset (i.e. value is null)
            if( (!(variable.getId() in this.varConstraintMap)) || 
                    v.getValue === null) continue;

            // For a variable that exists in the constraint map, we need to
            // check whether the variable's value is consistent with that of
            // corresponding values of any variables in related constraints
            const relatedConstraints = this.varConstraintMap[v.getId()];
            for(const relConst in relatedConstraints) {
                let otherVar = null;
                if(relConst.getV1Id() === v.getId())
                    otherVar = relConst.getV2();
                else
                    otherVar = relConst.getV1();
                if(otherVar !== null) {
                    if(!(otherVar.getValue() in relConst.getTargetValues(
                            v.getId(), v.getValue()))) {
                        log.debug('The value of the corresponding ' +
                              'variable in this constraint is not valid.');  
                        return false;
                    }
                }
                
            }


        }
        
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
