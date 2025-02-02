const stylesheet = [
    {
      selector: 'node',
      style: {
        'content': 'data(label)',
        'background-color': 'white',
        'text-valign': 'center',
        'font-size' : '2em',
        'border-width': 3,
        'border-color': 'black',
        'border-style': 'solid',
        'label': 'data(label)',
        'width': 50,
        'height': 50,
        'shape': 'ellipse',
        'overlay-shape': 'ellipse'
      }
    },{
      selector: 'node#start',
      style: {
        'overlay-opacity': 0
      }
    },{
      selector: '.toDelete',
      style: {
        'overlay-color': 'red',
      }
    },
    {
      selector: 'node.submachine',
      style: {
        'content': 'data(label)',
        'text-valign': 'center',
        'color': 'black',
        'background-color': 'white',
        'border-style': 'solid',
        'border-width': '2px',
        'shape': 'rectangle',
        'overlay-shape': 'round-rectangle'
      }
    },
        {
      selector: 'edge',
      style: {
        'width': 2,
        'label': 'data(label)',
        'edge-text-rotation': 'none',
        'curve-style': 'bezier',
        'control-point-step-size': '70px',
        'target-arrow-shape': 'triangle',
        'line-color': 'black',
        'target-arrow-color': 'black',
        'color': 'white',
        'font-family' : 'system-ui',
        'font-size' : '2em',
        'text-outline-width': 2,
        'text-outline-color': '#555',
        'loop-direction': '45deg',
        'loop-sweep': '1rad'
      }
    },
    {
      selector: 'edge[direction]',
      style: {
        'loop-direction': 'data(direction)'
      }
    },
    {
      selector: 'edge[sweep]',
      style: {
        'loop-sweep': 'data(sweep)'
      }
    },

    // {
    //   selector: '.edgehandles-preview',
    //   style: {
    //     'loop-direction': '-90deg',
    //     'loop-sweep': '1rad'
    //   }
    // },

// some style for the extension

    {
      selector: '.eh-handle',
      style: {
        'background-color': 'gray',
        'width': 12,
        'height': 12,
        'shape': 'ellipse',
        'overlay-opacity': 0,
        'border-width': 12, // makes the handle easier to hit
        'border-opacity': 0
      }
    },

    {
      selector: '.eh-hover',
      style: {
        'background-color': 'gray'
      }
    },

    {
      selector: '.eh-source',
      style: {
        'border-width': 2,
        'border-color': 'gray'
      }
    },

    {
      selector: '.eh-target',
      style: {
        'border-width': 2,
        'border-color': 'gray'
      }
    },

    {
      selector: '.eh-preview, .eh-ghost-edge',
      style: {
        'background-color': 'gray',
        'line-color': 'gray',
        'target-arrow-color': 'gray',
        'source-arrow-color': 'gray'
      }
    },

    {
      selector: '.eh-ghost-edge.eh-preview-active',
      style: {
        'opacity': 0
      }
    },


    {
      selector: ':selected',
      style: {
        'background-color': 'black',
        'line-color': 'black',
        'target-arrow-color': 'black',
        'source-arrow-color': 'black'
      }
    },
    {
      selector: '.autorotate',
      style: {
        'edge-text-rotation': 'autorotate'
      }
    },
    {
      selector: '.startparent',
      style: {
        'border-width': '0',
        'background-opacity': '0',
        'content': ''
      }
    },
    {
      selector: '.startmarker',
      style: {
        'border-style': 'solid',
        'border-width': '2px',
        'content': '',
        'shape': 'polygon',
        'shape-polygon-points': '-.8, -.55,  0.2, -0,  -.8, .55'
      }
    },
    {
      selector: 'node.running',
      style: {
        'color': 'Gray',
        'background-color': 'lightGray',
        'border-color': 'Gray'
      }
    },
    {
      selector: 'node.running.active',
      style: {
        'color': 'black',
        'background-color': 'white',
        'border-color': 'black'
      }
    },
    {
      selector: 'node.rejected',
      style: {
        'border-color': 'red'
      }
    },
    {
      selector: 'node.accepting',
      style: {
        'border-color': 'LimeGreen'
      }
    },
    {
      selector: 'edge.running',
      style: {
        'line-color': 'Gray',
        'target-arrow-color': 'Gray'
      }
    },
    {
      selector: 'edge.running.active',
      style: {
        'line-color': 'Black',
        'target-arrow-color': 'Black'
      }
    },
    {
      selector: 'edge.accepting.active',
      style: {
        'line-color': 'LimeGreen',
        'target-arrow-color': 'LimeGreen'
      }
    }
  ];

export default stylesheet
