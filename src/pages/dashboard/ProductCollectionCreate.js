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
import { ProductCollectionForm } from '../../components/_dashboard/e-commerce/product-collection';
import { resetProductCollectionState, getProductCollectionById } from '../../redux/slices/productCollection';

// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { productCollection } = useSelector((state) => state.productCollection);
  const isEdit = Boolean(id);

  useEffect(() => {
    if (id) {
      dispatch(getProductCollectionById(id));
    } else {
      dispatch(resetProductCollectionState());
    }
  }, [id, dispatch]);

  return (
    <Page title={!isEdit ? 'Create a new product collection' : 'Edit product collection'}>
      <Container>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new product collection' : 'Edit product collection'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Product Collection',
              href: PATH_DASHBOARD.productCollection.root
            },
            { name: !isEdit ? 'New product collection' : productCollection.collectionName }
          ]}
        />

        <ProductCollectionForm isEdit={isEdit} currentCollection={productCollection} />
      </Container>
    </Page>
  );
}
