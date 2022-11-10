import * as Yup from 'yup';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik } from 'formik';
import { LoadingButton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { Box, TextField } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { addModule, updateModule } from '../../../../redux/slices/module';
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
ModuleForm.propTypes = {
  className: PropTypes.string,
  isEdit: PropTypes.bool,
  currentModule: PropTypes.object
};

function ModuleForm({ className, isEdit, currentModule, ...other }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const Schema = Yup.object().shape({
    moduleName: Yup.string()
      .required('This field is required')
      .min(2, 'Minimum of 2 characters are required')
      .max(200, 'Should be less than 200 characters')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      moduleName: currentModule?.moduleName || ''
    },
    validationSchema: Schema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (isEdit) {
          dispatch(updateModule(currentModule.id, values))
            .then(() => {
              resetForm();
              setSubmitting(false);
              enqueueSnackbar('Update success', { variant: 'success' });
              navigate(PATH_DASHBOARD.admin.module.list);
            })
            .catch(() => {
              enqueueSnackbar('Update error', { variant: 'error' });
            });
        } else {
          dispatch(addModule(values))
            .then(() => {
              resetForm();
              setSubmitting(false);
              enqueueSnackbar('Create success', { variant: 'success' });
              navigate(PATH_DASHBOARD.admin.module.list);
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

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit} className={clsx(classes.root, className)} {...other}>
        <TextField
          fullWidth
          label="Add Module"
          {...getFieldProps('moduleName')}
          error={Boolean(touched.moduleName && errors.moduleName)}
          helperText={touched.moduleName && errors.moduleName}
          className={classes.margin}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton type="submit" variant="contained" pending={isSubmitting}>
            {!isEdit ? 'Add Module' : 'Save Changes'}
          </LoadingButton>
        </Box>
      </Form>
    </FormikProvider>
  );
}

export default ModuleForm;
