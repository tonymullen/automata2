import { useCallback, useEffect, useRef, useState } from "react";
import { EditText, EditTextarea } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import "./TapeAndStack.css";

const Tape = ({
  //automatonChanged,
  isOpen,
  contents,
  updateTape,
  indexPos,
  pos,
  normalAcceptReject
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState(pos);
  // const [indPos, setIndPos] = useState(indexPos);
  const [width, setWidth] = useState(750);

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

  const setIndPos = useCallback(i => {
    updateTape({
      "indexPos": i,
      "position": pos,
      "contents": contents
    });
  });

  // Effect to add and clean up event listeners for dragging
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove]);


  // const handleFocus = useCallback(e => {
  //   console.log(e);
  // });

  const handleChange = (e, ind) => {
      let newContents = contents;
      newContents[ind] = e.target.value;
      let newTape = {
        "indexPos": indexPos,
        "position": position,
        "contents": newContents
      }
      updateTape(newTape);
  };

  if (!isOpen) return null;
  return (
    <div>
    <div className="float-overlay">
      <div className="float"
        ref={popupRef}
        tabIndex={0}
        onClick={e => {
          e.stopPropagation()
        }} //to prevent event delegation to the overlay
        onKeyDown={e => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            setIndPos(indexPos+1)
          }
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (indexPos > 0) {
              setIndPos(indexPos-1)
            }
          }
        }}
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
                     key={'cell'+0}
                     onClick={()=>{setIndPos(0)}}>
                  <div className={"tape-cell-top " +
                                  (0==indexPos && "active")}
                      key={'top'+0}></div>

                  <EditText
                    name={"textbox"+0}
                    className={("tape-cell-data tape-cell-data-left " +
                                normalAcceptReject + ' ' +
                                (0==indexPos && "active"))
                              }
                    defaultValue={contents[0]}
                    value={contents[0]}
                    inputClassName={("tape-cell-entry " +
                                    (0==indexPos && "active"))
                                  }
                    onChange={(e) => handleChange(e, 0)}
                  />
              </div>

              { contents.slice(1).map((item, i) =>
                <div className="tape-cell"
                     key={'cell'+i+1} onClick={
                        (e)=>{
                          setIndPos(i+1);
                        }
                      }>
                  <div className={"tape-cell-top " +
                                  ((i+1)==indexPos && "active")}
                      key={'top'+i+1}></div>

                  <EditText
                    name={"textbox"+i+1}
                    className={("tape-cell-data " + normalAcceptReject + ' ' +
                      ((i+1)==indexPos && "active"))
                     }
                    defaultValue={item}
                    value={item}
                    inputClassName={("tape-cell-entry " +
                       ((i+1)==indexPos && "active"))
                      }
                    onChange={(e) => handleChange(e, i+1)}
                  />
              </div>
              )}

              { Array.apply('', Array(24)).map((item, i) =>
                <div className="tape-cell" key={'cell'+contents.length+i}
                  onClick={()=>{setIndPos(contents.length+i)}}>
                  <div className={"tape-cell-top " +
                                  ((contents.length+i)==indexPos && "active")}
                    key={'top'+contents.length+i}></div>

                  <EditText
                    name={"textbox"+contents.length+i}
                    className={("tape-cell-data " +
                      ((contents.length+i)==indexPos && "active"))
                     }
                    defaultValue={item}
                    value={item}
                    inputClassName={("tape-cell-entry " +
                      ((contents.length+i)==indexPos && "active"))
                     }
                    onChange={(e) => handleChange(e, contents.length+i)}
                  />
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
