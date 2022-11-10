import * as Yup from 'yup';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack5';
import { useDispatch } from 'react-redux';
import { LoadingButton } from '@material-ui/lab';
import { Box, Button, TextField, FormControlLabel, FormHelperText, Switch, Grid } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { UploadSingleFile } from '../../../upload';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import {
  addProductCollection,
  updateProductCollection,
  deleteCollectionImage
} from '../../../../redux/slices/productCollection';
import { useSelector } from '../../../../redux/store';

// ----------------------------------------------------------------------
ProductCollectionForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCollection: PropTypes.object
};

function ProductCollectionForm({ isEdit, currentCollection }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  // states from store
  const { uuid } = useSelector((state) => state.user);

  // form validator
  const Schema = Yup.object().shape({
    collectionName: Yup.string().required('Name is required').min(2, 'Minimum of 2 characters are required'),
    aviliablefrom: Yup.date().min(
      new Date(Date.now() - 24 * 60 * 60 * 1000),
      'AvailableFrom date cannot be the dates before today'
    ),
    aviliableTill: Yup.date().when(
      'aviliablefrom',
      (availableFrom, schema) =>
        availableFrom && schema.min(availableFrom, 'AvailableTill date must be greater than AvailableFrom date')
    )
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      collectionName: currentCollection?.collectionName || '',
      aviliablefrom: currentCollection.aviliablefrom?.split('T')[0] || '',
      aviliableTill: currentCollection.aviliableTill?.split('T')[0] || '',
      collectionImage: currentCollection?.collectionImage || null,
      status: currentCollection?.status || true,
      cImage: '',
      uid: currentCollection?.uid || uuid
    },
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, setSubmitting, setErrors }) => {
      try {
        if (isEdit) {
          dispatch(updateProductCollection(currentCollection.id, values))
            .then(() => {
              enqueueSnackbar('Update successful', { variant: 'success' });
              navigate(PATH_DASHBOARD.productCollection.list);
              resetForm();
            })
            .catch((error) => {
              setSubmitting(false);
              setErrors(error);
              enqueueSnackbar('Update failed', { variant: 'error' });
            });
        } else {
          dispatch(addProductCollection(values))
            .then(() => {
              enqueueSnackbar('Product added', { variant: 'success' });
              navigate(PATH_DASHBOARD.productCollection.list);
              resetForm();
            })
            .catch((error) => {
              setSubmitting(false);
              setErrors(error);
              enqueueSnackbar('Cannot add', { variant: 'error' });
            });
        }
      } catch (error) {
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { values, touched, errors, handleSubmit, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback(
    (selectedFile) => {
      setFieldValue(
        'cImage',
        Object.assign(selectedFile[0], {
          preview: URL.createObjectURL(selectedFile[0])
        })
      );
    },
    [setFieldValue]
  );

  const handleRemove = () => {
    setFieldValue('cImage', '');
  };

  const deleteImage = () => {
    dispatch(deleteCollectionImage(currentCollection.id));
  };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Add Product Collection"
              {...getFieldProps('collectionName')}
              error={Boolean(touched.collectionName && errors.collectionName)}
              helperText={touched.collectionName && errors.collectionName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="available-from-date"
              label="Available From"
              type="date"
              {...getFieldProps('aviliablefrom')}
              value={values.aviliablefrom}
              InputLabelProps={{ shrink: true }}
              error={Boolean(touched.aviliablefrom && errors.aviliablefrom)}
              helperText={touched.aviliablefrom && errors.aviliablefrom}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="available-till-date"
              label="Available Till"
              type="date"
              {...getFieldProps('aviliableTill')}
              value={values.aviliableTill}
              InputLabelProps={{ shrink: true }}
              error={Boolean(touched.aviliableTill && errors.aviliableTill)}
              helperText={touched.aviliableTill && errors.aviliableTill}
            />
          </Grid>
          <Grid item xs={12}>
            <div>
              Add Image
              {typeof values.collectionImage === 'string' ? (
                <div>
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${values.collectionImage}`}
                    alt="collection"
                    width="50%"
                  />
                  <Button variant="contained" color="error" onClick={deleteImage}>
                    Remove
                  </Button>
                </div>
              ) : (
                <UploadSingleFile
                  showPreview
                  maxSize={3145728}
                  accept="image/*"
                  file={values.cImage}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  error={Boolean(touched.cImage && errors.cImage)}
                />
              )}
              {touched.cImage && errors.cImage && (
                <FormHelperText error sx={{ px: 2 }}>
                  {touched.cImage && errors.cImage}
                </FormHelperText>
              )}
            </div>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch {...getFieldProps('status')} checked={values.status} />}
              label="Status"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained">
                {!isEdit ? 'Add Product Collection' : 'Save Changes'}
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}

export default ProductCollectionForm;
