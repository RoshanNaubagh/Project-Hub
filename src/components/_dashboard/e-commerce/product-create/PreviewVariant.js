import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import DeepEqual from 'fast-deep-equal/react';
import { setProductVariantList } from '../../../../redux/slices/productVariant';

PreviewVariant.propTypes = {
  variants: PropTypes.array,
  defaultValues: PropTypes.object
};

function PreviewVariant({ variants, defaultValues }) {
  const dispatch = useDispatch();
  const variantArrRef = useRef(variants);

  if (!DeepEqual(variantArrRef.current, variants)) {
    variantArrRef.current = variants;
  }

  const { productVariantList } = useSelector((state) => state.productVariant);

  const onChangeHandler = ({ target: { name, value } }, label) => {
    const newProductVariants = [];
    productVariantList.forEach((v) => {
      const variant = { ...v };
      if (v.label === label) {
        variant[name] = value;
      }
      newProductVariants.push(variant);
    });

    dispatch(setProductVariantList(newProductVariants));
  };

  useEffect(() => {
    const optionRows = [];
    variants.forEach((opts) => {
      let variant = '';
      let label;
      if (opts instanceof Array) {
        opts.map((option) => (variant += `${option} /`));

        label = variant.split('/');
        label.pop();
        label = label.join(' / ');
      } else {
        label = opts;
      }
      optionRows.push({ label, price: defaultValues.price, quantity: defaultValues.qunatity, sku: '', barcode: '' });
    });

    const newProductVariants = [];
    optionRows.forEach((o) => {
      /* eslint-disable-next-line no-plusplus */
      for (let i = 0; i < productVariantList.length; i++) {
        if (o.label.match(productVariantList[i].label)) {
          o.price = productVariantList[i].price;
          o.quantity = productVariantList[i].quantity;
          o.sku = productVariantList[i].sku;
          o.barcode = productVariantList[i].barcode;
          break;
        }
      }
      newProductVariants.push(o);
    });
    dispatch(setProductVariantList(newProductVariants));
    // eslint-disable-next-line
  }, [variantArrRef.current]);

  return (
    <TableContainer component={Paper}>
      <Table style={{ width: '900px' }}>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '200px' }}>Variant</TableCell>
            <TableCell align="left" style={{ width: '200px' }}>
              Price
            </TableCell>
            <TableCell align="left" style={{ width: '50px' }}>
              Quantity
            </TableCell>
            <TableCell align="left" style={{ width: '200px' }}>
              SKU
            </TableCell>
            <TableCell align="left" style={{ width: '200px' }}>
              Barcode
            </TableCell>
            <TableCell align="center" />
          </TableRow>
        </TableHead>
        <TableBody>
          {productVariantList.map((variant, index) => (
            <VarRow key={index} onChangeHandler={onChangeHandler} variant={variant} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

VarRow.propTypes = {
  onChangeHandler: PropTypes.func,
  variant: PropTypes.object
};

function VarRow({ onChangeHandler, variant }) {
  return (
    <TableRow key={variant.label}>
      <TableCell>{variant.label}</TableCell>
      <TableCell>
        <FormControl fullWidth variant="outlined" size="small">
          <OutlinedInput
            name="price"
            type="number"
            value={variant.price}
            onChange={(e) => onChangeHandler(e, variant.label)}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            placeholder="0.00"
          />
        </FormControl>
      </TableCell>
      <TableCell>
        <TextField
          name="quantity"
          value={variant.quantity}
          onChange={(e) => onChangeHandler(e, variant.label)}
          type="number"
          variant="outlined"
          size="small"
        />
      </TableCell>
      <TableCell>
        <TextField
          name="sku"
          value={variant.sku}
          onChange={(e) => onChangeHandler(e, variant.label)}
          variant="outlined"
          size="small"
          placeholder="SKU"
        />
      </TableCell>
      <TableCell>
        <TextField
          name="barcode"
          value={variant.barcode}
          onChange={(e) => onChangeHandler(e, variant.label)}
          variant="outlined"
          size="small"
          placeholder="Barcode"
        />
      </TableCell>
      <TableCell>
        <Delete />
      </TableCell>
    </TableRow>
  );
}

export default PreviewVariant;
