import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProduct } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ProductNewForm from '../../components/_dashboard/e-commerce/ProductNewForm';

// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { product } = useSelector((state) => state.product);
  const isEdit = pathname.includes('edit');

  useEffect(() => {
    if (isEdit) {
      dispatch(getProduct(id));
    }
  }, [dispatch, isEdit, id]);

  return (
    <Page title="Ecommerce: Create a new product | Minimal-UI">
      <Container>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new product' : 'Edit product'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root
            },
            { name: !isEdit ? 'New product' : 'edit product' }
          ]}
        />

        <ProductNewForm isEdit={isEdit} currentProduct={product} />
      </Container>
    </Page>
  );
}
