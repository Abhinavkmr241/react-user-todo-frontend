import { SHOW_LOADER, HIDE_LOADER } from "../actions";

const loaderInitialState = {
  isFullPageLoaderVisible: false,
  loaderText: "",
  isBottomLoaderVisible: false,
  blockBackGround: false,
  centerText: ""
};

export const loaderDataReducer = (
  state = loaderInitialState,
  action
) => {
  console.log('here :>> ', state);
  let newState = { ...state };
  switch (action.type) {
    case SHOW_LOADER: {
      newState = {
        isFullPageLoaderVisible: true,
        loaderText: action.payload.loaderText
      };
      break;
    }
    case HIDE_LOADER: {
      newState = {
        isFullPageLoaderVisible: false,
        loaderText: "Loading"
      };
      break;
    }
    default: {
    }
  }
  return newState;
};
