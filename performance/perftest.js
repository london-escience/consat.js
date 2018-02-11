/**
 * The main top level node executable for the performance test command line
 * application.
 */
import * as log from 'loglevel';
import CSPDataGenerator from './datagenerator.js';
const testPlan = require('./test_data_plan.json');

const logger = log.noConflict();
logger.setLevel(logger.levels.DEBUG);
main();

function main() {
    logger.debug('Running command-line performance test utility.');
    // Load the data file and run the test data generator.
    const dataGen = new CSPDataGenerator(testPlan);
    if(dataGen == null) {
        logger.error('An error occurred creating the data generator.');
        return;
    }
    logger.debug('Data generated successfully.');
}
