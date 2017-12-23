/**
 * Implementation of a simple backtracking CSP solver. Extends the
 * main CSPSolver class defined in index.js.
 *
 * This solver uses a recursive approach to identify possible solutions given
 * a CSP definition. For a given problem definition and assignment, the
 * solver checks if the assignment is complete and if not:
 * Recursive stage: it selects one of the unassigned variables in the
 * assignment. It then checks if the new set of assignments is consistent.
 * If so it recurses to the next level of the tree, returning to the
 * "Recursive stage" marker. If the assignment is not consistent, this branch
 * of the tree fails and we jump back to the previous state and try another
 * branch.
 */
import CSPSolver from './cspsolver';
import Assignment from './assignment';
import Solution from './solution';
import * as log from 'loglevel';

const logger = log.getLogger('backtracking');
logger.setLevel(logger.levels.INFO);

class BacktrackingSolver extends CSPSolver {

    // Variables and constraints set via superclass, this just provides an
    // implementation of solve using the backtracking method.
    // Superclass provides:
    // this._constraints = [];
    // this._variables = {}; - a map of variable ID to object
    // this.varConstraintMap = {}; - a map of variable ID to an array of
    //                               constraints with which that variable
    //                               is involved.
    constructor(...params) {
        super(...params);
        logger.debug('Creating a backtracking solver instance...');
    }

    /**
     * The solve function is the entry point to the recursive solve process.
     * When calling the solve here we identify whether we want only the first
     * solution or a list of all solutions.
     *
     * initialAssignent: an assignment object containing the initial state
     * getAllSolutions: true: get all solutions, false: return first solution
     *
     * If you want to get only the first solution for an unassigned initial
     * state, call solve with (null, false)
     */
    solve(initialAssignment = null, getAllSolutions = true) {
        super.solve(initialAssignment, getAllSolutions);
        if(initialAssignment === null) {
            // Prepare a blank initial assignment
            initialAssignment = Assignment.emptyAssignment(this._variables);
        }
        logger.debug('About to start solve with initial assignment:\n' +
            initialAssignment.printAssignment());
        this.treeLevel = 0;
        const result = this.recursiveSolve(initialAssignment);
        logger.debug('Result: ' + JSON.stringify(result));

        // Format the output data as JSON that we can load in as an object
        // later in order to test the solver output.
        function replacer(key, value) {
            if (key === 'domain') return undefined;
            else if (key === 'id') return undefined;
            else return value;
        }

        logger.debug('{"solutions":[');
        for(const solution of this._solutions) {
            logger.debug(JSON.stringify(solution, replacer) + ',');
        }
        logger.debug(']}');

        return result;
    }

    recursiveSolve(assignment) {
        this.treeLevel++;
        logger.debug('AT TREE LEVEL: ' + this.treeLevel);
        if(assignment.isComplete()) return new Solution(assignment);
        const v = this.getUnassignedVar(assignment);
        // We now process the selected unassigned variable working through
        // each of its values in turn each time we return to this tree node
        const varDomain = v.getDomain();
        const updatedDomain = this.orderDomainValues(varDomain);
        for(const item of updatedDomain) {
            v.setValue(item);
            logger.debug('Assignment is: ' + assignment.printAssignment());
            if(this.isConsistent(assignment)) {
                const result = this.recursiveSolve(assignment);
                this.treeLevel--;
                logger.debug('AT TREE LEVEL: ' + this.treeLevel);
                logger.debug('TYPE OF RESULT IS: ' + result.constructor.name);
                if(this.isSolution(result)) {
                    logger.trace('RESULT TO RETURN: ' + result.printAssignment());
                    // return result;
                    this._solutions.push(new Solution(result));
                }
                v.setValue(null);
            }
            else {
                v.setValue(null);
            }
        }
        return assignment;
    }

    /**
     * Select an unassigned variable from the assignment. To this, we get all
     * the unassigned vars from the assignment and then pick one at random.
     * This function can be updated to add heuristics to improve the variable
     * selection in a way that will increase the solver performance.
     */
    getUnassignedVar(assignment) {
        const unassignedList = assignment.getUnassignedVariables();
        // Get a random item from the list
        const randVar =
            unassignedList[Math.floor(Math.random() * unassignedList.length)];
        return randVar;
    }

    /**
     * Order the list of domain values. This process can be used to implement
     * heuristics that improve solver performance.
     *
     * NOTE: For now, this is a placeholder that simply returns the values
     * given in the order they were provided.
     */
    orderDomainValues(values) {
        return values;
    }

}

export default BacktrackingSolver;
