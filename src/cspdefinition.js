/**
 * A class representing a constraint satisfaction problem definition.
 * This class stores a list of variables, represented using Variable objects,
 * and a list of Constraint objects representing constraints between pairs
 * of variables.
 *
 * The constructor takes lists of variables and constraints and checks that
 * the constraints contain references to valid variables as provided in the
 * variable list.
 */
import { InvalidVariableError } from './exceptions';
import * as log from 'loglevel';

const logger = log.noConflict();
logger.setLevel(logger.levels.INFO);

class CSPDefinition {

    constructor(variables, constraints) {
        this._variables = {};
        this._constraints = [];

        // Populate the variable dictionary with the list of variables
        for(const variable of variables) {
            this._variables[variable.getId()] = variable;
        }

        // Get the list of variable keys - these are used to check vars below
        const idList = Object.keys(this._variables);

        for(const constraint of constraints) {
            if(idList.indexOf(constraint.getV1Id()) < 0) {
                logger.error('Variable 1 in the provided constraint ' +
                        'doesn\'t exist in the list of provided variables.');
                throw new InvalidVariableError('Variable 1 in this ' +
                        'constraint doesn\'t exist in the list of ' +
                        'provided variables.');
            }
            if(idList.indexOf(constraint.getV2Id()) < 0) {
                logger.error('Variable 2 in the provided constraint ' +
                        'doesn\'t exist in the list of provided variables.');
                throw new InvalidVariableError('Variable 2 in this ' +
                        'constraint doesn\'t exist in the list of ' +
                        'provided variables.');
            }
            this._constraints.push(constraint);
        }
    }

}

export default CSPDefinition;
