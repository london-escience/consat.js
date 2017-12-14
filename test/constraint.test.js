/**
 * Tests for checking correct operation of the Constraint class
 */
import test from 'ava';
import Variable from '../src/variable.js';
import Constraint from '../src/constraint.js';
import { VariableValueError } from '../src/exceptions.js';

const testDomainV1 = ['a', 'b', 'd','h'];
const testDomainV2 = ['t', 'v', 'w', 'x', 'p'];
const mappingV1V2 = {a:['v'], b:['t','v','p'], d:['w','x'], h:['x','p']};

const v1Name = 'TestVar1';
const v2Name = 'TestVar2';
const v1TestId = 'MyTestVarID';
const testV1 = new Variable(v1Name, testDomainV1, null, v1TestId);
const testV2 = new Variable(v2Name, testDomainV2);

const testConstraint = new Constraint(testV1, testV2, mappingV1V2);

// When a constraint object is created, we provide a set of mappings between
// the chosen source variable and the target variable. The constraint code
// generates the reverse mappings and we need to check that these are being
// generated correctly.
test('test generated constraint mappings', t => {
    const reverseMapping = {t:['b'], v:['a','b'], w:['d'], x:['d','h'],
            p:['b','h']};
    const c = new Constraint(testV1, testV2, mappingV1V2);
    t.deepEqual(reverseMapping, c.mappingsV2toV1);
});

// Test the get methods for variable 1, variable 1 name and variable 1 ID.
test('get variable 1 from constraint', t => {
    const v1 = testConstraint.getV1();
    t.is(v1, testV1)
});

test('get variable 1 name from constraint', t => {
    const name = testConstraint.getV1Name();
    t.is(name, v1Name);
});

test('get variable 1 ID from constraint', t=> {
    const id = testConstraint.getV1Id();
    t.is(id, v1TestId);
});

// Test the get methods for variable 2, variable 2 name and variable 2 ID.
test('get variable 2 from constraint', t => {
    const v2 = testConstraint.getV2();
    t.is(v2, testV2)
});

test('get variable 2 name from constraint', t => {
    const name = testConstraint.getV2Name();
    t.is(name, v2Name);
});

test('get variable 2 ID from constraint', t => {
    const id = testConstraint.getV2Id();
    const uuidv1Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    t.regex(id, uuidv1Regex);
});

// Test the target value lookup from v1 to v2 and vice versa
test('get target values from variable 2 given variable 1 value', t => {
    const values = testConstraint.getTargetValues(v1TestId, 'b');
    t.deepEqual(values, ['t', 'v', 'p']);
});

test('get target values from variable 1 given variable 2 value', t => {
    const values = testConstraint.getTargetValues(testV2.getId(), 'x');
    t.deepEqual(values, ['d', 'h']);
});

// Test target value lookup for invalid values
test('get target values from variable 2 given invalid var 1 value', t => {
    const err = t.throws(() => {
        testConstraint.getTargetValues(v1TestId, 'k');    
    }, VariableValueError);
    t.is(err.message, 'The specified value is not a valid value for the ' +
            'variable named.')
});

test('get target values from variable 1 given invalid var 2 value', t => {
    const err = t.throws(() => {
        testConstraint.getTargetValues(testV2.getId(), 'm');    
    }, VariableValueError);
    t.is(err.message, 'The specified value is not a valid value for the ' +
            'variable named.')
    
});
