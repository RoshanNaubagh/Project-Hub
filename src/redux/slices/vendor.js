import { createSlice } from '@reduxjs/toolkit';
import API from '../../api/e-commerce/vendor';

// ----------------------------------------------------------------------

const initialState = {
  error: false,
  vendors: []
};

const slice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET VENDORS
    getSuccess(state, action) {
      state.vendors = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { hasError, getSuccess } = slice.actions;

// ----------------------------------------------------------------------

export function getVendors() {
  return async (dispatch) => {
    try {
      const { data } = await API.GET();
      return dispatch(getSuccess(data));
    } catch (error) {
      dispatch(hasError('Error in fetching vendors'));
      return Promise.reject(error);
    }
  };
}
