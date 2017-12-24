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

log.noConflict();
const logger = log.getLogger('backtracking.test');
logger.setLevel(logger.levels.DEBUG);

const solutions = [];
const solutionStr = '{"solutions":[{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"red"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"blue"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"red"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"blue"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"red"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"green"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"red"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"red"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"blue"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"red"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"blue"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"red"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"green"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"green"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"red"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"blue"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"red"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"blue"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"red"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"green"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"blue"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"red"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"green"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"red"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"green"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"red"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"blue"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"red"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"red"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"green"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"red"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"green"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"red"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"blue"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"green"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"red"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"green"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"red"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"green"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"red"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"blue"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"blue"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"green"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"blue"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"green"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"blue"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"green"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"red"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"red"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"green"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"blue"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"green"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"blue"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"green"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"red"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"green"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"green"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"blue"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"green"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"blue"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"green"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"red"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"blue"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"green"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"red"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"green"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"red"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"green"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"blue"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"red"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"green"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"red"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"green"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"red"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"green"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"blue"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"green"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"green"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"red"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"green"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"red"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"green"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"blue"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"blue"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"blue"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"green"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"blue"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"green"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"blue"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"red"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"red"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"blue"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"green"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"blue"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"green"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"blue"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"red"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"green"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"blue"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"green"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"blue"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"green"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"blue"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"red"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"blue"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"blue"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"red"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"blue"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"red"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"blue"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"green"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"red"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"blue"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"red"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"blue"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"red"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"blue"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"green"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"green"}}},{"varMap":{"bc1751f0-e5ac-11e7-87ab-5dd40df07acf":{"name":"WA","value":"blue"},"bc17a010-e5ac-11e7-87ab-5dd40df07acf":{"name":"NT","value":"red"},"bc17ee30-e5ac-11e7-87ab-5dd40df07acf":{"name":"Q","value":"blue"},"bc186360-e5ac-11e7-87ab-5dd40df07acf":{"name":"NSW","value":"red"},"bc18b180-e5ac-11e7-87ab-5dd40df07acf":{"name":"V","value":"blue"},"bc18ffa0-e5ac-11e7-87ab-5dd40df07acf":{"name":"SA","value":"green"},"bc199be0-e5ac-11e7-87ab-5dd40df07acf":{"name":"T","value":"blue"}}}]}';
const solutionObj = JSON.parse(solutionStr);
const varDomain = ['red','green','blue'];
const WA = new Variable('WA', varDomain);
const NT = new Variable('NT', varDomain);
const Q = new Variable('Q', varDomain);
const NSW = new Variable('NSW', varDomain);
const V = new Variable('V', varDomain);
const SA = new Variable('SA', varDomain);
const T = new Variable('T', varDomain);
const variables = {WA: WA, NT: NT, Q: Q, NSW: NSW, V: V, SA: SA, T: T};

for(const item of solutionObj['solutions']) {
    const varList = [];
    const varMap = item['varMap'];
    for(const key in varMap) {
        const v = new Variable(varMap[key]['name'], varDomain, varMap[key].value, key);
        varList.push(v);
    }
    const assignment = new Assignment(varList);
    solutions.push(new Solution(assignment));
}

function setupMapColouringSolver() {
    // Setup the solver with the map colouring problem, as used in the 
    // Artificial Intelligence: A Modern Approach book.
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
    return solver;
}

test('check a simple backtracking solve with valid solutions', t => {
    const solver = setupMapColouringSolver();
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
            logger.debug('SOL VARDATA: ' + JSON.stringify(varData));
            solDict[varData.name] = varData.value;
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
        for(const resData of resList) {
            logger.debug('RES VARDATA: ' + JSON.stringify(resData));
            resDict[resData.name] = resData.value;
        }
        resultSolutionList.push(resDict);
    }
    // Now we need to check whether there is an equivalent set of entries in 
    // solutionList and resSolutionList. These entries will be in a random 
    // order in both lists. At present, we check this using an inefficient 
    // O(n^2) approach but this can be optimised in due course.
    t.is(resultSolutionList.length, solutionList.length);
    for(const soln of solutionList) {
        logger.debug('Checking soln: <' + JSON.stringify(soln) + '>');
        let solution = null;
        let i = resultSolutionList.length;
        
        while(i--) {
            const res = resultSolutionList[i];
            logger.debug('Length of result solution list: ' + resultSolutionList.length);
            logger.trace('Checking res: <' + JSON.stringify(res) + '>');
            
            let match = true;
            for(const key in soln) {
                if((!(key in res)) || soln[key] !== res[key]) {
                    match = false;
                    logger.trace('Key <' + key + '>, val <' + soln[key] + '> is not in <' 
                            + JSON.stringify(res) + '> or values don\'t match');
                    break;
                }
            }
            if(match) {
                logger.debug('We have a match...removing from resSolList');
                resultSolutionList.splice(i, 1);
                break;
            }            
        }
        logger.debug('Broken out of resSolList loop...');
    }
    t.is(resultSolutionList.length, 0);
});

test('check a simple backtracking solve with no solutions', t => {
    const solver = setupMapColouringSolver();
    // Setup the initial assignment
    // With this assignment, SA can only be green, NSW can only be blue
    // therefore we expect one possible solution.
    const initialValues = {WA:'red',NT:'blue',Q:'red',V:'red',T:'green', SA: 'blue', NSW: null};
    const initialVarList = [];
    for(const key in initialValues) {
        const v = Variable.fromVariable(variables[key]);
        v.setValue(initialValues[key]);
        initialVarList.push(v);
        logger.debug('SETUP VARIABLE: [' + v.getId() + ', ' + v.getName() + 
            ', ' + v.getValue() + ']');
    }
    const initialAssignment = new Assignment(initialVarList);
    logger.debug('Running solve for map colouring problem...');
    const res = solver.solve(initialAssignment);
    const localSolutions = solver._solutions;
    logger.debug('Solver result: <' + JSON.stringify(localSolutions) + '>');
    logger.debug('Number of solutions: <' + localSolutions.length + '>');
    t.is(localSolutions.length, 0);
});

test('check a backtracking solve beginning with a partial solution', t => {
    const solver = setupMapColouringSolver();
    // Setup the initial assignment
    // With this assignment, SA can only be green, NSW can only be blue
    // therefore we expect one possible solution.
    const initialValues = {WA:'red',NT:'blue',Q:'red',V:'red',T:'green', SA: null, NSW: null};
    const solutionValues = {WA:'red',NT:'blue',Q:'red',V:'red',T:'green',
        SA:'green',NSW:'blue'};
    const initialVarList = [];
    for(const key in initialValues) {
        const v = Variable.fromVariable(variables[key]);
        v.setValue(initialValues[key]);
        initialVarList.push(v);
        logger.debug('SETUP VARIABLE: [' + v.getId() + ', ' + v.getName() + 
            ', ' + v.getValue() + ']');
    }
    const solutionVarList = [];
    for(const key in solutionValues) {
        const v = Variable.fromVariable(variables[key]);
        v.setValue(solutionValues[key]);
        solutionVarList.push(v);
        logger.debug('SETUP VARIABLE: [' + v.getId() + ', ' + v.getName() + 
            ', ' + v.getValue() + ']');

    }
    const initialAssignment = new Assignment(initialVarList);
    const solutionAssignment = new Assignment(solutionVarList);
    const solution = [new Solution(solutionAssignment)];
    logger.debug('Running solve for map colouring problem...');
    const res = solver.solve(initialAssignment);
    const solutions = solver._solutions;
    logger.debug('Solver result: <' + JSON.stringify(solutions) + '>');
    logger.debug('Number of solutions: <' + solutions.length + '>');
    t.is(solutions.length, 1);
    const solutionMap = solutions[0]['varMap'];
    for(const key in solutionMap) {
        const varName = solutionMap[key]['name'];
        const varValue = solutionMap[key]['value']
        t.is(varValue, solutionAssignment.getValueForVarByName(varName));
    }
    

});

test('check a backtracking solve for first solution only response', t => {
    const solver = setupMapColouringSolver();
    logger.debug('Running solve for map colouring problem...');
    // Pass false to show that we don't want to get all solutions and only 
    // want to receive the first solution discovered.
    const res = solver.solve(Assignment.emptyAssignment(solver._variables), false);
    logger.debug('Result from map solve: ' + JSON.stringify(res));
    logger.debug('Solver solutions from map solve: ' + JSON.stringify(solver._solutions));
    // We should receive only 1 solution
    const localSolutions = solver._solutions;
    t.is(localSolutions.length, 1);
    // Make sure that the discovered solution is present in the full solution
    // list stored in the global solutions list
    let match = false;
    const local = localSolutions[0];
    for(const sol of solutions) {
        if(local.getValueForVarByName('WA') === sol.getValueForVarByName('WA') &&
           local.getValueForVarByName('NT') === sol.getValueForVarByName('NT') &&
           local.getValueForVarByName('Q') === sol.getValueForVarByName('Q') &&
           local.getValueForVarByName('V') === sol.getValueForVarByName('V') &&
           local.getValueForVarByName('T') === sol.getValueForVarByName('T') &&
           local.getValueForVarByName('SA') === sol.getValueForVarByName('SA') &&
           local.getValueForVarByName('NSW') === sol.getValueForVarByName('NSW')) {
            match = true;
            break;
        }
    }
    t.is(match, true);
});
