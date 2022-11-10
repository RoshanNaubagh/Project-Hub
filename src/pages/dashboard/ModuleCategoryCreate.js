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
import { ModuleCategoryForm } from '../../components/_dashboard/organization/moduleCategory';
import { resetForm, getModuleCategoryById } from '../../redux/slices/moduleCategory';
import { getModules } from '../../redux/slices/module';

// ----------------------------------------------------------------------

export default function ModuleCategoryCreate() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { moduleCategory } = useSelector((state) => state.moduleCategory);
  const { modulesList } = useSelector((state) => state.module);
  const isEdit = Boolean(id);

  useEffect(() => {
    dispatch(getModules());
    if (id) {
      dispatch(getModuleCategoryById(id));
    } else {
      dispatch(resetForm());
    }
  }, [id, dispatch]);

  return (
    <Page title={!isEdit ? 'Create a New Module Category' : 'Edit Module Category'}>
      <Container>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a New Module Category' : 'Edit Module Category'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Admin', href: PATH_DASHBOARD.root },
            {
              name: 'Module Category',
              href: PATH_DASHBOARD.admin.moduleCategory.root
            },
            { name: !isEdit ? 'New Module Category' : moduleCategory.moduleCategoryName }
          ]}
        />

        <ModuleCategoryForm isEdit={isEdit} currentModuleCategory={moduleCategory} modules={modulesList} />
      </Container>
    </Page>
  );
}
