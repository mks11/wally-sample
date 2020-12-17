import { observable, decorate, action } from 'mobx';

class SnackbarStore {
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' };
  autoHideDuration = 6000;
  isOpen = false;
  message = '';
  severity = 'info';

  openSnackbar = (
    message = '',
    severity = 'info',
    autoHideDuration = 6000,
    anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  ) => {
    this.isOpen = true;
    this.message = message;
    this.severity = severity;
    this.autoHideDuration = autoHideDuration;
    this.anchorOrigin = anchorOrigin;
  };

  closeSnackbar = () => {
    this.isOpen = false;
  };
}

decorate(SnackbarStore, {
  anchorOrigin: observable,
  autoHideDuration: observable,
  isOpen: observable,
  message: observable,
  severity: observable,

  openSnackbar: action,
  closeSnackbar: action,
});

export default new SnackbarStore();
