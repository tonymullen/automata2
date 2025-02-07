// import { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import "./TapeAndStack.css";

const Tape = ({
  isOpen,
  contents,
  indexPos,
  pos
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(pos);

  // Ref to store the initial mouse position when dragging starts
  const startPos = useRef({ x: 0, y: 0 });

  // Ref to store the popup element
  const popupRef = useRef(null);

  // Function to handle mouse movement while dragging
  const onMouseMove = useCallback(e => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - startPos.current.x,
        y: e.clientY - startPos.current.y,
      });
    },
    [isDragging]
  );

  // Function to handle the end of a drag event
  const onMouseUp = () => {
    setIsDragging(false);
  };

  // Function to handle the start of a drag event
  const onMouseDown = e => {
    e.stopPropagation();
    setIsDragging(true);
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

   useEffect(() => {
    console.log(contents);
  }, [position]);

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
        style={{transform: `translate(${position.x}px, ${position.y}px)`}}
        >
      <div className="float-header" onMouseDown={onMouseDown}>
      </div>
        <div className="float-content">
          {/* <div className="tape-tops">
            <div className="tape-top active"></div>
            <div className="tape-top"></div>
            <div className="tape-top"></div>
          </div> */}
          <div className="tape-contents-and-resize">
            <div className="tape-contents-window">
              <div className="tape-contents">
              { contents.map((item, i) =>
                <div className="tape-cell" key={i}>
                  <div className="tape-cell-top" key={i}></div>
                  <div className={"tape-cell-data "+ (i==0 && "tape-cell-data-left")} key={i}>
                    {item}
                  </div>
              </div>
              )}
              { Array.apply(' ', Array(30)).map((item, i) =>
                <div className="tape-cell" key={contents.length+i}>
                  <div className="tape-cell-top" key={i}></div>
                  <div className="tape-cell-data" key={contents.length+i}>
                    {item}
                  </div>
                </div>
              )}
              </div>
            </div>
            <div className="tape-resize-box">
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Tape;
