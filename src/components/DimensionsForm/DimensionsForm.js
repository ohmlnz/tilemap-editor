// External Imports
import React from 'react';


// Internal Imports
import './DimensionsForm.css';


// Component Definition
const DimensionsForm = ({ dispatch, state }) => {
  const { errorMessage, mapDimensions } = state;

  const setDimensions = (event) => {
    dispatch({ payload: {
      [event.target.name]: event.target.value,
    }, type: 'SET_MAP_DIMENSIONS' })
  }

  // TODO: should be able to validate form when pressing enter
  const submitDimensions = () => {
    if (isNaN(mapDimensions.width) || isNaN(mapDimensions.height) || isNaN(mapDimensions.block)) {
      dispatch({ payload: 'Your input is incorrect, please enter a numerical value', type: 'SET_ERROR_MESSAGE' })
      return;
    } else if (mapDimensions.width % mapDimensions.block !== 0 || mapDimensions.height % mapDimensions.block !== 0) {
      dispatch({ payload: 'Your dimensions have to match with your block size', type: 'SET_ERROR_MESSAGE' })
      return;
    } else {
      dispatch({ payload: true, type: 'SET_INPUTED_DIMENSIONS' });
    }
  };

  return (
    <div className="tilemap-information">
      <h1>What are the dimensions of your map (in pixels)?</h1>
      <input
        type="text"
        placeholder="Width"
        onChange={setDimensions}
        name="width"
        value={mapDimensions.width}
      />
      <input
        type="text"
        placeholder="Height"
        onChange={setDimensions}
        name="height"
        value={mapDimensions.height}
      />
      <br />
      <input
        type="text"
        placeholder="Block size"
        onChange={setDimensions}
        name="block"
        value={mapDimensions.block}
      />
      <button onClick={submitDimensions}>Submit</button>
      <div className="error-message">{errorMessage}</div>
    </div>
  );
};

export default DimensionsForm;