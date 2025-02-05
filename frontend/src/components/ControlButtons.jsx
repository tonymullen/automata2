import Glyphicon from '@strongdm/glyphicon'
import "../assets/fonts/automaton-icons/fonts/automaton-icons.ttf";
import './ControlButtons.css';


function ControlButtons({
    createPDF,
    saveAutomaton
}) {

    return (
        <div className="controller-buttons">
            <div className="playIcons noSelect">
                <span className="playIcons noSelect">
                    <span className="auticon-controller-play" onClick={()=>{}}></span>
                    <span className="auticon-controller-fast-forward" onClick={()=>{}}></span>
                    <span className="auticon-controller-step" onClick={()=>{}}></span>
                    <span className="auticon-controller-pause" onClick={()=>{}}></span>
                    <span className="auticon-controller-jump-to-start" onClick={()=>{}}></span>
                </span>
            </div>
            <div className="saveIcon" ng-hide="vm.automaton.demo">
                <span className="saveIcon glyphicon glyphicon-cloud-upload"
                    ng-click="vm.save(true)"  ng-hide="vm.authentication.user;"
                    onClick={saveAutomaton}>
                </span>
                {/* <span className="saveIcon logInToSave" ng-show="vm.authentication.user;">
                    Log in first to<br/>enable saving
                </span> */}
            </div>

            <div className="saveIcon fileIcon">

            <span className="saveIcon fileIcon glyphicon glyphicon-save-file"
                  onClick={createPDF}></span>
            </div>

            <span className="automaton_title" ng-if="!vm.automaton.demo && vm.authentication.user">
            <a href="#"  editable-text="vm.automaton.title" my-onaftersave="vm.save(true)">
                Automaton title
            </a>
            </span>
            <span className="automaton_title" ng-if="vm.automaton.demo || !vm.authentication.user">
                Automaton title
            </span>
        </div>
    );
}

export default ControlButtons;
