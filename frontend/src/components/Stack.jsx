import { useCallback, useEffect, useRef, useState } from "react";
import "./TapeAndStack.css";

const Stack = ({
  isOpen,
  contents,
  pos
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState(pos);
  const [height, setHeight] = useState(350);

  // Ref to store the initial mouse position when dragging starts
  const startPos = useRef({ x: 0, y: 0 });

  // Ref to store the popup element
  const popupRef = useRef(null);

  // Function to handle mouse movement while dragging
  const onMouseMove = useCallback(e => {
      if (isDragging) {
        setPosition({
          x: e.clientX - startPos.current.x,
          y: e.clientY - startPos.current.y,
        });
      } else if (isResizing) {
        setHeight(height + (e.clientY-startPos.current.y+20));
        setPosition({
          x: position.x,
          y: position.y + (e.clientY-startPos.current.y+20)/2,
        });
      } else {
        return;
      }},
    [isDragging, isResizing]
  );

  // Function to handle the end of a drag event
  const onMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Function to handle the start of a drag event
  const onMouseDown = e => {
    e.stopPropagation();
    setIsDragging(true);
    startPos.current = {
      x: e.clientX - position.x, y: e.clientY - position.y
    };
  };

  const onResizeMouseDown = e => {
    e.stopPropagation();
    setIsResizing(true);
    startPos.current = {
      x: e.clientX - position.x, y: e.clientY - position.y
    };
  };

  // Effect to add and clean up event listeners for dragging
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove]);

  if (!isOpen) return null;
  return (
    <div>
    <div className="float-overlay">
      <div className="float"
        ref={popupRef}
        onClick={e => {
          console.log("Click");
          e.stopPropagation()
        }} //to prevent event delegation to the overlay
        style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            height: `${height}px`
                }}
        >
      <div className="stack-float-header" onMouseDown={onMouseDown}>
      </div>
        <div className="float-content">
          <div className="stack-contents-and-resize">
            <div className="stack-contents-window" style={{height: `${height-30}px`}}>
              <div className="stack-contents">
              { contents.map((item, i) =>
                  <div className={
                                  ("stack-cell-data" + ' ' +
                                  (i==0 && "stack-cell-data-left "))
                                }
                       key={'tapeItem'+i}>
                    {item}
              </div>
              )}
              { Array.apply(' ', Array(15)).map((item, i) =>
                <div className="stack-cell" key={'cell'+contents.length+i}>
                  <div className="stack-cell-top" key={'top'+contents.length+i}></div>
                  <div className="stack-cell-data" key={'tapeItem'+contents.length+i}>
                    {item}
                  </div>
                </div>
              )}
              </div>
            </div>
            <div className="stack-resize-box" onMouseDown={onResizeMouseDown}>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Stack;
