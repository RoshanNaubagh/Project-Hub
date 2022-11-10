import { createSlice } from '@reduxjs/toolkit';
import API from '../../api/realEstate/realEstateCategory';

// ----------------------------------------------------------------------

const initialState = {
  error: false,
  realEstateCategories: []
};

const slice = createSlice({
  name: 'realEstateCategory',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET VENDORS
    getSuccess(state, action) {
      state.realEstateCategories = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { hasError, getSuccess } = slice.actions;

// ----------------------------------------------------------------------

export function getRealEstatecategories() {
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
