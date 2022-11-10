import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';

import { useCallback, useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

// material
import { LoadingButton, MobileDatePicker } from '@material-ui/lab';
import { styled } from '@material-ui/core/styles';
import {
  Card,
  Grid,
  Chip,
  Stack,
  Button,
  Switch,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Autocomplete,
  FormHelperText,
  InputAdornment,
  FormControlLabel
} from '@material-ui/core';
// utils
import fakeRequest from '../../../utils/fakeRequest';
//
import { QuillEditor } from '../../editor';
import { UploadMultiFile } from '../../upload';
import { SERVER_URL } from '../../../utils/serverUrl';

//
import countries from '../user/countries';
import { getRealEstatecategories } from '../../../redux/slices/realEstateCategory';
import { getPropertyTypes } from '../../../redux/slices/propertyTypes';
import { getListingTypes } from '../../../redux/slices/listingTypes';
// eslint-disable-next-line import/named
import { addlistingdetails, updateAgentDetails, deleteRealEstateImage } from '../../../redux/slices/listingDetails';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

const priceTypes = [
  {
    id: 1,
    name: 'Per Month'
  },
  {
    id: 2,
    name: 'Per Year'
  }
];

const numberofBedrooms = [
  { id: 1, value: 1 },
  { id: 2, value: 2 },
  { id: 3, value: 3 },
  { id: 4, value: 4 }
];

const garageTypes = [
  { id: 1, value: '1 Parking Spot' },
  { id: 2, value: '2 Parking Spot' },
  { id: 3, value: 'off-street Parking' }
];

const genderChoice = [
  { id: 1, value: 'Male' },
  { id: 2, value: 'Female' },
  { id: 3, value: 'Any' }
];

const unitOfMeasures = [
  { id: 1, value: 'per meter' },
  { id: 2, value: 'per feet' },
  { id: 3, value: 'per anna' }
];

// ----------------------------------------------------------------------
RealEstateNewPostForm.propTypes = {
  isEdit: PropTypes.bool,
  currentListingDetail: PropTypes.object
};
export default function RealEstateNewPostForm({ isEdit, currentListingDetail }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [realEstateCategoryId, setRealEstatecategoryId] = useState(0);
  const [listingTypeId, setlistingTypeId] = useState();

  const { realEstateCategories } = useSelector((state) => state.realEstateCategory);
  const { listingTypes } = useSelector((state) => state.listingType);
  const { propertyTypes } = useSelector((state) => state.propertyType);
  const { realEstateImages } = useSelector((state) => state.realEstateImage);

  const Schema = Yup.object().shape({
    listingTitle: Yup.string()
      .required('This field is required')
      .min(2, 'Minimum of 2 characters are required')
      .max(200, 'Should be less than 200 characters'),
    realEstateCategoryId: Yup.number().moreThan(0, 'This field is required'),
    listingTypeId: Yup.number().moreThan(0, 'This field is required'),
    advertisementDescription: Yup.string()
      .required('This field is required')
      .min(2, 'Minimum of 2 characters are required')
      .max(200, 'Should be less than 200 characters'),
    address: Yup.string()
      .required('This field is required')
      .min(2, 'Minimum of 2 characters are required')
      .max(200, 'Should be less than 200 characters'),
    city: Yup.string().required('City is required').min(2, 'Minimum 2 characters'),
    state: Yup.string().required('State is required').min(2, 'Minimum 2 characters'),
    country: Yup.string().required('Country is required'),
    postCode: Yup.number().required('This field is required'),
    landSize: Yup.number().required('Enter your landSize in number'),
    unitOfMeasure: Yup.mixed().required('Unit Of Measure is required'),
    priceType: Yup.string().required('Select the type of Price'),
    proImages: Yup.mixed().required('Add at least one image'),
    noofBedroom: Yup.number()
      .notRequired()
      .when('listingTypeId', {
        is: (val) => val !== 2 && val !== 3,
        then: Yup.number().required('the field is required now'),
        otherwise: Yup.number().notRequired()
      }),
    noofBathroom: Yup.number()
      .notRequired()
      .when('listingTypeId', {
        is: (val) => val !== 2 && val !== 3,
        then: Yup.number().required('the field is required now'),
        otherwise: Yup.number().notRequired()
      })
    // garage: Yup.object('Select the garage type'),
    // floorArea: Yup.number().required('Enter the area of floor'),
    // availableFrom: Yup.mixed().required('Select the date available from'),
    // agencyName: Yup.string().required('Agenecy Name is required'),
    // contactName: Yup.string().required('Conatct Name is required'),
    // contactNumber: Yup.mixed().required('Enter the Contact phone number'),
    // email: Yup.string().email('Invalid Email Format').required('Required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentListingDetail?.id || 0,
      userId: currentListingDetail?.userId || '',
      realEstateCategoryId: currentListingDetail?.realEstateCategoryId || 0,
      listingTypeId: currentListingDetail?.listingTypeId || 0,
      propertyTypeId: currentListingDetail?.propertyTypeId || 0,
      listingTitle: currentListingDetail?.listingTitle || '',
      advertisementDescription: currentListingDetail?.advertisementDescription || '',
      address: currentListingDetail?.address || '',
      city: currentListingDetail?.city || '',
      state: currentListingDetail?.state || '',
      country: currentListingDetail?.country || '',
      postCode: currentListingDetail?.postCode || '',
      nearbyPublicAreas: currentListingDetail?.nearbyPublicAreas || [],
      landSize: currentListingDetail?.landSize || '',
      unitOfMeasure: currentListingDetail?.unitOfMeasure || '',
      listingPrice: currentListingDetail?.listingPrice || '',
      reservePrice: currentListingDetail?.reservePrice || '',
      priceType: currentListingDetail?.priceType || '',
      publishStatus: currentListingDetail?.publishStatus || false,
      proImages: currentListingDetail?.proImages || [],
      realEstateImages: currentListingDetail?.realEstateImages || null,

      petAllowed: currentListingDetail.rentalOptional?.petAllowed || false,
      smoker: currentListingDetail.rentalOptional?.smoker || false,
      baby: currentListingDetail.rentalOptional?.baby || false,
      maximumTenant: currentListingDetail.rentalOptional?.maximumTenant || '',
      furnished: currentListingDetail.rentalOptional?.furnished || false,
      utilityIncluded: currentListingDetail.rentalOptional?.utilityIncluded || false,
      preferredGender: currentListingDetail.rentalOptional?.preferredGender || '',

      noofBedroom: currentListingDetail.extraEntity?.noofBedroom || null,
      noofBathroom: currentListingDetail.extraEntity?.noofBathroom || '',
      garage: currentListingDetail.extraEntity?.garage || '',
      floorArea: currentListingDetail.extraEntity?.floorArea || '',
      availableFrom: currentListingDetail.extraEntity?.availableFrom || '',

      agencyName: currentListingDetail.agentDetails?.agencyName || '',
      contactName: currentListingDetail.agentDetails?.contactName || '',
      contactNumber: currentListingDetail.agentDetails?.contactNumber || '',
      email: currentListingDetail.agentDetails?.email || ''
    },
    validationSchema: Schema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (isEdit) {
          dispatch(updateAgentDetails(currentListingDetail.id, values))
            .then(() => {
              enqueueSnackbar('Update successful', { variant: 'success' });
              navigate(PATH_DASHBOARD.realEstate.list);
              resetForm();
            })
            .catch((error) => {
              enqueueSnackbar('Update failed', { variant: 'error' });
              setErrors(error);
            });
        } else {
          dispatch(addlistingdetails(values))
            .then(() => {
              resetForm();
              setSubmitting(false);
              console.log(isEdit);

              // eslint-disable-next-line no-undef
              enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
              navigate(PATH_DASHBOARD.realEstate.list);
            })
            .catch((error) => {
              console.log(error);
              // eslint-disable-next-line no-undef
              enqueueSnackbar('Create error', { variant: 'error' });
            });
        }
      } catch {
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, handleSubmit, handleChange, isSubmitting, setFieldValue, getFieldProps } = formik;

  const [value, setValue] = useState(new Date());

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFieldValue(
        'proImages',
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    },
    [setFieldValue]
  );

  const handleRemove = (file) => {
    const filteredItems = values.proImages.filter((_file) => _file !== file);
    setFieldValue('proImages', filteredItems);
    if (typeof file === 'string') {
      const image = file.replace(`${SERVER_URL}/`, '');
      console.log(image);
      dispatch(deleteRealEstateImage(values.id, image));
    }
    console.log(file);
    console.log(values.id);
  };

  const handleRemoveAll = () => {
    setFieldValue('proImages', []);
    if (values.realEstateImages) {
      dispatch(deleteRealEstateImage(values.id, 'all'));
    }
  };

  const realEstateCategoryChange = (category) => {
    const newCategoryId = {
      ...realEstateCategoryId,
      realEstateCategoryId: category.target.value
    };

    setRealEstatecategoryId(newCategoryId);
    console.log(realEstateCategoryId);
  };

  const listingTypeChange = (e) => {
    setlistingTypeId(...listingTypeId, e.target.value);
    console.log(listingTypeId);
  };
  const getValue = () => {
    console.log(values.realEstateCategoryId);
  };

  const getImages = useCallback(() => {
    const images = [];
    if (values.proImages.length) {
      values.proImages.forEach((file) => {
        images.push(file);
      });
    }
    if (values.realEstateImages) {
      values.realEstateImages.forEach((image) => {
        images.push(`${SERVER_URL}/${image.url}`);
      });
    }
    return images;
  }, [values.proImages, values.realEstateImages]);
  useEffect(() => {
    dispatch(getRealEstatecategories());
    dispatch(getPropertyTypes());
    dispatch(getListingTypes());
  }, [dispatch]);
  return (
    <>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Post Title"
                    {...getFieldProps('listingTitle')}
                    error={Boolean(touched.listingTitle && errors.listingTitle)}
                    helperText={touched.listingTitle && errors.listingTitle}
                  />

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      select
                      fullWidth
                      label="Real Estate Category"
                      placeholder="Real Estate Category"
                      {...getFieldProps('realEstateCategoryId')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.realEstateCategoryId && errors.realEstateCategoryId)}
                      helperText={touched.realEstateCategoryId && errors.realEstateCategoryId}
                      // value={values.realEstateCategoryId}
                      // onChnage={handleChange}
                    >
                      <option value="" />
                      {realEstateCategories.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.realEstateCategoryName}
                        </option>
                      ))}
                    </TextField>

                    {/*  */}

                    <TextField
                      select
                      fullWidth
                      label="Listing Type"
                      placeholder="ListingTypeId"
                      {...getFieldProps('listingTypeId')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.listingTypeId && errors.listingTypeId)}
                      helperText={touched.listingTypeId && errors.listingTypeId}
                    >
                      <option value="" />
                      {listingTypes.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.listingTypeTitle}
                        </option>
                      ))}
                    </TextField>
                    <TextField
                      select
                      fullWidth
                      label="Property Type"
                      placeholder="Property Type"
                      {...getFieldProps('propertyTypeId')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.propertyTypeId && errors.propertyTypeId)}
                      helperText={touched.propertyTypeId && errors.propertyTypeId}
                    >
                      <option value="" />
                      {propertyTypes.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.type}
                        </option>
                      ))}
                    </TextField>
                  </Stack>

                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={5}
                    label="Short Advertising Description"
                    {...getFieldProps('advertisementDescription')}
                    error={Boolean(touched.advertisementDescription && errors.advertisementDescription)}
                    helperText={touched.advertisementDescription && errors.advertisementDescription}
                  />

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      select
                      fullWidth
                      label="Country"
                      placeholder="Country"
                      {...getFieldProps('country')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.country && errors.country)}
                      helperText={touched.country && errors.country}
                    >
                      <option value="" />
                      {countries.map((option) => (
                        <option key={option.code} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                    <TextField
                      fullWidth
                      label="Address"
                      {...getFieldProps('address')}
                      error={Boolean(touched.address && errors.address)}
                      helperText={touched.address && errors.address}
                    />
                  </Stack>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="State/Region"
                      {...getFieldProps('state')}
                      error={Boolean(touched.state && errors.state)}
                      helperText={touched.state && errors.state}
                    />
                    <TextField
                      fullWidth
                      label="City"
                      {...getFieldProps('city')}
                      error={Boolean(touched.city && errors.city)}
                      helperText={touched.city && errors.city}
                    />
                    <TextField
                      fullWidth
                      label="Zip/Code"
                      {...getFieldProps('postCode')}
                      error={Boolean(touched.postCode && errors.postCode)}
                      helperText={touched.postCode && errors.postCode}
                    />
                  </Stack>

                  <Autocomplete
                    multiple
                    freeSolo
                    value={values.nearbyPublicAreas}
                    onChange={(event, newValue) => {
                      setFieldValue('nearbyPublicAreas', newValue);
                    }}
                    options={values.nearbyPublicAreas.map((option) => option)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip key={option} size="small" label={option} {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => <TextField {...params} label="Public Facilities" />}
                  />
                  <div>
                    <LabelStyle>Add Images</LabelStyle>
                    <UploadMultiFile
                      showPreview
                      {...getFieldProps('proImages')}
                      maxSize={3145728}
                      accept="image/*"
                      files={getImages()}
                      // files={values.proImages}
                      onDrop={handleDrop}
                      onRemove={handleRemove}
                      onRemoveAll={handleRemoveAll}
                      error={Boolean(touched.proImages && errors.proImages)}
                    />
                    {touched.proImages && errors.proImages && (
                      <FormHelperText error sx={{ px: 2 }}>
                        {touched.proImages && errors.proImages}
                      </FormHelperText>
                    )}
                  </div>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Land Size"
                      {...getFieldProps('landSize')}
                      error={Boolean(touched.postCode && errors.postCode)}
                      helperText={touched.postCode && errors.postCode}
                    />
                    <TextField
                      select
                      fullWidth
                      label="Unit Of Measure"
                      placeholder="unitOfMeasure"
                      {...getFieldProps('unitOfMeasure')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.unitOfMeasure && errors.unitOfMeasure)}
                      helperText={touched.unitOfMeasure && errors.unitOfMeasure}
                    >
                      <option value="" />
                      {unitOfMeasures.map((option) => (
                        <option key={option.id} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </TextField>
                  </Stack>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Listing Price"
                      {...getFieldProps('listingPrice')}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        type: 'number'
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Reserve Price"
                      {...getFieldProps('reservePrice')}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        type: 'number'
                      }}
                    />
                    <TextField
                      select
                      fullWidth
                      label="Price Type"
                      placeholder="priceType"
                      {...getFieldProps('priceType')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.priceType && errors.priceType)}
                      helperText={touched.priceType && errors.priceType}
                    >
                      <option value="" />
                      {priceTypes.map((option) => (
                        <option key={option.id} value={option.name}>
                          {option.name}
                        </option>
                      ))}
                    </TextField>
                  </Stack>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <div>
                    <FormControlLabel
                      control={<Switch {...getFieldProps('publishStatus')} checked={values.publishStatus} />}
                      label="Publish Status"
                      labelPlacement="start"
                      sx={{ mb: 1, mx: 0, width: '100%', justifyContent: 'space-between' }}
                    />
                  </div>
                </Stack>
              </Card>
              {/* if the listing type is land dont show extra entity  */}

              {values.listingTypeId === '2' || values.listingTypeId === '3' ? (
                <Card sx={{ p: 3, mt: 3 }}>
                  <Stack spacing={3}>
                    <TextField
                      select
                      fullWidth
                      label="Number of Bedrooms"
                      placeholder="1"
                      {...getFieldProps('noofBedroom')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.noofBedroom && errors.noofBedroom)}
                      helperText={touched.noofBedroom && errors.noofBedroom}
                    >
                      <option value="" />
                      {numberofBedrooms.map((option) => (
                        <option key={option.id} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </TextField>
                    <TextField
                      select
                      fullWidth
                      label="Number of Bathrooms"
                      placeholder="1"
                      {...getFieldProps('noofBathroom')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.noofBathroom && errors.noofBathroom)}
                      helperText={touched.noofBathroom && errors.noofBathroom}
                    >
                      <option value="" />
                      {numberofBedrooms.map((option) => (
                        <option key={option.id} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </TextField>

                    <TextField
                      select
                      fullWidth
                      label="Parking Type"
                      placeholder="Parking type"
                      {...getFieldProps('garage')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.garage && errors.garage)}
                      helperText={touched.garage && errors.garage}
                    >
                      <option value="" />
                      {garageTypes.map((option) => (
                        <option key={option.id} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </TextField>

                    <TextField
                      fullWidth
                      minRows={3}
                      maxRows={5}
                      label="Floor Area (square meter)"
                      {...getFieldProps('floorArea')}
                    />

                    <TextField
                      name="availableFrom"
                      label="Available Date"
                      InputLabelProps={{ shrink: true, required: true }}
                      type="date"
                      {...getFieldProps('availableFrom')}
                    />
                  </Stack>
                </Card>
              ) : null}

              {isEdit && (values.listingTypeId === 2 || values.listingTypeId === 3) ? (
                <Card sx={{ p: 3, mt: 3 }}>
                  <Stack spacing={3}>
                    <TextField
                      select
                      fullWidth
                      label="Number of Bedrooms"
                      placeholder="1"
                      {...getFieldProps('noofBedroom')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.noofBedroom && errors.noofBedroom)}
                      helperText={touched.noofBedroom && errors.noofBedroom}
                    >
                      <option value="" />
                      {numberofBedrooms.map((option) => (
                        <option key={option.id} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </TextField>
                    <TextField
                      select
                      fullWidth
                      label="Number of Bathrooms"
                      placeholder="1"
                      {...getFieldProps('noofBathroom')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.noofBathroom && errors.noofBathroom)}
                      helperText={touched.noofBathroom && errors.noofBathroom}
                    >
                      <option value="" />
                      {numberofBedrooms.map((option) => (
                        <option key={option.id} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </TextField>

                    <TextField
                      select
                      fullWidth
                      label="Parking Type"
                      placeholder="Parking type"
                      {...getFieldProps('garage')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.garage && errors.garage)}
                      helperText={touched.garage && errors.garage}
                    >
                      <option value="" />
                      {garageTypes.map((option) => (
                        <option key={option.id} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </TextField>

                    <TextField
                      fullWidth
                      minRows={3}
                      maxRows={5}
                      label="Floor Area (square meter)"
                      {...getFieldProps('floorArea')}
                    />

                    <TextField
                      name="availableFrom"
                      label="Available Date"
                      InputLabelProps={{ shrink: true, required: true }}
                      type="date"
                      {...getFieldProps('availableFrom')}
                      value={values.availableFrom}
                    />
                  </Stack>
                </Card>
              ) : null}
              {/* if realestatecategory is rental type  */}
              {values.realEstateCategoryId === '2' ? (
                <Card sx={{ p: 3, mt: 3 }}>
                  <Stack spacing={3}>
                    <div>
                      <FormControlLabel
                        control={<Switch {...getFieldProps('smoker')} checked={values.smoker} />}
                        label="Smoker Allowed"
                        labelPlacement="start"
                        sx={{ mb: 1, mx: 0, width: '100%', justifyContent: 'space-between' }}
                      />
                      <FormControlLabel
                        control={<Switch {...getFieldProps('petAllowed')} checked={values.petAllowed} />}
                        label="Pets Allowed"
                        labelPlacement="start"
                        sx={{ mb: 1, mx: 0, width: '100%', justifyContent: 'space-between' }}
                      />
                      <FormControlLabel
                        control={<Switch {...getFieldProps('baby')} checked={values.baby} />}
                        label="Children Allowed"
                        labelPlacement="start"
                        sx={{ mb: 1, mx: 0, width: '100%', justifyContent: 'space-between' }}
                      />
                      <FormControlLabel
                        control={<Switch {...getFieldProps('furnished')} checked={values.furnished} />}
                        label="Furnished"
                        labelPlacement="start"
                        sx={{ mb: 1, mx: 0, width: '100%', justifyContent: 'space-between' }}
                      />
                      <FormControlLabel
                        control={<Switch {...getFieldProps('utilityIncluded')} checked={values.utilityIncluded} />}
                        label="Utility Included"
                        labelPlacement="start"
                        sx={{ mb: 1, mx: 0, width: '100%', justifyContent: 'space-between' }}
                      />
                    </div>
                    <TextField
                      fullWidth
                      minRows={3}
                      maxRows={5}
                      label="Maximum Tenant"
                      {...getFieldProps('maximumTenant')}
                    />
                    <TextField
                      select
                      fullWidth
                      label="Prefered Gender"
                      placeholder="Gender"
                      {...getFieldProps('preferredGender')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.preferredGender && errors.preferredGender)}
                      helperText={touched.preferredGender && errors.preferredGender}
                    >
                      <option value="" />
                      {genderChoice.map((option) => (
                        <option key={option.id} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </TextField>
                  </Stack>
                </Card>
              ) : null}

              {isEdit && values.realEstateCategoryId === 2 ? (
                <Card sx={{ p: 3, mt: 3 }}>
                  <Stack spacing={3}>
                    <div>
                      <FormControlLabel
                        control={<Switch {...getFieldProps('smoker')} checked={values.smoker} />}
                        label="Smoker Allowed"
                        labelPlacement="start"
                        sx={{ mb: 1, mx: 0, width: '100%', justifyContent: 'space-between' }}
                      />
                      <FormControlLabel
                        control={<Switch {...getFieldProps('petAllowed')} checked={values.petAllowed} />}
                        label="Pets Allowed"
                        labelPlacement="start"
                        sx={{ mb: 1, mx: 0, width: '100%', justifyContent: 'space-between' }}
                      />
                      <FormControlLabel
                        control={<Switch {...getFieldProps('baby')} checked={values.baby} />}
                        label="Children Allowed"
                        labelPlacement="start"
                        sx={{ mb: 1, mx: 0, width: '100%', justifyContent: 'space-between' }}
                      />
                      <FormControlLabel
                        control={<Switch {...getFieldProps('furnished')} checked={values.furnished} />}
                        label="Furnished"
                        labelPlacement="start"
                        sx={{ mb: 1, mx: 0, width: '100%', justifyContent: 'space-between' }}
                      />
                      <FormControlLabel
                        control={<Switch {...getFieldProps('utilityIncluded')} checked={values.utilityIncluded} />}
                        label="Utility Included"
                        labelPlacement="start"
                        sx={{ mb: 1, mx: 0, width: '100%', justifyContent: 'space-between' }}
                      />
                    </div>
                    <TextField
                      fullWidth
                      minRows={3}
                      maxRows={5}
                      label="Maximum Tenant"
                      {...getFieldProps('maximumTenant')}
                    />
                    <TextField
                      select
                      fullWidth
                      label="Prefered Gender"
                      placeholder="Gender"
                      {...getFieldProps('preferredGender')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.preferredGender && errors.preferredGender)}
                      helperText={touched.preferredGender && errors.preferredGender}
                    >
                      <option value="" />
                      {genderChoice.map((option) => (
                        <option key={option.id} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </TextField>
                  </Stack>
                </Card>
              ) : null}

              <Card sx={{ p: 3, mt: 3 }}>
                <Stack spacing={3}>
                  <TextField fullWidth minRows={3} maxRows={5} label="Agency Name" {...getFieldProps('agencyName')} />
                  <TextField fullWidth minRows={3} maxRows={5} label="Agent Name" {...getFieldProps('contactName')} />
                  <TextField fullWidth minRows={3} maxRows={5} label="Email" {...getFieldProps('email')} />
                  <TextField
                    fullWidth
                    minRows={3}
                    maxRows={5}
                    label="Phone Number"
                    {...getFieldProps('contactNumber')}
                  />
                </Stack>
              </Card>
              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                {/* <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                  Post
                </LoadingButton> */}
                <LoadingButton fullWidth type="submit" variant="contained" pending={isSubmitting}>
                  {isEdit ? 'Add Listings' : 'Save Changes'}
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </>
  );
}
