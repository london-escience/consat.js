/**
 * A variable class representing a discrete variable with a finite domain of
 * values.
 *
 * The variable has a name, a domain and an optional value.
 */
import uuid from 'uuid/v1.js';
import CSPSolverValueException from './exceptions';

class Variable {

    constructor(name, domain, value = null, id = null) {
        // Assign the variable a unique ID
        if(id === null) this.id = uuid();
        else this.id = id;

        this.name = name;
        this.domain = domain;
        this.value = value;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getDomain() {
        return this.domain;
    }

    getValue() {
        return this.value;
    }

    addValue(value) {
        if(!this.domain.includes(value)) {
            throw CSPSolverValueException('The value specified for variable [' +
                    this.name + '] is not in the value domain.');
        }
        else {
            this.value = value;
        }
    }

    valueInDomain(value) {
        return this.domain.includes(value);
    }

    /**
     * Create a new Variable object from an existing one
     */
    static fromVariable(v) {
        return new Variable(v.getName(), v.getDomain(), v.getValue());
    }

}

export default Variable;
