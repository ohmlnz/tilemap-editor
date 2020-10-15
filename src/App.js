// External Imports
import React, { useRef, useReducer } from 'react';


// Internal Imports
import DimensionsForm from './components/DimensionsForm/DimensionsForm';
import SideBar from './components/SideBar/SideBar';
import Tileset from './components/Tileset/Tileset';
import Export from './components/Export/Export';
import { initialState, rootReducer } from './state/rootReducer';
import './App.css';


// Local Variables
let currentMap = {};


// Component Definition
const App = () => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const { hasInputedDimensions } = state;
  const tilesetCanvasRef = useRef(null);

  return (
    <div className="tilemap">
      {!hasInputedDimensions ? (
        <DimensionsForm
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
        currentMap={currentMap}
        dispatch={dispatch}
        state={state}
        tilesetCanvasRef={tilesetCanvasRef}
      />
      <Export
        currentMap={currentMap}
        dispatch={dispatch}
        state={state}
        tilesetCanvasRef={tilesetCanvasRef}
      />
    </div>
  );
};


export default App;
