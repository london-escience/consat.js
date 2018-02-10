/**
 *
 */
import * as log from 'loglevel';

const logger = log.noConflict();
logger.setLevel(logger.levels.INFO);

class CSPDataGenerator {

    constructor(testPlanFile) {
        logger.debug('Placeholder constructor');
    }

    getDataSetById() {
        logger.debug('Placeholder for getDataSetById');
    }

    numDataSets() {
        logger.debug('Placeholder for numDataSets');
    }

}

export default CSPDataGenerator;
