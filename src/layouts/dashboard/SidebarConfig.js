// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard')
};

const sidebarConfig = [
  // ADMIN
  // ----------------------------------------------------------------------
  {
    subheader: 'admin',
    items: [
      // ADMIN : MODULE
      {
        title: 'module',
        path: PATH_DASHBOARD.admin.module.root,
        icon: ICONS.ecommerce,
        children: [
          { title: 'new', path: PATH_DASHBOARD.admin.module.new },
          { title: 'list', path: PATH_DASHBOARD.admin.module.list }
        ]
      },
      // ADMIN : MODULE CATEGORY
      {
        title: 'module category',
        path: PATH_DASHBOARD.admin.moduleCategory.root,
        icon: ICONS.ecommerce,
        children: [
          { title: 'new', path: PATH_DASHBOARD.admin.moduleCategory.new },
          { title: 'list', path: PATH_DASHBOARD.admin.moduleCategory.list }
        ]
      }
    ]
  },
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [{ title: 'e-commerce', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.ecommerce }]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // MANAGEMENT : USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'list', path: PATH_DASHBOARD.user.list },
          { title: 'create', path: PATH_DASHBOARD.user.newUser },
          { title: 'edit', path: PATH_DASHBOARD.user.editById },
          { title: 'account', path: PATH_DASHBOARD.user.account }
        ]
      },
      // MANAGEMENT : E-COMMERCE
      {
        title: 'e-commerce',
        path: PATH_DASHBOARD.eCommerce.root,
        icon: ICONS.cart,
        children: [
          { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop },
          { title: 'product', path: PATH_DASHBOARD.eCommerce.productById },
          { title: 'list', path: PATH_DASHBOARD.eCommerce.list },
          { title: 'create', path: PATH_DASHBOARD.eCommerce.newProduct },
          { title: 'edit', path: PATH_DASHBOARD.eCommerce.editById },
          { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout },
          { title: 'invoice', path: PATH_DASHBOARD.eCommerce.invoice }
        ]
      },
      // MANAGEMENT : COLLECTION
      {
        title: 'Product Collection',
        path: PATH_DASHBOARD.productCollection.list,
        icon: ICONS.user,
        children: [
          { title: 'New', path: PATH_DASHBOARD.productCollection.new },
          { title: 'List', path: PATH_DASHBOARD.productCollection.list }
        ]
      },
      // Real Estate
      // MANAGEMENT : BLOG
      {
        title: 'realEstate',
        path: PATH_DASHBOARD.realEstate.root,
        icon: ICONS.blog,
        children: [{ title: 'new post', path: PATH_DASHBOARD.realEstate.newPost }]
      }
    ]
  }
];

export default sidebarConfig;
