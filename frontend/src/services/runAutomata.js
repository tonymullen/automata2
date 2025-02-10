export function stepFSA(state, index, cy, automaton) {
    cy.nodes().forEach((n)=>{
        n.addClass('running');
    });
    cy.edges().forEach((e)=>{
        e.addClass('running');
    });
    if (state === 0) {
        cy.nodes('#start').addClass('active');
    }

    let nextEdge;
    cy.edges().forEach(e=>{
        console.log("Source state:")
        console.log(e.data().source);
        console.log(state);
        console.log("Read val")
        console.log(e.data().read);
        console.log(automaton.tape.contents[index]);
        console.log("\n");
        if (e.data().read == automaton.tape.contents[index]
                &&
            e.data().source == state) {
                console.log("Match")
                nextEdge = e
            }
        })

    cy.nodes('#'+state).addClass('active');

    return ({"nextS": nextEdge.data().target,
            "nextI": index+1});
};

export function stepPDA() {

};

export function stepTM() {

};
