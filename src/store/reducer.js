import * as actionTypes from './actions';

const initialState = {
  adminSidebar: false,
  user: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SWITCH_SIDEBAR:
      return {
        ...state,
        adminSidebar: !state.adminSidebar,
      };
    case actionTypes.RESET_SIDEBAR:
      return {
        ...state,
        adminSidebar: false,
      };
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};

export default reducer;
