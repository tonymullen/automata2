import { useCallback, useEffect, useRef, useState } from "react";
import "./TapeAndStack.css";

const Tape = ({
  isOpen,
  contents,
  indexPos,
  pos
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState(pos);
  const [indPos, setIndPos] = useState(indexPos);
  const [width, setWidth] = useState(750);

  // Ref to store the initial mouse position when dragging starts
  const startPos = useRef({ x: 0, y: 0 });

  // Ref to store the popup element
  const popupRef = useRef(null);

  // Function to handle mouse movement while dragging
  const onMouseMove = useCallback(e => {
      if (isDragging) {
        console.log(position);
        setPosition({
          x: e.clientX - startPos.current.x,
          y: e.clientY - startPos.current.y,
        });
      } else if (isResizing) {
        setWidth(width + (e.clientX-startPos.current.x+50));
        setPosition({
          x: position.x + (e.clientX-startPos.current.x+50)/2,
          y: position.y
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
            width: `${width}px`
                }}
        >
      <div className="float-header" onMouseDown={onMouseDown}>
      </div>
        <div className="float-content">
          <div className="tape-contents-and-resize">
            <div className="tape-contents-window" style={{width: `${width-30}px`}}>
              <div className="tape-contents">

              <div className="tape-cell"
                     key={'cell'+0} onClick={()=>{setIndPos(0)}}>
                  <div className={"tape-cell-top " +
                                  (0==indPos && "active")}
                      key={'top'+0}></div>
                  <div className={
                                  ("tape-cell-data tape-cell-data-left " +
                                  (0==indPos && "active"))
                                }
                       key={'tapeItem'+0}>
                    {contents[0]}
                  </div>
              </div>

              { contents.slice(1).map((item, i) =>
                <div className="tape-cell"
                     key={'cell'+i+1} onClick={()=>{setIndPos(i+1)}}>
                  <div className={"tape-cell-top " +
                                  ((i+1)==indPos && "active")}
                      key={'top'+i+1}></div>
                  <div className={
                                  ("tape-cell-data" + ' ' +
                                  ((i+1)==indPos && "active"))
                                }
                       key={'tapeItem'+i+1}>
                    {item}
                  </div>
              </div>
              )}

              { Array.apply(' ', Array(33)).map((item, i) =>
                <div className="tape-cell" key={'cell'+contents.length+i}
                  onClick={()=>{setIndPos(contents.length+i)}}>
                  <div className={"tape-cell-top " +
                                  ((contents.length+i)==indPos && "active")}
                    key={'top'+contents.length+i}></div>
                  <div className={"tape-cell-data " +
                                  ((contents.length+i)==indPos && "active")}
                    key={'tapeItem'+contents.length+i}>
                    {item}
                  </div>
                </div>
              )}
              </div>
            </div>
            <div className="tape-resize-box" onMouseDown={onResizeMouseDown}>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Tape;
