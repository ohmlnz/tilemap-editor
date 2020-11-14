// External Imports
import React, { useRef } from 'react';


// Internal Imports
import './SideBar.css';
import { imageIcon } from '../../assets/icons';
import Tools from './Tools';


// Local Constants
const ACCEPTED_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];
const MAX_UPLOAD_SIZE = 10000000;


// Component Definition
const SideBar = ({ dispatch, state }) => {
  const {
    isSidebarExtended,
    isSolidBlock,
    mapDimensions,
    tilemapDimensions,
    tileset,
  } = state;
  const isTilesetAvailable = Boolean(tileset);
  const previewCanvasRef = useRef(null);

  // TODO: image selection should happen within Setup
  const selectFile = (e) => {
    const file = e.target.files[0];
    if (file.size >= MAX_UPLOAD_SIZE) {
      dispatch({ payload: 'Your file exceeds the maximum size allowed.', type: 'SET_ERROR_MESSAGE' })
    } else if (!ACCEPTED_TYPES.includes(file.type)) {
      dispatch({ payload: 'The type of file you have selected is not accepted.', type: 'SET_ERROR_MESSAGE' })
    } else {
      const context = previewCanvasRef.current.getContext('2d');
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const image = new Image();
        image.onload = () => {
          dispatch({ payload: {
            height: image.height,
            width: image.width,
          }, type: 'SET_TILEMAP_DIMENSIONS' });
          context.drawImage(image, 0, 0);
        }
        image.src = reader.result;
        dispatch({ payload: image, type: 'SET_TILESET' });
      });
      reader.readAsDataURL(file);
    }
  };

  const getIndexPosition = (event) => {
    const rect = previewCanvasRef.current.getBoundingClientRect();
    const posX = Math.floor((event.clientX - rect.left) / mapDimensions.block);
    const posY = Math.floor((event.clientY - rect.top) / mapDimensions.block);
    return { posX, posY };
  };

  const highlightSelection = (context, posX, posY) => {
    let x = posX * 16;
    let y = posY * 16;

    context.clearRect(0, 0, tilemapDimensions.width, tilemapDimensions.height);
    context.drawImage(tileset, 0, 0);
    context.beginPath();
    context.moveTo(x, y);
    y = y + 16;
    context.lineTo(x, y);
    x = x + 16;
    context.lineTo(x, y);
    y = y - 16;
    context.lineTo(x, y);
    x = x - 16;
    context.lineTo(x, y);
    context.lineWidth = 2;
    context.strokeStyle = "#FF0000";
    context.stroke();
  };

  const pick = (event) => {
    const context = previewCanvasRef.current.getContext('2d');
    const { posX, posY } = getIndexPosition(event);
    const index = (posY * 40) + posX;
    context.clearRect(0, 0, tilemapDimensions.width, tilemapDimensions.height);
    context.drawImage(tileset, 0, 0);
    const data = context.getImageData(posX  * mapDimensions.block, posY  * mapDimensions.block, mapDimensions.block, mapDimensions.block);
    dispatch({ payload: {
      index,
      data,
      state: isSolidBlock,
    },
    type: 'SET_SELECTED_BLOCK' });
    highlightSelection(context, posX, posY);
  };

  const setSelectionIndex = () => {}

  return (
    <div className={`preview-container ${isSidebarExtended ? 'extended' : 'collapsed'}`}>
      {!isTilesetAvailable && 
      <div className="content-selection-container">
        <div className="image-upload">
          <label htmlFor="image_to_upload">{imageIcon} Select a tilemap to upload</label>
          <input
            className="file-selection"
            id="image_to_upload"
            name="image_to_upload"
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            onChange={selectFile}
          />
        </div>
      </div> }
      <div className="preview-tilemap">
        <canvas
          ref={previewCanvasRef}
          onClick={pick}
          onMouseDown={(e) => setSelectionIndex({ down: getIndexPosition(e)})}
          onMouseUp={(e) => setSelectionIndex({ up: getIndexPosition(e)})}
          width={tilemapDimensions.width}
          height={tilemapDimensions.height}
        />
        <Tools
          dispatch={dispatch}
          isTilesetAvailable={isTilesetAvailable}
          state={state}
        />
      </div>
    </div>
  );
}

export default SideBar;