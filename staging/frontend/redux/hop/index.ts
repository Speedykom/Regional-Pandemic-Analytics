const SET_HOP_CONTENT = "hop/SET_HOP_CONTENT";

// init state
const initialState: any = {
  hop: "",
};

// Actions
export const setHopAction = (payload: any) => ({
  type: SET_HOP_CONTENT,
  payload,
});


// reducer
export const hopReducer = (
  state: any = initialState,
  action: any = undefined
) => {
  switch (action.type) {
    case SET_HOP_CONTENT:
      return {
        ...state,
        hop: action.payload,
      };

    default:
      return state;
  }
};