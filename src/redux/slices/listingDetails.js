import { sum, map, filter, uniqBy, reject } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import API from '../../api/realEstate/listingDetails';
import { convertToFormData } from '../../utils/formatFormData';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  listingDetails: [],
  listing: {},
  sortBy: null
};

const slice = createSlice({
  name: 'listingDetail',
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
    getlistingDetailsSuccess(state, action) {
      state.isLoading = false;

      state.listingDetails = [...action.payload];
    },

    // GET PRODUCT
    getByIdSuccess(state, action) {
      state.isLoading = false;
      state.listing = { ...action.payload };
    },

    updateListingDetailsSuccess(state, action) {
      state.listing = action.payload;
    },

    // DELETE PRODUCT
    deleteListingDetailsSuccess(state, action) {
      state.listingDetails = reject(state.listingDetails, { id: action.payload });
    },

    deleteSuccess(state, action) {
      state.isLoading = false;
      state.listingDetails = state.listingDetails.filter((m) => m.id !== action.payload);
    },

    //  SORT & FILTER PRODUCTS
    sortByListingdetails(state, action) {
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
  getlistingDetailsSuccess,
  deleteListingDetailsSuccess,
  getByIdSuccess,
  deleteSuccess,
  sortByListingdetails
} = slice.actions;

// ----------------------------------------------------------------------

export function getListingDetails() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const { data } = await API.GET();
      return dispatch(slice.actions.getlistingDetailsSuccess(data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

// ----------------------------------------------------------------------

export function getListingDetail(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const { data } = await API.GETBYID(id);
      return dispatch(getByIdSuccess(data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function deleteListingDetails(id) {
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

export function addlistingdetails(listingDetails) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    console.log('I am here');

    const form = {
      userId: listingDetails.userId,
      realEstateCategoryId: listingDetails.realEstateCategoryId,
      listingTypeId: listingDetails.listingTypeId,
      propertyTypeId: listingDetails.propertyTypeId,
      listingTitle: listingDetails.listingTitle,
      advertisementDescription: listingDetails.advertisementDescription,
      address: listingDetails.address,
      city: listingDetails.city,
      state: listingDetails.state,
      country: listingDetails.country,
      postCode: listingDetails.postCode,
      nearbyPublicAreas: listingDetails.nearbyPublicAreas,
      landSize: listingDetails.landSize,
      unitOfMeasure: listingDetails.unitOfMeasure,
      listingPrice: listingDetails.listingPrice,
      reservePrice: listingDetails.reservePrice,
      priceType: listingDetails.priceType,
      publishStatus: listingDetails.publishStatus,
      realEstateImages: listingDetails.realEstateImages
    };
    console.log(form);

    const formData = convertToFormData(form);

    listingDetails.proImages.forEach((file) => {
      formData.append('realEstatePics', file);
    });

    const rentalOptional = JSON.stringify({
      petAllowed: listingDetails.petAllowed,
      smoker: listingDetails.smoker,
      baby: listingDetails.baby,
      maximumTenant: listingDetails.maximumTenant,
      furnished: listingDetails.furnished,
      utilityIncluded: listingDetails.utilityIncluded,
      preferredGender: listingDetails.preferredGender
    });
    console.log(rentalOptional);

    formData.append('rentalOp', rentalOptional);

    const extraentity = JSON.stringify({
      noofBedroom: listingDetails.noofBedroom,
      noofBathroom: listingDetails.noofBathroom,
      garage: listingDetails.garage,
      floorArea: listingDetails.floorArea,
      availableFrom: listingDetails.availableFrom
    });
    console.log(extraentity);
    formData.append('exEntity', extraentity);

    const agentDetails = JSON.stringify({
      agencyName: listingDetails.agencyName,
      contactName: listingDetails.contactName,
      contactNumber: listingDetails.contactNumber,
      email: listingDetails.email
    });
    console.log(agentDetails);

    formData.append('ageDetails', agentDetails);

    try {
      console.log(form);
      console.log(formData);

      await API.POST(formData);

      return null;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function updateAgentDetails(id, listingDetails) {
  return async (dispatch) => {
    dispatch(startLoading());

    // console.log(listingDetails);
    console.log(id);

    const form = {
      userId: listingDetails.userId,
      realEstateCategoryId: listingDetails.realEstateCategoryId,
      listingTypeId: listingDetails.listingTypeId,
      propertyTypeId: listingDetails.propertyTypeId,
      listingTitle: listingDetails.listingTitle,
      advertisementDescription: listingDetails.advertisementDescription,
      address: listingDetails.address,
      city: listingDetails.city,
      state: listingDetails.state,
      country: listingDetails.country,
      postCode: listingDetails.postCode,
      nearbyPublicAreas: listingDetails.nearbyPublicAreas,
      landSize: listingDetails.landSize,
      unitOfMeasure: listingDetails.unitOfMeasure,
      listingPrice: listingDetails.listingPrice,
      reservePrice: listingDetails.reservePrice,
      priceType: listingDetails.priceType,
      realEstateImages: listingDetails.realEstateImages
    };

    const formData = convertToFormData(form);
    formData.append('id', id);

    listingDetails.proImages.forEach((file) => {
      formData.append('realEstatePics', file);
    });

    const rentalOptional = JSON.stringify({
      petAllowed: listingDetails.petAllowed,
      smoker: listingDetails.smoker,
      baby: listingDetails.baby,
      maximumTenant: listingDetails.maximumTenant,
      furnished: listingDetails.furnished,
      utilityIncluded: listingDetails.utilityIncluded,
      preferredGender: listingDetails.preferredGender
    });

    formData.append('rentalOp', rentalOptional);

    const extraentity = JSON.stringify({
      noofBedroom: listingDetails.noofBedroom,
      noofBathroom: listingDetails.noofBathroom,
      garage: listingDetails.garage,
      floorArea: listingDetails.floorArea,
      availableFrom: listingDetails.availableFrom
    });
    formData.append('exEntity', extraentity);

    const agentDetails = JSON.stringify({
      agencyName: listingDetails.agencyName,
      contactName: listingDetails.contactName,
      contactNumber: listingDetails.contactNumber,
      email: listingDetails.email
    });

    formData.append('ageDetails', agentDetails);

    try {
      // console.log(form);
      console.log(formData);

      await API.PUT(id, formData);

      return null;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function deleteRealEstateImage(id, image) {
  return async (dispatch) => {
    try {
      const { data } = await API.DELETE_PROMO_IMAGE(id, image);
      return dispatch(slice.actions.updateListingDetailsSuccess(data));
    } catch (error) {
      if (error.status !== 404) {
        dispatch(slice.actions.hasError(error.title));
        return Promise.reject(error);
      }
      return null;
    }
  };
}
