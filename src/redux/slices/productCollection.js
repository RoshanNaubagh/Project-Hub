import { createSlice } from '@reduxjs/toolkit';
import API from '../../api/e-commerce/productCollection';
import { convertToFormData } from '../../utils/formatFormData';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  productCollections: [],
  productCollection: {},
  sortBy: null
};

const slice = createSlice({
  name: 'productCollection',
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

    // GET COLLECTIONS
    getSuccess(state, action) {
      state.isLoading = false;
      state.productCollections = action.payload;
    },

    // GET COLLECTION
    getByIdSuccess(state, action) {
      state.isLoading = false;
      state.productCollection = { ...action.payload };
    },

    // PUT COLLECTION
    updateSuccess(state) {
      state.isLoading = false;
      state.productCollection = {};
    },

    // PUT COLLECTION STATUS
    updateStatusSuccess(state, action) {
      const filteredColls = state.productCollections.filter((c) => c.id !== action.payload.id);
      state.productCollections = [...filteredColls, action.payload];
    },

    deleteSuccess(state, action) {
      state.isLoading = false;
      state.productCollections = state.productCollections.filter((c) => c.id !== action.payload);
    },

    // DELETE COLLECTION IMAGE
    deleteImgSuccess(state, action) {
      state.isLoading = false;
      state.productCollection = { ...state.productCollection, collectionImage: action.payload.collectionImage };
    },

    // SORT & FILTER PRODUCTS
    sortByProducts(state, action) {
      state.sortBy = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  hasError,
  startLoading,
  getSuccess,
  getByIdSuccess,
  updateStatusSuccess,
  deleteSuccess,
  deleteImgSuccess,
  updateSuccess
} = slice.actions;

// ----------------------------------------------------------------------

export function getProductCollections() {
  return async (dispatch) => {
    dispatch(startLoading());

    try {
      const { data } = await API.GET();
      return dispatch(getSuccess(data));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(error);
    }
  };
}

export function getProductCollectionById(id) {
  return async (dispatch) => {
    dispatch(startLoading());

    try {
      const { data } = await API.GETBYID(id);
      return dispatch(getByIdSuccess(data));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(error);
    }
  };
}

export function resetProductCollectionState() {
  return async (dispatch) => {
    dispatch(updateSuccess());
  };
}

export function addProductCollection(form) {
  return async (dispatch) => {
    dispatch(startLoading());
    const formData = convertToFormData(form);
    console.log(formData);

    try {
      await API.POST(formData);
      return null;
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(error);
    }
  };
}

export function updateProductCollection(id, form) {
  return async (dispatch) => {
    dispatch(startLoading());
    const formData = convertToFormData(form);
    formData.append('id', id);
    try {
      await API.PUT(id, formData);
      return dispatch(updateSuccess());
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(error);
    }
  };
}

export function updateCollectionStatus(id, status) {
  return async (dispatch) => {
    dispatch(startLoading());

    try {
      const { data } = await API.UPDATE_STATUS(id, { value: status });
      return dispatch(updateStatusSuccess(data));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(error);
    }
  };
}

export function deleteCollection(id) {
  return async (dispatch) => {
    dispatch(startLoading());

    try {
      await API.DELETE(id);
      return dispatch(deleteSuccess(id));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(error);
    }
  };
}

export function deleteCollectionImage(id) {
  return async (dispatch) => {
    dispatch(startLoading());

    try {
      const { data } = await API.DELETE_COL_IMG(id);
      return dispatch(deleteImgSuccess(data));
    } catch (error) {
      dispatch(hasError(error));
      return Promise.reject(error);
    }
  };
}
