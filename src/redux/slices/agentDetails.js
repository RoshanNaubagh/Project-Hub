import { sum, map, filter, uniqBy, reject } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import API from '../../api/realEstate/agentDetails';
import { convertToFormData } from '../../utils/formatFormData';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  agentDetails: [],
  agentDetail: null,
  sortBy: null
};

const slice = createSlice({
  name: 'agentDetail',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getagentDetailsSuccess(state, action) {
      state.isLoading = false;

      state.agentDetails = action.payload;
    },

    // GET PRODUCT
    getagentDetailsuccess(state, action) {
      state.isLoading = false;
      state.agentDetail = action.payload;
    },

    // DELETE PRODUCT
    deleteagentDetails(state, action) {
      state.agentDetails = reject(state.agentDetails, { id: action.payload });
    },

    //  SORT & FILTER PRODUCTS
    sortByagentDetails(state, action) {
      state.sortBy = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  startLoading,
  hasError,
  getagentDetailsuccess,
  getagentDetailsSuccess,
  deleteagentDetails,
  sortByagentDetails
} = slice.actions;

// ----------------------------------------------------------------------

export function getagentDetails() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const { data } = await API.GET();
      return dispatch(slice.actions.getagentDetailsSuccess(data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

// ----------------------------------------------------------------------

export function getagentDetail(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const { data } = await API.GETBYID(id);
      return dispatch(slice.actions.getagentDetail(data[0]));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function addagentDetails(agentDetails) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    try {
      await API.POST(agentDetails);
      return null;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}
