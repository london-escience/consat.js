/**
 * Tests for checking correct operation of the Assignment class.
 */
import test from 'ava';
import * as log from 'loglevel';
import Variable from '../src/variable.js';
import Constraint from '../src/constraint.js';
import Assignment from '../src/assignment.js';
import { VariableValueError } from '../src/exceptions.js';

var logger = log.noConflict();
logger.setLevel(logger.levels.INFO);

// Create a list of test variables to use for creating the assignment object
const v1 = new Variable('MyTestVar1', ['a','b']);
const v2 = new Variable('MyTestVar2', ['c','d','e','f','g']);
const v3 = new Variable('MyTestVar3', ['h','i','j','k','l','m']);
const v4 = new Variable('MyTestVar4', ['n','o']);
const v5 = new Variable('MyTestVar5', ['p']);

const localVarList = [v1, v2, v3, v4, v5];

// Test creation of an assignment from a list of variables with values.
test('creation of an assignment object', t => {
    const assignment = new Assignment(localVarList);
    // ES2017 Object.values probably too new to be using here...
    const varMapValues = [];
    for(const key in assignment.varMap) 
        varMapValues.push(assignment.varMap[key]);
    t.deepEqual(varMapValues, localVarList);
});

test('get the list of variables for an assignment', t => {
    const assignment = new Assignment(localVarList);
    const varList = assignment.getVarList();
    t.deepEqual(varList, localVarList);
});

// Test getting a variable value from an assignment where the variable is 
// identified by name and ID. Also test for name and ID trying to access a 
// variable that doesn't exist in the assignment.
test('get value for a variable in an assignment by variable name', t => {
    const newV3 = Variable.fromVariable(v3);
    newV3.setValue('j');
    const assignment = new Assignment([v1, v2, newV3, v4, v5]);
    const value = assignment.getValueForVarByName('MyTestVar3');
    t.is(value, 'j');
});

test('get value for a variable in an assignment by variable ID', t => {
    const newV4 = new Variable('MyTestVar4', ['n','o'], null, 'MyTestVar4ID');
    newV4.setValue('o');
    const assignment = new Assignment([v1, v2, v3, newV4, v5]);
    const value = assignment.getValueForVarById('MyTestVar4ID');
    logger.debug('Checking value: <' + value + '>');
    t.is(value, 'o');
});

test('get value for missing variable in assignment by variable name', t => {
    const assignment = new Assignment(localVarList);
    const err = t.throws(() => {
        const value = assignment.getValueForVarByName('InvalidVarName');
    }, VariableValueError);
    t.is(err.message, 'A variable with the specified name does not exist.');
});

test('get value for missing variable in assignment by variable ID', t => {
    const assignment = new Assignment(localVarList);
    const err = t.throws(() => {
        const value = assignment.getValueForVarById('InvalidVarID');
    }, VariableValueError);
    t.is(err.message, 'A variable with the specified ID does not exist.');
});

// Complete assignment tests - here we run tests to see whether we can
// correctly identify when an assignment is complete or not.
test('test for a complete assignment with a complete input', t => {
    const v1Assigned = new Variable('MyTestVar1', ['a','b'], 'b');
    const v2Assigned = new Variable('MyTestVar2', ['c','d','e','f','g'], 'e');
    const v3Assigned = new Variable('MyTestVar3', ['h','i','j','k','l','m'], 'i');
    const v4Assigned = new Variable('MyTestVar4', ['n','o'], 'o');
    const v5Assigned = new Variable('MyTestVar5', ['p'], 'p');

    const varList = [v1Assigned, v2Assigned, v3Assigned, 
                     v4Assigned, v5Assigned];
    
    const assignment = new Assignment(varList);
    t.is(assignment.isComplete(), true);
});

test('test for a complete assignment with an incomplete input', t => {
    const v1Assigned = new Variable('MyTestVar1', ['a','b'], 'b');
    const v2Assigned = new Variable('MyTestVar2', ['c','d','e','f','g'], 'e');
    const v3Assigned = new Variable('MyTestVar3', ['h','i','j','k','l','m'], 'i');
    const v4Assigned = new Variable('MyTestVar4', ['n','o']);
    const v5Assigned = new Variable('MyTestVar5', ['p'], 'p');

    const varList = [v1Assigned, v2Assigned, v3Assigned, 
                     v4Assigned, v5Assigned];
    
    const assignment = new Assignment(varList);
    t.is(assignment.isComplete(), false);
});