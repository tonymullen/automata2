import "../assets/fonts/automaton-icons/fonts/automaton-icons.ttf";
import './ControlButtons.css';


function ControlButtons() {

    return (
        <div className="controller-buttons">
            <div className="playIcons noSelect">
                <span className="playIcons noSelect">
                    <span className="auticon-controller-play" onClick="vm.play('default')"></span>
                    <span className="auticon-controller-fast-forward" onClick="vm.play('fast')"></span>
                    <span className="auticon-controller-step" onClick="vm.play('step')"></span>
                    <span className="auticon-controller-pause" onClick="vm.play('pause')"></span>
                    <span className="auticon-controller-jump-to-start" onClick="vm.play('stop')"></span>
                </span>
            </div>
            <div className="saveIcon" ng-hide="vm.automaton.demo">
                <span className="saveIcon glyphicon glyphicon-cloud-upload"
                    ng-click="vm.save(true)"  ng-show="vm.authentication.user;">
                </span>
                <span className="saveIcon logInToSave" ng-hide="vm.authentication.user;">
                    Log in first to<br/>enable saving
                </span>
            </div>

            <div className="saveIcon fileIcon">
            <span className="saveIcon fileIcon glyphicon glyphicon-save-file"
                  ng-click="vm.fileExport(true)"></span>
            </div>

            <span className="automaton_title" ng-if="!vm.automaton.demo && vm.authentication.user">
            <a href="#"  editable-text="vm.automaton.title" onaftersave="vm.save(true)">
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
