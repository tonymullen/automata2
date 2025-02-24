// import { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import "./AddEdgeModal.css";

const AddEdgeModal = ({
  isOpen,
  onClose,
  children,
  edgeToAdd,
  position,
  updateAutomaton,
  readAlphabet,
  actionAlphabet,
  machineType
}) => {
  const [selectedValue, setSelectedValue] = useState("⌄");
  const [read, setRead] = useState(null);
  const [action, setAction] = useState(null);
  const [stackRead, setStackRead] = useState(null);
  const [stackPush, setStackPush] = useState(null);

  const finalizeEdge = useCallback(() => {
    if (machineType === 'tm') {
      edgeToAdd.data('read', read);
      edgeToAdd.data('action', action);
      edgeToAdd.data('label', read+':'+action);
      updateAutomaton(edgeToAdd);
      setSelectedValue("⌄");
      setRead(null);
      setAction(null);
    } else if (machineType === 'fsa') {
      edgeToAdd.data('read', read);
      edgeToAdd.data('label', read);
      updateAutomaton(edgeToAdd);
      setSelectedValue("⌄");
      setRead(null);
    } else if (machineType === 'pda') {
      edgeToAdd.data('read', read);
      edgeToAdd.data('stackRead', stackRead);
      edgeToAdd.data('stackPush', stackPush);
      edgeToAdd.data('label', read+":"+stackRead+":"+stackPush);
      updateAutomaton(edgeToAdd);
      setSelectedValue("⌄");
      setRead(null);
    }
  onClose();
  });

  const handleSelectRead = (event) => {
    setRead(event.target.value);
  };

  const handleSelectAction = (event) => {
    setAction(event.target.value);
  };

  const handleSelectStackRead = (event) => {
    setStackRead(event.target.value);
  };

  const handleSelectStackPush = (event) => {
    setStackPush(event.target.value);
  };

  if (!isOpen) return null;
  return (
      <div className="aem-popup"
        style={
          {
            // transform: `translate(${edgeToAdd.renderedMidpoint().x-65}px, ${edgeToAdd.renderedMidpoint().y-30}px)`
            transform: `translate(${position.x-65}px, ${position.y-30}px)`
          }}
        >
          <div className="aem-popup-content noSelect">
            <div className="edgeLabelDropdowns noSelect">
                <div className="edgeLabelDropdown noSelect">
                  <select className="edgeLabelSymbolInput edgeLabelSelect
                                    noSelect form-select-sm" aria-label=".form-select-sm
                                    example" defaultValue={selectedValue}
                                    onChange={handleSelectRead}>
                    <option value={selectedValue} disabled={true}>⌄</option>
                    {readAlphabet.map(function(item, i){
                      return <option value={item} key={i}>{item}</option>
                    })}
                  </select>
              </div>

            { machineType === 'tm' &&
              <span className="edgeLabelSymbolInput">:</span>
            }
            { machineType === 'tm' &&
              <div className="edgeLabelDropdown">
                <select className="edgeLabelSymbolInput edgeLabelSelect
                                  form-select-sm" aria-label=".form-select-sm
                                  example" defaultValue={selectedValue}
                                  onChange={handleSelectAction}>
                  <option value={selectedValue} disabled={true}>⌄</option>
                  {actionAlphabet.map(function(item, i){
                    return <option value={item} key={i}>{item}</option>
                  })}
                </select>
            </div>
            }

            { machineType === 'pda' &&
              <span className="edgeLabelSymbolInput">:</span>
            }
            { machineType === 'pda' &&
              <div className="edgeLabelDropdown">
                <select className="edgeLabelSymbolInput edgeLabelSelect
                                  form-select-sm" aria-label=".form-select-sm
                                  example" defaultValue={selectedValue}
                                  onChange={handleSelectStackRead}>
                  <option value={selectedValue} disabled={true}>⌄</option>
                  {actionAlphabet.map(function(item, i){
                    return <option value={item} key={i}>{item}</option>
                  })}
                </select>
            </div>
            }
            { machineType === 'pda' &&
              <span className="edgeLabelSymbolInput">:</span>
            }
            { machineType === 'pda' &&
              <div className="edgeLabelDropdown">
                <select className="edgeLabelSymbolInput edgeLabelSelect
                                  form-select-sm" aria-label=".form-select-sm
                                  example" defaultValue={selectedValue}
                                  onChange={handleSelectStackPush}>
                  <option value={selectedValue} disabled={true}>⌄</option>
                  {actionAlphabet.map(function(item, i){
                    return <option value={item} key={i}>{item}</option>
                  })}
                </select>
            </div>
            }



          </div>
          <Button className="add-edge-okay"
                  onClick={finalizeEdge}
                  variant="light"
                  disabled={
                    (machineType === 'tm' && (read===null||action===null))
                    ||
                    (read===null)
                    }>OK</Button>
          </div>
      </div>
  );
};

export default AddEdgeModal;
