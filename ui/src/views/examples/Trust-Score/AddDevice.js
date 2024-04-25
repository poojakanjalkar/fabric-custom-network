import { getTimeStamp } from "helper/utils";
import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormFeedback,
  Card,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  CustomInput,
} from "reactstrap";
export default function AddDevice(props) {
  const { className, modal, toggle } = props;
  const [name, setName] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [calibrationDate, setCalibrationDate] = useState("");
  const [calibrationExpiryDate, setCalibrationExpiryDate] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  // console.log("----------props---------", props);

  // useEffect(() => {
  //   console.log("--------isEdit changed--------", props)
  //   if (props.isEdit) {
  //     setName(props?.editData?.name);
  //     setDeviceId(props?.editData?.deviceId);
  //   }else{

  //   }
  // }, [props.isEdit]);

  // useEffect(() => {
  //   console.log("--------isEdit changed--------", props)
  //   if (props.isEdit) {
  //     setName(props?.editData?.name);
  //     setDeviceId(props?.editData?.deviceId);
  //   }else{

  //   }
  // }, []);

  const { addToast } = useToasts();

  const validateAndAddDevice = () => {
    let isInvalid = false;

    setIsValidating(true);

    if (name == "") {
      addToast(`Please add correct device name`, {
        appearance: "error",
        autoDismiss: true,
      });
      isInvalid = true;
    }
    if (deviceId == "") {
      addToast(`Please add correct device id `, {
        appearance: "error",
        autoDismiss: true,
      });
      isInvalid = true;
    }
    if (calibrationDate == "") {
      addToast(`Please add correct calibration date`, {
        appearance: "error",
        autoDismiss: true,
      });
      isInvalid = true;
    }

    if (calibrationExpiryDate == "") {
      addToast(`Please add correct calibration expiry date`, {
        appearance: "error",
        autoDismiss: true,
      });
      isInvalid = true;
    }

    if (!isInvalid) {
      addDevice();
    }
  };

  const resetInput = () => {
    setName("");
    setDeviceId("");
    setCalibrationDate("");
    setCalibrationExpiryDate("");
  };

  const addDevice = () => {
    // const data = new FormData();
    let device = {
      name: name,
      deviceId: deviceId,
      calibrationDate: calibrationDate,
      calibrationExpiryDate: calibrationExpiryDate,
    };
    props.addItem(device);
    props.toggle();
    resetInput();
    // data.append("name", name);
    // data.append("deviceId", deviceId);
    // data.append("calibrationDate", getTimeStamp(calibrationDate));
    // data.append("calibrationExpiryDate", getTimeStamp(calibrationExpiryDate));
  };

  const inputChangeHandler = (value, fieldName) => {
    switch (fieldName) {
      case "name":
        setName(value);
        break;
      case "deviceId":
        setDeviceId(value);
        break;
      case "calibrationDate":
        setCalibrationDate(value);
        break;

      case "calibrationExpiryDate":
        setCalibrationExpiryDate(value);
        break;

      default:
        break;
    }
  };

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} className={className} size={"lg"}>
        <ModalHeader toggle={toggle}>Add Device Details</ModalHeader>

        <>
          <Card className="bg-secondary  px-md-2">
            <ModalBody>
              <FormGroup row>
                <Label sm={2}>Name</Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    value={name}
                    invalid={isValidating && name == ""}
                    onChange={(e) => {
                      inputChangeHandler(e.target.value, "name");
                    }}
                    placeholder="Enter device name"
                  />

                  <FormFeedback>*Required</FormFeedback>
                </Col>
              </FormGroup>

              <Form>
                <FormGroup row>
                  <Label sm={2}>Device ID</Label>
                  <Col sm={10}>
                    <Input
                      value={deviceId}
                      invalid={isValidating && deviceId == ""}
                      onChange={(e) => {
                        inputChangeHandler(e.target.value, "deviceId");
                      }}
                      placeholder="Enter device id "
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Calibration Date</Label>
                  <Col sm={10}>
                    <Input
                      invalid={isValidating && calibrationDate == ""}
                      onChange={(e) => {
                        inputChangeHandler(e.target.value, "calibrationDate");
                      }}
                      type="date"
                      name="date"
                      id="exampleDate"
                      placeholder="date placeholder"
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm={2}>Calibration Expiry Date</Label>
                  <Col sm={10}>
                    <Input
                      invalid={isValidating && calibrationExpiryDate == ""}
                      onChange={(e) => {
                        inputChangeHandler(
                          e.target.value,
                          "calibrationExpiryDate"
                        );
                      }}
                      type="date"
                      name="date"
                      id="exampleDate"
                      placeholder="date placeholder"
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
              </Form>
            </ModalBody>
          </Card>

          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                validateAndAddDevice();
              }}
            >
              Submit Device
            </Button>{" "}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </>
      </Modal>
    </div>
  );
}
