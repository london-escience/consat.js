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

const testV1 = new Variable('TestVar1', testDomainV1);
const testV2 = new Variable('TestVar2', testDomainV2);

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
test.todo('get variable 1 from constraint');

test.todo('get variable 1 name from constraint');

test.todo('get variable 1 ID from constraint');

// Test the get methods for variable 2, variable 2 name and variable 2 ID.
test.todo('get variable 2 from constraint');

test.todo('get variable 2 name from constraint');

test.todo('get variable 2 ID from constraint');

// Test the target value lookup from v1 to v2 and vice versa.
test.todo('get target values from variable 2 given variable 1 value');

test.todo('get target values from variable 1 given variable 2 value');
