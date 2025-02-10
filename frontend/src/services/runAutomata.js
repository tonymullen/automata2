export function stepFSA(state, index, cy, automaton) {
    console.log("Step FSA");
    console.log(automaton);
    cy.nodes().forEach((n)=>{
        n.addClass('running');
    });
    cy.edges().forEach((e)=>{
        e.addClass('running');
    });

    return {nextState: 0, nextIndex: 0};
};

export function stepPDA() {

};

export function stepTM() {

};
