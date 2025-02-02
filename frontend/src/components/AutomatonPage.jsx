import AutomatonEditor from './AutomatonEditor';


function AutomatonPage() {
    let params = useParams();

    // Retrieve Automaton from database
    useEffect(() => {
        const getAutomaton = id => {
        AutomataDataService.get(id)
        .then(response => {
            setAutomaton(response.data);
            // console.log(response.data.eles);
        })
        .catch(e => {
            console.log(e);
        });
        }
        getAutomaton(params.id)
    }, [params.id]);

    return (
        <div>
        <AutomatonEditor automaton={automaton}/>
        </div>
    );
}

export default AutomatonEditor;
