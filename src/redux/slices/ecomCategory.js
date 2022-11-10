import { createSlice } from '@reduxjs/toolkit';
import API from '../../api/e-commerce/ecomCategory';

// ----------------------------------------------------------------------

const initialState = {
  error: false,
  ecomCategories: []
};

const slice = createSlice({
  name: 'ecomCategory',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET VENDORS
    getSuccess(state, action) {
      state.ecomCategories = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { hasError, getSuccess } = slice.actions;

// ----------------------------------------------------------------------

export function getEcomCategories() {
  return async (dispatch) => {
    try {
      const { data } = await API.GET();
      return dispatch(getSuccess(data));
    } catch (error) {
      dispatch(hasError('Error in fetching categories'));
      return Promise.reject(error);
    }
  };
}
