import React, { useState } from "react";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import {
  Grid,
  Button,
  Container,
  ListItem,
  ListItemText,
  List,
  Divider,
  Dialog,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { connect } from "utils";
import JarOrLidDialog from "./JarOrLidOptionsDialog";
import axios from "axios";
import { API_POST_PACKAGING_RETURNS } from "../../../config";
import TrackingDialogInput from "./TrackingDialogInput";

//TODO ask for persistance

const SUCCESS_COMPLETED = "successType1";
const SUCCESS_REQUIRES_TRACKING = "successType2";
const SUCCESS_NOT_COMPLETED = "successType3";

function NewReturnForm({ user_id, packagingURLs = [] }) {
  const [successType, setSuccessType] = useState();
  const [showTrackingInputDialog, setShowTrackingInputDialog] = useState(false);

  // if (!user_id) {
  //   return <div>Please login!</div>;
  // }

  const submitNewReturn = async ({
    Tracking_id = "",
    packaging_urls,
    warehouse_associate_id,
  }: data) => {
    const url = API_POST_PACKAGING_RETURNS;
    return await axios.post(url, {
      ...data,
    });
  };

  const handleTrackingIdSubmit = () => {};

  const setCorrectTypeOfSuccess = (data) => {
    //todo
  };

  useEffect(() => {
    if (successType === SUCCESS_COMPLETED) {
      // done!
      return
    } elseif(successType === SUCCESS_REQUIRES_TRACKING){
      setShowTrackingInputDialog(true);
    } else {
      
    }
  }, [successType]);

  const handleSubmit = async (values, { setSubmitting }) => {
    // setTimeout(() => {
    //   alert(JSON.stringify(values));
    //   setSubmitting(false);
    //   setShowTrackingInputDialog(false);
    // }, 400);

    try {
      const { status, data } = await submitNewReturn(values);
      if (status === "200") {
        setCorrectTypeOfSuccess(data); //TODO
      }
    } catch {
      // handle error //TODO
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Grid
        item
        style={{
          maxHeight: "100%",
          overflow: "auto",
          border: "1px solid green",
        }}
      >
        <List dense>
          {packagingURLs.map((url) => (
            <ListItem key={url}>
              <ListItemText>
                <Typography
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    maxWidth: "400px",
                  }}
                  maxWidth="sm"
                  variant="body1"
                >
                  {url}
                </Typography>
              </ListItemText>
              <Divider />
            </ListItem>
          ))}
        </List>
      </Grid>
      <Formik
        initialValues={{
          Tracking_id: "",
          packaging_urls: packagingURLs,
          warehouse_associate_id: user_id,
        }}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        <Form style={{ border: "1px solid red" }}>
          <TrackingDialogInput
            show={showTrackingInputDialog}
            setShow={(val) => {
              setShowTrackingInputDialog(val);
            }}
          />
          <Grid container xs={12}>
            <Grid container item xs={12} justify={"space-around"}>
              <Grid item>
                <Button variant={"outlined"} type="submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </div>
  );
}

// const JarOrLidOptions = ({ packagingReturn, onSelect }) => {
//   const handleSelect = (val) => {
//     onSelect(val);
//   };

//   return (
//     <Container justify="center" flexDirection="column" style={{ flex: 1 }}>
//       <List>
//         <ListItem button onClick={() => handleSelect("jar")}>
//           <ListItemText>Jar</ListItemText>
//         </ListItem>
//         <ListItem button onClick={() => handleSelect("lid")}>
//           <ListItemText>Lid</ListItemText>
//         </ListItem>
//       </List>
//     </Container>
//   );
// };

function NewPackagingReturn({
  store: { user: userStore, packagingReturn, modal },
}) {
  const [isJarOrLidOpen, setJarOrLidOpen] = useState(false);

  // // todo styles
  // const handleJarOrLidSelect = (val) => {
  //   packagingReturn.addPackagingURL(val);
  // };

  const user_id = userStore.user && userStore.user._id;

  const handleClose = (selectedValue) => {
    setJarOrLidOpen(false);
    if (!!selectedValue) {
      packagingReturn.addPackagingURL(selectedValue);
    }
  };

  const handleMissingQRCode = () => {
    // modal.toggleModal(
    //   "generic",
    //   null,
    //   null,
    //   <JarOrLidOptions
    //     packagingReturn={packagingReturn}
    //     onSelect={handleJarOrLidSelect}
    //   />
    // );
    setJarOrLidOpen(true);
  };
  const handleTrackingIdRequest = () => {
    // modal.toggleModal(
    //   "generic",
    //   null,
    //   null,
    //   <Container
    //     justify="center"
    //     flexDirection="column"
    //     style={{ flex: 1 }}
    //   ></Container>
    // );
  };

  const handleScanQRCode = () => {};
  return (
    <Container
      style={{
        // flex: 1,
        flexDirection: "column",
        border: "1px solid blue",
        height: "80vh",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: "2rem",
      }}
      maxWidth="sm"
    >
      <h2 className={{ textAlign: "center" }}>New Packaging Return </h2>

      <NewReturnForm
        packagingURLs={packagingReturn.packaging_urls.toJS()}
        user_id={user_id}
      />
      <Divider />
      <div style={{ border: "1px solid pink" }}>
        <JarOrLidDialog open={isJarOrLidOpen} onClose={handleClose} />
        <Button variant="primary" size="large" onClick={handleMissingQRCode}>
          Missing QR Code
        </Button>
        <Button variant="primary" size="large" onClick={handleScanQRCode}>
          Scan QR Code
        </Button>
      </div>
    </Container>
  );
}

NewPackagingReturn.propTypes = {};

// mobx v5 work around for hooks
class _NewPackagingReturn extends React.Component {
  render() {
    return <NewPackagingReturn {...this.props} />;
  }
}

export default connect("store")(_NewPackagingReturn);
