export function newAutomaton(user, type) {
    const machine = {
        'user': user,
        'machine': type,
        'title': 'Untitled',
        'alphabet': ["0","1","A","B","C","_"],
        'eles': {
            'edges': [],
            'nodes': [{
                'classes': 'startmarker',
                'position': {
                    'x': 232,
                    'y': 181
                },
                'data' : {
                    'id': 'start',
                }
            },{
                'classes': 'enode nnode',
                'position': {
                    'x': 500,
                    'y': 181
                },
                'data': {
                    'id': '0',
                    'label': '0',
                    'start': true,
                }
            }]
        },
        'tape': {
            indexPos: 0,
            position: {
                'x': -100,
                'y': 125
            },
            contents: []}
    }
    if (type=='pda') {
        machine.stack = {
            position: {
                'x': -395,
                'y': 150
            },
            contents: []
        }
    }

    return machine;
}
