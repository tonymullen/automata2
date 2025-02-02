const automaton = [
    { data: { id: 'one', label: 'Node 1' }, position: { x: 200, y: 100 } },
    { data: { id: 'two', label: 'Node 2' }, position: { x: 300, y: 200 } },
    { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
];

export default automaton;
