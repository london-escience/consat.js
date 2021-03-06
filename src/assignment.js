/**
 * The assignment class provides one instance of an "assignment" - a list of
 * all the variables in a CSP with some or all of them assigned a value.
 */
import { VariableValueError } from './exceptions.js';
import Variable from './variable.js';
import * as log from 'loglevel';

var logger = log.noConflict();
logger.setLevel(logger.levels.INFO);

class Assignment {

    constructor(assignedVariableList) {
        const varMap = {};
        for(const v of assignedVariableList) {
            logger.debug('Creating variable...');
            logger.debug('Var name: ' + v.getName());
            logger.debug('Var ID: ' + v.getId());
            logger.debug('Var value: ' + v.getValue());
            logger.debug('Var domain: ' + JSON.stringify(v.getDomain()));
            const newVar = Variable.fromVariable(v);
            varMap[newVar.getId()] = newVar;
        }
        this.varMap = varMap;
    }

    getVarList() {
        const varList = [];
        for(const key in this.varMap) {
            varList.push(this.varMap[key]);
        }
        return varList;
    }

    getValueForVarByName(varName) {
        for(const vId in this.varMap) {
            if(this.varMap[vId].getName() === varName) {
                return this.varMap[vId].getValue();
            }
        }
        throw new VariableValueError('A variable with the specified ' +
                'name does not exist.');
    }

    getValueForVarById(varId) {
        if(varId in this.varMap) {
            return this.varMap[varId].getValue();
        }
        // If the variable ID isn't in the map, throw an error.
        throw new VariableValueError('A variable with the specified ' +
                'ID does not exist.');
    }

    // Get the list of unassigned variables for this assignment
    getUnassignedVariables() {
        const unassignedVars = [];
        for(const key in this.varMap) {
            const v = this.varMap[key];
            if(!v.hasValue()) unassignedVars.push(v);
        }
        return unassignedVars;
    }

    /**
     * Check if this assignment is complete. An assignment that is
     * complete is one where all the variables in the assignment have values.
     */
    isComplete() {
        for(const vId in this.varMap) {
            if(this.varMap[vId].getValue() === null) return false;
        }
        return true;
    }

    printAssignment() {
        let printStr = '';
        for(const vId in this.varMap) {
            printStr += this.varMap[vId].name + ' = ' + this.varMap[vId].value + '\t';
        }
        printStr += '\n';
        return printStr;
    }

    static emptyAssignment(variableMap) {
        const assignmentList = [];
        for(const varId in variableMap) {
            const newVar = Variable.fromVariable(variableMap[varId]);
            newVar.setValue(null);
            assignmentList.push(newVar);
        }
        return new Assignment(assignmentList);
    }

}

export default Assignment;
