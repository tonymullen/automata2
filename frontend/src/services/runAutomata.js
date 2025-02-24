export function stepFSA(state, index, cy, automaton,
                        setTapeNormalAcceptReject) {
    cy.nodes().forEach((n)=>{
        n.addClass('running');
        n.removeClass('active');
        n.removeClass('accepting');
        n.removeClass('rejected');
        setTapeNormalAcceptReject('normal');
    });
    cy.edges().forEach((e)=>{
        e.addClass('running');
        e.removeClass('active');
    });
    if (state === 0) {
        cy.nodes('#start').addClass('active');
    }
    if (automaton.tape.contents[index] == ' ') {
        cy.nodes().forEach((n)=>{
            n.removeClass('running');
        });
        cy.edges().forEach((e)=>{
            e.removeClass('running');
        });
        if (cy.nodes('#'+state).data().accept) {
            cy.nodes('#'+state).addClass('accepting');
            setTapeNormalAcceptReject('accepting');
        } else {
            cy.nodes('#'+state).addClass('rejected');
            setTapeNormalAcceptReject('rejected');
        }

        return ({"nextS": null,
                 "nextI": null});
    } else {
        console.log(">>"+automaton.tape.contents[index]+"<<");
        let nextEdge;
        cy.edges().forEach(e=>{
            console.log(e.data().read);
            if (e.data().read == automaton.tape.contents[index]
                    &&
                e.data().source == state) {
                    nextEdge = e
                }
            })
        nextEdge.addClass('active');
        cy.nodes('#'+state).addClass('active');

        return ({"nextS": nextEdge.data().target,
            "nextI": index+1});
    }
};

export function stepPDA() {

};

export function stepTM() {

};
