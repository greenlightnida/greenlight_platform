#!/usr/bin/env tsx

/**
 * Planning Criteria Protocol
 * Command: assess
 *
 * - Accepts a plan/strategy as input
 * - For each department/manager, assesses the plan from their POV
 * - Rates the plan's effectiveness per department
 * - Details SWOT (Strengths, Weaknesses, Opportunities, Threats)
 * - Confirms and refines dependencies
 * - Makes amendments/upgrades until rating is 85%+
 * - Outputs summary and actionable amendments
 * - Designed for use on recommendations execution plan
 */

import fs from 'fs';
import path from 'path';

// Example departments in a dev stack
const DEPARTMENTS = [
  'Frontend',
  'Backend',
  'DevOps',
  'QA',
  'Product',
  'Security',
  'Data',
  'Governance',
  'UX/UI',
  'Documentation'
];

interface Assessment {
  department: string;
  rating: number;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  dependencies: string[];
  amendments: string[];
}

interface PlanAssessment {
  overallRating: number;
  assessments: Assessment[];
  summary: string;
  amendments: string[];
}

function readPlan(planPath: string): string {
  if (!fs.existsSync(planPath)) {
    throw new Error(`Plan file not found: ${planPath}`);
  }
  return fs.readFileSync(planPath, 'utf-8');
}

function assessDepartment(plan: string, department: string): Assessment {
  // Placeholder: In a real system, this would use AI/ML or expert rules
  // For now, use simple heuristics and randomization for demonstration
  const baseRating = Math.floor(60 + Math.random() * 30); // 60-90
  const swot = {
    strengths: [`${department} sees clear objectives.`],
    weaknesses: [`${department} notes some resource constraints.`],
    opportunities: [`${department} can leverage new tools.`],
    threats: [`${department} faces tight deadlines.`]
  };
  const dependencies = [`${department} needs coordination with other teams.`];
  const amendments = baseRating < 85 ? [`${department} requests more clarity on deliverables.`] : [];
  return { department, rating: baseRating, swot, dependencies, amendments };
}

function aggregateAssessment(assessments: Assessment[]): PlanAssessment {
  const overallRating = Math.round(
    assessments.reduce((sum, a) => sum + a.rating, 0) / assessments.length
  );
  const amendments = assessments.flatMap(a => a.amendments);
  const summary =
    overallRating >= 85
      ? 'Plan is effective and ready for execution.'
      : 'Plan needs further refinement before execution.';
  return { overallRating, assessments, summary, amendments };
}

async function amendPlan(plan: string, amendments: string[]): Promise<string> {
  // Placeholder: In a real system, this would use AI/ML or prompt engineering
  let amendedPlan = plan;
  for (const amendment of amendments) {
    amendedPlan += `\n[AMENDMENT]: ${amendment}`;
  }
  return amendedPlan;
}

async function assess(planPath: string) {
  let plan = readPlan(planPath);
  let assessment: PlanAssessment;
  let iteration = 0;
  do {
    iteration++;
    console.log(`\n--- Assessment Iteration ${iteration} ---`);
    const assessments = DEPARTMENTS.map(dep => assessDepartment(plan, dep));
    assessment = aggregateAssessment(assessments);
    console.log(`\nOverall Rating: ${assessment.overallRating}%`);
    for (const a of assessment.assessments) {
      console.log(`- ${a.department}: ${a.rating}%`);
      console.log(`  SWOT: S:${a.swot.strengths[0]} W:${a.swot.weaknesses[0]} O:${a.swot.opportunities[0]} T:${a.swot.threats[0]}`);
      if (a.amendments.length) {
        console.log(`  Amendments: ${a.amendments.join('; ')}`);
      }
    }
    if (assessment.amendments.length) {
      plan = await amendPlan(plan, assessment.amendments);
      console.log(`\nAmendments applied. Reassessing...`);
    }
  } while (assessment.overallRating < 85 && iteration < 5);

  // Output summary and amendments
  console.log(`\n=== Final Assessment ===`);
  console.log(`Summary: ${assessment.summary}`);
  if (assessment.amendments.length) {
    console.log(`Outstanding Amendments: ${assessment.amendments.join('; ')}`);
  }
  // Optionally, write amended plan to file
  const amendedPath = planPath.replace(/(\.md|\.txt|\.plan)?$/, '.amended.plan');
  fs.writeFileSync(amendedPath, plan, 'utf-8');
  console.log(`\nAmended plan written to: ${amendedPath}`);
}

// CLI usage: tsx planning_criteria_protocol.ts assess <planPath>
const [,, command, planPath] = process.argv;
if (command === 'assess' && planPath) {
  assess(planPath).catch(err => {
    console.error('Assessment failed:', err);
    process.exit(1);
  });
} else if (command === 'assess') {
  console.log('Usage: tsx planning_criteria_protocol.ts assess <planPath>');
  process.exit(1);
} 