// External Imports
import React from 'react';


// Internal Imports
import {
  brushIcon,
  eraserIcon,
  maximizeIcon,
} from '../../assets/icons';
import './Tools.css';


// Component Definition
const Tools = ({ dispatch, isTilesetAvailable, state }) => {
  const {
    gridMode,
    isSidebarExtended,
    isSolidBlock,
    selectedBlock,
    selectedTool,
  } = state;

  return (
    <>
    { isTilesetAvailable &&
      <div className="container-controls">
        { !isSidebarExtended ? 
        <button onClick={() => dispatch({ payload: true, type: 'SET_SIDEBAR_STATE' })}>
          {maximizeIcon}
        </button> :
        <button onClick={() => dispatch({ payload: false, type: 'SET_SIDEBAR_STATE' })}>
          Minimize
        </button> }
    </div> }
    { selectedBlock.index !== undefined && (
      <div className="pixel-information">
        <button
          className={isSolidBlock ? 'solid' : ''}
          onClick={() => {
            dispatch({ payload: {
              ...selectedBlock,
              state: !isSolidBlock,
            },
            type: 'SET_SELECTED_BLOCK' });
            dispatch({ payload: !isSolidBlock, type: 'SET_IS_SOLID_BLOCK' })
          }}
        >
          { isSidebarExtended ? 'Solid' : 'S'}
        </button>
      </div>
    )}
    { isTilesetAvailable &&
      <div className="tools">
        <button
          className={selectedTool === 'brush' ? 'selected' : ''}
          onClick={() => dispatch({ payload: 'brush', type: 'SELECT_TOOL' })}
        >
          {brushIcon}
        </button>
        <button
          className={selectedTool === 'eraser' ? 'selected' : ''}
          onClick={() => dispatch({ payload: 'eraser', type: 'SELECT_TOOL' })}
        >
          {eraserIcon}
        </button>
        <button
          className={gridMode ? 'selected' : ''}
          onClick={() => dispatch({ type: 'SET_GRID' })}
          >
          { isSidebarExtended ? 'Grid mode' : 'Grid'}
        </button>
      </div> }
    </>
  );
}

export default Tools;