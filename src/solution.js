import * as log from 'loglevel';
import Assignment from './assignment.js';
import { InvalidSolutionError } from './exceptions.js';

var logger = log.noConflict();
logger.setLevel(logger.levels.INFO);

/**
 * A solution is an assignment for which all variables have values and all
 * these values are consistent with the set of constraints for the given CSP.
 *
 * At present we don't check for consistency when creating a solution - this
 * is done by the target CSP solver class since this has access to the
 * variable and constraint details to make such checks. It is therefore
 * assumed that the provided solution is consistent and this is simply a
 * marker subclass to identify a given assignment as a solution.
 */
class Solution extends Assignment {

    constructor(assignment) {
        super(assignment.getVarList());
        if(!assignment.isComplete()) {
            throw new InvalidSolutionError('The provided assignment is ' +
                'incomplete. Can\'t create a solution from this assignment.');
        }
    }

}

export default Solution;
