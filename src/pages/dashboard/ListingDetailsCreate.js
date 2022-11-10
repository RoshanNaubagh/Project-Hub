import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getListingDetail } from '../../redux/slices/listingDetails';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import RealEstateNewPostForm from '../../components/_dashboard/realEstate/RealEstateNewPostForm';

// ----------------------------------------------------------------------

export default function ListingDetailsCreate() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { listingDetail } = useSelector((state) => state.listingDetail);
  const isEdit = pathname.includes('edit');

  useEffect(() => {
    if (isEdit) {
      dispatch(getListingDetail(id));
    }
  }, [dispatch, isEdit, id]);

  return (
    <Page title="Ecommerce: Create a new product | Minimal-UI">
      <Container>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new Listing' : 'Edit Listing'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.realEstatelestate.root
            },
            { name: !isEdit ? 'New Real Estate listing' : listingDetail.listingTitle }
          ]}
        />

        <RealEstateNewPostForm isEdit={isEdit} currentListingDetail={listingDetail} />
      </Container>
    </Page>
  );
}
