// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  admin: {
    // module
    module: {
      root: path(ROOTS_DASHBOARD, '/admin/module'),
      new: path(ROOTS_DASHBOARD, '/admin/module/new'),
      list: path(ROOTS_DASHBOARD, '/admin/module/list')
    },
    // module category
    moduleCategory: {
      root: path(ROOTS_DASHBOARD, '/admin/module-category'),
      new: path(ROOTS_DASHBOARD, '/admin/module-category/new'),
      list: path(ROOTS_DASHBOARD, '/admin/module-category/list')
    }
  },
  general: {
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce')
  },
  app: {
    root: path(ROOTS_DASHBOARD, '/app')
  },
  // User
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    newUser: path(ROOTS_DASHBOARD, '/user/new'),
    editById: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
    account: path(ROOTS_DASHBOARD, '/user/account')
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    // product
    product: path(ROOTS_DASHBOARD, '/e-commerce/product/:name'),
    productById: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/product/list'),
    newProduct: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    editById: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    invoice: path(ROOTS_DASHBOARD, '/e-commerce/invoice')
  },
  // product collection
  productCollection: {
    root: path(ROOTS_DASHBOARD, '/product-collection'),
    new: path(ROOTS_DASHBOARD, '/product-collection/new'),
    list: path(ROOTS_DASHBOARD, '/product-collection/list'),
    editById: path(ROOTS_DASHBOARD, '/product-collection/1/edit')
  },
  // RealEstate
  realEstate: {
    root: path(ROOTS_DASHBOARD, '/realEstate'),
    newPost: path(ROOTS_DASHBOARD, '/realEstate/new-post'),
    editById: path(ROOTS_DASHBOARD, '/realEstate/1/edit'),
    list: path(ROOTS_DASHBOARD, '/realEstate/list')
  }
};
