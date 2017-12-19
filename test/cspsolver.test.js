/**
 * Tests for checking correct operation of the base CSPSolver class within 
 * the index.js file.
 */
import test from 'ava';
import Variable from '../src/variable.js';
import Constraint from '../src/constraint.js';
import Assignment from '../src/assignment.js';
import { CSPSolver } from '../src/index.js';
import { VariableValueError } from '../src/exceptions.js';

// Set up a test example with 5 variables and 4 constraints
const testDomainV1 = ['a', 'b', 'd','h'];
const testDomainV2 = ['t', 'v', 'w', 'x', 'p'];
const testDomainV3 = ['g', 'c', 'i'];
const testDomainV4 = ['u', 'z', 'e', 'f'];
const testDomainV5 = ['j', 'k', 'm', 'n', 'r', 's'];
const mappingV1V2 = {a:['v'], b:['t','v','p'], d:['w','x'], h:['x','p']};
const mappingV4V2 = {u:['v','w','x'], z:['t','w','x'], e:['p'], f:['t','p']};
const mappingV4V5 = {u:['r','n'], z:['j'], e:['m','n','r'], f:['k','m','s']};
const mappingV3V5 = {g:['m'], c:['j','k','n','r'], i:['s']};

const v1Name = 'TestVar1';
const v2Name = 'TestVar2';
const v3Name = 'TestVar3';
const v4Name = 'TestVar4';
const v5Name = 'TestVar5';
const testV1 = new Variable(v1Name, testDomainV1);
const testV2 = new Variable(v2Name, testDomainV2);
const testV3 = new Variable(v3Name, testDomainV3);
const testV4 = new Variable(v4Name, testDomainV4);
const testV5 = new Variable(v5Name, testDomainV5);

const testConstraint1 = new Constraint(testV1, testV2, mappingV1V2);
const testConstraint2 = new Constraint(testV4, testV2, mappingV4V2);
const testConstraint3 = new Constraint(testV4, testV5, mappingV4V5);
const testConstraint4 = new Constraint(testV3, testV5, mappingV3V5);

/*
 * Create a test 'blank' solver class 
 */
class MySolver extends CSPSolver {
    
    constructor(...params) {
        super(...params);
    }
    
}

function getTestSolverConfig() {
    const solver = new MySolver();
    solver.addVariable(testV1);
    solver.addVariable(testV2);
    solver.addVariable(testV3);
    solver.addVariable(testV4);
    solver.addVariable(testV5);
    solver.addConstraint(testConstraint1);
    solver.addConstraint(testConstraint2);
    solver.addConstraint(testConstraint3);
    solver.addConstraint(testConstraint4);
    return solver;
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
    const result = solver.addConstraint(testConstraint1);
    t.is(result, true);
});

test('is complete, valid assignment consistent with constraint mapping', t => {
    const solver = getTestSolverConfig();
    const newV1 = Variable.fromVariable(testV1);
    const newV2 = Variable.fromVariable(testV2);
    const newV3 = Variable.fromVariable(testV3);
    const newV4 = Variable.fromVariable(testV4);
    const newV5 = Variable.fromVariable(testV5);
    newV1.setValue('b');
    newV2.setValue('p');
    newV3.setValue('g');
    newV4.setValue('e');
    newV5.setValue('m');
    const assignment = new Assignment([newV1, newV2, newV3, newV4, newV5]);
    const isconsistent = solver.isConsistent(assignment); 
    t.is(isconsistent, true);
});

test('is complete, invalid assignment consistent with mapping', t => {
    const solver = getTestSolverConfig();
    const newV1 = Variable.fromVariable(testV1);
    const newV2 = Variable.fromVariable(testV2);
    const newV3 = Variable.fromVariable(testV3);
    const newV4 = Variable.fromVariable(testV4);
    const newV5 = Variable.fromVariable(testV5);
    newV1.setValue('b');
    newV2.setValue('p');
    newV3.setValue('g');
    newV4.setValue('e');
    newV5.setValue('s');
    const assignment = new Assignment([newV1, newV2, newV3, newV4, newV5]);
    const isconsistent = solver.isConsistent(assignment); 
    t.is(isconsistent, false);
});

test('is partial, valid assignment consistent with constraint mapping', t => {
    const solver = getTestSolverConfig();
    const newV1 = Variable.fromVariable(testV1);
    const newV2 = Variable.fromVariable(testV2);
    const newV3 = Variable.fromVariable(testV3);
    const newV4 = Variable.fromVariable(testV4);
    const newV5 = Variable.fromVariable(testV5);
    newV2.setValue('p');
    newV4.setValue('e');
    newV5.setValue('m');
    const assignment = new Assignment([newV1, newV2, newV3, newV4, newV5]);
    const isconsistent = solver.isConsistent(assignment); 
    t.is(isconsistent, true);
});

test('is partial, invalid assignment consistent with mapping', t => {
    const solver = getTestSolverConfig();
    const newV1 = Variable.fromVariable(testV1);
    const newV2 = Variable.fromVariable(testV2);
    const newV3 = Variable.fromVariable(testV3);
    const newV4 = Variable.fromVariable(testV4);
    const newV5 = Variable.fromVariable(testV5);
    newV1.setValue('b');
    newV3.setValue('g');
    newV5.setValue('s');
    const assignment = new Assignment([newV1, newV2, newV3, newV4, newV5]);
    const isconsistent = solver.isConsistent(assignment); 
    t.is(isconsistent, false);
});
