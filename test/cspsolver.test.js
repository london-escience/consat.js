/**
 * Tests for checking correct operation of the base CSPSolver class within 
 * the index.js file.
 */
import test from 'ava';
import Variable from '../src/variable.js';
import Constraint from '../src/constraint.js';
import { CSPSolver } from '../src/index.js';
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

/*
 * Create a test 'blank' solver class 
 */
class MySolver extends CSPSolver {
    
    constructor(...params) {
        super(...params);
    }
    
}

// Test that we can't directly instantiate the CSPSolver class - a subclass
// providing a specific implementation of the solve function must be used. 
test('check that cspsolver class can\'t be directly instantiated', t => {
    const err = t.throws(() => {
        const solver = new CSPSolver();
    }, TypeError);
    t.is(err.message, 'CSPSolver is an abstract class and can\'t be ' +
            'instantiated directly.');
});

// Add a variable and check that its been correctly added to variable list
// We need to use the test csp solver subclass defined above for this.
test('test adding a variable to a solver', t => {
    const solver = new MySolver();
    const result = solver.addVariable(testV1);
    t.is(result, true);
});

// Add a constraint and check that its been correctly added to the solver
test('test adding a constraint to a solver', t => {
    const solver = new MySolver();
    const result = solver.addConstraint(testConstraint);
    t.is(result, true);
});
