/**
 * Tests for checking correct operation of the base CSPSolver class within 
 * the index.js file.
 */
import test from 'ava';
import Variable from '../src/variable.js';
import Constraint from '../src/constraint.js';
import { VariableValueError } from '../src/exceptions.js';

// Test that we can't directly instantiate the CSPSolver class - a subclass
// providing a specific implementation of the solve function must be used. 
test.todo('check that cspsolver class can\'t be directly instantiated');

// Add a variable and check that its been correctly added to variable list
// We need to use the test csp solver subclass defined above for this.
test.todo('test adding a variable to a solver');

// Add a constraint and check that its been correctly added to the solver
test.todo('test adding a constraint to a solver');

// Assignment tests - here we run various tests to see whether the solver is
// correctly handling variable assignments. The individual methods on the
// assignment class are tested separately in assignment.test.js
