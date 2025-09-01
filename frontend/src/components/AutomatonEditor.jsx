import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
import edgehandles from 'cytoscape-edgehandles';
import cytoscapePopper from 'cytoscape-popper';
import AutomataDataService from '../services/automata';
// import { setup } from '../services/cytoscapeSetup'; TODO: refactor
import { generatePDF } from "../services/generatePDF";
import { newAutomaton } from '../services/newAutomaton';
import { stepFSA, stepPDA, stepTM } from '../services/runAutomata';

import AddEdgeModal from './AddEdgeModal';
import ControlButtons from './ControlButtons';
import Tape from './Tape';
import Stack from './Stack';
import stylesheet from './automata_stylesheet';
import './AutomatonEditor.css';

function AutomatonEditor({user, type}) {
  const navigate = useNavigate();
  const params = useParams();
  const cyRef = useRef(null);
  const loaded = useRef(false);

  // Initialize state for modals
  // const [isTapeModalOpen, setIsTapeModalOpen] = useState(false);
  const [isAddEdgeModalOpen, setIsAddEdgeModalOpen] = useState(false);
  const [edgeToAdd, setEdgeToAdd] = useState(null);
  const [edgeToAddPosition, setEdgeToAddPosition] = useState({x:0, y:0})
  // const openTapeModal = () => setIsTapeModalOpen(true);
  const openAddEdgeModal = () => setIsAddEdgeModalOpen(true);
  const closeAddEdgeModal = () => setIsAddEdgeModalOpen(false);

  // Establish alphabet for added edges
  const [selectableReadAlphabet, setSelectableReadAlphabet] = useState([]);
  const [selectableActionAlphabet, setSelectableActionAlphabet] = useState([]);
  const [save, setSave] = useState(null);
  const readBaseAlphabet = useRef([]);
  const actionBaseAlphabet = useRef(['→', '←'])

  // Running animation
  const [running, setRunning] = useState(false);
  // const [runState, setRunState] = useState(0);
  const [nextState, setNextState] = useState(0);
  const [nextIndex, setNextIndex] = useState(0);
  const [tapeNormalAcceptReject, setTapeNormalAcceptReject] = useState('normal');
  const [stepTrigger, setStepTrigger] = useState(0)

  // Automaton state
  const [automaton, setAutomaton] = useState({
    _id: null,
    user: null,
    machine: "",
    title: "",
    alphabet: null,
    eles: null,
    tape: {},
    created: null,
    demo: false,
    determ: false
  });

  // Retrieve Automaton from database
  useEffect(() => {
    // This shouldn't rely entirely on user. Deal with this when users
    // are fixed
    // if (user) {
      if (params.id === 'newtm') {
        setAutomaton(newAutomaton(user.googleId, 'tm'));
        setSave('create');
      } else if (params.id === 'newfsa') {
        setAutomaton(newAutomaton(user.googleId, 'fsa'));
        setSave('create');
      } else if (params.id === 'newpda') {
        setAutomaton(newAutomaton(user.googleId, 'pda'));
        setSave('create');
      } else {
        setSave('update');
        const getAutomaton = id => {
          AutomataDataService.get(id)
          .then(response => {
            setAutomaton(response.data);
          })
          .catch(e => {
            console.log(e);
          });
        }
        getAutomaton(params.id)
      }
    // }
  }, [params.id, user]);


  // Set up listeners and Cytoscape stuff
  // on automaton
  useEffect(() => {
    if (!(automaton==null)){
      cytoscape.use(cxtmenu);
      cytoscape.use(edgehandles);
      cytoscape.use(cytoscapePopper);

      if (cyRef.current) {
        // Access the Cytoscape instance
        const cy = cyRef.current;

        // TODO: refactor all of the below into
        // cytoscapeSetup

        cy.removeAllListeners();

        let tapx;
        let tapy;
        let clickstart;
        let clickstop = 0;
        let del = false;

        cy.$('#start').removeAllListeners();
        cy.$('#start').ungrabify();
        cy.$('#start').unselectify();
        cy.$('#start').position({
          x: cy.$('#0').position('x') - 32,
          y: cy.$('#0').position('y')
        });

        cy.on('drag', '#0', function (e) {
          cy.$('#start').position({
            x: cy.$('#0').position('x') - (cy.$('#0').accept ? 34 : 32),
            y: cy.$('#0').position('y')
          });
        });

        cy.on('drag', 'node', function (e) {
          var node = e.target;
          node.removeClass('toDelete');
          if (cy.edges().length > 0 && (
              (!cy.edges()[cy.edges().length-1].data().label)||
              (cy.edges()[cy.edges().length-1].data().label == ":")||
              (cy.edges()[cy.edges().length-1].data().label.match("null")))
            ) {
                 cy.remove(cy.edges()[cy.edges().length-1])
          }

          updateNodeLocation(e.target);
          removeHandle();
          closeAddEdgeModal();

          // setEdgeToAddPosition({
          //   x: cy.edges()[cy.edges().length-1].renderedMidpoint().x,
          //   y: cy.edges()[cy.edges().length-1].renderedMidpoint().y
          // });
        });

        cy.on('taphold', 'node', function (e) {
          doTapHold(e);
        });

        cy.on('tap', 'edge', function (e) {
          // console.log(e);
        });

        cy.on('taphold', 'edge', function (e) {
          doTapHold(e);
        });

        cy.on('remove', 'edge', function(e) {
          let idToDel = e.target.data().id;
          automaton.eles.edges = automaton.eles.edges.filter(
            (e) => !(e.data.id === idToDel),
          );
        });

        cy.on('vmousedown', function (e) {
          // for node placment with context menu
          clickstart = e.timeStamp;
          tapx = e.position.x;
          tapy = e.position.y;
        });

        let edgedrag = false;
        let draggedEdge;
        cy.on('vmousedown', 'edge', function (e) {
          cy.panningEnabled(false);
          draggedEdge = e.target;
          edgedrag = true;
        });

        cy.on('vmouseup', function (e) {
          edgedrag = false;
          cy.panningEnabled(true);
        });

        cy.on('vmousemove', function (e) {
          if (edgedrag) {
            var dx = e.position.x - draggedEdge.source().position().x;
            var dy = e.position.y - draggedEdge.source().position().y;
            var angle = Math.atan2(dy, dx);
            if (angle > -Math.PI / 8 || (angle >= 0 && angle <= Math.PI / 8)) {
              draggedEdge.data({ 'direction': '90deg' });
              draggedEdge.css({ 'loop-direction': '90deg' });
            } else if (angle >= -Math.PI * 3 / 8) {
              draggedEdge.data({ 'direction': '45deg' });
              draggedEdge.css({ 'loop-direction': '45deg' });
            } else if (angle >= -Math.PI * 5 / 8) {
              draggedEdge.data({ 'direction': '0deg' });
              draggedEdge.css({ 'loop-direction': '0deg' });
            } else if (angle >= -Math.PI * 7 / 8) {
              draggedEdge.data({ 'direction': '-45deg' });
              draggedEdge.css({ 'loop-direction': '-45deg' });
            } else if (angle < -Math.PI * 7 / 8 || angle > Math.PI * 7 / 8) {
              draggedEdge.data({ 'direction': '-90deg' });
              draggedEdge.css({ 'loop-direction': '-90deg' });
            }
            if (angle >= Math.PI * 5 / 8) {
              draggedEdge.data({ 'direction': '225deg' });
              draggedEdge.css({ 'loop-direction': '225deg' });
            } else if (angle >= Math.PI * 3 / 8) {
              draggedEdge.data({ 'direction': '180deg' });
              draggedEdge.css({ 'loop-direction': '180deg' });
            } else if (angle >= Math.PI / 8) {
              draggedEdge.data({ 'direction': '135deg' });
              draggedEdge.css({ 'loop-direction': '135deg' });
            }
          }
        });

        cy.on('vmouseup', function (e) {
          edgedrag = false;
          cy.panningEnabled(true);
        });

        function doMouseUp(e) {
          let element = e.target;
          let idToDel = e.target.data().id;
          clickstop = e.timeStamp - clickstart;
          // Delete a node after long mouse press
          if (clickstop >= 750 && element.hasClass('toDelete')) {
            resetElementColors();
            cy.remove('.toDelete');
            // delete corresponding model element
            automaton.eles.nodes = automaton.eles.nodes.filter(
              (n) => !(n.data.id === idToDel),
            );
            automaton.eles.edges = automaton.eles.edges.filter(
              (e) => !(e.data.id === idToDel),
            );

            var deleted = element.data('label');
            // Update labels for nodes after deletion
            if (del && element.isNode() && element.hasClass('nnode')) {
              cy.nodes('.nnode').forEach(function (n) {
                if (n.data('label') && n.data('label') > deleted) {
                  var newLabel = n.data('label') - 1;
                  n.data('label', newLabel);
                }
              });
            }
            // Update labels for submachines
            if (del && element.isNode() && element.hasClass('submachine')) {
              cy.nodes('.submachine').forEach(function (n) {
                if (n.data('label') &&
                  Number(n.data('label').replace('M', '')) > Number(deleted.replace('M', ''))) {
                  var newLabel = 'M' + String(Number(n.data('label').replace('M', '')) - 1);
                  n.data('label', newLabel);
                }
              });
            }
          }
          element.removeClass('toDelete');
          clickstart = 0;
          del = false;
        }

        function doTapHold(e) {
          // Prepare to delete a node
          const element = e.target;
          if (!(element.id() === 'start' || element.id() === '0')) {
            element.addClass('toDelete');
            del = true;
          }
        }

        cy.on('vmouseup', 'node', function (e) {
          doMouseUp(e);
        });

        cy.on('vmouseup', 'edge', function (e) {
          doMouseUp(e);
        });

        cy.on('mouseout', 'node', function (e) {
          removeHandle();
        });

        let tappedBefore;
        let tappedTimeout;
        cy.on('tap', 'node', function (e) {
          let node = e.target;
          if (tappedTimeout && tappedBefore) {
            clearTimeout(tappedTimeout);
          }
          if (tappedBefore === node) {
            node.trigger('doubleTap');
            tappedBefore = null;
          } else {
            tappedTimeout = setTimeout(function () {
              tappedBefore = null;
            }, 300);
            tappedBefore = node;
          }
        });

        function resetElementColors() {
          cy.$('node').removeClass('running');
          cy.$('edge').removeClass('running');
          cy.$('node').removeClass('active');
          cy.$('edge').removeClass('active');
          cy.$('node').removeClass('rejected');
          cy.$('node').removeClass('accepting');
        }

        function toggleAccept(node) {
          if (!node.data().accept) {
            node.data().accept = true;
            node.addClass('accept');
            resetElementColors();
            if (node.data().start) {
              cy.$('#start').position({
                x: cy.$('#start').position('x') - 2
              });
            }
          } else {
            node.data().accept = false;
            node.removeClass('accept');
            resetElementColors();
            if (node.data().start) {
              cy.$('#start').position({
                x: cy.$('#start').position('x') + 2
              });
            }
          }
          automaton.eles.nodes.forEach(n=>{
            if(n.data.id === node.data().id) {
              n.classes = node.classes();
            }
          });
        }

        if (automaton.machine !== 'tm') { // accept states only for FSAs and PDAs
          cy.on('click', 'node', function (e) {
            var node = e.target;
            if (!node.hasClass('submachine')) {
              toggleAccept(node);
            } else {
              editSubmachine(node);
            }
          });

          cy.on('doubleTap', function (e) {
            var node = e.target;
            if (!node.hasClass('submachine')) {
              toggleAccept(node);
            } else {
              editSubmachine(node);
            }
            node.trigger('mouseout');
          });
        }

        var menuDefaults = {
          menuRadius: 100, // the radius of the circular menu in pixels
          selector: 'core', // elements matching this Cytoscape.js selector will trigger cxtmenus
          commands: [ // an array of commands to list in the menu or a function that returns the array
            { // example command
              // fillColor: 'rgba(100, 100, 100, 0.75)', // optional: custom background color for item
              content: '<span class="cxtmenutext noSelect">Add<br>state</span>', // html/text content to be displayed in the menu
              select: function (e) { // a function to execute when the command is selected
                resetElementColors();
                if (e === cy) {
                    var ind = cy.nodes('.nnode').length;
                    cy.add({
                      group: 'nodes',
                      data: { label: ind,
                        weight: 75 },
                      classes: 'enode nnode',
                      position: { x: tapx, y: tapy }
                    });
                    updateAutomatonNodes(cy.nodes()[cy.nodes().length-1]);
                } // `ele` holds the reference to the active element
                // necessary hack to ensure that newly created
                // nodes don't flicker. Toggles accept state on start state
                // toggleAccept(cy.nodes().eq(1));
                // toggleAccept(cy.nodes().eq(1));
              }
            },
            { // example command
              // fillColor: 'rgba(100, 100, 100, 0.75)', // optional: custom background color for item
              content: '<span class="cxtmenutext noSelect">Add<br>comment</span>', // html/text content to be displayed in the menu
              select: function (e) { // a function to execute when the command is selected
                console.log('comment'); // `ele` holds the reference to the active element
              }
            },
            { // example command
              // fillColor: 'rgba(100, 100, 100, 0.75)', // optional: custom background color for item
              content: '<span class="cxtmenutext noSelect">Add<br>submachine</span>', // html/text content to be displayed in the menu
              select: function (e) { // a function to execute when the command is selected
                resetElementColors();
                if (e === cy) {
                  var ind = cy.nodes('.submachine').length;
                  var smlabel = 'M' + ind;
                  cy.add({
                    group: 'nodes',
                    data: { label: smlabel,
                      weight: 75 },
                    classes: 'submachine enode',
                    position: { x: tapx, y: tapy }
                  });
                  updateAutomatonNodes(cy.nodes()[cy.nodes().length-1]);
                }// `ele` holds the reference to the active element
                // necessary hack to ensure that newly created
                // nodes don't flicker. Toggles accept state on start state
                // toggleAccept(cy.nodes().eq(1));
                // toggleAccept(cy.nodes().eq(1));
              }
            }
          ], // function ( ele ){ return [  ] }, // example function for commands
          fillColor: 'rgba(47, 79, 79, 0.75)', // the background colour of the menu
          activeFillColor: 'rgba(167, 170, 138, 0.50)', // the colour used to indicate the selected command
          activePadding: 20, // additional size in pixels for the active command
          indicatorSize: 24, // the size in pixels of the pointer to the active command
          separatorWidth: 3, // the empty spacing in pixels between successive commands
          spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
          minSpotlightRadius: 24, // the minimum radius in pixels of the spotlight
          maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight
          openMenuEvents: 'cxttapstart taphold', // cytoscape events that will open the menu (space separated)
          itemColor: 'white', // the colour of text in the command's content
          itemTextShadowColor: 'black', // the text shadow colour of the command's content
          zIndex: 9999 // the z-index of the ui div
        };
        // var cxtmenuApi = cy.cxtmenu(menuDefaults);
        cy.cxtmenu(menuDefaults);

        var edgeDefaults = {
          preview: true, // whether to show added edges preview before releasing selection
          stackOrder: 4, // Controls stack order of edgehandles canvas element by setting it's z-index
          handleSize: 15, // the size of the edge handle put on nodes
          handleColor: 'rgba(167, 164, 138, 0.70)', // the colour of the handle and the line drawn from it
          handleLineType: 'ghost', // can be 'ghost' for real edge, 'straight' for a straight line, or 'draw' for a draw-as-you-go line
          handleLineWidth: 1, // width of handle line in pixels
          handleNodes: '.enode', // selector/filter function for whether edges can be made from a given node
          hoverDelay: 150, // time spend over a target node before it is considered a target selection
          cxt: false, // whether cxt events trigger edgehandles (useful on touch)
          // enabled: true, // whether to start the plugin in the enabled state
          toggleOffOnLeave: true, // whether an edge is cancelled by leaving a node (true), or whether you need to go over again to cancel (false; allows multiple edges in one pass)
          edgeType: function (sourceNode, targetNode) {
            // can return 'flat' for flat edges between nodes or 'node' for intermediate node between them
            // returning null/undefined means an edge can't be added between the two nodes
            return 'flat';
          },
          canConnect: function( sourceNode, targetNode ){
            // whether an edge can be created between source and target
            //return !sourceNode.same(targetNode); // e.g. disallow loops
            let target_not_start = false;
            if (targetNode.data()) {
              target_not_start = targetNode.data()['id'] != "start"
            }
            return (
                    // !redundant && This isn't right
                    target_not_start &&
                    sourceNode.data()['id'] != "start");
          },
          nodeLoopOffset: -50, // offset for edgeType: 'node' loops
          nodeParams: function (sourceNode, targetNode) {
            // for edges between the specified source and target
            // return element object to be passed to cy.add() for intermediary node
            return {};
          },
          edgeParams: function (sourceNode, targetNode, i) {
            // for edges between the specified source and target
            // return element object to be passed to cy.add() for edge
            // NB: i indicates edge index in case of edgeType: 'node'
            return {};
          },
          start: function (sourceNode) {
            // console.log("Starting");
            // fired when edgehandles interaction starts (drag on handle)
          },
          complete: function (sourceNode, targetNodes, addedEntities) {
            resetElementColors();
            addedEntities[0].data({ 'direction': '-90deg', 'sweep': '1rad' });
          },
          stop: function (sourceNode) {
            // fired when edgehandles interaction is stopped
            // (either complete with added edges or incomplete)
          }
        };

        let popperNode;
        let popper;
        let popperDiv;
        let started = false;

        function removeHandle() {
          if (popper){
            popper.destroy();
            popper = null;
          }

          if (popperDiv) {
            document.body.removeChild(popperDiv);
            popperDiv = null;
          }
          popperNode = null;
        }

        let eh = cy.edgehandles(edgeDefaults);

        function start() {
          eh.start(popperNode);
        }

        function stop() {
          eh.stop();
        }

        function setHandleOn(node) {
          if (node.data().id != "start") {
            if (started) { return; }

            removeHandle(); // rm old handle
            popperNode = node;

            popperDiv = document.createElement('div');
            popperDiv.classList.add('popper-handle');
            popperDiv.addEventListener('mousedown', start);
            document.body.appendChild(popperDiv);
            popper = node.popper({
              content: popperDiv,
              popper: {
                placement: 'top',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, -10],
                    },
                  },
                ]
              }
            });
          }
        }

        cy.on('mouseover', 'node', function(e) {
          setHandleOn(e.target);
        });

        cy.on('grab', 'node', function(){
          removeHandle();
        });

        cy.on('tap', function(e){
          if (e.target === cy) {
            removeHandle();
          }
        });

        cy.on('zoom pan', function(){
          // If new edge doesn't have a label, its incomplete, scrub it
          if (cy.edges().length > 0 && (
                (!cy.edges()[cy.edges().length-1].data().label)||
                (cy.edges()[cy.edges().length-1].data().label == ":")||
                (cy.edges()[cy.edges().length-1].data().label.match("null")))) {
              cy.remove(cy.edges()[cy.edges().length-1])
          }

          removeHandle();
          closeAddEdgeModal();
        });

        cy.on('ehstart', function(){
          if (cy.edges().length > 0 &&
            (!cy.edges()[cy.edges().length-1].data().label)) {
            cy.remove(cy.edges()[cy.edges().length-1])
          }
          started = true;
        });

        cy.on('ehstop', function(){
          started = false;
        });

        cy.on('ehcomplete', function(){
          setEdgeToAdd(cy.edges()[cy.edges().length-1]);
          setEdgeToAddPosition({x: cy.edges()[cy.edges().length-1].renderedMidpoint().x,
                                y: cy.edges()[cy.edges().length-1].renderedMidpoint().y});

          // Set up usable alphabet
          let unusedAlphabet;
          if (!(automaton.alphabet == null)) {
            let unusedAlphabet = automaton.alphabet.filter((c) => {
              let edgeToAdd = cy.edges()[cy.edges().length-1];
              let ret = true;
              if (!(edgeToAdd == null)) {
                automaton.eles.edges.forEach(edge => {
                  if (edge.data.source === edgeToAdd.source().data().id) {
                    if (edge.data.read === c){
                      ret = false;
                     }
                  }
                });
              }
              return ret;
            });

            setSelectableReadAlphabet(readBaseAlphabet.current.concat(unusedAlphabet));
            if (automaton.machine=='tm') {
              setSelectableActionAlphabet(actionBaseAlphabet.current.concat(automaton.alphabet));
            } else if (automaton.machine=='pda') {
              setSelectableActionAlphabet(automaton.alphabet);
            }
          }
        });
        window.addEventListener('mouseup', function(e){
          stop();
        });
      }
    }
  }, [automaton]);

  useEffect(() => {
    if (selectableReadAlphabet.length > 0) {
      openAddEdgeModal();
    }
  },[selectableReadAlphabet])

  const closeAddEdgeModalAndAddEdge = useCallback(()=>{
    closeAddEdgeModal();
  });

  const updateAutomatonEdges = useCallback((cy_edge)=>{
    let newEdge = {
      data: cy_edge.data()
    }
    setAutomaton({
      ...automaton,
      eles: {
        ...automaton.eles,
        edges: [
          ...automaton.eles.edges,
          newEdge
        ]
      }
    })
  });

  const updateAutomatonNodes = useCallback((cy_node)=>{
    let newNode = {
      data: cy_node.data(),
      position: cy_node.position(),
      classes: cy_node.classes(),
    }
    setAutomaton({
      ...automaton,
      eles: {
        ...automaton.eles,
        nodes: [
          ...automaton.eles.nodes,
          newNode
        ]
      }
    })
  });

  const clickTapeUpdate = useCallback((newTape)=>{
    setRunning(false);
    updateAutomatonTape(newTape);
  });

  const updateAutomatonTape = useCallback((newTape)=>{
    setAutomaton({
      ...automaton,
      tape: newTape
    })
  });

  const updateNodeLocation = useCallback((cy_node)=>{
    automaton.eles.nodes.forEach(n=>{
      if (n.data.id === cy_node.data().id) {
        n.position = cy_node.position();
      }
    });
  });

  const createPDF = useCallback(()=>{
    generatePDF("cy", automaton.title);
  });

  const setAutomatonTitle = useCallback((text)=>{
    setAutomaton({
      ...automaton,
      "title": text
    })
  }, [setAutomaton]);

  const saveAutomaton = useCallback(()=>{
    if (save==='update') {
      AutomataDataService.updateAutomaton(automaton)
        .then(response => {
          // setAutomaton(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    } else if (save==='create') {
      AutomataDataService.createAutomaton(automaton)
        .then(response => {
          navigate(`/automata/${response.data.response.insertedId}`);
        })
        .catch(e => {
          console.log(e);
        });
    }
  });

  const step = useCallback(()=>{
    let cy = cyRef.current;
    if (!running) {
      setRunning(true);
      updateAutomatonTape({
        ...automaton.tape,
        indexPos: 0
      })
      let nextS, nextI;
      // ({ nextS, nextI } = stepFSA(nextState, nextIndex, cy, automaton,
      //                             setTapeNormalAcceptReject));
      ({ nextS, nextI } = stepTM(nextState, nextIndex, cy, automaton));

      setNextState(nextS);
      setNextIndex(nextI);
      return Math.random() // not finished
    } else {
      updateAutomatonTape({
        ...automaton.tape,
        indexPos: nextIndex
      })
      let nextS, nextI;
      // ({ nextS, nextI } = stepFSA(nextState, nextIndex, cy, automaton,
      //                             setTapeNormalAcceptReject));
      ({ nextS, nextI } = stepTM(nextState, nextIndex, cy, automaton));


      setNextState(nextS);
      setNextIndex(nextI);
      if (nextS === null && nextI === null) {
        setRunning(false);
        setNextState(0);
        setNextIndex(0);
        return 0 // finished
      }
      return Math.random() // not finished
    }
  }, [updateAutomatonTape, setNextState, setNextIndex]);

  useEffect(()=>{
    if (stepTrigger > 0) {
      setTimeout(()=>{
        setStepTrigger(step())
      }, 1000);
    }
  },[stepTrigger]);

  const play = useCallback((speed)=>{
    if (speed==='fast') {
      console.log('fast')
    } else {
      setRunning(false);
      setStepTrigger(1);
    }
  }, [step, running]);

  return (
    <div className="automaton-editor">
      { automaton.tape.position !== undefined &&
      <Tape
        // automatonChanged={automatonChanged}
        isOpen={true}
        contents={automaton.tape.contents}
        updateTape={clickTapeUpdate}
        indexPos={automaton.tape.indexPos}
        pos={automaton.tape.position}
        normalAcceptReject={tapeNormalAcceptReject}/>
      }
      { automaton.stack && automaton.stack.position &&
      <Stack
        isOpen={automaton.machine === 'pda'}
        contents={automaton.stack.contents}
        pos={automaton.stack.position}/>
      }
      <AddEdgeModal
        isOpen={isAddEdgeModalOpen}
        onClose={closeAddEdgeModalAndAddEdge}
        edgeToAdd={edgeToAdd}
        position={edgeToAddPosition}
        updateAutomaton={updateAutomatonEdges}
        readAlphabet={selectableReadAlphabet}
        actionAlphabet={selectableActionAlphabet}
        machineType={automaton.machine}/>
      <ControlButtons
        createPDF={createPDF}
        saveAutomaton={saveAutomaton}
        automatonTitle={automaton.title}
        setAutomatonTitle={setAutomatonTitle}
        play={play}
        step={step}
        />
      <CytoscapeComponent
        id="cy"
        zoom={1}
        autounselectify={true}
        boxSelectionEnabled={false}
        elements=
        {CytoscapeComponent.normalizeElements({
          nodes: automaton.eles? automaton.eles.nodes: [],
          edges: automaton.eles? automaton.eles.edges: []
        })}
        cy={(cy) => { cyRef.current = cy }}
        style={ { height: '800px' } }
        stylesheet={stylesheet}
        />
    </div>
  );
}

export default AutomatonEditor;
