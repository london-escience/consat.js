/**
 * A variable class representing a discrete variable with a finite domain of
 * values.
 *
 * The variable has a name, a domain and an optional value.
 */
import CSPSolverValueException from './exceptions';

class Variable {

    constructor(name, domain, value = null) {
        this.name = name;
        this.domain = domain;
        this.value = value;
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

}

export default Variable;
