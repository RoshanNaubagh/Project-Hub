import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
import {
  Card,
  Chip,
  Grid,
  Stack,
  Switch,
  Select,
  Button,
  TextField,
  InputLabel,
  Typography,
  Checkbox,
  FormControl,
  Autocomplete,
  InputAdornment,
  FormHelperText,
  FormControlLabel
} from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

import { QuillEditor } from '../../editor';
import { UploadMultiFile } from '../../upload';
import { PreviewVariant } from './product-create';
import { addNewProduct } from '../../../redux/slices/product';
import { getVendors } from '../../../redux/slices/vendor';
import { getEcomCategories } from '../../../redux/slices/ecomCategory';
import { getProductCollections } from '../../../redux/slices/productCollection';
import { setProductVariantList } from '../../../redux/slices/productVariant';

// product status
const PRODUCT_STATUS = ['Draft', 'Active', 'Disable'];

const TAGS_OPTION = ['product'];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

const VARIANTS = [
  {
    id: 1,
    name: 'Color'
  },
  {
    id: 2,
    name: 'Size'
  },
  {
    id: 3,
    name: 'Gender'
  },
  {
    id: 4,
    name: 'Material'
  },
  {
    id: 5,
    name: 'Style'
  },
  {
    id: 6,
    name: 'Title'
  }
];

// ----------------------------------------------------------------------

ProductNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object
};

export default function ProductNewForm({ isEdit, currentProduct }) {
  const defaultVariantOption = {
    id: 1,
    optName: 'Color',
    optValues: []
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { uuid } = useSelector((state) => state.user);
  const [hasVariant, setHasVariant] = useState(false);
  const [optionRow, setOptionRow] = useState([defaultVariantOption]);
  // remove first element to get rest available options
  const REST_OPTIONS = VARIANTS.slice();
  REST_OPTIONS.splice(0, 1);
  const [restOptions, setRestOptions] = useState(REST_OPTIONS);
  // states from store
  const { vendors } = useSelector((state) => state.vendor);
  const { ecomCategories } = useSelector((state) => state.ecomCategory);
  const [categoryIds, setCategoryIds] = useState({ categoryA: 0, categoryB: 0, categoryC: 0 });
  const [Values, setValues] = useState({ categoryA: null, categoryB: null, categoryC: null, categoryD: null });
  const { productVariantList } = useSelector((state) => state.productVariant);
  const { productCollections } = useSelector((state) => state.productCollection);

  const Schema = Yup.object().shape({
    productTitle: Yup.string()
      .required('This field is required')
      .min(2, 'Minimum of 2 characters are required')
      .max(200, 'Should be less than 200 characters'),
    description: Yup.string().required('This field is required'),
    proImages: Yup.mixed().required('Add at least one image'),
    productStatus: Yup.string().required('This field is required'),
    vendorId: Yup.number().moreThan(0, 'This field is required'),
    collectionId: Yup.number().moreThan(0, 'This field is required'),
    barcode: Yup.string().max(40, 'Maximum 40 characters'),
    sku: Yup.string().max(60, 'Maximum 60 characters'),
    quantity: Yup.number().required('This field is required').min(0, 'Quantity should be 0 or above'),
    ecomCategoryId: Yup.number().required('This field is required'),
    compareAtPrice: Yup.number().required('This field is required').positive('Add valid price')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      productTitle: currentProduct?.productTitle || '',
      description: currentProduct?.description || '',
      proImages: currentProduct?.proImages || [],
      hasVariant: false,
      option: '',
      productStatus: currentProduct?.productStatus || PRODUCT_STATUS[0],
      vendorId: currentProduct?.vendorId || 0,
      collectionId: currentProduct?.collectionId || 0,
      barcode: currentProduct?.barcode || '',
      sku: currentProduct?.sku || '',
      quantity: currentProduct?.quantity || 1,
      tags: currentProduct?.tags || [TAGS_OPTION[0]],
      inStock: Boolean(currentProduct?.inventoryType !== 'out_of_stock'),
      ecomCategoryId: currentProduct?.ecomCategoryId || undefined,
      compareAtPrice: currentProduct?.compareAtPrice || 0.0,
      price: currentProduct?.price || 0.0,
      costPrice: currentProduct?.costPrice || 0.0,
      taxes: true,
      uid: currentProduct?.uid || uuid
    },
    validationSchema: Schema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        dispatch(addNewProduct(values, productVariantList))
          .then(() => {
            resetForm();
            setSubmitting(false);
            setValues({ categoryA: null, categoryB: null, categoryC: null, categoryD: null });
            setProductVariantList([]);
            setHasVariant(false);
            setOptionRow([defaultVariantOption]);

            enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
            navigate(PATH_DASHBOARD.eCommerce.list);
          })
          .catch(() => {
            enqueueSnackbar(!isEdit ? 'Create error' : 'Update error', { variant: 'error' });
          });
      } catch (error) {
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

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

  const handleRemoveAll = () => {
    setFieldValue('proImages', []);
  };

  const handleAddOption = () => {
    let maxId = 0;

    // gets max id number
    optionRow.forEach((or) => {
      if (or.id > maxId) maxId = or.id;
    });
    const options = restOptions.slice();

    if (options.length !== 0) {
      setOptionRow([...optionRow, { id: maxId + 1, optName: options[0].name, optValues: [] }]);
      options.splice(0, 1);
    }

    // sort options by id (ASC)
    sortOptions(options);
    setRestOptions(options);
  };

  const sortOptions = (arr) =>
    arr.sort((a, b) => {
      if (a.id < b.id) return -1;
      return a.id > b.id ? 1 : 0;
    });

  const removeOption = (index) => {
    const newOptions = optionRow.slice();
    const curName = optionRow[index].optName;
    let id = 0;

    // get id of deleted option name
    VARIANTS.forEach((v) => {
      if (v.name === curName) id = v.id;
    });

    newOptions.splice(index, 1);
    if (newOptions.length === 0) newOptions.push(defaultVariantOption);
    setOptionRow(newOptions);

    // adds deleted option name as available select option
    const selectOptions = [...restOptions, { id, name: curName }];
    // sort by id (ASC)
    sortOptions(selectOptions);

    setRestOptions(selectOptions);
  };

  const handleOptValueChange = (id, newValue) => {
    const newOptions = optionRow.map((opt) => {
      if (opt.id === id) {
        opt.optValues = newValue.slice();
      }
      return opt;
    });

    setOptionRow(newOptions);
  };

  const handleOptNameChange = ({ target: { value } }, id) => {
    let oldValue = '';
    let oId = 0;

    const newOptions = optionRow.map((opt) => {
      if (opt.id === id) {
        oldValue = opt.optName;
        opt.optName = value;
      }
      return opt;
    });

    VARIANTS.forEach((v) => {
      if (v.name === oldValue) oId = v.id;
    });
    const selectOptions = restOptions.slice();
    restOptions.forEach((o, index) => {
      if (o.name === value) {
        selectOptions.splice(index, 1);
        selectOptions.push({ id: oId, name: oldValue });
      }
    });
    sortOptions(selectOptions);

    setRestOptions(selectOptions);
    setOptionRow(newOptions);
  };

  const handleRemove = (file) => {
    const filteredItems = values.proImages.filter((_file) => _file !== file);
    setFieldValue('proImages', filteredItems);
  };

  const handleCatAChange = (category) => {
    const newCategoryId = {
      ...categoryIds,
      categoryA: category.id
    };
    setValues({ categoryA: category, categoryB: null, categoryC: null, categoryD: null });
    setCategoryIds(newCategoryId);
  };

  const handleCatBChange = (category) => {
    const newCategoryId = {
      ...categoryIds,
      categoryB: category.id
    };
    setValues({ ...Values, categoryB: category, categoryC: null, categoryD: null });
    setCategoryIds(newCategoryId);
  };

  const handleCatCChange = (category) => {
    const newCategoryId = {
      ...categoryIds,
      categoryC: category.id
    };
    setValues({ ...Values, categoryC: category, categoryD: null });
    setCategoryIds(newCategoryId);
  };

  const handleHasVariantCheckbox = ({ target: { checked } }) => {
    setFieldValue('hasVariant', checked);
    setHasVariant(checked);
  };

  const handlePriceChange = (value) => {
    const newProductVariants = [];
    productVariantList.forEach((v) => {
      const variant = { ...v, price: value };
      newProductVariants.push(variant);
    });

    dispatch(setProductVariantList(newProductVariants));
  };

  const handleQtyChange = (value) => {
    const newProductVariants = [];
    productVariantList.forEach((v) => {
      const variant = { ...v, quantity: value };
      newProductVariants.push(variant);
    });

    dispatch(setProductVariantList(newProductVariants));
  };

  const variants = [];
  optionRow.forEach((opt) => {
    if (opt.optValues.length) variants.push(opt.optValues);
  });

  const cartesianVariants = variants.length
    ? variants.reduce((vars, arr) => vars.flatMap((v) => arr.map((a) => [v, a].flat())))
    : [];

  useEffect(() => {
    dispatch(getVendors());
    dispatch(getEcomCategories());
    dispatch(getProductCollections());
  }, [dispatch]);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Product Name"
                  {...getFieldProps('productTitle')}
                  error={Boolean(touched.productTitle && errors.productTitle)}
                  helperText={touched.productTitle && errors.productTitle}
                />

                <div>
                  <LabelStyle>Description</LabelStyle>
                  <QuillEditor
                    simple
                    id="product-description"
                    value={values.description}
                    onChange={(val) => setFieldValue('description', val)}
                    error={Boolean(touched.description && errors.description)}
                  />
                  {touched.description && errors.description && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {touched.description && errors.description}
                    </FormHelperText>
                  )}
                </div>

                <div>
                  <LabelStyle>Add Images</LabelStyle>
                  <UploadMultiFile
                    showPreview
                    maxSize={3145728}
                    accept="image/*"
                    files={values.proImages}
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
                <FormControlLabel
                  control={
                    <Checkbox
                      {...getFieldProps('hasVariant')}
                      checked={values.hasVariant}
                      onChange={handleHasVariantCheckbox}
                    />
                  }
                  label="Has variants"
                />
                {hasVariant ? (
                  <>
                    <div>
                      <LabelStyle>Variants</LabelStyle>
                      {optionRow.map(({ id, optName, optValues }, index) => (
                        <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }} mb={1}>
                          <FormControl fullWidth>
                            <InputLabel id="opt-name">Option {index + 1}</InputLabel>
                            <Select
                              labelId="opt-name"
                              label="Option"
                              native
                              value={optName}
                              onChange={(e) => handleOptNameChange(e, id)}
                            >
                              <option key={id} value={optName}>
                                {optName}
                              </option>
                              {restOptions
                                .filter((a) => a.name !== optName)
                                .map(({ id, name }) => (
                                  <option key={id} value={name}>
                                    {name}
                                  </option>
                                ))}
                            </Select>
                          </FormControl>
                          <Autocomplete
                            fullWidth
                            multiple
                            freeSolo
                            value={optValues}
                            onChange={(event, newValue) => {
                              handleOptValueChange(id, newValue);
                            }}
                            options={[].map((option) => option)}
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip key={option} size="small" label={option} {...getTagProps({ index })} />
                              ))
                            }
                            renderInput={(params) => <TextField label="Values" {...params} />}
                          />
                          <Button size="small" color="secondary" variant="text" onClick={() => removeOption(index)}>
                            Remove
                          </Button>
                        </Stack>
                      ))}
                      <Stack direction="row" mt={1}>
                        {restOptions.length === 0 ? (
                          ''
                        ) : (
                          <LoadingButton variant="outlined" size="medium" onClick={handleAddOption}>
                            Add Option
                          </LoadingButton>
                        )}
                      </Stack>
                    </div>
                    {cartesianVariants.length ? (
                      <div>
                        <LabelStyle>Preview</LabelStyle>
                        <PreviewVariant
                          variants={cartesianVariants}
                          defaultValues={{ qunatity: values.quantity, price: values.compareAtPrice }}
                        />
                      </div>
                    ) : null}
                  </>
                ) : (
                  ''
                )}
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel shrink>Status</InputLabel>
                    <Select label="Status" native {...getFieldProps('productStatus')} value={values.productStatus}>
                      {PRODUCT_STATUS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Select>
                    {touched.productStatus && errors.productStatus && (
                      <FormHelperText error>{touched.productStatus && errors.productStatus}</FormHelperText>
                    )}
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel shrink>Vendor</InputLabel>
                    <Select label="Vendor" native {...getFieldProps('vendorId')} value={values.vendorId}>
                      <option value={0}>Select Vendor</option>
                      {vendors.map(({ id, vendorName }) => (
                        <option key={id} value={id}>
                          {vendorName}
                        </option>
                      ))}
                    </Select>
                    {touched.vendorId && errors.vendorId && (
                      <FormHelperText error>{touched.vendorId && errors.vendorId}</FormHelperText>
                    )}
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel shrink>Collection</InputLabel>
                    <Select label="Collection" native {...getFieldProps('collectionId')} value={values.collectionId}>
                      <option value={0}>Select Collection</option>
                      {productCollections.map(({ id, collectionName }) => (
                        <option key={id} value={id}>
                          {collectionName}
                        </option>
                      ))}
                    </Select>
                    {touched.collectionId && errors.collectionId && (
                      <FormHelperText error>{touched.collectionId && errors.collectionId}</FormHelperText>
                    )}
                  </FormControl>

                  <TextField fullWidth label="Product Barcode" {...getFieldProps('barcode')} disabled={hasVariant} />
                  <TextField fullWidth label="Product SKU" {...getFieldProps('sku')} disabled={hasVariant} />
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    {...getFieldProps('quantity')}
                    value={values.quantity}
                    onChange={({ target: { value } }) => {
                      handleQtyChange(value);
                      setFieldValue('quantity', value);
                    }}
                    error={Boolean(touched.quantity && errors.quantity)}
                    helperText={touched.quantity && errors.quantity}
                  />

                  <Autocomplete
                    multiple
                    freeSolo
                    value={values.tags}
                    onChange={(event, newValue) => {
                      setFieldValue('tags', newValue);
                    }}
                    options={TAGS_OPTION.map((option) => option)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip key={option} size="small" label={option} {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => <TextField label="Tags" {...params} />}
                  />
                  <FormControlLabel
                    control={<Switch {...getFieldProps('inStock')} checked={values.inStock} />}
                    label="In stock"
                    sx={{ mb: 2 }}
                  />
                </Stack>
              </Card>
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <InputLabel shrink>Categories</InputLabel>
                    {touched.ecomCategoryId && errors.ecomCategoryId && (
                      <FormHelperText error>{touched.ecomCategoryId && errors.ecomCategoryId}</FormHelperText>
                    )}
                    <Autocomplete
                      fullWidth
                      value={Values.categoryA}
                      onChange={(event, newValue) => {
                        setFieldValue('ecomCategoryId', newValue.id);
                        handleCatAChange(newValue);
                      }}
                      options={ecomCategories.filter((cat) => cat.parentcategoryId === null)}
                      getOptionLabel={(option) => option.categoryName}
                      renderInput={(params) => <TextField label="Category A" {...params} />}
                    />
                    <Autocomplete
                      fullWidth
                      value={Values.categoryB}
                      onChange={(event, newValue) => {
                        setFieldValue('ecomCategoryId', newValue.id);
                        handleCatBChange(newValue);
                      }}
                      options={ecomCategories.filter((cat) => cat.parentcategoryId === categoryIds.categoryA)}
                      getOptionLabel={(option) => option.categoryName}
                      renderInput={(params) => <TextField label="Category B" {...params} />}
                    />
                    <Autocomplete
                      fullWidth
                      value={Values.categoryC}
                      onChange={(event, newValue) => {
                        setFieldValue('ecomCategoryId', newValue.id);
                        handleCatCChange(newValue);
                      }}
                      options={ecomCategories.filter((cat) => cat.parentcategoryId === categoryIds.categoryB)}
                      getOptionLabel={(option) => option.categoryName}
                      renderInput={(params) => <TextField label="Category C" {...params} />}
                    />
                    <Autocomplete
                      fullWidth
                      value={Values.categoryD}
                      onChange={(event, newValue) => {
                        setValues({ ...Values, categoryD: newValue });
                        setFieldValue('ecomCategoryId', newValue.id);
                      }}
                      options={ecomCategories.filter((cat) => cat.parentcategoryId === categoryIds.categoryC)}
                      getOptionLabel={(option) => option.categoryName}
                      renderInput={(params) => <TextField label="Category D" {...params} />}
                    />
                  </Stack>
                </Card>
              </Stack>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    placeholder="0.00"
                    label="Regular Price"
                    {...getFieldProps('compareAtPrice')}
                    value={values.compareAtPrice}
                    onChange={({ target: { value } }) => {
                      handlePriceChange(value);
                      setFieldValue('compareAtPrice', value);
                    }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      type: 'number'
                    }}
                    error={Boolean(touched.compareAtPrice && errors.compareAtPrice)}
                    helperText={touched.compareAtPrice && errors.compareAtPrice}
                  />

                  <TextField
                    fullWidth
                    placeholder="0.00"
                    label="Sale Price"
                    {...getFieldProps('price')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      type: 'number'
                    }}
                    error={Boolean(touched.price && errors.price)}
                    helperText={touched.price && errors.price}
                  />

                  <TextField
                    fullWidth
                    placeholder="0.00"
                    label="Cost Price"
                    {...getFieldProps('costPrice')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      type: 'number'
                    }}
                    error={Boolean(touched.costPrice && errors.costPrice)}
                    helperText={touched.costPrice && errors.costPrice}
                  />
                </Stack>

                <FormControlLabel
                  control={<Switch {...getFieldProps('taxes')} checked={values.taxes} />}
                  label="Price includes taxes"
                  sx={{ mt: 2 }}
                />
              </Card>

              <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={isSubmitting}>
                {!isEdit ? 'Create Product' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
