import { createSlice } from '@reduxjs/toolkit';
import API from '../../api/realEstate/realEstateImage';

// ----------------------------------------------------------------------

const initialState = {
  error: false,
  realEstateImages: []
};

const slice = createSlice({
  name: 'realEstateImage',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET VENDORS
    getSuccess(state, action) {
      state.realEstateImages = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { hasError, getSuccess } = slice.actions;

// ----------------------------------------------------------------------

export function getRealEstateImages(id) {
  return async (dispatch) => {
    try {
      const { data } = await API.GET(id);
      return dispatch(getSuccess(data));
    } catch (error) {
      dispatch(hasError('Error in fetching categories'));
      return Promise.reject(error);
    }
  };
}
