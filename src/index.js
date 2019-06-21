/**
 * Entry point for the consat.js Constraint Satisfaction Solver library.
 *
 * This library provides support for solving constraint satisfaction problems
 * either by formulating the problem programmatically or by loading in a
 * problem description in XML format that can be used to define the problem.
 *
 * At present, this module provides a basic backtracking solver for discrete
 * variables with finite domains.
 */
import CSPSolver from './cspsolver';
import Variable from './variable';
import Constraint from './constraint';
import Assignment from './assignment';
import Solution from './solution';
import BacktrackingSolver from './backtrackingsolver';
import { InvalidVariableError } from './exceptions';

export { CSPSolver, Variable, Constraint, BacktrackingSolver, Assignment,
    Solution, InvalidVariableError };
