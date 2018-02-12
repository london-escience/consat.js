/**
 * A constraint class representing a constraint between two variables.
 * The constraint is set up as a mapping between two variables, v1 and v2
 *
 * Since a constraint works in two directions, we need a two-way
 * representation of our constraint mapping. The client creating the instance
 * of this class only needs to specify the mapping in one direction and we
 * then generate the mapping in the other direction based on the information
 * from the provided mapping.
 *
 * Mappings are represented as an associative array with the value of the
 * source variable as the key and then a list of valid values of the target
 * variable as the value.
 */
import { VariableValueError, InvalidVariableError } from './exceptions';
import * as log from 'loglevel';

const logger = log.noConflict();
logger.setLevel(logger.levels.INFO);

class Constraint {

    constructor(v1, v2, mappingsV1toV2) {
        if(v1.getName() === v2.getName()) {
            throw new VariableValueError('The two variables for this ' +
                    'constraint cannot have the same name.');
        }

        const mappingsV2toV1 = {};
        // Begin by setting up reverse mappings from v2 to v1
        // We go through the mappings and check for each item that the source
        // and all the target values appear in the domains of the relevant
        // variables. If they don't then the provided mapping is incorrect.
        for(let key in mappingsV1toV2) {
            if(!v1.valueInDomain(key)) {
                log.error('The provided variable mapping is invalid.' +
                        'Value [' + key + '] is specified as a mapping key' +
                        ' is not a in the value domain for variable 1 [' +
                        v1.getName() + ']');
                throw new VariableValueError('Value [' + key + '] is ' +
                        'specified as a mapping key is not a in the value ' +
                        'domain for variable 1 [' + v1.getName() + ']');
            }
            // Add the current value (key) to the V2toV1 table...
            for(let val of mappingsV1toV2[key]) {
                if(!(val in mappingsV2toV1)) {
                    mappingsV2toV1[val] = [];
                }
                mappingsV2toV1[val].push(key);
            }
        }

        // In theory this shouldn't happen but its possible (especially when
        // generating random variable data) that there are values in the
        // domain of one variable that have no mapping to a value in the
        // domain of the other variable. In this case, we may need to add
        // empty entries to the V2->V1 mapping that was generated above...
        const V2toV1keys = Object.keys(mappingsV2toV1);
        for(const domainVal of v2.getDomain()) {
            if(V2toV1keys.indexOf(domainVal) === -1) {
                mappingsV2toV1[domainVal] = [];
            }
        }

        // Store class variables
        this.v1 = v1;
        this.v2 = v2;
        this.mappingsV1toV2 = mappingsV1toV2;
        this.mappingsV2toV1 = mappingsV2toV1;
    }

    getV1() {
        return this.v1;
    }

    getV1Name() {
        return this.v1.getName();
    }

    getV1Id() {
        return this.v1.getId();
    }

    getV2() {
        return this.v2;
    }

    getV2Name() {
        return this.v2.getName();
    }

    getV2Id() {
        return this.v2.getId();
    }

    /**
     * Get all the target values for the specified variable and value.
     */
    getTargetValues(vId, vValue) {
        // Check whether we've been passed a value for var1 or var2 and then
        // get the corresponding values from the relevant mapping
        logger.trace('Getting target values for vId <', vId, '> with value <',
            vValue, '>.');
        if(vId === this.v1.getId()) {
            if(!(vValue in this.mappingsV1toV2)) {
                logger.debug('The specified value <' + vValue + '> is not ' +
                    'a valid value for the variable with ID <' + vId + '>. ' +
                    'Mappings are ' + JSON.stringify(this.mappingsV1toV2));
                throw new VariableValueError('The specified value is not ' +
                'a valid value for the variable named.');
            }
            return this.mappingsV1toV2[vValue];
        }
        else if(vId === this.v2.getId()) {
            if(!(vValue in this.mappingsV2toV1)) {
                logger.trace('The specified value <' + vValue + '> is not ' +
                        'a valid value for the variable with ID <' + vId + '>. ' +
                        'Mappings are ' + JSON.stringify(this.mappingsV2toV1));
                throw new VariableValueError('The specified value is not ' +
                        'a valid value for the variable named.');
            }
            return this.mappingsV2toV1[vValue];
        }
        else {
            throw new InvalidVariableError('Invalid variable name provided.');
        }
    }

}

export default Constraint;
