/**
 * Run tests to check for correct operation of the backtracking solver.
 */
import test from 'ava';
import Variable from '../src/variable.js';
import Constraint from '../src/constraint.js';
import Assignment from '../src/assignment.js';
import Solution from '../src/solution.js';
import BacktrackingSolver from '../src/backtrackingsolver.js';
import { VariableValueError } from '../src/exceptions.js';
import * as log from 'loglevel';

const logger = log.getLogger('backtracking.test');
logger.setLevel(logger.levels.DEBUG);

const solutions = [];
const solutionStr = '{"solutions":[{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"red"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"blue"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"red"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"blue"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"red"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"green"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"red"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"red"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"blue"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"red"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"blue"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"red"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"green"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"green"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"red"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"blue"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"red"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"blue"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"red"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"green"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"blue"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"red"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"green"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"red"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"green"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"red"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"blue"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"red"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"red"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"green"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"red"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"green"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"red"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"blue"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"green"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"red"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"green"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"red"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"green"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"red"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"blue"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"blue"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"green"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"blue"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"green"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"blue"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"green"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"red"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"red"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"green"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"blue"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"green"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"blue"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"green"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"red"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"green"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"green"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"blue"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"green"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"blue"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"green"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"red"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"blue"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"green"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"red"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"green"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"red"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"green"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"blue"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"red"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"green"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"red"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"green"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"red"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"green"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"blue"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"green"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"green"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"red"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"green"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"red"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"green"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"blue"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"blue"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"blue"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"green"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"blue"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"green"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"blue"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"red"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"red"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"blue"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"green"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"blue"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"green"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"blue"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"red"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"green"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"blue"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"green"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"blue"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"green"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"blue"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"red"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"blue"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"blue"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"red"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"blue"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"red"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"blue"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"green"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"red"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"blue"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"red"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"blue"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"red"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"blue"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"green"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"green"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"blue"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"red"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"blue"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"red"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"blue"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"green"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"blue"}}}]}';
const solutionObj = JSON.parse(solutionStr);
const varDomain = ['red','green','blue'];
for(const item of solutionObj['solutions']) {
    const varList = [];
    const varMap = item['varMap'];
    for(const key in varMap) {
        const v = new Variable(key, varDomain, varMap[key].value, varMap[key].name);
        varList.push(v);
    }
    const assignment = new Assignment(varList);
    solutions.push(new Solution(assignment));
}

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
    // Process the list of solutions into a list of JSON objects that contain
    // keys for the var names and the corresponding var value.
    const solutionList = [];
    for(const sol of solutions) {
        const solDict = {};
        const varList = sol.getVarList();
        for(const varData of varList) {
            logger.debug('VARDATA: ' + JSON.stringify(varData));
            solDict[varData.id] = varData.value;
        }
        solutionList.push(solDict);
    }
    logger.debug('Solution data: ' + JSON.stringify(solutionList));
    // Now need to check that one of the results that we've got is in the 
    // solution list from above.
    
    const resultSolutionList = [];
    for(const sol of solver._solutions) {
        const resDict = {};
        const resList = sol.getVarList();
        for(const varData of varList) {
            logger.debug('VARDATA: ' + JSON.stringify(varData));
            resDict[varData.id] = varData.value;
        }
        resultSolutionList.push(resDict);
    }
});

test.todo('check a simple backtracking solve with no solutions');

test.todo('check a bracktracking solve beginning with a partial solution');

test.todo('check a bracktracking solve for first solution only response');

test.todo('check a bracktracking solve for all solutions response');