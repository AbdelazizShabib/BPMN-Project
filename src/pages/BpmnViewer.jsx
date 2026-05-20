import { useEffect, useRef, useState } from 'react'
import BpmnNavigatedViewer from 'bpmn-js/lib/NavigatedViewer'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-js.css'
import { SCRUM_BPMN } from '../data/scrumBpmn'
import Header from '../components/layout/Header'
import {
  ZoomIn, ZoomOut, Maximize2, Maximize, Minimize, RefreshCw,
  Info, Play, Zap, AlertTriangle, TrendingUp, Circle, GitBranch, X, Database, Clock, FileText,
} from 'lucide-react'

const NODE_INFO = {
  // ── Events ──────────────────────────────────────────────────────────────────
  SE_Start: {
    title: 'Product Backlog Exists',
    desc: 'The process begins when an initial product backlog exists. The Product Owner has captured at least a first set of user stories that define the product vision and anchors every sprint to the bigger picture.',
    color: 'text-green-400', type: 'event', phase: 'Backlog Preparation',
    xpReward: null, gamification: null, achievement: null, behavioralEffect: null, risk: null,
  },
  EE_Released: {
    title: 'Product Released',
    desc: 'The product has been successfully shipped to end users. All agreed sprint cycles are complete and the team has chosen not to continue development. A full-team XP bonus is awarded.',
    color: 'text-red-400', type: 'event', phase: 'Release',
    xpReward: '+500 XP',
    gamification: 'Release Celebration bonus: +500 XP shared equally across all team members for a successful product launch.',
    achievement: 'Ship It', behavioralEffect: 'Reinforces collective ownership of the end-to-end delivery.',
    risk: null,
  },

  // ── Backlog Preparation ──────────────────────────────────────────────────────
  T_Vision: {
    title: 'Maintain Product Vision',
    desc: 'The Product Owner maintains and communicates the overall product vision and long-term roadmap. This anchors every sprint to the bigger picture and ensures stakeholder alignment.',
    color: 'text-blue-400', type: 'task', phase: 'Backlog Preparation',
    xpReward: '+50 XP',
    gamification: 'Vision Keeper badge awarded for 3 consecutive sprints with a documented, stakeholder-approved vision update.',
    achievement: 'Vision Keeper',
    behavioralEffect: 'Encourages Product Owners to maintain and regularly communicate the product roadmap, not just react to requests.',
    risk: 'May incentivize frequent vision changes to farm XP, introducing scope creep rather than strategic consistency.',
  },
  T_Stories: {
    title: 'Write & Refine User Stories',
    desc: 'User stories are written in "As a … I want … so that …" format. Acceptance criteria are defined. Existing stories are refined based on new knowledge, stakeholder feedback, or changing requirements.',
    color: 'text-blue-400', type: 'task', phase: 'Backlog Preparation',
    xpReward: '+75 XP',
    gamification: '+75 XP per user story accepted into a sprint. Bonus +50 XP for stories with clearly defined acceptance criteria and no ambiguity flags.',
    achievement: 'Story Architect',
    behavioralEffect: 'Motivates thorough story writing with well-defined, testable acceptance criteria rather than vague requests.',
    risk: 'Story inflation risk — writing many small trivial stories to maximize XP gains, reducing sprint planning efficiency.',
  },
  T_Estimate: {
    title: 'Estimate Story Points',
    desc: 'The development team collaboratively estimates the relative effort of each backlog item using story points (e.g. Fibonacci scale). Techniques like Planning Poker ensure shared understanding.',
    color: 'text-blue-400', type: 'task', phase: 'Backlog Preparation',
    xpReward: '+100 XP',
    gamification: 'Estimation Master badge: +100 XP when sprint actual velocity is within 15% of estimated velocity for 2 consecutive sprints.',
    achievement: 'Estimation Master',
    behavioralEffect: 'Drives the team to invest in estimation skill, improve calibration, and develop shared understanding of complexity.',
    risk: 'Teams may sandbag estimates (inflate points) to guarantee XP rewards, or underestimate to appear efficient and then miss sprint goals.',
  },
  T_Prioritize: {
    title: 'Prioritize Product Backlog',
    desc: 'The Product Owner orders backlog items by business value, risk, and dependencies. Higher-priority items are better refined and estimated. The team re-prioritizes after every sprint.',
    color: 'text-blue-400', type: 'task', phase: 'Backlog Preparation',
    xpReward: '+60 XP',
    gamification: 'XP multiplier of ×1.5 applied to sprint delivery XP when top-priority items are delivered on schedule.',
    achievement: 'Backlog Guru',
    behavioralEffect: 'Reinforces value-driven decision making in backlog ordering, linking XP rewards to business outcomes.',
    risk: 'PO may prioritize easy, low-complexity items to maximize delivery XP rather than high-risk, business-critical features.',
  },
  GW_Backlog: {
    title: 'Backlog Ready?',
    desc: 'Decision: is the top of the backlog sufficiently refined and estimated for sprint planning to begin? If not, the team runs additional grooming before proceeding.',
    color: 'text-orange-400', type: 'gateway', phase: 'Backlog Preparation',
    xpReward: null, gamification: null, achievement: null, behavioralEffect: null, risk: null,
  },
  T_AddStories: {
    title: 'Add More User Stories',
    desc: 'When the backlog lacks enough refined items, the team runs an additional grooming session. Stories are decomposed, clarified, and estimated until the backlog is sprint-ready.',
    color: 'text-blue-400', type: 'task', phase: 'Backlog Preparation',
    xpReward: '+40 XP',
    gamification: 'Backlog health score contributes to the team XP multiplier at sprint start. Consistently healthy backlogs unlock the Backlog Refiner achievement.',
    achievement: 'Backlog Refiner',
    behavioralEffect: 'Encourages proactive grooming sessions rather than discovering gaps during sprint planning.',
    risk: 'Unnecessary story decomposition to inflate backlog size metrics and trigger XP rewards without real product value.',
  },

  // ── Sprint Planning ──────────────────────────────────────────────────────────
  T_SprintPlan: {
    title: 'Sprint Planning Meeting',
    desc: 'The whole Scrum team meets to plan the upcoming sprint. The Product Owner presents top backlog items; the team asks clarifying questions and collectively agrees on what can be delivered.',
    color: 'text-violet-400', type: 'task', phase: 'Sprint Planning',
    xpReward: '+150 XP',
    gamification: 'Planning XP: +150 XP when the sprint goal is clearly stated, scope is realistic, and all committed stories are assigned at planning.',
    achievement: 'Planning Ace',
    behavioralEffect: 'Encourages full team participation in planning, better preparation, and realistic commitment rather than passive acceptance.',
    risk: 'Teams may over-commit to score Planning XP, then fail to deliver the sprint goal and lose more XP than they gained.',
  },
  T_Goal: {
    title: 'Define Sprint Goal',
    desc: 'A single, concise statement that captures the purpose of the sprint. The sprint goal gives the team focus and allows flexibility in how the goal is achieved.',
    color: 'text-violet-400', type: 'task', phase: 'Sprint Planning',
    xpReward: '+80 XP',
    gamification: 'Goal Clarity bonus: +80 XP when the sprint goal is SMART (Specific, Measurable, Achievable, Relevant, Time-bound) and achieved at sprint end.',
    achievement: 'Goal Setter',
    behavioralEffect: 'Motivates writing clear, measurable goals rather than vague directives, and creates accountability for delivering on the stated purpose.',
    risk: 'Teams may set artificially simple or narrow goals to guarantee XP reward, reducing the ambition and value of each sprint.',
  },
  T_SelectItems: {
    title: 'Select Backlog Items',
    desc: 'The team selects the product backlog items they commit to delivering this sprint, based on priority and team capacity (velocity). Selected items form the sprint backlog.',
    color: 'text-violet-400', type: 'task', phase: 'Sprint Planning',
    xpReward: '+50 XP',
    gamification: 'Selection accuracy tracked: XP multiplier based on the percentage of selected items actually delivered — rewarding realistic commitment over optimistic over-loading.',
    achievement: 'Commitment Champion',
    behavioralEffect: 'Drives accurate capacity planning and aligns individual commitment with team capability assessment.',
    risk: 'May incentivize selecting low-complexity, easily-deliverable items rather than high-value, challenging features to maximise completion XP.',
  },
  T_SprintBacklog: {
    title: 'Create Sprint Backlog',
    desc: "Selected stories are broken down into specific development tasks. Each task is small enough to be completed in a day. The sprint backlog is the team's plan for delivering the sprint goal.",
    color: 'text-violet-400', type: 'task', phase: 'Sprint Planning',
    xpReward: '+60 XP',
    gamification: 'Task Clarity bonus: well-decomposed tasks (≤1 day each, fully described) earn a +60 XP Sprint Architect reward for the planning session.',
    achievement: 'Sprint Architect',
    behavioralEffect: 'Encourages proper task decomposition and shared understanding of work before coding begins.',
    risk: 'Artificial task splitting to inflate task completion counts, enabling XP farming through many trivial task closures.',
  },
  GW_Capacity: {
    title: 'Team Capacity Met?',
    desc: "Does the selected scope fit within the team's available capacity for this sprint? If overloaded, items are removed from the sprint backlog until the workload is realistic.",
    color: 'text-orange-400', type: 'gateway', phase: 'Sprint Planning',
    xpReward: null, gamification: null, achievement: null, behavioralEffect: null, risk: null,
  },
  T_AdjustScope: {
    title: 'Adjust Sprint Scope',
    desc: "Items are removed from or added to the sprint backlog to match the team's capacity. The Product Owner decides which items to defer. Scope adjustment avoids overcommitment.",
    color: 'text-violet-400', type: 'task', phase: 'Sprint Planning',
    xpReward: '+30 XP',
    gamification: 'Realist bonus: +30 XP for responsible scope management. Normalises adjustment as a healthy practice, not a failure.',
    achievement: 'Realist',
    behavioralEffect: 'Removes stigma around reducing scope; teams are rewarded for honest capacity assessment rather than heroic over-commitment.',
    risk: 'Teams may adjust scope too aggressively (choose very little work) to guarantee 100% sprint completion and XP rewards.',
  },

  // ── Daily Scrum ──────────────────────────────────────────────────────────────
  T_DailyScrum: {
    title: 'Daily Scrum Standup',
    desc: 'A 15-minute time-boxed event held every working day. Each team member answers: What did I do yesterday? What will I do today? Are there any impediments? The Scrum Master facilitates and removes blockers.',
    color: 'text-yellow-400', type: 'task', phase: 'Daily Scrum',
    xpReward: '+25 XP',
    gamification: '+25 XP daily attendance. Streak multiplier: ×1.5 XP after 5 consecutive standups. Daily Champion achievement at 10-day streak.',
    achievement: 'Daily Champion',
    behavioralEffect: 'Maximises team attendance, punctuality, and transparency. Streak system rewards sustained engagement rather than one-off participation.',
    risk: 'Attendance farming — showing up but not contributing. Streak pressure causes stress and penalises team members for illness or leave.',
  },
  GW_Impediment: {
    title: 'Impediment Exists?',
    desc: 'Is there a blocker preventing the team from making progress? Impediments can be technical, process-related, or external. The Scrum Master is responsible for resolving impediments quickly.',
    color: 'text-orange-400', type: 'gateway', phase: 'Daily Scrum',
    xpReward: null, gamification: null, achievement: null, behavioralEffect: null, risk: null,
  },
  T_RemImpediment: {
    title: 'Remove Impediment',
    desc: "The Scrum Master works to eliminate the identified blocker. This may involve escalating to management, coordinating with other teams, or reorganising the team's approach.",
    color: 'text-red-400', type: 'task', phase: 'Daily Scrum',
    xpReward: '+200 XP',
    gamification: 'Blocker Buster: +200 XP for resolving an impediment within 24 hours of identification. Rapid resolution bonus reinforces urgency.',
    achievement: 'Blocker Buster',
    behavioralEffect: 'Incentivises rapid, decisive impediment resolution rather than allowing blockers to linger and stall progress.',
    risk: 'Scrum Masters may declare trivial or self-inflicted issues as formal impediments to farm high XP.',
  },

  // ── Development ──────────────────────────────────────────────────────────────
  T_Dev: {
    title: 'Development Work',
    desc: 'Developers design, build, and integrate features. The team self-organises around tasks. Work should meet the Definition of Done including coding standards, unit tests, and documentation.',
    color: 'text-cyan-400', type: 'task', phase: 'Development',
    xpReward: 'SP × 20 XP',
    gamification: 'XP = Story Points × 20. Combo bonus: +50% XP for completing tasks 2+ days before sprint end. Early delivery rewards planning skill.',
    achievement: 'Velocity Surge',
    behavioralEffect: 'Rewards developers for tackling complex, high-SP stories rather than cherry-picking easy tasks. Combo bonuses incentivise momentum.',
    risk: 'Prioritising quick, low-effort tasks to maximise XP at the expense of high-value complex work. Code quality sacrificed for speed.',
  },
  T_CodeReview: {
    title: 'Peer Code Review',
    desc: 'A team member reviews the code authored by a peer. Code review ensures quality, knowledge sharing, adherence to standards, and early detection of bugs before testing.',
    color: 'text-cyan-400', type: 'task', phase: 'Development',
    xpReward: '+75 XP',
    gamification: '+75 XP per code review submitted with meaningful comments. +100 XP bonus for catching critical defects before testing.',
    achievement: 'Review Champion',
    behavioralEffect: 'Drives active participation in reviews rather than treating them as a blocking formality. Rewards knowledge sharing behaviour.',
    risk: 'Rubber-stamp reviews to farm XP without genuine quality assessment. High review volumes with low feedback quality.',
  },
  GW_Quality: {
    title: 'Code Quality Acceptable?',
    desc: "Does the reviewed code meet the team's quality standards and Definition of Done? If issues are found, the author fixes them and re-submits for review.",
    color: 'text-orange-400', type: 'gateway', phase: 'Development',
    xpReward: null, gamification: null, achievement: null, behavioralEffect: null, risk: null,
  },
  T_FixIssues: {
    title: 'Fix Code Issues',
    desc: 'The developer addresses feedback from the code review — refactoring, fixing bugs, improving readability, adding missing tests, or correcting standards violations.',
    color: 'text-cyan-400', type: 'task', phase: 'Development',
    xpReward: '+40 XP',
    gamification: '+40 XP per review round resolved. Rapid-response bonus: +20 XP if feedback is fully addressed within 4 hours of review completion.',
    achievement: 'Quick Fix',
    behavioralEffect: 'Encourages developers to respond constructively and promptly to review feedback, maintaining flow and reducing PR stale time.',
    risk: 'Superficial fixes applied to close review comments quickly and earn XP without addressing the root-cause quality issues identified.',
  },

  // ── Testing ──────────────────────────────────────────────────────────────────
  T_Testing: {
    title: 'Unit & Integration Testing',
    desc: 'The team runs automated unit tests, integration tests, and manual exploratory testing. The goal is to verify the feature works correctly in isolation and together with other components.',
    color: 'text-pink-400', type: 'task', phase: 'Testing',
    xpReward: '+100 XP',
    gamification: '+100 XP for test coverage ≥80% on new code. Zero-defect achievement bonus unlocked when a feature ships with no bugs found in QA.',
    achievement: 'Zero Defect',
    behavioralEffect: 'Motivates comprehensive test coverage and proactive defect detection before features reach the sprint review.',
    risk: 'Writing tests only to hit coverage thresholds (e.g. trivial tests) rather than testing real behaviour and edge cases.',
  },
  GW_Tests: {
    title: 'Tests Pass?',
    desc: 'Do all automated and manual tests pass? Failing tests indicate defects that must be fixed before the work is considered done. The team never advances broken work to the sprint review.',
    color: 'text-orange-400', type: 'gateway', phase: 'Testing',
    xpReward: null, gamification: null, achievement: null, behavioralEffect: null, risk: null,
  },
  T_FixDefects: {
    title: 'Fix Defects',
    desc: 'Identified bugs and test failures are diagnosed and corrected. The developer re-runs tests after each fix to confirm the defect is resolved without introducing regressions.',
    color: 'text-pink-400', type: 'task', phase: 'Testing',
    xpReward: '+150 XP',
    gamification: '+150 XP per critical bug fixed. Bug Crusher achievement unlocked after fixing 10+ bugs in a single sprint.',
    achievement: 'Bug Crusher',
    behavioralEffect: 'Makes debugging a rewarding, celebrated activity rather than a punishing obligation, encouraging thorough defect resolution.',
    risk: 'Deliberately introducing or allowing bugs to accumulate in order to earn fix XP — gaming the reward system at the cost of product stability.',
  },
  GW_SprintDone: {
    title: 'All Sprint Tasks Done?',
    desc: 'Are all committed sprint backlog items complete and meeting the Definition of Done? If work remains, the team continues through another Daily Scrum cycle.',
    color: 'text-orange-400', type: 'gateway', phase: 'Testing',
    xpReward: null, gamification: null, achievement: null, behavioralEffect: null, risk: null,
  },

  // ── Sprint Review ────────────────────────────────────────────────────────────
  T_PrepDemo: {
    title: 'Prepare Sprint Demo',
    desc: 'The team prepares a demonstration of all completed work. They select realistic scenarios, prepare test data, and ensure the environment is stable so stakeholders can see the real product.',
    color: 'text-indigo-400', type: 'task', phase: 'Sprint Review',
    xpReward: '+80 XP',
    gamification: '+80 XP for demo preparation. +50 XP bonus if stakeholder satisfaction score ≥4/5 following the demo.',
    achievement: 'Demo Master',
    behavioralEffect: 'Encourages polished, realistic demonstrations that build stakeholder trust, rather than hastily prepared screenshots.',
    risk: 'Teams may invest time polishing the demo surface (UI cosmetics, staging data) rather than fixing real underlying product issues.',
  },
  T_SprintReview: {
    title: 'Sprint Review Meeting',
    desc: 'The Scrum team demonstrates the sprint increment to stakeholders. It is an informal, collaborative meeting — not a gate review. The team shows only completed, working software.',
    color: 'text-indigo-400', type: 'task', phase: 'Sprint Review',
    xpReward: '+200 XP',
    gamification: 'Sprint Review Bonus: +200 XP for full team attendance and stakeholder satisfaction ≥80%. Sprint Hero achievement for teams achieving this 3 sprints running.',
    achievement: 'Sprint Hero',
    behavioralEffect: 'Drives active engagement in the review process and motivates teams to deliver genuinely working, demonstrable software.',
    risk: 'Teams may inflate stakeholder satisfaction scores (coached feedback, selective demonstrations) to unlock XP bonuses.',
  },
  T_Feedback: {
    title: 'Gather Stakeholder Feedback',
    desc: 'Stakeholders provide feedback on the delivered increment. This input directly updates the product backlog — new items are added, priorities are adjusted, and the product roadmap is refined.',
    color: 'text-indigo-400', type: 'task', phase: 'Sprint Review',
    xpReward: '+100 XP',
    gamification: '+100 XP for capturing structured feedback that results in ≥2 new or updated backlog items, closing the feedback-to-action loop.',
    achievement: 'Feedback Architect',
    behavioralEffect: 'Encourages genuine stakeholder engagement rather than passive listening, turning feedback into actionable backlog items.',
    risk: 'Teams may solicit excessive, low-quality feedback to farm XP without the intent or capacity to act on the insights captured.',
  },
  GW_Accepted: {
    title: 'Increment Accepted?',
    desc: 'Does the delivered increment meet the acceptance criteria defined at sprint planning? If the Product Owner rejects items, the backlog is updated and work re-enters a future sprint.',
    color: 'text-orange-400', type: 'gateway', phase: 'Sprint Review',
    xpReward: null, gamification: null, achievement: null, behavioralEffect: null, risk: null,
  },
  T_UpdateBacklog: {
    title: 'Update Product Backlog',
    desc: 'Rejected or incomplete items are returned to the product backlog with updated acceptance criteria. Stakeholder feedback is captured as new backlog items. The backlog is re-prioritised.',
    color: 'text-indigo-400', type: 'task', phase: 'Sprint Review',
    xpReward: '+50 XP',
    gamification: '+50 XP for each backlog item updated with actionable stakeholder feedback integration, linking review insights to future sprint value.',
    achievement: 'Backlog Champion',
    behavioralEffect: 'Reinforces continuous backlog refinement as a valuable, rewarded activity that connects stakeholder input to product evolution.',
    risk: 'Artificial backlog updates created purely to trigger XP rewards, adding noise to the product backlog rather than genuine product direction.',
  },

  // ── Retrospective ────────────────────────────────────────────────────────────
  T_Retro: {
    title: 'Sprint Retrospective',
    desc: "The team reflects on the sprint process — not the product. They discuss what went well, what didn't, and what to try differently. The Scrum Master facilitates; all team members participate.",
    color: 'text-emerald-400', type: 'task', phase: 'Retrospective',
    xpReward: '+120 XP',
    gamification: '+120 XP for full team retro participation. Collaboration Achievement unlocked for teams that maintain constructive, action-oriented retrospectives over 3 sprints.',
    achievement: 'Retrospection Master',
    behavioralEffect: 'Encourages honest reflection and psychological safety. XP rewards full participation rather than individual heroics.',
    risk: 'Superficial retro participation to claim attendance XP. Honest critical feedback avoided to maintain team harmony and not risk social standing.',
  },
  T_Improve: {
    title: 'Identify Process Improvements',
    desc: 'Specific, actionable improvement items are identified and prioritised. The team selects the top one or two improvements to implement in the next sprint.',
    color: 'text-emerald-400', type: 'task', phase: 'Retrospective',
    xpReward: '+100 XP',
    gamification: '+100 XP when improvement actions identified in retro are implemented and verified in the following sprint — rewarding follow-through, not just identification.',
    achievement: 'Process Pioneer',
    behavioralEffect: 'Creates accountability for actually implementing retro outcomes, closing the inspect-and-adapt loop with measurable XP incentives.',
    risk: 'Easy or trivial improvements selected to guarantee XP rather than addressing the real process pain points that require difficult organisational change.',
  },
  T_UpdateProcess: {
    title: 'Update Team Processes',
    desc: "The agreed improvements are documented and built into the team's working agreements, Definition of Done, or tooling. This closes the inspect-and-adapt loop and drives continuous improvement.",
    color: 'text-emerald-400', type: 'task', phase: 'Retrospective',
    xpReward: '+80 XP',
    gamification: 'Continuous Improvement streak: +80 XP × consecutive sprint count for sustained, verified process improvement. Consistency King badge at 4 sprints.',
    achievement: 'Consistency King',
    behavioralEffect: 'Rewards teams that genuinely evolve their process over multiple sprints, building a culture of continuous improvement.',
    risk: 'Documentation updated to satisfy the XP requirement without any real behavioural or process change in how the team operates day-to-day.',
  },

  // ── Release ──────────────────────────────────────────────────────────────────
  GW_Release: {
    title: 'Release Ready?',
    desc: 'Is the current product increment stable, tested, and of sufficient value to release to end users? Release decisions consider stakeholder needs, technical readiness, and business timing.',
    color: 'text-orange-400', type: 'gateway', phase: 'Release',
    xpReward: null, gamification: null, achievement: null, behavioralEffect: null, risk: null,
  },
  T_Deploy: {
    title: 'Deploy to Production',
    desc: 'The increment is deployed through the release pipeline to the production environment. In mature teams this is automated via CI/CD. The deployment is preceded by smoke tests and a rollback plan.',
    color: 'text-amber-400', type: 'task', phase: 'Release',
    xpReward: '+300 XP',
    gamification: '+300 XP Deployment Champion bonus. Zero-rollback achievement for clean production deployments with no hotfixes required within 72 hours.',
    achievement: 'Deployment Champion',
    behavioralEffect: 'Makes production deployment a celebrated team milestone, building a culture of confident, frequent release rather than fear-driven big-bang launches.',
    risk: 'Rushing deployments to claim XP, skipping smoke tests or rollback preparation, increasing the risk of production incidents.',
  },
  T_Monitor: {
    title: 'Monitor & Validate Release',
    desc: 'After deployment, the team monitors application health, error rates, and user behaviour. Any production issues are triaged immediately. A successful release confirms the increment delivers value.',
    color: 'text-amber-400', type: 'task', phase: 'Release',
    xpReward: '+150 XP',
    gamification: '+150 XP for a 72-hour clean monitoring window post-release. Quality Shield badge earned for incident-free production periods.',
    achievement: 'Quality Shield',
    behavioralEffect: 'Promotes active post-deployment monitoring and rapid incident response as a standard engineering practice.',
    risk: 'Closing monitoring alerts or incident tickets prematurely to collect XP, masking real production issues.',
  },
  GW_MoreSprints: {
    title: 'Continue Development?',
    desc: 'Does the product backlog still contain items worth building? If yes, the team begins a new sprint cycle. If the product is complete or discontinued, the process ends.',
    color: 'text-orange-400', type: 'gateway', phase: 'Release',
    xpReward: null, gamification: null, achievement: null, behavioralEffect: null, risk: null,
  },

  // ── Boundary Events ─────────────────────────────────────────────────────────
  TB_SprintPlan: {
    title: 'Sprint Planning Time-box (4h)',
    desc: 'An interrupting timer boundary event on Sprint Planning. If the session exceeds 4 hours, this event fires, cancels ongoing discussion, and forces the process to backlog item selection — ensuring the team commits with whatever scope has been agreed.',
    color: 'text-orange-400', type: 'event', phase: 'Sprint Planning',
    xpReward: null, gamification: null, achievement: null, behavioralEffect: null, risk: null,
  },
  TB_SprintDeadline: {
    title: 'Sprint Deadline (2 weeks)',
    desc: 'An interrupting timer boundary event on Development Work. After 2 calendar weeks the sprint time-box expires: development is halted and the process jumps directly to Sprint Review, enforcing Scrum\'s fixed-length sprint cadence regardless of task completion status.',
    color: 'text-orange-400', type: 'event', phase: 'Development',
    xpReward: null, gamification: null, achievement: null, behavioralEffect: null, risk: null,
  },
  EB_Deploy: {
    title: 'Deployment Error',
    desc: 'An interrupting error boundary event on Deploy to Production. If the pipeline reports a critical failure — build error, failed smoke test, health-check timeout — this event catches it, cancels the deployment task, and triggers the Rollback Deployment path.',
    color: 'text-red-400', type: 'event', phase: 'Release',
    xpReward: null, gamification: null, achievement: null, behavioralEffect: null, risk: null,
  },
  T_Rollback: {
    title: 'Rollback Deployment',
    desc: 'Triggered by a deployment error, the team executes a controlled rollback to the last stable production version. After confirming stability, they perform an incident post-mortem, apply a fix, and re-enter the monitoring phase before scheduling a new release attempt.',
    color: 'text-amber-400', type: 'task', phase: 'Release',
    xpReward: '+200 XP',
    gamification: 'Rollback Resilience: +200 XP for a clean rollback completed within 30 minutes of incident detection. Rapid, practised recovery is rewarded as a first-class engineering skill.',
    achievement: 'Rollback Resilience',
    behavioralEffect: 'Normalises rollback as a planned, rehearsed procedure rather than a panic response — building confidence in frequent, small releases.',
    risk: 'Teams may allow or introduce deliberate deployment instability to repeatedly trigger rollback XP, undermining the production reliability culture the mechanic is meant to build.',
  },

  // ── Data Objects & Stores ────────────────────────────────────────────────────
  DS_ProductBacklog: {
    title: 'Product Backlog (Data Store)',
    desc: 'A persistent, ordered data store holding every known product requirement — user stories, bugs, and technical tasks. The Product Owner owns and prioritises it. It is continuously refined between sprints and is the single source of truth for what the team will build.',
    color: 'text-blue-400', type: 'data', phase: 'Backlog Preparation',
    xpReward: null, gamification: null, achievement: null, behavioralEffect: null, risk: null,
  },
  DO_SprintBacklog: {
    title: 'Sprint Backlog (Data Object)',
    desc: 'A data object created during Sprint Planning containing the selected stories decomposed into daily tasks. The Development Team owns it and updates it in real time. It is the live plan for achieving the Sprint Goal and becomes the primary transparency artefact during the sprint.',
    color: 'text-violet-400', type: 'data', phase: 'Sprint Planning',
    xpReward: null, gamification: null, achievement: null, behavioralEffect: null, risk: null,
  },
  DO_SprintGoal: {
    title: 'Sprint Goal (Data Object)',
    desc: 'A concise, single-sentence artefact produced during Sprint Planning that captures the sprint\'s primary objective. It gives the team focus and flexibility while providing stakeholders with a meaningful milestone to inspect at Sprint Review.',
    color: 'text-violet-400', type: 'data', phase: 'Sprint Planning',
    xpReward: null, gamification: null, achievement: null, behavioralEffect: null, risk: null,
  },
  DO_DoD: {
    title: 'Definition of Done (Data Object)',
    desc: 'A shared, team-agreed quality checklist that every increment must satisfy before it can be declared "Done" — covering coding standards, test coverage thresholds, peer review sign-off, and documentation. The DoD makes the Sprint Review meaningful by ensuring inspected work is truly complete.',
    color: 'text-pink-400', type: 'data', phase: 'Development',
    xpReward: null, gamification: null, achievement: null, behavioralEffect: null, risk: null,
  },
}

const groups = [
  { label: 'Backlog Preparation', color: 'text-blue-400',   ids: ['SE_Start','T_Vision','T_Stories','T_Estimate','T_Prioritize','GW_Backlog','T_AddStories','DS_ProductBacklog'] },
  { label: 'Sprint Planning',     color: 'text-violet-400', ids: ['T_SprintPlan','TB_SprintPlan','T_Goal','T_SelectItems','T_SprintBacklog','GW_Capacity','T_AdjustScope','DO_SprintGoal','DO_SprintBacklog'] },
  { label: 'Daily Scrum Loop',    color: 'text-yellow-400', ids: ['T_DailyScrum','GW_Impediment','T_RemImpediment'] },
  { label: 'Development',         color: 'text-cyan-400',   ids: ['T_Dev','TB_SprintDeadline','T_CodeReview','GW_Quality','T_FixIssues','DO_DoD'] },
  { label: 'Testing',             color: 'text-pink-400',   ids: ['T_Testing','GW_Tests','T_FixDefects','GW_SprintDone'] },
  { label: 'Sprint Review',       color: 'text-indigo-400', ids: ['T_PrepDemo','T_SprintReview','T_Feedback','GW_Accepted','T_UpdateBacklog'] },
  { label: 'Retrospective',       color: 'text-emerald-400',ids: ['T_Retro','T_Improve','T_UpdateProcess'] },
  { label: 'Release',             color: 'text-amber-400',  ids: ['GW_Release','T_Deploy','EB_Deploy','T_Rollback','T_Monitor','GW_MoreSprints','EE_Released'] },
]

function NodeTypeIcon({ type, color, size = 14 }) {
  if (type === 'gateway') return <GitBranch size={size} className={color} />
  if (type === 'event')   return <Circle    size={size} className={color} />
  if (type === 'data')    return <Database  size={size} className={color} />
  return <Play size={size} className={color} />
}

function NodeOverlay({ node, onClose }) {
  return (
    <div className="absolute bottom-4 left-4 right-4 lg:right-auto lg:w-[420px] z-10 bg-slate-900/97 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-4 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
            <NodeTypeIcon type={node.type} color={node.color} size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white leading-tight">{node.title}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className={`text-xs capitalize ${node.color}`}>{node.type}</span>
              {node.phase && <span className="text-xs text-slate-500">· {node.phase}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {node.xpReward && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-900/60 border border-violet-700/50 text-violet-300 font-mono whitespace-nowrap">
              {node.xpReward}
            </span>
          )}
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-800">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Scrum Purpose */}
      <div className="px-4 py-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Scrum Purpose</p>
        <p className="text-xs text-slate-300 leading-relaxed">{node.desc}</p>
      </div>

      {/* Gamification Mechanics */}
      {node.gamification && (
        <div className="px-4 py-3 border-t border-slate-700/40 bg-violet-950/20">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap size={12} className="text-violet-400" />
            <p className="text-xs font-semibold text-violet-300 uppercase tracking-wide">Gamification Mechanic</p>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-2.5">{node.gamification}</p>
          <div className="flex items-center gap-3 flex-wrap">
            {node.achievement && (
              <span className="text-xs px-2 py-1 rounded-lg bg-yellow-900/30 border border-yellow-800/40 text-yellow-400 flex items-center gap-1">
                <span>🏅</span> {node.achievement}
              </span>
            )}
            {node.behavioralEffect && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <TrendingUp size={11} className="flex-shrink-0" />
                {node.behavioralEffect}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Risk Warning */}
      {node.risk && (
        <div className="px-4 py-3 border-t border-slate-700/40 bg-red-950/10">
          <div className="flex items-center gap-1.5 mb-1.5">
            <AlertTriangle size={12} className="text-red-400" />
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wide">Gamification Risk</p>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{node.risk}</p>
        </div>
      )}
    </div>
  )
}

export default function BpmnViewer() {
  const containerRef    = useRef(null)
  const canvasWrapRef   = useRef(null)
  const modelerRef      = useRef(null)
  const prevHighlighted = useRef(null)
  const sidebarItemRefs = useRef({})

  const [selectedNode,  setSelectedNode]  = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [isFullscreen,  setIsFullscreen]  = useState(false)

  useEffect(() => {
    if (!containerRef.current) return
    let destroyed = false

    const viewer = new BpmnNavigatedViewer({
      container: containerRef.current,
      keyboard: { bindTo: document },
    })
    modelerRef.current = viewer

    viewer.importXML(SCRUM_BPMN).then(() => {
      if (destroyed) return
      const canvas = viewer.get('canvas')
      reorderSvgLayers()
      setLoading(false)

      viewer.get('eventBus').on('element.click', ({ element }) => {
        if (!NODE_INFO[element.id]) return
        setSelectedNode({ id: element.id, ...NODE_INFO[element.id] })
        if (prevHighlighted.current) {
          try { canvas.removeMarker(prevHighlighted.current, 'selected-highlight') } catch (_) {}
        }
        canvas.addMarker(element.id, 'selected-highlight')
        prevHighlighted.current = element.id
      })

      // Double RAF — ensures browser has computed flex layout dimensions before fitting
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (destroyed) return
        canvas.zoom('fit-viewport', 'auto')
        // For this wide diagram, fit-viewport can be extremely zoomed out.
        // If zoom < 0.25, show the start of the process at a more readable level.
        if (canvas.zoom() < 0.25) {
          canvas.zoom(0.28, { x: 1500, y: 460 })
        }
      }))
    }).catch(err => {
      if (destroyed) return
      setError(err.message)
      setLoading(false)
    })

    return () => {
      destroyed = true
      modelerRef.current = null
      viewer.destroy()
    }
  }, [])

  useEffect(() => {
    if (selectedNode?.id) {
      sidebarItemRefs.current[selectedNode.id]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selectedNode?.id])

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement)
      setTimeout(() => modelerRef.current?.get('canvas')?.zoom('fit-viewport', 'auto'), 200)
    }
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const reorderSvgLayers = () => {
    const svgEl = containerRef.current?.querySelector('svg')
    if (!svgEl) return
    const diagramContainer = svgEl.querySelector('.djs-container')
    const baseGroup = diagramContainer
      ? (Array.from(diagramContainer.children).find(c => c.tagName === 'g') ?? diagramContainer)
      : svgEl.querySelector('g')
    if (!baseGroup) return
    const children = Array.from(baseGroup.children)
    const connLayer  = children.find(c => c.classList.contains('djs-layer-connections'))
    const shapeLayer = children.find(c => c.classList.contains('djs-layer-shapes'))
    if (connLayer && shapeLayer) {
      baseGroup.insertBefore(connLayer, shapeLayer)
    } else {
      children.filter(c => c.classList.contains('djs-shape')).forEach(s => baseGroup.appendChild(s))
    }
  }

  const zoom    = dir => { const c = modelerRef.current?.get('canvas'); if (c) c.zoom(dir === 'in' ? c.zoom() * 1.25 : c.zoom() / 1.25) }
  const fitView = () => modelerRef.current?.get('canvas')?.zoom('fit-viewport', 'auto')
  const reset   = () => modelerRef.current?.importXML(SCRUM_BPMN).then(() => {
    reorderSvgLayers()
    requestAnimationFrame(() => requestAnimationFrame(() => fitView()))
  })
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) canvasWrapRef.current?.requestFullscreen?.()
    else document.exitFullscreen?.()
  }

  const selectNode = id => {
    const info = NODE_INFO[id]
    if (!info) return
    setSelectedNode({ id, ...info })
    const viewer = modelerRef.current
    if (!viewer || loading) return
    const canvas          = viewer.get('canvas')
    const elementRegistry = viewer.get('elementRegistry')
    if (prevHighlighted.current) {
      try { canvas.removeMarker(prevHighlighted.current, 'selected-highlight') } catch (_) {}
    }
    const element = elementRegistry.get(id)
    if (!element) return
    canvas.addMarker(id, 'selected-highlight')
    prevHighlighted.current = id
    const cx = element.x + (element.width  || 0) / 2
    const cy = element.y + (element.height || 0) / 2
    canvas.zoom(canvas.zoom(), { x: cx, y: cy })
  }

  const controls = [
    { icon: ZoomIn,                              action: () => zoom('in'),  title: 'Zoom In'    },
    { icon: ZoomOut,                             action: () => zoom('out'), title: 'Zoom Out'   },
    { icon: Maximize2,                           action: fitView,           title: 'Fit View'   },
    { icon: RefreshCw,                           action: reset,             title: 'Reset'      },
    { icon: isFullscreen ? Minimize : Maximize,  action: toggleFullscreen,  title: isFullscreen ? 'Exit Fullscreen' : 'Fullscreen' },
  ]

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        title="BPMN Process Viewer"
        subtitle="Gamified Scrum framework — 3 timer/error boundary events · 4 data objects · 8 gateways · XP system"
      />

      <main className="flex-1 p-4 lg:p-6 flex flex-col gap-3 overflow-hidden min-h-0">
        {/* Info banner */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-950/30 border border-violet-800/30 text-xs text-violet-300 flex-shrink-0">
          <Info size={13} className="flex-shrink-0 text-violet-400" />
          <p className="truncate">
            Click any element in the diagram or the list to explore its <span className="text-white font-medium">Scrum purpose</span>,{' '}
            <span className="text-violet-300 font-medium">gamification mechanic</span>, and{' '}
            <span className="text-red-300 font-medium">associated risk</span>.
          </p>
        </div>

        {/* Diagram + sidebar */}
        <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">

          {/* Canvas */}
          <div
            ref={canvasWrapRef}
            className="flex-1 relative bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden min-h-[400px] lg:min-h-0"
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10 rounded-2xl">
                <div className="flex items-center gap-3 text-slate-300">
                  <RefreshCw size={18} className="animate-spin" />
                  <span className="text-sm">Loading diagram…</span>
                </div>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center z-10 p-6">
                <p className="text-red-400 text-sm text-center">Failed to load: {error}</p>
              </div>
            )}

            <div ref={containerRef} className="bpmn-container absolute inset-0 w-full h-full" />

            {/* Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              {controls.map(({ icon: Icon, action, title }) => (
                <button key={title} onClick={action} title={title}
                  className="w-9 h-9 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-300 hover:text-white hover:border-violet-500/60 hover:bg-slate-700 transition-all flex items-center justify-center shadow-lg">
                  <Icon size={16} />
                </button>
              ))}
            </div>

            {/* Node detail overlay */}
            {selectedNode && (
              <NodeOverlay node={selectedNode} onClose={() => setSelectedNode(null)} />
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-2 overflow-y-auto lg:max-h-full">
            {groups.map(group => (
              <div key={group.label} className="bg-slate-800/40 border border-slate-700/40 rounded-xl overflow-hidden flex-shrink-0">
                <p className={`text-xs font-semibold uppercase tracking-wider px-3 py-2 bg-slate-800/60 border-b border-slate-700/40 ${group.color}`}>
                  {group.label}
                </p>
                <div className="p-1">
                  {group.ids.map(id => {
                    const info = NODE_INFO[id]
                    if (!info) return null
                    const active = selectedNode?.id === id
                    return (
                      <button
                        key={id}
                        ref={el => { if (el) sidebarItemRefs.current[id] = el }}
                        onClick={() => selectNode(id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          active
                            ? 'bg-violet-900/40 text-violet-300 border border-violet-700/40'
                            : 'text-slate-400 hover:bg-slate-700/40 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-medium ${info.color} truncate`}>{info.title}</span>
                          {info.xpReward && (
                            <span className="text-xs text-violet-500 font-mono flex-shrink-0 opacity-70">{info.xpReward}</span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
