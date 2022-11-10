import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    // Dashboard Routes
    {
      path: 'dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/ecommerce" replace /> },
        {
          path: 'admin',
          children: [
            {
              path: 'module',
              children: [
                { path: 'new', element: <ModuleForm /> },
                { path: 'list', element: <ModuleList /> },
                { path: '/:id/edit', element: <ModuleForm /> }
              ]
            },
            {
              path: 'module-category',
              children: [
                { path: 'new', element: <ModuleCategoryForm /> },
                { path: 'list', element: <ModuleCategoryList /> },
                { path: '/:id/edit', element: <ModuleCategoryForm /> }
              ]
            }
          ]
        },
        { path: 'ecommerce', element: <GeneralEcommerce /> },
        // User
        {
          path: 'user',
          children: [
            { path: '/', element: <Navigate to="/dashboard/user/profile" replace /> },
            { path: 'list', element: <UserList /> },
            { path: 'new', element: <UserCreate /> },
            { path: '/:name/edit', element: <UserCreate /> },
            { path: 'account', element: <UserAccount /> }
          ]
        },
        {
          path: 'e-commerce',
          children: [
            { path: '/', element: <Navigate to="/dashboard/e-commerce/shop" replace /> },
            { path: 'shop', element: <EcommerceShop /> },
            { path: 'product/:name', element: <EcommerceProductDetails /> },
            { path: 'product/list', element: <EcommerceProductList /> },
            { path: 'product/new', element: <EcommerceProductCreate /> },
            { path: 'product/:name/edit', element: <EcommerceProductCreate /> },
            { path: 'checkout', element: <EcommerceCheckout /> },
            { path: 'invoice', element: <EcommerceInvoice /> }
          ]
        },
        {
          path: 'product-collection',
          children: [
            { path: '/', element: <Navigate to="/dashboard/product-collection/list" replace /> },
            { path: '/new', element: <ProductCollectionForm /> },
            { path: '/list', element: <ProductCollectionList /> },
            { path: '/:id/edit', element: <ProductCollectionForm /> }
          ]
        },
        // Real Estate
        {
          path: 'realEstate',
          children: [
            { path: '/', element: <Navigate to="/dashboard/realEstateNewPost" replace /> },
            { path: 'new-post', element: <RealEstateNewPost /> },
            { path: '/list', element: <ListingDetailsList /> },
            { path: '/:id/edit', element: <RealEstateNewPost /> }
          ]
        }
      ]
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [{ path: '/', element: <LandingPage /> }]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// IMPORT COMPONENTS

// Dashboard
// User
const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));
// Ecommerce
const GeneralEcommerce = Loadable(lazy(() => import('../pages/dashboard/GeneralEcommerce')));
const EcommerceShop = Loadable(lazy(() => import('../pages/dashboard/EcommerceShop')));
const EcommerceProductDetails = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductDetails')));
const EcommerceProductList = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductList')));
const EcommerceProductCreate = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductCreate')));
const EcommerceCheckout = Loadable(lazy(() => import('../pages/dashboard/EcommerceCheckout')));
const EcommerceInvoice = Loadable(lazy(() => import('../pages/dashboard/EcommerceInvoice')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
// RealEstate
const RealEstateNewPost = Loadable(lazy(() => import('../pages/dashboard/RealEstateNewPost')));
// Main
const LandingPage = Loadable(lazy(() => import('../pages/LandingPage')));
// product Collection
const ProductCollectionForm = Loadable(lazy(() => import('../pages/dashboard/ProductCollectionCreate')));
const ProductCollectionList = Loadable(lazy(() => import('../pages/dashboard/ProductCollectionList')));
// Module
const ModuleForm = Loadable(lazy(() => import('../pages/dashboard/ModuleCreate')));
const ModuleList = Loadable(lazy(() => import('../pages/dashboard/ModuleList')));
// Module Category
const ModuleCategoryForm = Loadable(lazy(() => import('../pages/dashboard/ModuleCategoryCreate')));
const ModuleCategoryList = Loadable(lazy(() => import('../pages/dashboard/ModuleCategoryList')));

const ListingDetailsList = Loadable(lazy(() => import('../pages/dashboard/ListingDetailsList')));
