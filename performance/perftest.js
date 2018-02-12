/**
 * The main top level node executable for the performance test command line
 * application.
 */
import * as log from 'loglevel';
import CSPDataGenerator from './datagenerator.js';
import BacktrackingSolver from '../src/backtrackingsolver.js';
import Assignment from '../src/assignment.js';
const testPlan = require('./test_data_plan.json');

const logger = log.noConflict();
logger.setLevel(logger.levels.INFO);
main();

function main() {
    logger.debug('Running command-line performance test utility.');
    // Load the data file and run the test data generator.
    const dataGen = new CSPDataGenerator(testPlan);
    if(dataGen == null) {
        logger.error('An error occurred creating the data generator.');
        return;
    }
    const data = dataGen.generateTestData();
    const dataObjects = [];
    for(const key in data) {
        dataObjects.push(data[key]);
    }
    logger.debug('Data generated successfully. Got <' + dataObjects.length +
            '> definitions');

    // Now we want to run a set of tests with the CSP definitions that we've
    // created. These tests will run through each of the variables making
    // selections until we have a complete and valid setup with all variables
    // having values defined.
    // DEBUGGING - start with just the first definition
    // const def = dataObjects[0];

    let testNum = 0;
    for(const def of dataObjects) {
        logger.info('Test with <' + def.numVariables() + '> variables ' +
                'and <' + testPlan['testPlan'][testNum]['const_2'] + ', ' +
                testPlan['testPlan'][testNum]['const_3'] + ', ' +
                testPlan['testPlan'][testNum]['const_4'] + '> 2, 3 and ' +
                '4-way constraints:');
        const solver = new BacktrackingSolver(def);
        const initialAssignment = Assignment.emptyAssignment(def.getVariableMap());
        logger.debug('Initial assignment: ' + JSON.stringify(initialAssignment));
        const solutions = solver.solve(initialAssignment);
        logger.info('\tReceived <' + solutions.length + '> solutions.\n');
        let i = 1;
        for(const sol of solutions) {
            let str = '\tSolution ' + i + ': \t';
            for(const v of sol.getVarList()) {
                str += ('<' + v.getName() + ', ' + v.getValue() + '> ');
            }
            logger.debug(str);
            i++;
        }
        testNum++;
    }
}
