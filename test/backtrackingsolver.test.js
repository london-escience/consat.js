/**
 * Run tests to check for correct operation of the backtracking solver.
 */
import test from 'ava';
import Variable from '../src/variable.js';
import Constraint from '../src/constraint.js';
import Assignment from '../src/assignment.js';
import BacktrackingSolver from '../src/backtrackingsolver.js';
import { VariableValueError } from '../src/exceptions.js';
import * as log from 'loglevel';

var logger = log.noConflict();
logger.setLevel(logger.levels.DEBUG);

test('check a simple backtracking solve with valid solutions', t => {
    // Setup the solver with the map colouring problem, as used in the 
    // Artificial Intelligence: A Modern Approach book.
    const domain = ['red', 'green', 'blue'];
    const WA = new Variable('WA', domain);
    const NT = new Variable('NT', domain);
    const Q = new Variable('Q', domain);
    const NSW = new Variable('NSW', domain);
    const V = new Variable('V', domain);
    const SA = new Variable('SA', domain);
    const T = new Variable('T', domain);
    // Mappings between neighbouring variables are the same for each pair
    const mappingV1toV2 = {'red':['green','blue'], 'green':['red','blue'], 
        'blue':['red','green']};
    const WA_NT = new Constraint(WA, NT, mappingV1toV2);
    const WA_SA = new Constraint(WA, SA, mappingV1toV2);
    const NT_SA = new Constraint(NT, SA, mappingV1toV2);
    const NT_Q = new Constraint(NT, Q, mappingV1toV2);
    const SA_Q = new Constraint(SA, Q, mappingV1toV2);
    const SA_NSW = new Constraint(SA, NSW, mappingV1toV2);
    const SA_V = new Constraint(SA, V, mappingV1toV2);
    const Q_NSW = new Constraint(Q, NSW, mappingV1toV2);
    const NSW_V = new Constraint(NSW, V, mappingV1toV2);
    const solver = new BacktrackingSolver();
    solver.addVariable(WA);
    solver.addVariable(NT);
    solver.addVariable(Q);
    solver.addVariable(NSW);
    solver.addVariable(V);
    solver.addVariable(SA);
    solver.addVariable(T);
    solver.addConstraint(WA_NT);
    solver.addConstraint(WA_SA);
    solver.addConstraint(NT_SA);
    solver.addConstraint(NT_Q);
    solver.addConstraint(SA_Q);
    solver.addConstraint(SA_NSW);
    solver.addConstraint(SA_V);
    solver.addConstraint(Q_NSW);
    solver.addConstraint(NSW_V);
    logger.debug('Running solve for map colouring problem...');
    const res = solver.solve(Assignment.emptyAssignment(solver._variables));
    logger.debug('Result from map solve: ' + JSON.stringify(res));
});

test.todo('check a simple backtracking solve with no solutions');

test.todo('check a bracktracking solve beginning with a partial solution');

test.todo('check a bracktracking solve for first solution only response');

test.todo('check a bracktracking solve for all solutions response');