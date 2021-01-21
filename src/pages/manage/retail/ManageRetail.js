import React, { Component } from 'react';

// API
import { createProducts, updateProducts } from 'api/product';

// Custom Components
import Title from 'common/page/Title';

// MaterialUI
import { Button, Paper } from '@material-ui/core';

// Utilities
import { connect } from 'utils';

class ManageRetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      errors: [],
      loading: false,
    };
    this.userStore = props.store.user;
    this.adminStore = props.store.admin;
    this.modalStore = props.store.modal;
  }

  componentDidMount() {
    this.userStore
      .getStatus(true)
      .then((status) => {
        const user = this.userStore.user;
        if (
          status &&
          (user.type === 'admin' ||
            user.type === 'super-admin' ||
            user.type === 'tws-ops' ||
            user.type === 'retail')
        ) {
        } else {
          this.props.store.routing.push('/');
        }
      })
      .catch((error) => {
        this.props.store.routing.push('/');
      });
  }

  onUploadProducts = async (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      const formData = new FormData();
      formData.append('file', this.state.file[0]);
      let fileName = this.state.file[0].name;
      try {
        const auth = this.userStore.getHeaderAuth();
        await createProducts(fileName, formData, auth);
      } catch (error) {
        this.modalStore.toggleModal('error');
      } finally {
        this.setState({
          loading: false,
          file: null,
        });
      }
    } else {
      this.setState({
        errors: this.state.errors.concat('Please add a CSV file.'),
        loading: false,
      });
    }
  };

  onUploadProductEdits = async (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      const formData = new FormData();
      formData.append('file', this.state.file[0]);
      let fileName = this.state.file[0].name;
      try {
        const auth = this.userStore.getHeaderAuth();
        await updateProducts(fileName, formData, auth);
      } catch (error) {
        this.modalStore.toggleModal('error');
      } finally {
        this.setState({
          loading: false,
          file: null,
        });
      }
    } else {
      this.setState({
        errors: this.state.errors.concat('Please add a CSV file.'),
        loading: false,
      });
    }
  };

  onUploadSKUs = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      const formData = new FormData();
      formData.append('file', this.state.file[0]);
      let fileName = this.state.file[0].name;
      this.adminStore
        .uploadSKUs(fileName, formData)
        .catch(() => {
          this.modalStore.toggleModal('error');
        })
        .finally(() => {
          this.setState({
            loading: false,
            file: null,
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat('Please add a CSV file.'),
        loading: false,
      });
    }
  };

  onUploadVendors = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      const formData = new FormData();
      formData.append('file', this.state.file[0]);
      let fileName = this.state.file[0].name;
      this.adminStore
        .uploadVendors(fileName, formData)
        .catch(() => {
          this.modalStore.toggleModal('error');
        })
        .finally(() => {
          this.setState({
            loading: false,
            file: null,
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat('Please add a CSV file.'),
        loading: false,
      });
    }
  };

  onUploadCategories = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      const formData = new FormData();
      formData.append('file', this.state.file[0]);
      let fileName = this.state.file[0].name;
      this.adminStore
        .uploadCategories(fileName, formData)
        .catch(() => {
          this.modalStore.toggleModal('error');
        })
        .finally(() => {
          this.setState({
            loading: false,
            file: null,
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat('Please add a CSV file.'),
        loading: false,
      });
    }
  };

  onUploadShipments = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      const formData = new FormData();
      formData.append('file', this.state.file[0]);
      let fileName = this.state.file[0].name;
      this.adminStore
        .uploadShipments(fileName, formData)
        .catch(() => {
          this.modalStore.toggleModal('error');
        })
        .finally(() => {
          this.setState({
            loading: false,
            file: null,
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat('Please add a CSV file.'),
        loading: false,
      });
    }
  };

  onUploadProductRetirements = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      const formData = new FormData();
      formData.append('file', this.state.file[0]);
      let fileName = this.state.file[0].name;
      this.adminStore
        .uploadProductRetirements(fileName, formData)
        .catch(() => {
          this.modalStore.toggleModal('error');
        })
        .finally(() => {
          this.setState({
            loading: false,
            file: null,
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat('Please add a CSV file.'),
        loading: false,
      });
    }
  };

  handleFileUpload = (event) => {
    this.setState({ file: event.target.files });
  };

  isFormValid = ({ file }) => file;

  displayErrors = (errors) => (
    <p style={{ fontSize: '1.25em', color: 'red' }}>
      {errors[errors.length - 1]}
    </p>
  );

  handleInputError = (errors, inputName) => {
    return errors.some((error) => error.toLowerCase().includes(inputName))
      ? 'error'
      : ' ';
  };

  render() {
    if (!this.userStore.user) return null;
    const { errors, loading } = this.state;

    return (
      <div>
        <Title content="Retail Upload" />
        <Paper
          className="product-selection-container"
          style={{ backgroundColor: '#faf5ee' }}
        >
          <div
            className="product-selection-container-inner"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="product-selection-upload">
              {errors.length > 0 && (
                <div style={{ marginTop: '-2.5%' }}>
                  {this.displayErrors(errors)}
                </div>
              )}
              <h3>Upload</h3>

              <div className="product-selection-button">
                <form
                  onSubmit={this.onUploadProducts}
                  className={this.handleInputError(errors, 'file')}
                >
                  <input
                    type="file"
                    id="file"
                    onChange={this.handleFileUpload}
                  />
                  <Button
                    disabled={loading}
                    className={loading ? 'loading' : ''}
                    style={{ textTransform: 'none' }}
                    size="medium"
                    type="submit"
                  >
                    Upload Products
                  </Button>
                </form>
              </div>

              <div className="product-selection-button">
                <form
                  onSubmit={this.onUploadVendors}
                  className={this.handleInputError(errors, 'file')}
                >
                  <input
                    type="file"
                    id="file"
                    onChange={this.handleFileUpload}
                  />
                  <Button
                    disabled={loading}
                    className={loading ? 'loading' : ''}
                    style={{ textTransform: 'none' }}
                    size="medium"
                    type="submit"
                  >
                    Upload Vendors
                  </Button>
                </form>
              </div>

              <div className="product-selection-button">
                <form
                  onSubmit={this.onUploadCategories}
                  className={this.handleInputError(errors, 'file')}
                >
                  <input
                    type="file"
                    id="file"
                    onChange={this.handleFileUpload}
                  />
                  <Button
                    disabled={loading}
                    className={loading ? 'loading' : ''}
                    style={{ textTransform: 'none' }}
                    size="medium"
                    type="submit"
                  >
                    Upload Internal Cats
                  </Button>
                </form>
              </div>

              <div className="product-selection-button">
                <form
                  onSubmit={this.onUploadShipments}
                  className={this.handleInputError(errors, 'file')}
                >
                  <input
                    type="file"
                    id="file"
                    onChange={this.handleFileUpload}
                  />
                  <Button
                    disabled={loading}
                    className={loading ? 'loading' : ''}
                    style={{ textTransform: 'none' }}
                    size="medium"
                    type="submit"
                  >
                    Upload Shipments
                  </Button>
                </form>
              </div>

              <div className="product-selection-button">
                <form
                  onSubmit={this.onUploadProductRetirements}
                  className={this.handleInputError(errors, 'file')}
                >
                  <input
                    type="file"
                    id="file"
                    onChange={this.handleFileUpload}
                  />
                  <Button
                    disabled={loading}
                    className={loading ? 'loading' : ''}
                    style={{ textTransform: 'none' }}
                    size="medium"
                    type="submit"
                  >
                    Upload Product Actions
                  </Button>
                </form>
              </div>

              <div className="product-selection-button">
                <form
                  onSubmit={this.onUploadProductEdits}
                  className={this.handleInputError(errors, 'file')}
                >
                  <input
                    type="file"
                    id="file"
                    onChange={this.handleFileUpload}
                  />
                  <Button
                    disabled={loading}
                    className={loading ? 'loading' : ''}
                    style={{ textTransform: 'none' }}
                    size="medium"
                    type="submit"
                  >
                    Upload Product Edits
                  </Button>
                </form>
              </div>

              <div className="product-selection-button">
                <form
                  onSubmit={this.onUploadSKUs}
                  className={this.handleInputError(errors, 'file')}
                >
                  <input
                    type="file"
                    id="file"
                    onChange={this.handleFileUpload}
                  />
                  <Button
                    disabled={loading}
                    className={loading ? 'loading' : ''}
                    style={{ textTransform: 'none' }}
                    size="medium"
                    type="submit"
                  >
                    Upload SKUs
                  </Button>
                </form>
              </div>

              <div>
                Remember: Refresh page after each upload. Delete any extra
                header rows from the CSV - there should only be 1 row of headers
              </div>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default connect('store')(ManageRetail);
