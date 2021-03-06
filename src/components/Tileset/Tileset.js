// External Imports
import React, { useEffect } from 'react'


// Internal Imports
import './Tileset.css';


// Component Definition
const Tileset = ({ dispatch, state, tilesetCanvasRef }) => {
  const {
    currentMap,
    gridMode,
    hasInputedDimensions,
    isMouseDown,
    isSolidBlock,
    mapDimensions,
    selectedBlock,
    selectedTool,
  } = state;

  const paint = (event) => {
    if (selectedBlock.index === undefined) {
      return;
    }

    if (isMouseDown || event.type === 'click') {
      const context = tilesetCanvasRef.current.getContext('2d');
      const rect = tilesetCanvasRef.current.getBoundingClientRect();
      const posX = Math.floor((event.clientX - rect.left) / 16);
      const posY = Math.floor((event.clientY - rect.top) / 16);
      const mapIndex = (posY * (mapDimensions.width / mapDimensions.block)) + posX;

      if (selectedTool === 'eraser') {
        context.clearRect(posX * mapDimensions.block, posY * mapDimensions.block, mapDimensions.block, mapDimensions.block);
      } else {
        context.putImageData(selectedBlock.data, posX * mapDimensions.block, posY * mapDimensions.block);
        if (isSolidBlock) {
          context.globalAlpha=0.62;
          context.globalCompositeOperation='source-atop';
          context.fillStyle='red';
          context.fillRect(posX * 16, posY * 16, 16, 16);
        }
        dispatch({
          payload: currentMap[mapIndex] = {
            index: selectedBlock.index,
            state: selectedBlock.state,
          },
          type: 'SET_CURRENT_MAP'
        });
      }
    }
  };

  useEffect(() => {
    if (hasInputedDimensions) {
      const context = tilesetCanvasRef.current.getContext('2d');
      context.beginPath();
      for (let x = 0; x <= mapDimensions.width; x += mapDimensions.block) {
        context.moveTo(x, 0);
        context.lineTo(x, mapDimensions.height);
      }

      for (let x = 0; x <= mapDimensions.height; x += mapDimensions.block) {
        context.moveTo(0, x);
        context.lineTo(mapDimensions.width, x);
      }
      context.lineWidth = gridMode ? 1 : 2;
      context.strokeStyle = gridMode ? 'black' : 'white';
      context.stroke();
    }
  }, [hasInputedDimensions, gridMode, mapDimensions, tilesetCanvasRef]);

  return (
    <div className="main-container">
      <canvas
        onMouseDown={() => dispatch({ payload: true, type: 'SET_MOUSE_DOWN' })}
        onMouseUp={() => dispatch({ payload: false, type: 'SET_MOUSE_DOWN' })}
        onMouseOut={() => dispatch({ payload: false, type: 'SET_MOUSE_DOWN' })}
        onMouseMove={(e) => paint(e)}
        onClick={(e) => paint(e)}
        ref={tilesetCanvasRef}
        width={mapDimensions.width}
        height={hasInputedDimensions ? mapDimensions.height : '0px'}
        style={{ border: hasInputedDimensions && !gridMode ? '1px solid black' : ''}}
      />
    </div>
  );
}

export default Tileset;