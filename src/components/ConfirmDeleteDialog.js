import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

ConfirmDeleteDialog.propTypes = {
  ok: PropTypes.func,
  cancel: PropTypes.func,
  items: PropTypes.array
};

export default function ConfirmDeleteDialog({ cancel, ok, items = [] }) {
  return (
    <div>
      <Dialog open onClose={cancel} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete {items[0].name ? `"${items[0].name}"` : ''}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancel} color="info" autoFocus>
            Cancel
          </Button>
          <Button onClick={ok} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
