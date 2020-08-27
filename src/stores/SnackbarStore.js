import { observable, decorate, action } from "mobx";

class SnackbarStore {
  isOpen = false;
  message = "";
  severity = "info";

  openSnackbar(message = "", severity = "info") {
    this.isOpen = true;
    this.message = message;
    this.severity = severity;
  }

  closeSnackbar() {
    this.isOpen = false;
    this.message = "";
    this.severity = "info";
  }
}

decorate(SnackbarStore, {
  isOpen: observable,
  message: observable,
  severity: observable,

  openSnackbar: action,
  closeSnackbar: action,
});

export default new SnackbarStore();
