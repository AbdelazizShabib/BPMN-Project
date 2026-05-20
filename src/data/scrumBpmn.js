export const SCRUM_BPMN = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
             xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
             xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
             targetNamespace="http://scrum-bpmn.example">

  <collaboration id="Collab_Scrum">
    <participant id="Pool_Scrum" name="Scrum Framework Process" processRef="ScrumProcess"/>
    <participant id="Pool_Stakeholders" name="Stakeholders / Customers"/>
    <messageFlow id="MF_Review"   name="Sprint Demo"    sourceRef="T_SprintReview"    targetRef="Pool_Stakeholders"/>
    <messageFlow id="MF_Feedback" name="Feedback"       sourceRef="Pool_Stakeholders" targetRef="T_Feedback"/>
    <messageFlow id="MF_Deploy"   name="Release Notice" sourceRef="T_Deploy"          targetRef="Pool_Stakeholders"/>
  </collaboration>

  <process id="ScrumProcess" name="Scrum Framework" isExecutable="true">

    <laneSet id="LaneSet_1">
      <lane id="Lane_PO" name="Product Owner">
        <flowNodeRef>SE_Start</flowNodeRef>
        <flowNodeRef>T_Vision</flowNodeRef>
        <flowNodeRef>T_Stories</flowNodeRef>
        <flowNodeRef>T_Estimate</flowNodeRef>
        <flowNodeRef>T_Prioritize</flowNodeRef>
        <flowNodeRef>GW_Backlog</flowNodeRef>
        <flowNodeRef>T_AddStories</flowNodeRef>
        <flowNodeRef>T_Feedback</flowNodeRef>
        <flowNodeRef>GW_Accepted</flowNodeRef>
        <flowNodeRef>T_UpdateBacklog</flowNodeRef>
        <flowNodeRef>GW_Release</flowNodeRef>
        <flowNodeRef>GW_MoreSprints</flowNodeRef>
        <flowNodeRef>EE_Released</flowNodeRef>
      </lane>
      <lane id="Lane_SM" name="Scrum Master">
        <flowNodeRef>T_SprintPlan</flowNodeRef>
        <flowNodeRef>T_Goal</flowNodeRef>
        <flowNodeRef>T_DailyScrum</flowNodeRef>
        <flowNodeRef>GW_Impediment</flowNodeRef>
        <flowNodeRef>T_RemImpediment</flowNodeRef>
        <flowNodeRef>T_PrepDemo</flowNodeRef>
        <flowNodeRef>T_SprintReview</flowNodeRef>
        <flowNodeRef>T_Retro</flowNodeRef>
        <flowNodeRef>T_Improve</flowNodeRef>
        <flowNodeRef>T_UpdateProcess</flowNodeRef>
      </lane>
      <lane id="Lane_Dev" name="Development Team">
        <flowNodeRef>T_SelectItems</flowNodeRef>
        <flowNodeRef>T_SprintBacklog</flowNodeRef>
        <flowNodeRef>GW_Capacity</flowNodeRef>
        <flowNodeRef>T_AdjustScope</flowNodeRef>
        <flowNodeRef>T_Dev</flowNodeRef>
        <flowNodeRef>T_CodeReview</flowNodeRef>
        <flowNodeRef>GW_Quality</flowNodeRef>
        <flowNodeRef>T_FixIssues</flowNodeRef>
        <flowNodeRef>T_Testing</flowNodeRef>
        <flowNodeRef>GW_Tests</flowNodeRef>
        <flowNodeRef>T_FixDefects</flowNodeRef>
        <flowNodeRef>GW_SprintDone</flowNodeRef>
        <flowNodeRef>T_Deploy</flowNodeRef>
        <flowNodeRef>T_Monitor</flowNodeRef>
        <flowNodeRef>T_Rollback</flowNodeRef>
      </lane>
    </laneSet>

    <!-- EVENTS -->
    <startEvent id="SE_Start" name="Product&#10;Backlog Exists"><outgoing>F_01</outgoing></startEvent>
    <endEvent   id="EE_Released" name="Product&#10;Released"><incoming>F_R1</incoming></endEvent>

    <!-- BACKLOG PREPARATION (PO lane) -->
    <task id="T_Vision"    name="Maintain&#10;Product Vision">   <incoming>F_01</incoming><incoming>F_MS1</incoming><outgoing>F_02</outgoing></task>
    <task id="T_Stories"   name="Write &amp; Refine&#10;User Stories"><incoming>F_02</incoming><outgoing>F_03</outgoing></task>
    <task id="T_Estimate"  name="Estimate&#10;Story Points">     <incoming>F_03</incoming><outgoing>F_04</outgoing></task>
    <task id="T_Prioritize" name="Prioritize&#10;Product Backlog"><incoming>F_04</incoming><incoming>F_BR2</incoming><outgoing>F_05</outgoing></task>
    <exclusiveGateway id="GW_Backlog" name="Backlog&#10;Ready?"> <incoming>F_05</incoming><outgoing>F_06</outgoing><outgoing>F_BR1</outgoing></exclusiveGateway>
    <task id="T_AddStories" name="Add More&#10;User Stories">    <incoming>F_BR1</incoming><outgoing>F_BR2</outgoing></task>

    <!-- SPRINT PLANNING (SM + Dev lanes) -->
    <task id="T_SprintPlan"   name="Sprint Planning&#10;Meeting">      <incoming>F_06</incoming><incoming>F_AS2</incoming><incoming>F_UB2</incoming><outgoing>F_07</outgoing></task>
    <task id="T_Goal"         name="Define&#10;Sprint Goal">           <incoming>F_07</incoming><outgoing>F_08</outgoing></task>
    <task id="T_SelectItems"  name="Select Backlog&#10;Items">         <incoming>F_08</incoming><incoming>F_TB_SP</incoming><outgoing>F_09</outgoing></task>
    <task id="T_SprintBacklog" name="Create&#10;Sprint Backlog">       <incoming>F_09</incoming><outgoing>F_10</outgoing></task>
    <exclusiveGateway id="GW_Capacity" name="Team Capacity&#10;Met?"> <incoming>F_10</incoming><outgoing>F_11</outgoing><outgoing>F_AS1</outgoing></exclusiveGateway>
    <task id="T_AdjustScope"  name="Adjust Sprint&#10;Scope">          <incoming>F_AS1</incoming><outgoing>F_AS2</outgoing></task>

    <!-- SPRINT EXECUTION (SM + Dev lanes) -->
    <task id="T_DailyScrum"    name="Daily Scrum&#10;Standup">         <incoming>F_11</incoming><incoming>F_RI2</incoming><incoming>F_SD1</incoming><outgoing>F_12</outgoing></task>
    <exclusiveGateway id="GW_Impediment" name="Impediment&#10;Exists?"><incoming>F_12</incoming><outgoing>F_13</outgoing><outgoing>F_RI1</outgoing></exclusiveGateway>
    <task id="T_RemImpediment" name="Remove&#10;Impediment">            <incoming>F_RI1</incoming><outgoing>F_RI2</outgoing></task>
    <task id="T_Dev"           name="Development&#10;Work">             <incoming>F_13</incoming><incoming>F_FI2</incoming><outgoing>F_14</outgoing></task>
    <task id="T_CodeReview"    name="Peer Code&#10;Review">             <incoming>F_14</incoming><outgoing>F_15</outgoing></task>
    <exclusiveGateway id="GW_Quality" name="Code Quality&#10;OK?">     <incoming>F_15</incoming><outgoing>F_16</outgoing><outgoing>F_FI1</outgoing></exclusiveGateway>
    <task id="T_FixIssues"     name="Fix Code&#10;Issues">              <incoming>F_FI1</incoming><outgoing>F_FI2</outgoing></task>
    <task id="T_Testing"       name="Unit &amp; Integration&#10;Testing"><incoming>F_16</incoming><incoming>F_FD2</incoming><outgoing>F_17</outgoing></task>
    <exclusiveGateway id="GW_Tests" name="Tests&#10;Pass?">            <incoming>F_17</incoming><outgoing>F_18</outgoing><outgoing>F_FD1</outgoing></exclusiveGateway>
    <task id="T_FixDefects"    name="Fix&#10;Defects">                  <incoming>F_FD1</incoming><outgoing>F_FD2</outgoing></task>
    <exclusiveGateway id="GW_SprintDone" name="All Tasks&#10;Done?">   <incoming>F_18</incoming><outgoing>F_19</outgoing><outgoing>F_SD1</outgoing></exclusiveGateway>

    <!-- SPRINT REVIEW (SM + PO lanes) -->
    <task id="T_PrepDemo"    name="Prepare&#10;Sprint Demo">            <incoming>F_19</incoming><incoming>F_TB_SD</incoming><outgoing>F_20</outgoing></task>
    <task id="T_SprintReview" name="Sprint Review&#10;Meeting">         <incoming>F_20</incoming><outgoing>F_21</outgoing></task>
    <task id="T_Feedback"    name="Gather Stakeholder&#10;Feedback">    <incoming>F_21</incoming><outgoing>F_22</outgoing></task>
    <exclusiveGateway id="GW_Accepted" name="Increment&#10;Accepted?"> <incoming>F_22</incoming><outgoing>F_23</outgoing><outgoing>F_UB1</outgoing></exclusiveGateway>
    <task id="T_UpdateBacklog" name="Update Product&#10;Backlog">       <incoming>F_UB1</incoming><outgoing>F_UB2</outgoing></task>

    <!-- RETROSPECTIVE (SM lane) -->
    <task id="T_Retro"         name="Sprint&#10;Retrospective">         <incoming>F_23</incoming><outgoing>F_24</outgoing></task>
    <task id="T_Improve"       name="Identify Process&#10;Improvements"><incoming>F_24</incoming><outgoing>F_25</outgoing></task>
    <task id="T_UpdateProcess" name="Update Team&#10;Processes">        <incoming>F_25</incoming><outgoing>F_26</outgoing></task>

    <!-- RELEASE (PO + Dev lanes) -->
    <exclusiveGateway id="GW_Release"    name="Release&#10;Ready?">     <incoming>F_26</incoming><outgoing>F_27</outgoing><outgoing>F_28</outgoing></exclusiveGateway>
    <task id="T_Deploy"        name="Deploy to&#10;Production">          <incoming>F_27</incoming><outgoing>F_29</outgoing></task>
    <task id="T_Monitor"       name="Monitor &amp;&#10;Validate Release"><incoming>F_29</incoming><incoming>F_EB2</incoming><outgoing>F_30</outgoing></task>
    <exclusiveGateway id="GW_MoreSprints" name="Continue&#10;Development?"><incoming>F_30</incoming><incoming>F_28</incoming><outgoing>F_MS1</outgoing><outgoing>F_R1</outgoing></exclusiveGateway>

    <!-- BOUNDARY EVENTS -->
    <boundaryEvent id="TB_SprintPlan" name="4hr&#10;Time-box" attachedToRef="T_SprintPlan" cancelActivity="true">
      <outgoing>F_TB_SP</outgoing>
      <timerEventDefinition id="TED_SprintPlan"><timeDuration>PT4H</timeDuration></timerEventDefinition>
    </boundaryEvent>
    <boundaryEvent id="TB_SprintDeadline" name="Sprint&#10;Deadline (2w)" attachedToRef="T_Dev" cancelActivity="true">
      <outgoing>F_TB_SD</outgoing>
      <timerEventDefinition id="TED_SprintDeadline"><timeDuration>P14D</timeDuration></timerEventDefinition>
    </boundaryEvent>
    <boundaryEvent id="EB_Deploy" name="Deployment&#10;Error" attachedToRef="T_Deploy" cancelActivity="true">
      <outgoing>F_EB1</outgoing>
      <errorEventDefinition id="EED_Deploy"/>
    </boundaryEvent>
    <task id="T_Rollback" name="Rollback&#10;Deployment"><incoming>F_EB1</incoming><outgoing>F_EB2</outgoing></task>

    <!-- DATA OBJECTS & STORES -->
    <dataStoreReference id="DS_ProductBacklog" name="Product Backlog"/>
    <dataObjectReference id="DO_SprintBacklog" name="Sprint Backlog" dataObjectRef="SpO_1"/>
    <dataObject id="SpO_1"/>
    <dataObjectReference id="DO_SprintGoal" name="Sprint Goal" dataObjectRef="SgO_1"/>
    <dataObject id="SgO_1"/>
    <dataObjectReference id="DO_DoD" name="Definition&#10;of Done" dataObjectRef="DoDO_1"/>
    <dataObject id="DoDO_1"/>

    <!-- DATA ASSOCIATIONS -->
    <association id="Assoc_PBL"  associationDirection="Both" sourceRef="T_Estimate"     targetRef="DS_ProductBacklog"/>
    <association id="Assoc_SBL"  associationDirection="One"  sourceRef="T_SprintBacklog" targetRef="DO_SprintBacklog"/>
    <association id="Assoc_Goal" associationDirection="One"  sourceRef="T_Goal"          targetRef="DO_SprintGoal"/>
    <association id="Assoc_DoD"  associationDirection="One"  sourceRef="DO_DoD"          targetRef="T_Testing"/>

    <!-- SEQUENCE FLOWS -->
    <sequenceFlow id="F_01"  sourceRef="SE_Start"      targetRef="T_Vision"/>
    <sequenceFlow id="F_02"  sourceRef="T_Vision"       targetRef="T_Stories"/>
    <sequenceFlow id="F_03"  sourceRef="T_Stories"      targetRef="T_Estimate"/>
    <sequenceFlow id="F_04"  sourceRef="T_Estimate"     targetRef="T_Prioritize"/>
    <sequenceFlow id="F_05"  sourceRef="T_Prioritize"   targetRef="GW_Backlog"/>
    <sequenceFlow id="F_06"  name="Yes" sourceRef="GW_Backlog"     targetRef="T_SprintPlan"/>
    <sequenceFlow id="F_BR1" name="No"  sourceRef="GW_Backlog"     targetRef="T_AddStories"/>
    <sequenceFlow id="F_BR2" sourceRef="T_AddStories"   targetRef="T_Prioritize"/>
    <sequenceFlow id="F_07"  sourceRef="T_SprintPlan"   targetRef="T_Goal"/>
    <sequenceFlow id="F_08"  sourceRef="T_Goal"          targetRef="T_SelectItems"/>
    <sequenceFlow id="F_09"  sourceRef="T_SelectItems"  targetRef="T_SprintBacklog"/>
    <sequenceFlow id="F_10"  sourceRef="T_SprintBacklog" targetRef="GW_Capacity"/>
    <sequenceFlow id="F_11"  name="Yes" sourceRef="GW_Capacity"    targetRef="T_DailyScrum"/>
    <sequenceFlow id="F_AS1" name="No"  sourceRef="GW_Capacity"    targetRef="T_AdjustScope"/>
    <sequenceFlow id="F_AS2" sourceRef="T_AdjustScope"  targetRef="T_SprintPlan"/>
    <sequenceFlow id="F_12"  sourceRef="T_DailyScrum"   targetRef="GW_Impediment"/>
    <sequenceFlow id="F_13"  name="No"  sourceRef="GW_Impediment"  targetRef="T_Dev"/>
    <sequenceFlow id="F_RI1" name="Yes" sourceRef="GW_Impediment"  targetRef="T_RemImpediment"/>
    <sequenceFlow id="F_RI2" sourceRef="T_RemImpediment" targetRef="T_DailyScrum"/>
    <sequenceFlow id="F_14"  sourceRef="T_Dev"           targetRef="T_CodeReview"/>
    <sequenceFlow id="F_15"  sourceRef="T_CodeReview"   targetRef="GW_Quality"/>
    <sequenceFlow id="F_16"  name="Yes" sourceRef="GW_Quality"     targetRef="T_Testing"/>
    <sequenceFlow id="F_FI1" name="No"  sourceRef="GW_Quality"     targetRef="T_FixIssues"/>
    <sequenceFlow id="F_FI2" sourceRef="T_FixIssues"    targetRef="T_Dev"/>
    <sequenceFlow id="F_17"  sourceRef="T_Testing"       targetRef="GW_Tests"/>
    <sequenceFlow id="F_18"  name="Pass" sourceRef="GW_Tests"      targetRef="GW_SprintDone"/>
    <sequenceFlow id="F_FD1" name="Fail" sourceRef="GW_Tests"      targetRef="T_FixDefects"/>
    <sequenceFlow id="F_FD2" sourceRef="T_FixDefects"   targetRef="T_Testing"/>
    <sequenceFlow id="F_19"  name="Yes" sourceRef="GW_SprintDone"  targetRef="T_PrepDemo"/>
    <sequenceFlow id="F_SD1" name="No"  sourceRef="GW_SprintDone"  targetRef="T_DailyScrum"/>
    <sequenceFlow id="F_20"  sourceRef="T_PrepDemo"     targetRef="T_SprintReview"/>
    <sequenceFlow id="F_21"  sourceRef="T_SprintReview" targetRef="T_Feedback"/>
    <sequenceFlow id="F_22"  sourceRef="T_Feedback"     targetRef="GW_Accepted"/>
    <sequenceFlow id="F_23"  name="Yes" sourceRef="GW_Accepted"    targetRef="T_Retro"/>
    <sequenceFlow id="F_UB1" name="No"  sourceRef="GW_Accepted"    targetRef="T_UpdateBacklog"/>
    <sequenceFlow id="F_UB2" sourceRef="T_UpdateBacklog" targetRef="T_SprintPlan"/>
    <sequenceFlow id="F_24"  sourceRef="T_Retro"         targetRef="T_Improve"/>
    <sequenceFlow id="F_25"  sourceRef="T_Improve"       targetRef="T_UpdateProcess"/>
    <sequenceFlow id="F_26"  sourceRef="T_UpdateProcess" targetRef="GW_Release"/>
    <sequenceFlow id="F_27"  name="Yes" sourceRef="GW_Release"     targetRef="T_Deploy"/>
    <sequenceFlow id="F_28"  name="No"  sourceRef="GW_Release"     targetRef="GW_MoreSprints"/>
    <sequenceFlow id="F_29"  sourceRef="T_Deploy"        targetRef="T_Monitor"/>
    <sequenceFlow id="F_30"  sourceRef="T_Monitor"       targetRef="GW_MoreSprints"/>
    <sequenceFlow id="F_MS1" name="Yes" sourceRef="GW_MoreSprints" targetRef="T_Vision"/>
    <sequenceFlow id="F_R1"  name="No"  sourceRef="GW_MoreSprints" targetRef="EE_Released"/>
    <sequenceFlow id="F_TB_SP" sourceRef="TB_SprintPlan"     targetRef="T_SelectItems"/>
    <sequenceFlow id="F_TB_SD" sourceRef="TB_SprintDeadline" targetRef="T_PrepDemo"/>
    <sequenceFlow id="F_EB1"   sourceRef="EB_Deploy"         targetRef="T_Rollback"/>
    <sequenceFlow id="F_EB2"   sourceRef="T_Rollback"        targetRef="T_Monitor"/>
  </process>

  <bpmndi:BPMNDiagram id="Diagram_1">
    <bpmndi:BPMNPlane id="Plane_1" bpmnElement="Collab_Scrum">

      <!-- POOL -->
      <bpmndi:BPMNShape id="Pool_Scrum_di" bpmnElement="Pool_Scrum" isHorizontal="true">
        <dc:Bounds x="80" y="40" width="4120" height="750"/>
      </bpmndi:BPMNShape>

      <!-- LANES -->
      <bpmndi:BPMNShape id="Lane_PO_di" bpmnElement="Lane_PO" isHorizontal="true">
        <dc:Bounds x="110" y="40" width="4090" height="230"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Lane_SM_di" bpmnElement="Lane_SM" isHorizontal="true">
        <dc:Bounds x="110" y="270" width="4090" height="230"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Lane_Dev_di" bpmnElement="Lane_Dev" isHorizontal="true">
        <dc:Bounds x="110" y="500" width="4090" height="290"/>
      </bpmndi:BPMNShape>

      <!-- ── PO LANE ELEMENTS (center y=155) ── -->
      <bpmndi:BPMNShape id="SE_Start_di" bpmnElement="SE_Start">
        <dc:Bounds x="160" y="140" width="30" height="30"/>
        <bpmndi:BPMNLabel><dc:Bounds x="138" y="177" width="74" height="27"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="T_Vision_di" bpmnElement="T_Vision">
        <dc:Bounds x="220" y="125" width="100" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="T_Stories_di" bpmnElement="T_Stories">
        <dc:Bounds x="350" y="125" width="100" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="T_Estimate_di" bpmnElement="T_Estimate">
        <dc:Bounds x="480" y="125" width="100" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="T_Prioritize_di" bpmnElement="T_Prioritize">
        <dc:Bounds x="610" y="125" width="100" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="GW_Backlog_di" bpmnElement="GW_Backlog" isMarkerVisible="true">
        <dc:Bounds x="768" y="133" width="44" height="44"/>
        <bpmndi:BPMNLabel><dc:Bounds x="752" y="100" width="76" height="27"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="T_AddStories_di" bpmnElement="T_AddStories">
        <dc:Bounds x="740" y="198" width="100" height="60"/>
      </bpmndi:BPMNShape>

      <!-- Review phase PO elements -->
      <bpmndi:BPMNShape id="T_Feedback_di" bpmnElement="T_Feedback">
        <dc:Bounds x="2830" y="125" width="100" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="GW_Accepted_di" bpmnElement="GW_Accepted" isMarkerVisible="true">
        <dc:Bounds x="2998" y="133" width="44" height="44"/>
        <bpmndi:BPMNLabel><dc:Bounds x="2980" y="100" width="72" height="27"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="T_UpdateBacklog_di" bpmnElement="T_UpdateBacklog">
        <dc:Bounds x="2970" y="198" width="100" height="60"/>
      </bpmndi:BPMNShape>

      <!-- Release PO elements -->
      <bpmndi:BPMNShape id="GW_Release_di" bpmnElement="GW_Release" isMarkerVisible="true">
        <dc:Bounds x="3558" y="133" width="44" height="44"/>
        <bpmndi:BPMNLabel><dc:Bounds x="3540" y="100" width="72" height="27"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="GW_MoreSprints_di" bpmnElement="GW_MoreSprints" isMarkerVisible="true">
        <dc:Bounds x="3978" y="133" width="44" height="44"/>
        <bpmndi:BPMNLabel><dc:Bounds x="4026" y="100" width="80" height="27"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EE_Released_di" bpmnElement="EE_Released">
        <dc:Bounds x="4120" y="140" width="30" height="30"/>
        <bpmndi:BPMNLabel><dc:Bounds x="4102" y="177" width="66" height="27"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <!-- ── SM LANE ELEMENTS (center y=385) ── -->
      <bpmndi:BPMNShape id="T_SprintPlan_di" bpmnElement="T_SprintPlan">
        <dc:Bounds x="870" y="355" width="100" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="T_Goal_di" bpmnElement="T_Goal">
        <dc:Bounds x="1010" y="355" width="100" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="T_DailyScrum_di" bpmnElement="T_DailyScrum">
        <dc:Bounds x="1570" y="355" width="100" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="GW_Impediment_di" bpmnElement="GW_Impediment" isMarkerVisible="true">
        <dc:Bounds x="1738" y="363" width="44" height="44"/>
        <bpmndi:BPMNLabel><dc:Bounds x="1718" y="330" width="76" height="27"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="T_RemImpediment_di" bpmnElement="T_RemImpediment">
        <dc:Bounds x="1710" y="432" width="100" height="60"/>
      </bpmndi:BPMNShape>

      <!-- Review SM elements -->
      <bpmndi:BPMNShape id="T_PrepDemo_di" bpmnElement="T_PrepDemo">
        <dc:Bounds x="2690" y="355" width="100" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="T_SprintReview_di" bpmnElement="T_SprintReview">
        <dc:Bounds x="2830" y="355" width="100" height="60"/>
      </bpmndi:BPMNShape>

      <!-- Retro SM elements -->
      <bpmndi:BPMNShape id="T_Retro_di" bpmnElement="T_Retro">
        <dc:Bounds x="3110" y="355" width="100" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="T_Improve_di" bpmnElement="T_Improve">
        <dc:Bounds x="3250" y="355" width="100" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="T_UpdateProcess_di" bpmnElement="T_UpdateProcess">
        <dc:Bounds x="3390" y="355" width="100" height="60"/>
      </bpmndi:BPMNShape>

      <!-- ── DEV LANE ELEMENTS (center y=645) ── -->
      <bpmndi:BPMNShape id="T_SelectItems_di" bpmnElement="T_SelectItems">
        <dc:Bounds x="1150" y="615" width="100" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="T_SprintBacklog_di" bpmnElement="T_SprintBacklog">
        <dc:Bounds x="1290" y="615" width="100" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="GW_Capacity_di" bpmnElement="GW_Capacity" isMarkerVisible="true">
        <dc:Bounds x="1458" y="623" width="44" height="44"/>
        <bpmndi:BPMNLabel><dc:Bounds x="1510" y="590" width="76" height="27"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="T_AdjustScope_di" bpmnElement="T_AdjustScope">
        <dc:Bounds x="1430" y="700" width="100" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="T_Dev_di" bpmnElement="T_Dev">
        <dc:Bounds x="1850" y="615" width="100" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="T_CodeReview_di" bpmnElement="T_CodeReview">
        <dc:Bounds x="1990" y="615" width="100" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="GW_Quality_di" bpmnElement="GW_Quality" isMarkerVisible="true">
        <dc:Bounds x="2158" y="623" width="44" height="44"/>
        <bpmndi:BPMNLabel><dc:Bounds x="2138" y="590" width="76" height="27"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="T_FixIssues_di" bpmnElement="T_FixIssues">
        <dc:Bounds x="2130" y="700" width="100" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="T_Testing_di" bpmnElement="T_Testing">
        <dc:Bounds x="2270" y="615" width="100" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="GW_Tests_di" bpmnElement="GW_Tests" isMarkerVisible="true">
        <dc:Bounds x="2438" y="623" width="44" height="44"/>
        <bpmndi:BPMNLabel><dc:Bounds x="2422" y="590" width="68" height="27"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="T_FixDefects_di" bpmnElement="T_FixDefects">
        <dc:Bounds x="2410" y="700" width="100" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="GW_SprintDone_di" bpmnElement="GW_SprintDone" isMarkerVisible="true">
        <dc:Bounds x="2578" y="623" width="44" height="44"/>
        <bpmndi:BPMNLabel><dc:Bounds x="2626" y="590" width="80" height="27"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <!-- Release Dev elements -->
      <bpmndi:BPMNShape id="T_Deploy_di" bpmnElement="T_Deploy">
        <dc:Bounds x="3670" y="615" width="100" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="T_Monitor_di" bpmnElement="T_Monitor">
        <dc:Bounds x="3810" y="615" width="100" height="60"/>
      </bpmndi:BPMNShape>

      <!-- ══════════════ EDGES ══════════════ -->

      <!-- Phase 1: Backlog (PO lane horizontal) -->
      <bpmndi:BPMNEdge id="F_01_di"  bpmnElement="F_01"><di:waypoint x="190" y="155"/><di:waypoint x="220" y="155"/></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="F_02_di"  bpmnElement="F_02"><di:waypoint x="320" y="155"/><di:waypoint x="350" y="155"/></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="F_03_di"  bpmnElement="F_03"><di:waypoint x="450" y="155"/><di:waypoint x="480" y="155"/></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="F_04_di"  bpmnElement="F_04"><di:waypoint x="580" y="155"/><di:waypoint x="610" y="155"/></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="F_05_di"  bpmnElement="F_05"><di:waypoint x="710" y="155"/><di:waypoint x="768" y="155"/></bpmndi:BPMNEdge>

      <!-- GW_Backlog → SprintPlan (PO→SM, cross-lane down-right) -->
      <bpmndi:BPMNEdge id="F_06_di" bpmnElement="F_06">
        <di:waypoint x="812" y="155"/><di:waypoint x="841" y="155"/><di:waypoint x="841" y="385"/><di:waypoint x="870" y="385"/>
        <bpmndi:BPMNLabel><dc:Bounds x="822" y="260" width="20" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- GW_Backlog → AddStories (PO, down to branch) -->
      <bpmndi:BPMNEdge id="F_BR1_di" bpmnElement="F_BR1">
        <di:waypoint x="790" y="177"/><di:waypoint x="790" y="198"/>
        <bpmndi:BPMNLabel><dc:Bounds x="797" y="186" width="15" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- AddStories → Prioritize (PO, loop left-up) -->
      <bpmndi:BPMNEdge id="F_BR2_di" bpmnElement="F_BR2">
        <di:waypoint x="740" y="228"/><di:waypoint x="660" y="228"/><di:waypoint x="660" y="185"/>
      </bpmndi:BPMNEdge>

      <!-- Phase 2: Sprint Planning -->
      <bpmndi:BPMNEdge id="F_07_di" bpmnElement="F_07"><di:waypoint x="970" y="385"/><di:waypoint x="1010" y="385"/></bpmndi:BPMNEdge>

      <!-- T_Goal → T_SelectItems (SM→Dev, cross-lane) -->
      <bpmndi:BPMNEdge id="F_08_di" bpmnElement="F_08">
        <di:waypoint x="1060" y="415"/><di:waypoint x="1060" y="500"/><di:waypoint x="1200" y="500"/><di:waypoint x="1200" y="615"/>
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="F_09_di" bpmnElement="F_09"><di:waypoint x="1250" y="645"/><di:waypoint x="1290" y="645"/></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="F_10_di" bpmnElement="F_10"><di:waypoint x="1390" y="645"/><di:waypoint x="1458" y="645"/></bpmndi:BPMNEdge>

      <!-- GW_Capacity → DailyScrum (Dev→SM, cross-lane up) -->
      <bpmndi:BPMNEdge id="F_11_di" bpmnElement="F_11">
        <di:waypoint x="1480" y="623"/><di:waypoint x="1480" y="385"/><di:waypoint x="1570" y="385"/>
        <bpmndi:BPMNLabel><dc:Bounds x="1487" y="498" width="20" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- GW_Capacity → AdjustScope (Dev, down to branch) -->
      <bpmndi:BPMNEdge id="F_AS1_di" bpmnElement="F_AS1">
        <di:waypoint x="1480" y="667"/><di:waypoint x="1480" y="700"/>
        <bpmndi:BPMNLabel><dc:Bounds x="1487" y="681" width="15" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- AdjustScope → SprintPlan (Dev→SM, loop left-up) -->
      <bpmndi:BPMNEdge id="F_AS2_di" bpmnElement="F_AS2">
        <di:waypoint x="1430" y="730"/><di:waypoint x="920" y="730"/><di:waypoint x="920" y="500"/><di:waypoint x="920" y="415"/>
      </bpmndi:BPMNEdge>

      <!-- Phase 3: Sprint Execution -->
      <bpmndi:BPMNEdge id="F_12_di" bpmnElement="F_12"><di:waypoint x="1670" y="385"/><di:waypoint x="1738" y="385"/></bpmndi:BPMNEdge>

      <!-- GW_Impediment → T_Dev (SM→Dev, cross-lane down) -->
      <bpmndi:BPMNEdge id="F_13_di" bpmnElement="F_13">
        <di:waypoint x="1760" y="407"/><di:waypoint x="1760" y="500"/><di:waypoint x="1900" y="500"/><di:waypoint x="1900" y="615"/>
        <bpmndi:BPMNLabel><dc:Bounds x="1767" y="453" width="15" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- GW_Impediment → RemImpediment (SM, down to branch) -->
      <bpmndi:BPMNEdge id="F_RI1_di" bpmnElement="F_RI1">
        <di:waypoint x="1760" y="407"/><di:waypoint x="1760" y="432"/>
        <bpmndi:BPMNLabel><dc:Bounds x="1767" y="418" width="20" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- RemImpediment → DailyScrum (SM, loop left) -->
      <bpmndi:BPMNEdge id="F_RI2_di" bpmnElement="F_RI2">
        <di:waypoint x="1710" y="462"/><di:waypoint x="1620" y="462"/><di:waypoint x="1620" y="415"/>
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="F_14_di" bpmnElement="F_14"><di:waypoint x="1950" y="645"/><di:waypoint x="1990" y="645"/></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="F_15_di" bpmnElement="F_15"><di:waypoint x="2090" y="645"/><di:waypoint x="2158" y="645"/></bpmndi:BPMNEdge>

      <!-- GW_Quality → Testing (Dev, right) -->
      <bpmndi:BPMNEdge id="F_16_di" bpmnElement="F_16">
        <di:waypoint x="2202" y="645"/><di:waypoint x="2270" y="645"/>
        <bpmndi:BPMNLabel><dc:Bounds x="2228" y="627" width="20" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- GW_Quality → FixIssues (Dev, down) -->
      <bpmndi:BPMNEdge id="F_FI1_di" bpmnElement="F_FI1">
        <di:waypoint x="2180" y="667"/><di:waypoint x="2180" y="700"/>
        <bpmndi:BPMNLabel><dc:Bounds x="2187" y="681" width="15" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- FixIssues → T_Dev (Dev, loop left) -->
      <bpmndi:BPMNEdge id="F_FI2_di" bpmnElement="F_FI2">
        <di:waypoint x="2130" y="730"/><di:waypoint x="1900" y="730"/><di:waypoint x="1900" y="675"/>
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="F_17_di" bpmnElement="F_17"><di:waypoint x="2370" y="645"/><di:waypoint x="2438" y="645"/></bpmndi:BPMNEdge>

      <!-- GW_Tests → GW_SprintDone (Dev, right) -->
      <bpmndi:BPMNEdge id="F_18_di" bpmnElement="F_18">
        <di:waypoint x="2482" y="645"/><di:waypoint x="2578" y="645"/>
        <bpmndi:BPMNLabel><dc:Bounds x="2520" y="627" width="26" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- GW_Tests → FixDefects (Dev, down) -->
      <bpmndi:BPMNEdge id="F_FD1_di" bpmnElement="F_FD1">
        <di:waypoint x="2460" y="667"/><di:waypoint x="2460" y="700"/>
        <bpmndi:BPMNLabel><dc:Bounds x="2467" y="681" width="20" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- FixDefects → Testing (Dev, loop left) -->
      <bpmndi:BPMNEdge id="F_FD2_di" bpmnElement="F_FD2">
        <di:waypoint x="2410" y="730"/><di:waypoint x="2320" y="730"/><di:waypoint x="2320" y="675"/>
      </bpmndi:BPMNEdge>

      <!-- GW_SprintDone → PrepDemo (Dev→SM, up-right) -->
      <bpmndi:BPMNEdge id="F_19_di" bpmnElement="F_19">
        <di:waypoint x="2600" y="623"/><di:waypoint x="2600" y="385"/><di:waypoint x="2690" y="385"/>
        <bpmndi:BPMNLabel><dc:Bounds x="2607" y="498" width="20" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- GW_SprintDone → DailyScrum (Dev, long backward loop) -->
      <bpmndi:BPMNEdge id="F_SD1_di" bpmnElement="F_SD1">
        <di:waypoint x="2578" y="645"/><di:waypoint x="2578" y="775"/><di:waypoint x="1620" y="775"/><di:waypoint x="1620" y="415"/>
        <bpmndi:BPMNLabel><dc:Bounds x="2100" y="757" width="15" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- Phase 4: Sprint Review -->
      <bpmndi:BPMNEdge id="F_20_di" bpmnElement="F_20"><di:waypoint x="2790" y="385"/><di:waypoint x="2830" y="385"/></bpmndi:BPMNEdge>

      <!-- T_SprintReview → T_Feedback (SM→PO, cross-lane up) -->
      <bpmndi:BPMNEdge id="F_21_di" bpmnElement="F_21">
        <di:waypoint x="2880" y="355"/><di:waypoint x="2880" y="185"/>
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="F_22_di" bpmnElement="F_22"><di:waypoint x="2930" y="155"/><di:waypoint x="2998" y="155"/></bpmndi:BPMNEdge>

      <!-- GW_Accepted → T_Retro (PO→SM, cross-lane down) -->
      <bpmndi:BPMNEdge id="F_23_di" bpmnElement="F_23">
        <di:waypoint x="3042" y="155"/><di:waypoint x="3076" y="155"/><di:waypoint x="3076" y="385"/><di:waypoint x="3110" y="385"/>
        <bpmndi:BPMNLabel><dc:Bounds x="3052" y="260" width="20" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- GW_Accepted → UpdateBacklog (PO, down to branch) -->
      <bpmndi:BPMNEdge id="F_UB1_di" bpmnElement="F_UB1">
        <di:waypoint x="3020" y="177"/><di:waypoint x="3020" y="198"/>
        <bpmndi:BPMNLabel><dc:Bounds x="3027" y="186" width="15" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- UpdateBacklog → SprintPlan (PO→SM, very long backward loop) -->
      <bpmndi:BPMNEdge id="F_UB2_di" bpmnElement="F_UB2">
        <di:waypoint x="2970" y="228"/><di:waypoint x="920" y="228"/><di:waypoint x="920" y="355"/>
      </bpmndi:BPMNEdge>

      <!-- Phase 5: Retrospective -->
      <bpmndi:BPMNEdge id="F_24_di" bpmnElement="F_24"><di:waypoint x="3210" y="385"/><di:waypoint x="3250" y="385"/></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="F_25_di" bpmnElement="F_25"><di:waypoint x="3350" y="385"/><di:waypoint x="3390" y="385"/></bpmndi:BPMNEdge>

      <!-- T_UpdateProcess → GW_Release (SM→PO, cross-lane up) -->
      <bpmndi:BPMNEdge id="F_26_di" bpmnElement="F_26">
        <di:waypoint x="3490" y="385"/><di:waypoint x="3524" y="385"/><di:waypoint x="3524" y="155"/><di:waypoint x="3558" y="155"/>
      </bpmndi:BPMNEdge>

      <!-- Phase 6: Release -->
      <!-- GW_Release → T_Deploy (PO→Dev, cross-lane down) -->
      <bpmndi:BPMNEdge id="F_27_di" bpmnElement="F_27">
        <di:waypoint x="3580" y="177"/><di:waypoint x="3580" y="270"/><di:waypoint x="3720" y="270"/><di:waypoint x="3720" y="615"/>
        <bpmndi:BPMNLabel><dc:Bounds x="3640" y="252" width="20" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- GW_Release → GW_MoreSprints (PO, bypass deploy) -->
      <bpmndi:BPMNEdge id="F_28_di" bpmnElement="F_28">
        <di:waypoint x="3602" y="155"/><di:waypoint x="3978" y="155"/>
        <bpmndi:BPMNLabel><dc:Bounds x="3780" y="137" width="15" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="F_29_di" bpmnElement="F_29"><di:waypoint x="3770" y="645"/><di:waypoint x="3810" y="645"/></bpmndi:BPMNEdge>

      <!-- T_Monitor → GW_MoreSprints (Dev→PO, cross-lane up) -->
      <bpmndi:BPMNEdge id="F_30_di" bpmnElement="F_30">
        <di:waypoint x="3860" y="615"/><di:waypoint x="4000" y="615"/><di:waypoint x="4000" y="177"/>
      </bpmndi:BPMNEdge>

      <!-- GW_MoreSprints → T_Vision (very long top loop back) -->
      <bpmndi:BPMNEdge id="F_MS1_di" bpmnElement="F_MS1">
        <di:waypoint x="4000" y="133"/><di:waypoint x="4000" y="55"/><di:waypoint x="270" y="55"/><di:waypoint x="270" y="125"/>
        <bpmndi:BPMNLabel><dc:Bounds x="2080" y="37" width="20" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- GW_MoreSprints → EE_Released -->
      <bpmndi:BPMNEdge id="F_R1_di" bpmnElement="F_R1">
        <di:waypoint x="4022" y="155"/><di:waypoint x="4120" y="155"/>
        <bpmndi:BPMNLabel><dc:Bounds x="4063" y="137" width="15" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- ── STAKEHOLDERS POOL (below main pool) ── -->
      <bpmndi:BPMNShape id="Pool_Stakeholders_di" bpmnElement="Pool_Stakeholders" isHorizontal="true">
        <dc:Bounds x="80" y="820" width="4120" height="100"/>
      </bpmndi:BPMNShape>

      <!-- ══════════════ MESSAGE FLOWS ══════════════ -->

      <!-- T_SprintReview → Stakeholders: Sprint Demo (vertical, bottom of SM task → pool top) -->
      <bpmndi:BPMNEdge id="MF_Review_di" bpmnElement="MF_Review">
        <di:waypoint x="2880" y="415"/>
        <di:waypoint x="2880" y="820"/>
        <bpmndi:BPMNLabel><dc:Bounds x="2888" y="607" width="60" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- Stakeholders → T_Feedback: Feedback (up from pool, L-shape to right side of T_Feedback) -->
      <bpmndi:BPMNEdge id="MF_Feedback_di" bpmnElement="MF_Feedback">
        <di:waypoint x="3000" y="820"/>
        <di:waypoint x="3000" y="155"/>
        <di:waypoint x="2930" y="155"/>
        <bpmndi:BPMNLabel><dc:Bounds x="3008" y="487" width="47" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- T_Deploy → Stakeholders: Release Notice (vertical, bottom of Dev task → pool top) -->
      <bpmndi:BPMNEdge id="MF_Deploy_di" bpmnElement="MF_Deploy">
        <di:waypoint x="3720" y="675"/>
        <di:waypoint x="3720" y="820"/>
        <bpmndi:BPMNLabel><dc:Bounds x="3728" y="741" width="76" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- ══ BOUNDARY EVENT SHAPES ══ -->
      <!-- TB_SprintPlan: bottom-left of T_SprintPlan (x=870,y=355,w=100,h=60) → cx=880,cy=415 -->
      <bpmndi:BPMNShape id="TB_SprintPlan_di" bpmnElement="TB_SprintPlan">
        <dc:Bounds x="862" y="397" width="36" height="36"/>
        <bpmndi:BPMNLabel><dc:Bounds x="838" y="437" width="56" height="27"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <!-- TB_SprintDeadline: bottom-left of T_Dev (x=1850,y=615,w=100,h=60) → cx=1870,cy=675 -->
      <bpmndi:BPMNShape id="TB_SprintDeadline_di" bpmnElement="TB_SprintDeadline">
        <dc:Bounds x="1852" y="657" width="36" height="36"/>
        <bpmndi:BPMNLabel><dc:Bounds x="1826" y="697" width="68" height="27"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <!-- EB_Deploy: bottom-center of T_Deploy (x=3670,y=615,w=100,h=60) → cx=3720,cy=675 -->
      <bpmndi:BPMNShape id="EB_Deploy_di" bpmnElement="EB_Deploy">
        <dc:Bounds x="3702" y="657" width="36" height="36"/>
        <bpmndi:BPMNLabel><dc:Bounds x="3682" y="697" width="76" height="27"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <!-- T_Rollback: directly below T_Deploy -->
      <bpmndi:BPMNShape id="T_Rollback_di" bpmnElement="T_Rollback">
        <dc:Bounds x="3670" y="700" width="100" height="60"/>
      </bpmndi:BPMNShape>

      <!-- ══ DATA OBJECT / STORE SHAPES ══ -->
      <!-- DS_ProductBacklog: PO lane, below T_Estimate -->
      <bpmndi:BPMNShape id="DS_ProductBacklog_di" bpmnElement="DS_ProductBacklog">
        <dc:Bounds x="490" y="195" width="50" height="50"/>
        <bpmndi:BPMNLabel><dc:Bounds x="476" y="250" width="78" height="27"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <!-- DO_SprintBacklog: Dev lane, above T_SprintBacklog -->
      <bpmndi:BPMNShape id="DO_SprintBacklog_di" bpmnElement="DO_SprintBacklog">
        <dc:Bounds x="1290" y="540" width="36" height="50"/>
        <bpmndi:BPMNLabel><dc:Bounds x="1276" y="594" width="64" height="27"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <!-- DO_SprintGoal: SM lane, below T_Goal -->
      <bpmndi:BPMNShape id="DO_SprintGoal_di" bpmnElement="DO_SprintGoal">
        <dc:Bounds x="1090" y="440" width="36" height="50"/>
        <bpmndi:BPMNLabel><dc:Bounds x="1076" y="494" width="64" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <!-- DO_DoD: Dev lane, above T_Testing -->
      <bpmndi:BPMNShape id="DO_DoD_di" bpmnElement="DO_DoD">
        <dc:Bounds x="2270" y="540" width="36" height="50"/>
        <bpmndi:BPMNLabel><dc:Bounds x="2252" y="594" width="72" height="27"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <!-- ══ BOUNDARY EVENT FLOWS ══ -->
      <!-- TB_SprintPlan → T_SelectItems: down through SM lane then into Dev lane -->
      <bpmndi:BPMNEdge id="F_TB_SP_di" bpmnElement="F_TB_SP">
        <di:waypoint x="880" y="433"/>
        <di:waypoint x="880" y="480"/>
        <di:waypoint x="1200" y="480"/>
        <di:waypoint x="1200" y="615"/>
      </bpmndi:BPMNEdge>
      <!-- TB_SprintDeadline → T_PrepDemo: down then long right through Dev+SM lanes -->
      <bpmndi:BPMNEdge id="F_TB_SD_di" bpmnElement="F_TB_SD">
        <di:waypoint x="1870" y="693"/>
        <di:waypoint x="1870" y="750"/>
        <di:waypoint x="2740" y="750"/>
        <di:waypoint x="2740" y="415"/>
      </bpmndi:BPMNEdge>
      <!-- EB_Deploy → T_Rollback: straight down -->
      <bpmndi:BPMNEdge id="F_EB1_di" bpmnElement="F_EB1">
        <di:waypoint x="3720" y="693"/>
        <di:waypoint x="3720" y="700"/>
      </bpmndi:BPMNEdge>
      <!-- T_Rollback → T_Monitor: right then up -->
      <bpmndi:BPMNEdge id="F_EB2_di" bpmnElement="F_EB2">
        <di:waypoint x="3770" y="730"/>
        <di:waypoint x="3860" y="730"/>
        <di:waypoint x="3860" y="675"/>
      </bpmndi:BPMNEdge>

      <!-- ══ DATA ASSOCIATION EDGES ══ -->
      <bpmndi:BPMNEdge id="Assoc_PBL_di" bpmnElement="Assoc_PBL">
        <di:waypoint x="530" y="185"/>
        <di:waypoint x="515" y="195"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Assoc_SBL_di" bpmnElement="Assoc_SBL">
        <di:waypoint x="1340" y="615"/>
        <di:waypoint x="1308" y="590"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Assoc_Goal_di" bpmnElement="Assoc_Goal">
        <di:waypoint x="1100" y="415"/>
        <di:waypoint x="1108" y="440"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Assoc_DoD_di" bpmnElement="Assoc_DoD">
        <di:waypoint x="2288" y="590"/>
        <di:waypoint x="2288" y="615"/>
      </bpmndi:BPMNEdge>

    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`
