/**
 * Tests for checking correct operation of the Assignment class.
 */
import test from 'ava';
import * as log from 'loglevel';
import Variable from '../src/variable.js';
import Assignment from '../src/assignment.js';
import Solution from '../src/solution.js';
import { VariableValueError, InvalidSolutionError 
    } from '../src/exceptions.js';

var logger = log.noConflict();
logger.setLevel(logger.levels.INFO);

// Create a list of test variables to use for creating the assignment object
const v1 = new Variable('MyTestVar1', ['a','b']);
const v2 = new Variable('MyTestVar2', ['c','d','e','f','g']);
const v3 = new Variable('MyTestVar3', ['h','i','j','k','l','m']);
const v4 = new Variable('MyTestVar4', ['n','o']);
const v5 = new Variable('MyTestVar5', ['p']);

test('try to create a solution from a partial assignment', t => {
    v1.setValue('b');
    v2.setValue(null);
    v3.setValue('m');
    v4.setValue('o');
    v5.setValue(null);
    const localVarList = [v1, v2, v3, v4, v5];
    const a = new Assignment(localVarList);
    const err = t.throws(() => {
        const sol = new Solution(a);
    }, InvalidSolutionError);
    t.is(err.message, 'The provided assignment is incomplete. Can\'t ' +
        'create a solution from this assignment.');
});

test('try to create a solution from a complete assignment', t => {
    v1.setValue('b');
    v2.setValue('d');
    v3.setValue('m');
    v4.setValue('o');
    v5.setValue('p');
    const localVarList = [v1, v2, v3, v4, v5];
    const a = new Assignment(localVarList);
    const sol = new Solution(a);
    t.pass();
});