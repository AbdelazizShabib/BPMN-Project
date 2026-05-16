import { useEffect, useRef, useState } from 'react'
import BpmnNavigatedViewer from 'bpmn-js/lib/NavigatedViewer'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-js.css'
import { SCRUM_BPMN } from '../data/scrumBpmn'
import Header from '../components/layout/Header'
import { ZoomIn, ZoomOut, Maximize2, Info, Play, RefreshCw } from 'lucide-react'

const NODE_INFO = {
  // Events
  SE_Start:       { title: 'Product Backlog Exists',       desc: 'The process begins when an initial product backlog exists. The Product Owner has captured at least a first set of user stories that define the product vision.',                                                    color: 'text-green-400',  type: 'event'   },
  EE_Released:    { title: 'Product Released',             desc: 'The product has been successfully shipped to end users. All agreed sprint cycles are complete and the team has chosen not to continue development.',                                                              color: 'text-red-400',    type: 'event'   },
  // Backlog
  T_Vision:       { title: 'Maintain Product Vision',      desc: 'The Product Owner maintains and communicates the overall product vision and long-term roadmap. This anchors every sprint to the bigger picture and ensures stakeholder alignment.',                                color: 'text-blue-400',   type: 'task'    },
  T_Stories:      { title: 'Write & Refine User Stories',  desc: 'User stories are written in "As a … I want … so that …" format. Acceptance criteria are defined. Existing stories are refined based on new knowledge, stakeholder feedback, or changing requirements.',          color: 'text-blue-400',   type: 'task'    },
  T_Estimate:     { title: 'Estimate Story Points',        desc: 'The development team collaboratively estimates the relative effort of each backlog item using story points (e.g. Fibonacci scale). Techniques like Planning Poker ensure shared understanding.',                  color: 'text-blue-400',   type: 'task'    },
  T_Prioritize:   { title: 'Prioritize Product Backlog',   desc: 'The Product Owner orders backlog items by business value, risk, and dependencies. Higher-priority items are better refined and estimated. The team re-prioritizes after every sprint.',                           color: 'text-blue-400',   type: 'task'    },
  GW_Backlog:     { title: 'Backlog Ready?',               desc: 'Decision: is the top of the backlog sufficiently refined and estimated for sprint planning to begin? If not, the team writes additional user stories before proceeding.',                                         color: 'text-orange-400', type: 'gateway' },
  T_AddStories:   { title: 'Add More User Stories',        desc: 'When the backlog lacks enough refined items, the team runs an additional grooming session. Stories are decomposed, clarified, and estimated until the backlog is sprint-ready.',                                  color: 'text-blue-400',   type: 'task'    },
  // Sprint Planning
  T_SprintPlan:   { title: 'Sprint Planning Meeting',      desc: 'The whole Scrum team meets to plan the upcoming sprint. The Product Owner presents the top backlog items; the team asks clarifying questions and collectively agrees on what can be delivered.',                  color: 'text-violet-400', type: 'task'    },
  T_Goal:         { title: 'Define Sprint Goal',           desc: 'A single, concise statement that captures the purpose of the sprint. The sprint goal gives the team focus and allows flexibility in how the goal is achieved.',                                                   color: 'text-violet-400', type: 'task'    },
  T_SelectItems:  { title: 'Select Backlog Items',         desc: 'The team selects the product backlog items they commit to delivering this sprint, based on priority and team capacity (velocity). Selected items form the sprint backlog.',                                       color: 'text-violet-400', type: 'task'    },
  T_SprintBacklog:{ title: 'Create Sprint Backlog',        desc: 'Selected stories are broken down into specific development tasks. Each task is small enough to be completed in a day. The sprint backlog is the team\'s plan for delivering the sprint goal.',                  color: 'text-violet-400', type: 'task'    },
  GW_Capacity:    { title: 'Team Capacity Met?',           desc: 'Does the selected scope fit within the team\'s available capacity for this sprint? If overloaded, items are removed from the sprint backlog until the workload is realistic.',                                   color: 'text-orange-400', type: 'gateway' },
  T_AdjustScope:  { title: 'Adjust Sprint Scope',         desc: 'Items are removed from or added to the sprint backlog to match the team\'s capacity. The Product Owner decides which items to defer. Scope adjustment avoids overcommitment.',                                   color: 'text-violet-400', type: 'task'    },
  // Daily loop
  T_DailyScrum:   { title: 'Daily Scrum Standup',         desc: 'A 15-minute time-boxed event held every working day. Each team member answers: What did I do yesterday? What will I do today? Are there any impediments? The Scrum Master facilitates and removes blockers.',   color: 'text-yellow-400', type: 'task'    },
  GW_Impediment:  { title: 'Impediment Exists?',          desc: 'Is there a blocker preventing the team from making progress? Impediments can be technical, process-related, or external. The Scrum Master is responsible for resolving impediments quickly.',                    color: 'text-orange-400', type: 'gateway' },
  T_RemImpediment:{ title: 'Remove Impediment',           desc: 'The Scrum Master works to eliminate the identified blocker. This may involve escalating to management, coordinating with other teams, or reorganising the team\'s approach.',                                    color: 'text-red-400',    type: 'task'    },
  // Development
  T_Dev:          { title: 'Development Work',            desc: 'Developers design, build, and integrate features. The team self-organises around tasks. Work should meet the Definition of Done including coding standards, unit tests, and documentation.',                     color: 'text-cyan-400',   type: 'task'    },
  T_CodeReview:   { title: 'Peer Code Review',            desc: 'A team member reviews the code authored by a peer. Code review ensures quality, knowledge sharing, adherence to standards, and early detection of bugs before testing.',                                         color: 'text-cyan-400',   type: 'task'    },
  GW_Quality:     { title: 'Code Quality Acceptable?',   desc: 'Does the reviewed code meet the team\'s quality standards and Definition of Done? If issues are found, the author fixes them and re-submits for review.',                                                         color: 'text-orange-400', type: 'gateway' },
  T_FixIssues:    { title: 'Fix Code Issues',            desc: 'The developer addresses feedback from the code review — refactoring, fixing bugs, improving readability, adding missing tests, or correcting standards violations.',                                              color: 'text-cyan-400',   type: 'task'    },
  // Testing
  T_Testing:      { title: 'Unit & Integration Testing',  desc: 'The team runs automated unit tests, integration tests, and manual exploratory testing. The goal is to verify the feature works correctly in isolation and together with other components.',                      color: 'text-pink-400',   type: 'task'    },
  GW_Tests:       { title: 'Tests Pass?',                 desc: 'Do all automated and manual tests pass? Failing tests indicate defects that must be fixed before the work is considered done. The team never advances broken work to the sprint review.',                        color: 'text-orange-400', type: 'gateway' },
  T_FixDefects:   { title: 'Fix Defects',                 desc: 'Identified bugs and test failures are diagnosed and corrected. The developer re-runs tests after each fix to confirm the defect is resolved without introducing regressions.',                                    color: 'text-pink-400',   type: 'task'    },
  GW_SprintDone:  { title: 'All Sprint Tasks Done?',      desc: 'Are all committed sprint backlog items complete and meeting the Definition of Done? If work remains, the team continues through another Daily Scrum cycle.',                                                     color: 'text-orange-400', type: 'gateway' },
  // Review
  T_PrepDemo:     { title: 'Prepare Sprint Demo',         desc: 'The team prepares a demonstration of all completed work. They select realistic scenarios, prepare test data, and ensure the environment is stable so stakeholders can see the real product.',                   color: 'text-indigo-400', type: 'task'    },
  T_SprintReview: { title: 'Sprint Review Meeting',       desc: 'The Scrum team demonstrates the sprint increment to stakeholders. It is an informal, collaborative meeting — not a gate review. The team shows only completed, working software.',                              color: 'text-indigo-400', type: 'task'    },
  T_Feedback:     { title: 'Gather Stakeholder Feedback', desc: 'Stakeholders provide feedback on the delivered increment. This input directly updates the product backlog — new items are added, priorities are adjusted, and the product roadmap is refined.',                  color: 'text-indigo-400', type: 'task'    },
  GW_Accepted:    { title: 'Increment Accepted?',         desc: 'Does the delivered increment meet the acceptance criteria defined at sprint planning? If the Product Owner rejects items, the backlog is updated and the work re-enters a future sprint.',                        color: 'text-orange-400', type: 'gateway' },
  T_UpdateBacklog:{ title: 'Update Product Backlog',      desc: 'Rejected or incomplete items are returned to the product backlog with updated acceptance criteria. Stakeholder feedback is captured as new backlog items. The backlog is re-prioritised.',                       color: 'text-indigo-400', type: 'task'    },
  // Retrospective
  T_Retro:        { title: 'Sprint Retrospective',        desc: 'The team reflects on the sprint process — not the product. They discuss what went well, what didn\'t, and what to try differently. The Scrum Master facilitates; all team members participate.',               color: 'text-emerald-400',type: 'task'    },
  T_Improve:      { title: 'Identify Process Improvements',desc: 'Specific, actionable improvement items are identified and prioritised. The team selects the top one or two improvements to implement in the next sprint.',                                                      color: 'text-emerald-400',type: 'task'    },
  T_UpdateProcess:{ title: 'Update Team Processes',       desc: 'The agreed improvements are documented and built into the team\'s working agreements, Definition of Done, or tooling. This closes the inspect-and-adapt loop and drives continuous improvement.',               color: 'text-emerald-400',type: 'task'    },
  // Release
  GW_Release:     { title: 'Release Ready?',              desc: 'Is the current product increment stable, tested, and of sufficient value to release to end users? Release decisions consider stakeholder needs, technical readiness, and business timing.',                     color: 'text-orange-400', type: 'gateway' },
  T_Deploy:       { title: 'Deploy to Production',        desc: 'The increment is deployed through the release pipeline to the production environment. In mature teams this is automated via CI/CD. The deployment is preceded by smoke tests and a rollback plan.',             color: 'text-amber-400',  type: 'task'    },
  T_Monitor:      { title: 'Monitor & Validate Release',  desc: 'After deployment, the team monitors application health, error rates, and user behaviour. Any production issues are triaged immediately. A successful release confirms the increment delivers value.',           color: 'text-amber-400',  type: 'task'    },
  GW_MoreSprints: { title: 'Continue Development?',       desc: 'Does the product backlog still contain items worth building? If yes, the team begins a new sprint cycle. If the product is complete or discontinued, the process ends.',                                        color: 'text-orange-400', type: 'gateway' },
}

const TYPE_COLORS = {
  event:   'text-green-400',
  gateway: 'text-orange-400',
  task:    'text-slate-300',
}

export default function BpmnViewer() {
  const containerRef = useRef(null)
  const modelerRef   = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

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
      canvas.zoom('fit-viewport', 'auto')
      setLoading(false)

      viewer.get('eventBus').on('element.click', ({ element }) => {
        if (NODE_INFO[element.id]) {
          setSelectedNode({ id: element.id, ...NODE_INFO[element.id] })
        }
      })
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

  const zoom = (dir) => {
    const canvas = modelerRef.current?.get('canvas')
    if (!canvas) return
    canvas.zoom(dir === 'in' ? canvas.zoom() * 1.25 : canvas.zoom() / 1.25)
  }
  const fitView = () => modelerRef.current?.get('canvas')?.zoom('fit-viewport', 'auto')
  const reset   = () => modelerRef.current?.importXML(SCRUM_BPMN).then(fitView)

  const groups = [
    { label: 'Backlog Preparation', ids: ['SE_Start','T_Vision','T_Stories','T_Estimate','T_Prioritize','GW_Backlog','T_AddStories'] },
    { label: 'Sprint Planning',     ids: ['T_SprintPlan','T_Goal','T_SelectItems','T_SprintBacklog','GW_Capacity','T_AdjustScope'] },
    { label: 'Daily Scrum Loop',    ids: ['T_DailyScrum','GW_Impediment','T_RemImpediment'] },
    { label: 'Development',         ids: ['T_Dev','T_CodeReview','GW_Quality','T_FixIssues'] },
    { label: 'Testing',             ids: ['T_Testing','GW_Tests','T_FixDefects','GW_SprintDone'] },
    { label: 'Sprint Review',       ids: ['T_PrepDemo','T_SprintReview','T_Feedback','GW_Accepted','T_UpdateBacklog'] },
    { label: 'Retrospective',       ids: ['T_Retro','T_Improve','T_UpdateProcess'] },
    { label: 'Release',             ids: ['GW_Release','T_Deploy','T_Monitor','GW_MoreSprints','EE_Released'] },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="BPMN Process Viewer" subtitle="Full Scrum framework — 35 nodes, 8 decision gateways, multiple feedback loops" />

      <main className="flex-1 p-6 flex flex-col gap-4">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-950/30 border border-blue-800/30 text-xs text-blue-300">
          <Info size={14} className="flex-shrink-0 mt-0.5" />
          <p>Click any element to see details. Scroll to zoom, drag to pan. Use the sidebar list to jump to a step.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 flex-1">
          {/* Canvas */}
          <div className="flex-1 relative bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden" style={{ minHeight: 560 }}>
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
            <div ref={containerRef} className="bpmn-container w-full h-full" style={{ minHeight: 560 }} />

            {/* Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              {[
                { icon: ZoomIn,    action: () => zoom('in'),  title: 'Zoom In'  },
                { icon: ZoomOut,   action: () => zoom('out'), title: 'Zoom Out' },
                { icon: Maximize2, action: fitView,           title: 'Fit View' },
                { icon: RefreshCw, action: reset,             title: 'Reset'    },
              ].map(({ icon: Icon, action, title }) => (
                <button key={title} onClick={action} title={title}
                  className="w-9 h-9 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-300 hover:text-white hover:border-violet-500/60 hover:bg-slate-700 transition-all flex items-center justify-center shadow-lg">
                  <Icon size={16} />
                </button>
              ))}
            </div>

            {/* Selected node tooltip overlay */}
            {selectedNode && (
              <div className="absolute bottom-4 left-4 right-16 z-10 bg-slate-900/95 border border-slate-700 rounded-xl p-4 shadow-xl backdrop-blur max-w-lg">
                <div className="flex items-start gap-3">
                  <Play size={14} className={`${selectedNode.color} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className="text-sm font-bold text-white">{selectedNode.title}</p>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedNode.desc}</p>
                  </div>
                  <button onClick={() => setSelectedNode(null)} className="text-slate-500 hover:text-slate-300 flex-shrink-0 text-xs ml-auto">✕</button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: grouped process steps */}
          <div className="w-full lg:w-64 flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: 600 }}>
            {groups.map(group => (
              <div key={group.label} className="bg-slate-800/40 border border-slate-700/40 rounded-xl overflow-hidden">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2 bg-slate-800/60 border-b border-slate-700/40">
                  {group.label}
                </p>
                <div className="p-1">
                  {group.ids.map(id => {
                    const info = NODE_INFO[id]
                    if (!info) return null
                    return (
                      <button key={id} onClick={() => setSelectedNode({ id, ...info })}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          selectedNode?.id === id
                            ? 'bg-violet-900/40 text-violet-300 border border-violet-700/40'
                            : 'text-slate-400 hover:bg-slate-700/40 hover:text-slate-200'
                        }`}>
                        <span className={`font-medium ${info.color}`}>{info.title}</span>
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
