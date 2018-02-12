/**
 *
 */
import * as log from 'loglevel';
import uuid from 'uuid/v1.js';
import Variable from '../src/variable.js';
import Constraint from '../src/constraint.js';
import CSPDefinition from '../src/cspdefinition.js';
const Chance = require('chance');

const logger = log.noConflict();
logger.setLevel(logger.levels.INFO);

class CSPDataGenerator {

    constructor(testPlanFile) {
        if(testPlanFile == null) {
            throw new TypeError('A test plan file must be provided to ' +
                    'create an instance of the CSPDataGenerator');
        }
        if(!testPlanFile.hasOwnProperty('testPlan') ||
                !testPlanFile.hasOwnProperty('choicesPerVar')) {
            throw new TypeError('The test plan must contain top-level ' +
                    'testPlan and choicesPerVar properties.');
        }
        const testPlan = testPlanFile['testPlan'];
        logger.debug('Test plan contains <' + testPlan.length + '> tests.');
        this.testPlan = {'choicesPerVar': testPlanFile['choicesPerVar']};
        for(const item of testPlan) {
            this.testPlan[uuid()] = item;
        }

        // We now want to prepare a CSPDefinition object for each of the
        // entries in the test plan. We then return a dict with a uuid key
        // and the row from the test plan for each of the definitions. The
        // UUID can be used to access the data set via getDataSetById().
        this.testData = {};
        const testPlanIds = Object.keys(this.testPlan);
        const index = testPlanIds.indexOf('choicesPerVar');
        if(index >= 0) {
            testPlanIds.splice(index, 1);
        }
        logger.debug('IDs: ' + JSON.stringify(testPlanIds));
        for(const id of testPlanIds) {
            const numChoices = this.testPlan['choicesPerVar'];
            const numVars = this.testPlan[id]['vars'];
            const c2 = this.testPlan[id]['const_2'];
            const c3 = this.testPlan[id]['const_3'];
            const c4 = this.testPlan[id]['const_4'];
            this.testData[id] = this._generateTestData(numVars, numChoices,
                c2, c3, c4);
        }
        return this.testPlan;
    }

    getDataSetById(id) {
        if(!this.testData.hasOwnProperty(id)) {
            logger.debug('The test data does not contain a data object ' +
                    'with the id <' + id + '>');
            return null;
        }
        return this.testData[id];
    }

    numDataSets() {
        return this.testPlan.length;
    }

    /**
     * This function generates a test constraint satisfaction problem
     * definition for use in performance testing. The problem definition
     * contains the specified number of variables and variable options
     * in addition to the specified number of 2, 3 and 4-way constraints.
     */
    _generateTestData(numVars, numChoices, c2, c3, c4) {
        logger.debug('Generating test csp defintion for <' + numVars +
                '> vars, <' + numChoices + '> choices per var and with ' +
                '<' + c2 + ', ' + c3 + ', ' + c4 + '> 2, 3, 4-way ' +
                'constraints respectively.');

        const chance = new Chance();

        const variables = [];
        const constraints = [];
        for(let i = 0; i < numVars; i++) {
            const name = 'var-' + (i + 1);
            const domain = [];
            for(let j = 0; j < numChoices; j++) {
                domain.push(chance.word());
            }
            variables.push(new Variable(name, domain));
        }

        for(const v of variables) {
            logger.debug('Variable <' + v.getId() + ', ' + v.getName() +
                    '>: ' + JSON.stringify(v.getDomain()));
        }

        // Now we create some constraints - initially starting with just the
        // pairwise constraints.
        logger.debug('We need to create <' + c2 + '> pairwise constraints.');
        for(let i = 0; i < c2; i++) {
            // Remove two variables at random from the list of variables
            const v1 = variables.splice(Math.floor(Math.random() * variables.length), 1)[0];
            const v2 = variables.splice(Math.floor(Math.random() * variables.length), 1)[0];
            // Now create mappings between each of the values for v1 and a
            // subset of the values for v2.
            const mapping = {};
            const choices = v2.getDomain();
            for(const item of v1.getDomain()) {
                const targets = [];
                // For this item of the domain of v1 prepare a set of target
                // values by selecting a subset of values from v2. We pick a
                // random number of values between 1 and half the number of
                // total values.
                const numTargetOptions = Math.floor(Math.random() * (numChoices / 2)) + 1;
                logger.debug('Picking <' + numTargetOptions + '> target ' +
                        'choices for source value <' + item + '>');
                const choiceIndexes = [];
                for(let j = 0; j < choices.length; j++) {
                    choiceIndexes.push(j);
                }
                for(let j = 0; j < numTargetOptions; j++) {
                    // Pick a random value from choice indexes and remove it
                    // Use this value as the index for the choices array and
                    // add the value from the array to targets.
                    const idx = choiceIndexes.splice(Math.floor(Math.random() * choiceIndexes.length), 1)[0];
                    targets.push(choices[idx]);
                }
                mapping[item] = targets;
                logger.debug('\t\tPicked <' + JSON.stringify(targets) + '>');
            }
            constraints.push(new Constraint(v1, v2, mapping));
        }

        // We can now create the constraint problem definition object with
        // list of variables and constraints.
        return new CSPDefinition(variables, constraints);
    }

}

export default CSPDataGenerator;
