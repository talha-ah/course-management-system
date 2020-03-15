import * as actionTypes from './actions';

const initialState = {
  adminSidebar: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SWITCH_SIDEBAR:
      return {
        ...state,
        adminSidebar: !state.adminSidebar
      };

    default:
      return state;
  }
};

export default reducer;
