// External Imports
import React, { useRef } from 'react';


// Internal Imports
import Tools from './Tools';
import { imageIcon } from '../../assets/icons';
import './SideBar.css';


// Local Constants
const MAX_UPLOAD_SIZE = 10000000;
const ACCEPTED_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];


// Component Definition
const SideBar = ({ dispatch, state }) => {
  const {
    imagePath,
    isSidebarExtended,
    isSolidBlock,
    mapDimensions,
    tilemapDimensions,
  } = state;
  const isImageAvailable = Boolean(imagePath);
  const previewCanvasRef = useRef(null);

  // TODO: image selection should happen within DimensionForm (which will then have to be renamed, like Setup?)
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
          }, type: 'SET_TILEMAP_DIMENSIONS'});
          context.drawImage(image, 0, 0);
        }
        image.src = reader.result;
        dispatch({ payload: reader.result, type: 'SET_IMAGE_PATH' });
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

    // TODO: save data to avoid unecessary re-loading
    context.clearRect(0, 0, tilemapDimensions.width, tilemapDimensions.height);
    const image = new Image();
    image.onload = () => {
      context.drawImage(image, 0, 0);
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
    }
    image.src = imagePath;
  };

  const pick = (event) => {
    const context = previewCanvasRef.current.getContext('2d');
    const { posX, posY } = getIndexPosition(event);
    const index = (posY * 40) + posX;
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
      {!isImageAvailable && 
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
          isImageAvailable={isImageAvailable}
          state={state}
        />
      </div>
    </div>
  );
}

export default SideBar;