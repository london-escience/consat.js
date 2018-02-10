/**
 * The main top level node executable for the performance test command line
 * application.
 */
import * as log from 'loglevel';
import CSPDataGenerator from './datagenerator.js';

const logger = log.noConflict();
logger.setLevel(logger.levels.INFO);

logger.debug('Running command-line performance test utility.');
// Load the data file and run the test data generator.
const dataGen = CSPDataGenerator('');
