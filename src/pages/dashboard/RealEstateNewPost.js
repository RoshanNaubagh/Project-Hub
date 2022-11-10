import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getListingDetail } from '../../redux/slices/listingDetails';
import { getRealEstateImages } from '../../redux/slices/realEstateImage';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import RealEstateNewPostForm from '../../components/_dashboard/realEstate/RealEstateNewPostForm';

// ----------------------------------------------------------------------

export default function RealEstateNewPost() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { listing } = useSelector((state) => state.listingDetail);
  // const isEdit = pathname.includes('edit');
  const isEdit = Boolean(id);

  useEffect(() => {
    if (id) {
      dispatch(getListingDetail(id));
      dispatch(getRealEstateImages(id));
    }
  }, [id, dispatch]);

  return (
    <Page title={!isEdit ? 'Create Real Estate Category listing' : 'Edit Listing'}>
      <Container>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new Listing' : 'Edit Listing'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'RealEstate',
              href: PATH_DASHBOARD.realEstate.root
            },
            { name: !isEdit ? 'New Real Estate listing' : 'Edit' }
          ]}
        />

        <RealEstateNewPostForm isEdit={isEdit} currentListingDetail={listing} />
      </Container>
    </Page>
  );
}
