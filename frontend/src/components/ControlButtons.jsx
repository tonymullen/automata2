import Glyphicon from '@strongdm/glyphicon'
import { EditText, EditTextarea } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import "../assets/fonts/automaton-icons/fonts/automaton-icons.ttf";
import './ControlButtons.css';


function ControlButtons({
    createPDF,
    saveAutomaton,
    automatonTitle,
    setAutomatonTitle
}) {
    const handleChange = (e, setFn) => {
        setFn(e.target.value);
    };
    return (
        <div className="controller-buttons">
            <div className="playIcons noSelect">
                <span className="playIcons noSelect">
                    <span className="auticon-controller-play" onClick={()=>{}}></span>
                    <span className="auticon-controller-fast-forward" onClick={()=>{}}></span>
                    <span className="auticon-controller-step" onClick={()=>{}}></span>
                    {/* <span className="auticon-controller-pause" onClick={()=>{}}></span>
                    <span className="auticon-controller-jump-to-start" onClick={()=>{}}></span> */}
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

            <span className="automaton_title">
            <EditText
              name="textbox1"
              className="automaton_title"
              defaultValue={automatonTitle}
              value={automatonTitle}
              inputClassName='title-box'
              onChange={(e) => handleChange(e, setAutomatonTitle)}
            />
            </span>
        </div>
    );
}

export default ControlButtons;
