/**
 * Run tests to check for correct operation of the backtracking solver.
 */
import test from 'ava';
import Variable from '../src/variable.js';
import Constraint from '../src/constraint.js';
import Assignment from '../src/assignment.js';
import { BacktrackingSolver } from '../src/index.js';
import { VariableValueError } from '../src/exceptions.js';

test.todo('check a simple backtracking solve with valid solutions');

test.todo('check a simple backtracking solve with no solutions');

test.todo('check a bracktracking solve beginning with a partial solution');

test.todo('check a bracktracking solve for first solution only response');

test.todo('check a bracktracking solve for all solutions response');