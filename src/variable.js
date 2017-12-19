/**
 * A variable class representing a discrete variable with a finite domain of
 * values.
 *
 * The variable has a name, a domain and an optional value.
 */
import uuid from 'uuid/v1.js';
import * as log from 'loglevel';
import { VariableValueError } from './exceptions';

const logger = log.noConflict();
logger.setLevel(logger.levels.DEBUG);

class Variable {

    constructor(name, domain, value = null, id = null) {
        if(name === undefined || domain === undefined) {
            throw new TypeError('Name and domain are required parameters.');
        }
        if(name === '') throw new TypeError('Name cannot be an empty string.');
        if(domain.constructor !== Array) {
            throw new TypeError('Domain must be an array of possible values.');
        }
        if(domain.length === 0) {
            throw new TypeError('Domain array cannot be empty.');
        }

        // If a value is provided, it must be in the domain!
        if(value !== null) {
            if(domain.indexOf(value) === -1) {
                throw new VariableValueError('The specified value is not ' +
                        'in the provided domain of values.');
            }
        }

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
    
    hasValue() {
        return this.value !== null;
    }

    setValue(value) {
        if(!(this.domain.includes(value) || value === null)) {
            throw new VariableValueError('The value specified for variable' +
                    ' [' + this.id + '] is not in the value domain.');
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
        return new Variable(v.getName(), v.getDomain(), v.getValue(),
            v.getId());
    }

}

export default Variable;
