import { createSlice } from '@reduxjs/toolkit';
import API from '../../api/organization/module';

const initialState = {
  isLoading: false,
  error: false,
  modulesList: [],
  module: {},
  hasMore: true,
  index: 0,
  step: 11
};

const slice = createSlice({
  name: 'module',
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

    resetForm(state) {
      state.module = {};
    },

    // GET MODULES SUCCESS
    getSuccess(state, action) {
      state.isLoading = false;
      state.modulesList = [...action.payload];
    },

    // GET COLLECTION
    getByIdSuccess(state, action) {
      state.isLoading = false;
      state.module = { ...action.payload };
    },

    // Add MODULE SUCCESS
    addSuccess(state, action) {
      state.isLoading = false;
      state.modulesList = [...state.modulesList, action.payload];
    },

    // DELETE MODULES SUCCESS
    deleteSuccess(state, action) {
      state.isLoading = false;
      state.modulesList = state.modulesList.filter((m) => m.id !== action.payload);
    },

    // UPDATE MODULE SUCCESS
    updateSuccess(state, action) {
      state.isLoading = false;
      state.modulesList = state.modulesList.map((m) => (m.id === action.payload.id ? action.payload : m));
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  startLoading,
  getSuccess,
  addSuccess,
  updateSuccess,
  deleteSuccess,
  hasError,
  getByIdSuccess,
  resetForm
} = slice.actions;

// GET Modules
export function getModules() {
  return async (dispatch) => {
    dispatch(startLoading());
    try {
      const { data } = await API.GET();
      return dispatch(getSuccess(data));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}

// POST Module
export function addModule(formData) {
  return async (dispatch) => {
    dispatch(startLoading());
    try {
      const { data } = await API.POST(formData);
      return dispatch(addSuccess(data));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}

// DELETE Module
export function deleteModule(id) {
  return async (dispatch) => {
    dispatch(startLoading());
    try {
      await API.DELETE(id);
      return dispatch(deleteSuccess(id));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}

// GET Module by Module Id
export function getModuleById(id) {
  return async (dispatch) => {
    dispatch(startLoading());
    try {
      const { data } = await API.GETBYID(id);
      return dispatch(getByIdSuccess(data));
    } catch (error) {
      return Promise.reject(new Error(error));
    }
  };
}

// PUT Module
export function updateModule(id, formData) {
  return async (dispatch) => {
    dispatch(startLoading());
    // should also pass id in the object
    formData.id = id;
    try {
      const { data } = await API.PUT(id, formData);
      return dispatch(updateSuccess(data));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}
