// External Imports
import React, { useRef, useReducer } from 'react';


// Internal Imports
import './App.css';
import { initialState, rootReducer } from './state/rootReducer';
import Export from './components/Export/Export';
import Setup from './components/Setup/Setup';
import SideBar from './components/SideBar/SideBar';
import Tileset from './components/Tileset/Tileset';


// Component Definition
const App = () => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const { hasInputedDimensions } = state;
  const tilesetCanvasRef = useRef(null);

  return (
    <div className="tilemap">
      {!hasInputedDimensions ? (
        <Setup
          dispatch={dispatch}
          state={state}
        />
      ) : (
        <SideBar
          dispatch={dispatch}
          state={state}
        />      
      )}
      <Tileset 
        dispatch={dispatch}
        state={state}
        tilesetCanvasRef={tilesetCanvasRef}
      />
      <Export
        dispatch={dispatch}
        state={state}
        tilesetCanvasRef={tilesetCanvasRef}
      />
    </div>
  );
};


export default App;
