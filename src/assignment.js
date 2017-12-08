/**
 * The assignment class provides one instance of an "assignment" - a list of
 * all the variables in a CSP with some or all of them assigned a value.
 */
import VariableValueException from './exceptions.js';

class Assignment {

    constructor(assignedVariableList) {
        const varMap = {}
        for(const v in assignedVariableList) {
            const newVar = Variable.fromVariable(v);
            varMap[newVar.getid()] = newVar;
        }
        this.varMap = varMap;
    }

    getVarList() {
        return this.varList;
    }

    getValueForVarByName(varName) {
        for(const v in this.varList) {
            if(v.getName() === varName) {
                return v.getValue();
            }
        }
        throw new VariableValueException('A variable with the specified ' +
                'name does not exist.');
    }

    getValueForVarById(varId) {
        for(const v in this.varList) {
            if(v.getId() === varId) {
                return v.getValue();
            }
        }
        throw new VariableValueException('A variable with the specified ' +
                'ID does not exist.');
    }

}

export { Assignment };