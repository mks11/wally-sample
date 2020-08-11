import React from "react";
import { Backdrop, CircularProgress, Grid, Modal } from "@material-ui/core";
import styled from "styled-components";
import { connect } from "utils";

const ModalBackdrop = styled(Backdrop)`
  background-color: rgba(255, 255, 255, 0.7);
`;

const ModalBodyWrapper = styled(Grid)`
  height: 100vh;
`;

class LoadingSpinnerModal extends React.Component {
  constructor(props) {
    super(props);

    this.loading = this.props.store.loading;
  }

  render() {
    return (
      <Modal
        open={this.loading.isOpen}
        BackdropComponent={ModalBackdrop}
        onClose={this.loading.toggle}
      >
        <ModalBodyWrapper container justify="center" alignItems="center">
          <Grid item>
            <CircularProgress size="4rem" />
          </Grid>
        </ModalBodyWrapper>
      </Modal>
    );
  }
}

export default connect("store")(LoadingSpinnerModal);
