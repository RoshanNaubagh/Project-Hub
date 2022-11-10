import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { ModuleForm } from '../../components/_dashboard/organization/module';
import { resetForm, getModuleById } from '../../redux/slices/module';

// ----------------------------------------------------------------------

export default function ModuleCreate() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { module } = useSelector((state) => state.module);
  const isEdit = Boolean(id);

  useEffect(() => {
    if (id) {
      dispatch(getModuleById(id));
    } else {
      dispatch(resetForm());
    }
  }, [id, dispatch]);

  return (
    <Page title={!isEdit ? 'Create a New Module' : 'Edit Module'}>
      <Container>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a New Module' : 'Edit Module'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Admin', href: PATH_DASHBOARD.root },
            {
              name: 'Module',
              href: PATH_DASHBOARD.admin.module.root
            },
            { name: !isEdit ? 'New Module' : module.moduleName }
          ]}
        />

        <ModuleForm isEdit={isEdit} currentModule={module} />
      </Container>
    </Page>
  );
}
