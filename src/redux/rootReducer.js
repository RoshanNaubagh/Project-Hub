import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import productReducer from './slices/product';
import vendorReducer from './slices/vendor';
import ecomCategoryReducer from './slices/ecomCategory';
import productVariantReducer from './slices/productVariant';
import userReducer from './slices/user';
import productCollectionReducer from './slices/productCollection';
import moduleReducer from './slices/module';
import moduleCategoryReducer from './slices/moduleCategory';
import realEstateCategoryReducer from './slices/realEstateCategory';
import listingTypesReducer from './slices/listingTypes';
import propertyTypesReducer from './slices/propertyTypes';
import listingDetailsReducer from './slices/listingDetails';
import agentDetailsReducer from './slices/agentDetails';
import realEstateImageReducer from './slices/realEstateImage';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout']
};

const rootReducer = combineReducers({
  product: persistReducer(productPersistConfig, productReducer),
  vendor: vendorReducer,
  ecomCategory: ecomCategoryReducer,
  productVariant: productVariantReducer,
  user: userReducer,
  productCollection: productCollectionReducer,
  module: moduleReducer,
  moduleCategory: moduleCategoryReducer,
  realEstateCategory: realEstateCategoryReducer,
  listingType: listingTypesReducer,
  propertyType: propertyTypesReducer,
  listingDetail: listingDetailsReducer,
  agentDetail: agentDetailsReducer,
  realEstateImage: realEstateImageReducer
});

export { rootPersistConfig, rootReducer };
