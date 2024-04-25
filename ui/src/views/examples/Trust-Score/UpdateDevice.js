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
  const { className, editModal, toggleEditModal } = props;
  const [name, setName] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [calibrationDate, setCalibrationDate] = useState("");
  const [calibrationExpiryDate, setCalibrationExpiryDate] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  console.log("-------------------", props);

  useEffect(() => {
      setName(props?.editData?.name);
      setDeviceId(props?.editData?.deviceId);
  }, []);

   useEffect(() => {
    console.log("--------isEdit changed--------", props)
      setName(props?.editData?.name);
      setDeviceId(props?.editData?.deviceId);
  
  }, [props.editData]);

  const { addToast } = useToasts();

  const validateAndAddDevice = () => {
    let isInvalid = false;

    setIsValidating(true);

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
      updateDevice();
    }
  };

  const resetInput = () => {
    setName("");
    setDeviceId("");
    setCalibrationDate("");
    setCalibrationExpiryDate("");
  };

  // const addDevice = () => {
  //   // const data = new FormData();
  //   let device = {
  //     name: name,
  //     deviceId: deviceId,
  //     calibrationDate: calibrationDate,
  //     calibrationExpiryDate: calibrationExpiryDate,
  //   };
  //   props.updateDevice(device);
  //   props.toggleEditModal();
  //   resetInput();
  //   // data.append("name", name);
  //   // data.append("deviceId", deviceId);
  //   // data.append("calibrationDate", getTimeStamp(calibrationDate));
  //   // data.append("calibrationExpiryDate", getTimeStamp(calibrationExpiryDate));
  // };


  const updateDevice = () => {
    // const data = new FormData();
    let device = {
      name: name,
      deviceId: deviceId,
      calibrationDate: calibrationDate,
      calibrationExpiryDate: calibrationExpiryDate,
      id:props?.editData?.id
    };
    props.updateItem(device);
    props.toggleEditModal();
    resetInput();
    // data.append("name", name);
    // data.append("deviceId", deviceId);
    // data.append("calibrationDate", getTimeStamp(calibrationDate));
    // data.append("calibrationExpiryDate", getTimeStamp(calibrationExpiryDate));
  };

  const inputChangeHandler = (value, fieldName) => {
    switch (fieldName) {
      
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
      <Modal isOpen={editModal} toggle={toggleEditModal}  className={className} size={"lg"}>
        <ModalHeader toggle={toggleEditModal}>Update Device Details</ModalHeader>

        <>
          <Card className="bg-secondary  px-md-2">
            <ModalBody>
              <FormGroup row>
                <Label sm={2}>Name</Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    value={name}
                    disabled={true}
                  
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
                      disabled={true}
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
            <Button color="secondary" onClick={toggleEditModal}>
              Cancel
            </Button>
          </ModalFooter>
        </>
      </Modal>
    </div>
  );
}
