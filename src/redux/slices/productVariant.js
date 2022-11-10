import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  productVariantList: []
};

const slice = createSlice({
  name: 'productVariant',
  initialState,
  reducers: {
    updateProductVariant(state, action) {
      state.productVariantList = action.payload.slice();
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { updateProductVariant } = slice.actions;

// ----------------------------------------------------------------------

export function setProductVariantList(variants) {
  return (dispatch) => dispatch(updateProductVariant(variants));
}
