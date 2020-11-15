// External Imports
import React from 'react';


// Internal Imports
import './Export.css';


// Component Definition
const Export = ({ dispatch, state, tilesetCanvasRef }) => {
  const {
    currentMap,
    hasInputedDimensions,
    isCopiedToClipboard,
    mapDimensions,
  } = state;

  const exportMap = () => {   
    const mWidth = mapDimensions.width;
    const mHeight = mapDimensions.height;
    const bSize = mapDimensions.block;

    let string = `${mWidth} ${mHeight} `; 
    for (let i = 0; i < ((mWidth / bSize) * (mHeight / bSize)); i++) {
      string += currentMap[i] ? `${currentMap[i].index} ${currentMap[i].state ? '1' : '0'} ` : '-1 0 '; 
    }
    return string;
  };

  const copyToClipboard = () => {
    const map = exportMap();
    navigator.clipboard.writeText(map);
    dispatch({ payload: true, type: 'SET_COPIED_TO_CLIPBOARD' });
    setTimeout(() => {
      dispatch({ payload: false, type: 'SET_COPIED_TO_CLIPBOARD' });
    }, 1000);
  };
  
  const clearCanvas = () => {
    const context = tilesetCanvasRef.current.getContext('2d');
    context.clearRect(0, 0, mapDimensions.width, mapDimensions.height);
    dispatch({ payload: {}, type: 'RESET_MAP' });
  };

  return (
    hasInputedDimensions && (
      <div className="image-preview-container">
        <button onClick={clearCanvas}>
          Erase canvas
        </button>
        <button onClick={copyToClipboard}>
         { !isCopiedToClipboard ? 'Copy data to clipboard' : 'Copied!' }
        </button>
      </div>
    )
  )
}

export default Export;