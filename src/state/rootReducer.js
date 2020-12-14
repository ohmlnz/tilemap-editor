const initialState = {
  currentMap: {},
  errorMessage: '',
  gridMode: false,
  hasInputedDimensions: false,
  isCopiedToClipboard: false,
  isMouseDown: false,
  isSidebarExtended: true,
  isSolidBlock: false,
  mapDimensions: {
    width: 800,
    height: 640,
    block: 16,
  },
  selectedBlock: {},
  selectedTool: 'brush',
  tilemapDimensions: {},
  tileset: null,
};

const rootReducer = (state, action) => {
  switch (action.type) {
    case 'RESET_MAP':
      return {
        ...state,
        currentMap: action.payload,
      }
    case 'SELECT_TOOL':
      return {
        ...state,
        selectedTool: action.payload,
      };
    case 'SET_COPIED_TO_CLIPBOARD':
      return {
        ...state,
        isCopiedToClipboard: action.payload,
      };
    case 'SET_CURRENT_MAP':
      return {
        ...state,
        currentMap: {
          ...state.currentMap,
          ...action.payload,
        }
      }
    case 'SET_GRID':
      return {
        ...state,
        gridMode: !state.gridMode
      }
    case 'SET_ERROR_MESSAGE':
      return {
        ...state,
        errorMessage: action.payload,
      };
    case 'SET_INPUTED_DIMENSIONS':
      return {
        ...state,
        hasInputedDimensions: action.payload
      };
    case 'SET_IS_SOLID_BLOCK':
      return {
        ...state,
        isSolidBlock: action.payload,
      };
    case 'SET_MAP_DIMENSIONS':
      return {
        ...state,
        mapDimensions: {
          ...state.mapDimensions,
          ...action.payload,
        }
      };
    case 'SET_MOUSE_DOWN':
      return {
        ...state,
        isMouseDown: action.payload,
      };
    case 'SET_SELECTED_BLOCK':
      return {
        ...state,
        selectedBlock: {
          ...action.payload,
        }
      };
    case 'SET_SIDEBAR_STATE':
      return {
        ...state,
        isSidebarExtended: action.payload,
      };
    case 'SET_TILEMAP_DIMENSIONS':
      return {
        ...state,
        tilemapDimensions: {
          ...action.payload,
        }
      };
    case 'SET_TILESET':
      return {
        ...state,
        tileset: action.payload,
      };
    default:
      return state;
  }
}

export {
  initialState,
  rootReducer
};