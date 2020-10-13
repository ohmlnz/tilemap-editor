// External Imports
import React, { useRef, useState } from 'react';


// Internal Imports
import {
  imageIcon,
  maximizeIcon,
  brushIcon,
  eraserIcon,
} from '../../assets/icons.js';
import './Upload.css';


// Local Variables
const MAX_UPLOAD_SIZE = 10000000;
const ACCEPTED_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];
let currentMap = {};


// Component Definition
const Upload = () => {
  const [currentTool, setCurrentTool] = useState({ type: 'brush' });
  const [isWindowExtended, setIsWindowExtended] = useState(true);
  const [hasInputedDimensions, setHasInputedDimensions] = useState(false);
  const [mapDimensions, setMapDimensions] = useState({
    width: 800,
    height: 608,
    block: 16,  
  });
  const [tilemapDimensions, setTilemapDimensions] = useState({});
  const [isMouseDown, setMouseDown] = useState(false);
  const [hasBeenCopiedToClipboard, setHasBeenCopiedToClipboard] = useState(false);
  const [imagePath, setImagePath] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPixel, setCurrentPixel] = useState({});
  const isImageAvailable = Boolean(imagePath);
  const previewCanvasRef = useRef(null);
  const tilesetCanvasRef = useRef(null);
  const [isSolidPixel, setIsSolidPixel] = useState(false);

  const selectFile = (e) => {
    const file = e.target.files[0];
    if (file.size >= MAX_UPLOAD_SIZE) {
      setErrorMessage('Your file exceeds the maximum size allowed.');
    } else if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorMessage('The type of file you have selected is not accepted.');
    } else {
      const context = previewCanvasRef.current.getContext('2d');
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const image = new Image();
        image.onload = () => {
          setTilemapDimensions({
            height: image.height,
            width: image.width,
          });
          context.drawImage(image, 0, 0);
        }
        image.src = reader.result;
        setImagePath(reader.result);
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

  const pick = (event) => {
    const context = previewCanvasRef.current.getContext('2d');
    const { posX, posY } = getIndexPosition(event);
    const index = (posY * 40) + posX;
    const data = context.getImageData(posX  * mapDimensions.block, posY  * mapDimensions.block, mapDimensions.block, mapDimensions.block);
    setCurrentPixel({ index, data, state: isSolidPixel });
    highlightSelection(context, posX, posY);
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

  const paint = (event) => {
    if (currentPixel.index === undefined) {
      return;
    }

    if (isMouseDown || event.type === 'click') {
      const context = tilesetCanvasRef.current.getContext('2d');
      const rect = tilesetCanvasRef.current.getBoundingClientRect();
      const posX = Math.floor((event.clientX - rect.left) / 16);
      const posY = Math.floor((event.clientY - rect.top) / 16);
      const mapIndex = (posY * (mapDimensions.width / mapDimensions.block)) + posX;

      if (currentTool.type === 'eraser') {
        context.clearRect(posX * mapDimensions.block, posY * mapDimensions.block, mapDimensions.block, mapDimensions.block);
      } else {
        context.putImageData(currentPixel.data, posX * mapDimensions.block, posY * mapDimensions.block);
        if (isSolidPixel) {
          context.globalAlpha=0.62;
          context.globalCompositeOperation="source-atop";
          context.fillStyle="red";
          context.fillRect(posX * 16, posY * 16, 16, 16);
        }
        currentMap[mapIndex] = {
          index: currentPixel.index,
          state: currentPixel.state,
        };
      }
    }
  };

  const setDimensions = (event) => {
    setMapDimensions({
      ...mapDimensions,
      [event.target.name]: event.target.value
    })
  }

  const submitDimensions = () => {
    if (isNaN(mapDimensions.width) || isNaN(mapDimensions.height) || isNaN(mapDimensions.block)) {
      setErrorMessage('Your input is incorrect, please enter a numerical value');
      return;
    }

    if (mapDimensions.width % mapDimensions.block !== 0 || mapDimensions.height % mapDimensions.block !== 0) {
      setErrorMessage('Your dimensions have to match with your block size');
      return;
    }

    setHasInputedDimensions(true);
  };

  const copyToClipboard = () => {
    const text = document.createElement('textarea');
    text.value = exportMap();
    document.body.appendChild(text);
    text.select();
    document.execCommand('copy');
    document.body.removeChild(text);
    setHasBeenCopiedToClipboard(true);
    setTimeout(() => {
      setHasBeenCopiedToClipboard(false);
    }, 1000);
  };
  
  const eraseCanvas = () => {
    const context = tilesetCanvasRef.current.getContext('2d');
    context.clearRect(0, 0, mapDimensions.width, mapDimensions.height);
    currentMap = {};
  };

  const setSelectionIndex = () => {}

  return (
    <div className="tilemap">
      {!hasInputedDimensions ? (
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
      ) : (
        <div className={`preview-container ${isWindowExtended ? 'extended' : 'collapsed'}`}>
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
            { isImageAvailable &&
              <div className="container-controls">
               { !isWindowExtended ? 
                <button onClick={() => setIsWindowExtended(true)}>{maximizeIcon}</button> :
                <button onClick={() => setIsWindowExtended(false)}>Minimize</button> }
            </div> }
            { currentPixel.index !== undefined && (
              <div className="pixel-information">
                <button
                  className={isSolidPixel ? 'solid' : ''}
                  onClick={() => {
                    setCurrentPixel({
                      ...currentPixel,
                      state: !isSolidPixel,
                    })
                    setIsSolidPixel((state) => !state)
                  }}
                >
                  { isWindowExtended ? 'Solid' : 'S'}
                </button>
              </div>
            )}
            { isImageAvailable &&
              <div className="tools">
                <button
                  className={currentTool.type === 'brush' ? 'selected' : ''}
                  onClick={() => setCurrentTool({ type: 'brush' })}
                >
                  {brushIcon}
                </button>
                <button
                  className={currentTool.type === 'eraser' ? 'selected' : ''}
                  onClick={() => setCurrentTool({ type: 'eraser' })}
                >
                  {eraserIcon}
                </button>
              </div> }
          </div>
        </div>      
      )}
      <div className="main-container">
        <canvas
          onMouseDown={() => setMouseDown(true)}
          onMouseUp={() => setMouseDown(false)}
          onMouseOut={() => setMouseDown(false)}
          onMouseMove={(e) => paint(e)}
          onClick={(e) => paint(e)}
          ref={tilesetCanvasRef}
          width={mapDimensions.width}
          height={hasInputedDimensions ? mapDimensions.height : '0px'}
          style={{ border: hasInputedDimensions ? '1px solid black' : ''}}
        />
      </div>
      {hasInputedDimensions && (
        <div className="image-preview-container">
          <button onClick={eraseCanvas}>
            Erase canvas
          </button>
          <button onClick={copyToClipboard}>
           { !hasBeenCopiedToClipboard ? 'Copy data to clipboard' : 'Copied!' }
          </button>
      </div> )}
    </div>
  );
};

export default Upload;

/* 
TODO:
1. Add grid
2. Add current selection
3. add rootreducer to manage state
4. refactor code (better naming conventions and better abstraction)
6. add selector on map hover
8. large selection
9. use classnames
*/