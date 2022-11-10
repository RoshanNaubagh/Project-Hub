import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
import { makeStyles } from '@material-ui/styles';
import { Box, Toolbar, Tooltip, IconButton, Typography, InputAdornment, OutlinedInput } from '@material-ui/core';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => {
  const isLight = theme.palette.mode === 'light';
  return {
    root: {
      height: 96,
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(0, 1, 0, 3)
    },
    search: {
      width: 240,
      transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter
      }),
      '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
      '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${theme.palette.grey[500_32]} !important`
      }
    },
    highlight: isLight
      ? {
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.lighter
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.dark
        }
  };
});

// ----------------------------------------------------------------------

ToolbarTable.propTypes = {
  numSelected: PropTypes.number,
  handleDelete: PropTypes.func,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  className: PropTypes.string
};

function ToolbarTable({ numSelected, handleDelete, filterName, onFilterName, className }) {
  const classes = useStyles();

  const renderActions = (numSelected) => {
    let Actions;
    if (numSelected > 0) {
      Actions = (
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <Icon icon={trash2Fill} />
          </IconButton>
        </Tooltip>
      );
    } else {
      Actions = (
        <Tooltip title="Filter list">
          <IconButton>
            <Icon icon={roundFilterList} />
          </IconButton>
        </Tooltip>
      );
    }
    return Actions;
  };

  return (
    <Toolbar className={clsx(classes.root, { [classes.highlight]: numSelected > 0 }, className)}>
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder="Search module..."
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
          className={classes.search}
        />
      )}
      {renderActions(numSelected)}
    </Toolbar>
  );
}

export default ToolbarTable;
