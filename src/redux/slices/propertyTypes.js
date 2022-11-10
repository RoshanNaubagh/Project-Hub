import { createSlice } from '@reduxjs/toolkit';
import API from '../../api/realEstate/propertyTypes';

// ----------------------------------------------------------------------

const initialState = {
  error: false,
  propertyTypes: []
};

const slice = createSlice({
  name: 'propertyType',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET VENDORS
    getSuccess(state, action) {
      state.propertyTypes = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { hasError, getSuccess } = slice.actions;

// ----------------------------------------------------------------------

export function getPropertyTypes() {
  return async (dispatch) => {
    try {
      const { data } = await API.GET();
      return dispatch(getSuccess(data));
    } catch (error) {
      dispatch(hasError('Error in fetching PropertyTypes'));
      return Promise.reject(error);
    }
  };
}
