import { createSlice } from '@reduxjs/toolkit';
import API from '../../api/realEstate/listingTypes';

// ----------------------------------------------------------------------

const initialState = {
  error: false,
  listingTypes: []
};

const slice = createSlice({
  name: 'listingType',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET VENDORS
    getSuccess(state, action) {
      state.listingTypes = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { hasError, getSuccess } = slice.actions;

// ----------------------------------------------------------------------

export function getListingTypes() {
  return async (dispatch) => {
    try {
      const { data } = await API.GET();
      return dispatch(getSuccess(data));
    } catch (error) {
      dispatch(hasError('Error in fetching ListingTypes'));
      return Promise.reject(error);
    }
  };
}
