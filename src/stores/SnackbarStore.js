import { observable, decorate, action } from 'mobx';

class SnackbarStore {
  isOpen = false;
  message = '';
  severity = 'info';
  autoHideDuration = 6000;

  openSnackbar = (message = '', severity = 'info', autoHideDuration = 6000) => {
    this.isOpen = true;
    this.message = message;
    this.severity = severity;
    this.autoHideDuration = autoHideDuration;
  };

  closeSnackbar = () => {
    this.isOpen = false;
    this.message = '';
    this.severity = 'info';
    this.autoHideDuration = 6000;
  };
}

decorate(SnackbarStore, {
  autoHideDuration: observable,
  isOpen: observable,
  message: observable,
  severity: observable,

  openSnackbar: action,
  closeSnackbar: action,
});

export default new SnackbarStore();
