import { createSlice } from '@reduxjs/toolkit';
import API from '../../api/organization/moduleCategory';

const initialState = {
  isLoading: false,
  error: false,
  moduleCategoryList: [],
  moduleCategory: {},
  hasMore: true,
  index: 0,
  step: 11
};

const slice = createSlice({
  name: 'moduleCategory',
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
      state.moduleCategory = {};
    },

    // GET MODULE CATEGORY SUCCESS
    getSuccess(state, action) {
      state.isLoading = false;
      state.moduleCategoryList = [...action.payload];
    },

    // GET COLLECTION
    getByIdSuccess(state, action) {
      state.isLoading = false;
      state.moduleCategory = { ...action.payload };
    },

    // ADD MODULE CATEGORY SUCCESS
    addSuccess(state, action) {
      state.isLoading = false;
      state.moduleCategoryList = [...state.moduleCategoryList, action.payload];
    },

    // DELETE MODULE CATEGORY SUCCESS
    deleteSuccess(state, action) {
      state.isLoading = false;
      state.moduleCategoryList = state.moduleCategoryList.filter((m) => m.id !== action.payload);
    },

    // UPDATE MODULE CATEGORY SUCCESS
    updateSuccess(state, action) {
      state.isLoading = false;
      state.moduleCategoryList = state.moduleCategoryList.map((m) => (m.id === action.payload.id ? action.payload : m));
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
  resetForm,
  getByIdSuccess
} = slice.actions;

// GET Module Categories
export function getModuleCategories() {
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

// GET Module Categories
export function getModuleCatByModuleId(moduleId) {
  return async (dispatch) => {
    dispatch(startLoading());
    try {
      const { data } = await API.GET_BY_MODULE_ID(moduleId);
      return dispatch(getSuccess(data));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}

// POST Module Category
export function addModuleCategory(formData) {
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

// DELETE Module Category
export function deleteModuleCategory(id) {
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

// GET Module Category by Id
export function getModuleCategoryById(id) {
  return async (dispatch) => {
    try {
      const { data } = await API.GETBYID(id);
      return dispatch(getByIdSuccess(data));
    } catch (error) {
      return Promise.reject(new Error(error));
    }
  };
}

// PUT Module Category
export function updateModuleCategory(id, formData) {
  return async (dispatch) => {
    dispatch(startLoading());
    try {
      const { data } = await API.PUT(id, formData);
      return dispatch(updateSuccess(data));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(new Error(error));
    }
  };
}
