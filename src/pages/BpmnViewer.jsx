import { useEffect, useRef, useState } from 'react'
import BpmnNavigatedViewer from 'bpmn-js/lib/NavigatedViewer'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-js.css'
import Header from '../components/layout/Header'
import { ZoomIn, ZoomOut, Maximize2, Info, Play, RefreshCw } from 'lucide-react'

const SCRUM_BPMN = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
             xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
             xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
             targetNamespace="http://scrum-bpmn.example">

  <process id="ScrumProcess" name="Scrum Sprint Process" isExecutable="true">

    <startEvent id="StartEvent_1" name="Sprint Planning">
      <outgoing>Flow_1</outgoing>
    </startEvent>

    <task id="Task_Backlog" name="Refine Product Backlog">
      <incoming>Flow_1</incoming>
      <outgoing>Flow_2</outgoing>
    </task>

    <task id="Task_SprintPlan" name="Sprint Planning Meeting">
      <incoming>Flow_2</incoming>
      <outgoing>Flow_3</outgoing>
    </task>

    <task id="Task_DailyScrum" name="Daily Scrum">
      <incoming>Flow_3</incoming>
      <incoming>Flow_Loop</incoming>
      <outgoing>Flow_4</outgoing>
    </task>

    <task id="Task_Development" name="Development &amp; Implementation">
      <incoming>Flow_4</incoming>
      <outgoing>Flow_5</outgoing>
    </task>

    <task id="Task_Review" name="Sprint Review &amp; Demo">
      <incoming>Flow_5</incoming>
      <incoming>Flow_FromGateway2</incoming>
      <outgoing>Flow_6</outgoing>
    </task>

    <exclusiveGateway id="Gateway_1" name="Sprint Complete?">
      <incoming>Flow_6</incoming>
      <outgoing>Flow_Loop</outgoing>
      <outgoing>Flow_7</outgoing>
    </exclusiveGateway>

    <task id="Task_Retro" name="Sprint Retrospective">
      <incoming>Flow_7</incoming>
      <outgoing>Flow_8</outgoing>
    </task>

    <exclusiveGateway id="Gateway_2" name="More Sprints?">
      <incoming>Flow_8</incoming>
      <outgoing>Flow_FromGateway2</outgoing>
      <outgoing>Flow_9</outgoing>
    </exclusiveGateway>

    <endEvent id="EndEvent_1" name="Project Complete">
      <incoming>Flow_9</incoming>
    </endEvent>

    <sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_Backlog"/>
    <sequenceFlow id="Flow_2" sourceRef="Task_Backlog" targetRef="Task_SprintPlan"/>
    <sequenceFlow id="Flow_3" sourceRef="Task_SprintPlan" targetRef="Task_DailyScrum"/>
    <sequenceFlow id="Flow_4" sourceRef="Task_DailyScrum" targetRef="Task_Development"/>
    <sequenceFlow id="Flow_5" sourceRef="Task_Development" targetRef="Task_Review"/>
    <sequenceFlow id="Flow_6" sourceRef="Task_Review" targetRef="Gateway_1"/>
    <sequenceFlow id="Flow_Loop" name="Continue Sprint" sourceRef="Gateway_1" targetRef="Task_DailyScrum"/>
    <sequenceFlow id="Flow_7" name="Sprint Done" sourceRef="Gateway_1" targetRef="Task_Retro"/>
    <sequenceFlow id="Flow_8" sourceRef="Task_Retro" targetRef="Gateway_2"/>
    <sequenceFlow id="Flow_FromGateway2" name="New Sprint" sourceRef="Gateway_2" targetRef="Task_Review"/>
    <sequenceFlow id="Flow_9" name="Release" sourceRef="Gateway_2" targetRef="EndEvent_1"/>
  </process>

  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="ScrumProcess">

      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="252" width="36" height="36"/>
        <bpmndi:BPMNLabel><dc:Bounds x="135" y="295" width="72" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Task_Backlog_di" bpmnElement="Task_Backlog">
        <dc:Bounds x="240" y="230" width="120" height="80"/>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Task_SprintPlan_di" bpmnElement="Task_SprintPlan">
        <dc:Bounds x="420" y="230" width="120" height="80"/>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Task_DailyScrum_di" bpmnElement="Task_DailyScrum">
        <dc:Bounds x="600" y="230" width="120" height="80"/>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Task_Development_di" bpmnElement="Task_Development">
        <dc:Bounds x="600" y="370" width="120" height="80"/>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Task_Review_di" bpmnElement="Task_Review">
        <dc:Bounds x="780" y="370" width="120" height="80"/>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Gateway_1_di" bpmnElement="Gateway_1" isMarkerVisible="true">
        <dc:Bounds x="965" y="385" width="50" height="50"/>
        <bpmndi:BPMNLabel><dc:Bounds x="948" y="442" width="84" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Task_Retro_di" bpmnElement="Task_Retro">
        <dc:Bounds x="1070" y="370" width="120" height="80"/>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Gateway_2_di" bpmnElement="Gateway_2" isMarkerVisible="true">
        <dc:Bounds x="1245" y="385" width="50" height="50"/>
        <bpmndi:BPMNLabel><dc:Bounds x="1232" y="442" width="76" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="1362" y="392" width="36" height="36"/>
        <bpmndi:BPMNLabel><dc:Bounds x="1340" y="435" width="80" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="188" y="270"/><di:waypoint x="240" y="270"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="360" y="270"/><di:waypoint x="420" y="270"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3">
        <di:waypoint x="540" y="270"/><di:waypoint x="600" y="270"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_4_di" bpmnElement="Flow_4">
        <di:waypoint x="660" y="310"/><di:waypoint x="660" y="370"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_5_di" bpmnElement="Flow_5">
        <di:waypoint x="720" y="410"/><di:waypoint x="780" y="410"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_6_di" bpmnElement="Flow_6">
        <di:waypoint x="900" y="410"/><di:waypoint x="965" y="410"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Loop_di" bpmnElement="Flow_Loop">
        <di:waypoint x="990" y="385"/><di:waypoint x="990" y="270"/><di:waypoint x="720" y="270"/>
        <bpmndi:BPMNLabel><dc:Bounds x="840" y="252" width="80" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_7_di" bpmnElement="Flow_7">
        <di:waypoint x="1015" y="410"/><di:waypoint x="1070" y="410"/>
        <bpmndi:BPMNLabel><dc:Bounds x="1020" y="392" width="52" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_8_di" bpmnElement="Flow_8">
        <di:waypoint x="1190" y="410"/><di:waypoint x="1245" y="410"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_FromGateway2_di" bpmnElement="Flow_FromGateway2">
        <di:waypoint x="1270" y="385"/><di:waypoint x="1270" y="150"/><di:waypoint x="840" y="150"/><di:waypoint x="840" y="370"/>
        <bpmndi:BPMNLabel><dc:Bounds x="1040" y="132" width="60" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_9_di" bpmnElement="Flow_9">
        <di:waypoint x="1295" y="410"/><di:waypoint x="1362" y="410"/>
        <bpmndi:BPMNLabel><dc:Bounds x="1312" y="392" width="36" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`

const NODE_INFO = {
  StartEvent_1: { title: 'Sprint Planning Start', desc: 'Kickoff of the Scrum sprint cycle. Product Owner and Scrum Master align on sprint goals.', color: 'text-green-400' },
  Task_Backlog: { title: 'Backlog Refinement', desc: 'Team reviews and estimates user stories. Items are groomed, prioritized, and ready for sprint selection.', color: 'text-blue-400' },
  Task_SprintPlan: { title: 'Sprint Planning Meeting', desc: 'Team selects backlog items and commits to sprint goal. Tasks are broken down and assigned.', color: 'text-blue-400' },
  Task_DailyScrum: { title: 'Daily Scrum', desc: '15-minute standup. Each team member shares: what they did, what they will do, and any blockers.', color: 'text-yellow-400' },
  Task_Development: { title: 'Development & Implementation', desc: 'Core development work. Coding, reviews, testing, and integration happen in this phase.', color: 'text-violet-400' },
  Task_Review: { title: 'Sprint Review & Demo', desc: 'Team demonstrates completed work to stakeholders. Feedback is gathered and backlog is updated.', color: 'text-blue-400' },
  Gateway_1: { title: 'Sprint Complete?', desc: 'Decision point: if sprint tasks remain, loop back to Daily Scrum. Otherwise proceed to retrospective.', color: 'text-orange-400' },
  Task_Retro: { title: 'Sprint Retrospective', desc: 'Team reflects on the sprint process. Identifies what went well, what to improve, and action items.', color: 'text-blue-400' },
  Gateway_2: { title: 'More Sprints?', desc: 'If product backlog items remain, start a new sprint. Otherwise, release the product.', color: 'text-orange-400' },
  EndEvent_1: { title: 'Project Complete', desc: 'The product is released to end users. All sprint cycles are complete and the project goal is achieved.', color: 'text-red-400' },
}

export default function BpmnViewer() {
  const containerRef = useRef(null)
  const modelerRef = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!containerRef.current) return

    let destroyed = false

    const modeler = new BpmnNavigatedViewer({
      container: containerRef.current,
      keyboard: { bindTo: document },
    })
    modelerRef.current = modeler

    modeler.importXML(SCRUM_BPMN).then(() => {
      if (destroyed) return
      const canvas = modeler.get('canvas')
      canvas.zoom('fit-viewport', 'auto')
      setLoading(false)

      const eventBus = modeler.get('eventBus')
      eventBus.on('element.click', (e) => {
        const { element } = e
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
      modeler.destroy()
    }
  }, [])

  const zoom = (dir) => {
    const canvas = modelerRef.current?.get('canvas')
    if (!canvas) return
    const current = canvas.zoom()
    canvas.zoom(dir === 'in' ? current * 1.2 : current / 1.2)
  }

  const fitView = () => {
    modelerRef.current?.get('canvas')?.zoom('fit-viewport', 'auto')
  }

  const reset = () => {
    modelerRef.current?.importXML(SCRUM_BPMN).then(() => {
      modelerRef.current?.get('canvas')?.zoom('fit-viewport', 'auto')
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="BPMN Process Viewer" subtitle="Interactive Scrum workflow visualization" />

      <main className="flex-1 p-6 flex flex-col gap-4">
        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-950/30 border border-blue-800/30 text-sm text-blue-300">
          <Info size={16} className="flex-shrink-0 mt-0.5" />
          <p>Click any node in the diagram to see detailed information about that Scrum process step. Use the controls to zoom and navigate.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 flex-1">
          {/* BPMN Canvas */}
          <div className="flex-1 relative bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden" style={{ minHeight: 500 }}>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10 rounded-2xl">
                <div className="flex items-center gap-3 text-slate-300">
                  <RefreshCw size={18} className="animate-spin" />
                  <span className="text-sm">Loading BPMN diagram...</span>
                </div>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <p className="text-red-400 text-sm">Failed to load diagram: {error}</p>
              </div>
            )}
            <div ref={containerRef} className="bpmn-container w-full h-full" style={{ minHeight: 500 }} />

            {/* Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              {[
                { icon: ZoomIn, action: () => zoom('in'), title: 'Zoom In' },
                { icon: ZoomOut, action: () => zoom('out'), title: 'Zoom Out' },
                { icon: Maximize2, action: fitView, title: 'Fit View' },
                { icon: RefreshCw, action: reset, title: 'Reset' },
              ].map(({ icon: Icon, action, title }) => (
                <button
                  key={title}
                  onClick={action}
                  title={title}
                  className="w-9 h-9 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-300 hover:text-white hover:border-violet-500/60 hover:bg-slate-700 transition-all flex items-center justify-center shadow-lg"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Info Panel */}
          <div className="w-full lg:w-72 flex flex-col gap-3">
            {selectedNode ? (
              <div className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Play size={14} className={selectedNode.color} />
                  <h3 className="text-sm font-bold text-white">{selectedNode.title}</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{selectedNode.desc}</p>
                <div className="mt-2 pt-3 border-t border-slate-700/50">
                  <p className="text-xs text-slate-500">Element ID</p>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">{selectedNode.id}</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/40 border border-dashed border-slate-700/50 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3 min-h-40">
                <Info size={24} className="text-slate-600" />
                <p className="text-sm text-slate-500">Click any element in the diagram to view details</p>
              </div>
            )}

            {/* Process Steps List */}
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Process Steps</h4>
              <div className="space-y-1.5">
                {Object.entries(NODE_INFO).map(([id, info]) => (
                  <button
                    key={id}
                    onClick={() => setSelectedNode({ id, ...info })}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                      selectedNode?.id === id
                        ? 'bg-violet-900/40 text-violet-300 border border-violet-700/40'
                        : 'text-slate-400 hover:bg-slate-700/40 hover:text-slate-200'
                    }`}
                  >
                    <span className={`font-medium ${info.color}`}>{info.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
