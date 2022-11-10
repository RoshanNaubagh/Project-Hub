import * as Yup from 'yup';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { Box, TextField, Grid, Autocomplete, Button } from '@material-ui/core';
import { addModuleCategory, updateModuleCategory } from '../../../../redux/slices/moduleCategory';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------
const useStyles = makeStyles((theme) => ({
  root: {},
  margin: {
    marginBottom: theme.spacing(3)
  },
  helperText: {
    padding: theme.spacing(0, 2)
  }
}));

// ----------------------------------------------------------------------
ModuleCategoryForm.propTypes = {
  className: PropTypes.string,
  isEdit: PropTypes.bool,
  currentModuleCategory: PropTypes.object,
  modules: PropTypes.array
};

function ModuleCategoryForm({ className, isEdit, currentModuleCategory, modules, ...other }) {
  const mockModule = { id: 0, moduleName: '' };
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [module, setModule] = useState(mockModule);

  const Schema = Yup.object().shape({
    moduleCategoryName: Yup.string()
      .required('This field is required')
      .min(2, 'Minimum of 2 characters are required')
      .max(200, 'Should be less than 200 characters'),
    moduleId: Yup.number().moreThan(0, 'This field is required')
  });

  const getModule = (moduleId) => modules.filter((m) => m.id === moduleId)[0];
  const trialformodule = () => {
    console.log(module);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      moduleCategoryName: currentModuleCategory?.moduleCategoryName || '',
      moduleId: currentModuleCategory?.moduleId || 0
    },
    validationSchema: Schema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (isEdit) {
          dispatch(updateModuleCategory(currentModuleCategory.id, values))
            .then(() => {
              resetForm();
              setSubmitting(false);
              enqueueSnackbar('Update success', { variant: 'success' });
              navigate(PATH_DASHBOARD.admin.moduleCategory.list);
            })
            .catch(() => {
              enqueueSnackbar('Update error', { variant: 'error' });
            });
        } else {
          dispatch(addModuleCategory(values))
            .then(() => {
              resetForm();
              setSubmitting(false);
              enqueueSnackbar('Create success', { variant: 'success' });
              navigate(PATH_DASHBOARD.admin.moduleCategory.list);
            })
            .catch(() => {
              enqueueSnackbar('Create error', { variant: 'error' });
            });
        }
      } catch (error) {
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, getFieldProps, setFieldValue } = formik;

  useEffect(() => {
    if (currentModuleCategory.moduleId) setModule(getModule(currentModuleCategory.moduleId));
    else if (!values.moduleId) setModule(mockModule);
  });

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit} className={clsx(classes.root, className)} {...other}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              fullWidth
              options={modules}
              value={module}
              getOptionLabel={(m) => m.moduleName}
              onChange={(event, newValue) => {
                setFieldValue('moduleId', newValue.id);
                setModule(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Module"
                  error={Boolean(touched.moduleId && errors.moduleId)}
                  helperText={touched.moduleId && errors.moduleId}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Module Category"
              {...getFieldProps('moduleCategoryName')}
              error={Boolean(touched.moduleCategoryName && errors.moduleCategoryName)}
              helperText={touched.moduleCategoryName && errors.moduleCategoryName}
              className={classes.margin}
            />
          </Grid>
          {module.moduleName === 'health' ? <p>it is helath</p> : <p>it is education</p>}
          <Button onClick={trialformodule}>try</Button>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained">
                {!isEdit ? 'Add Module Category' : 'Save Module Category'}
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}

export default ModuleCategoryForm;
