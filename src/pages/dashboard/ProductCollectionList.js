import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack5';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Table,
  Button,
  TableRow,
  Checkbox,
  TableBody,
  TableCell,
  Container,
  TableContainer,
  TablePagination,
  Switch
} from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProductCollections, updateCollectionStatus, deleteCollection } from '../../redux/slices/productCollection';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';
import { ProductListHead, ProductListToolbar } from '../../components/_dashboard/e-commerce/product-collection';
import MoreMenu from '../../components/MoreMenu';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'photo', label: 'Image', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'aviliablefrom', label: 'Aviliable From', alignRight: false },
  { id: 'aviliableTill', label: 'Aviliable Till', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
];

const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  margin: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadiusSm
}));

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  if (query) {
    return filter(array, (_product) => _product.collectionName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------

export default function ProductCollectionList() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { productCollections } = useSelector((state) => state.productCollection);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('id');
  const [deleteItems, setDeleteItems] = useState([]);

  useEffect(() => {
    dispatch(getProductCollections());
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = productCollections.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const toggleStatus = ({ target: { checked } }, id) => {
    dispatch(updateCollectionStatus(id, checked));
  };

  const handleDelete = (name, id) => {
    setDeleteItems([{ name, id }]);
  };

  const handleDeleteSelected = () => {
    const items = [];
    selected.forEach((id) => {
      items.push({ id });
    });
    setDeleteItems(items);
  };

  const deleteCollections = () => {
    deleteItems.forEach((item) => {
      dispatch(deleteCollection(item.id))
        .then(() => {
          enqueueSnackbar('Delete successful', { variant: 'success' });
        })
        .catch(() => {
          enqueueSnackbar('Delete failed', { variant: 'error' });
        });
    });
    setSelected([]);
    setDeleteItems([]);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productCollections.length) : 0;

  const filteredCollections = applySortFilter(productCollections, getComparator(order, orderBy), filterName);

  const isProductNotFound = filteredCollections.length === 0;

  return (
    <Page title="Ecommerce: Product Collection List | Minimal-UI">
      <Container>
        {deleteItems.length ? (
          <ConfirmDeleteDialog cancel={() => setDeleteItems([])} ok={() => deleteCollections()} items={deleteItems} />
        ) : null}
        <HeaderBreadcrumbs
          heading="Product Collection List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.productCollection.root
            },
            { name: 'Product Collection' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.productCollection.new}
              startIcon={<Icon icon={plusFill} />}
            >
              New Product
            </Button>
          }
        />

        <Card>
          <ProductListToolbar
            numSelected={selected.length}
            handleDelete={handleDeleteSelected}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ProductListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={productCollections.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredCollections.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, collectionName, aviliablefrom, aviliableTill, status, collectionImage } = row;

                    const isItemSelected = selected.indexOf(id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, id)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Box
                            sx={{
                              py: 2,
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <ThumbImgStyle
                              alt={collectionName}
                              src={`${process.env.REACT_APP_API_URL}/${collectionImage}`}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="left">{collectionName}</TableCell>
                        <TableCell style={{ minWidth: 160 }}>{aviliablefrom}</TableCell>
                        <TableCell style={{ minWidth: 160 }}>{aviliableTill}</TableCell>
                        <TableCell align="left">
                          <Switch checked={status} onChange={(e) => toggleStatus(e, id)} />
                        </TableCell>
                        <TableCell align="right">
                          <MoreMenu
                            onDelete={() => handleDelete(collectionName, id)}
                            to={`${PATH_DASHBOARD.productCollection.root}/${id}/edit`}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isProductNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={productCollections.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
