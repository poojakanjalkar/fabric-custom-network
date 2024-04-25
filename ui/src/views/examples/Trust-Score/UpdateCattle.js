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
export default function UpdateCattle(props) {
  const { className, editModal, toggleEditModal } = props;
  const [id, setId] = useState("");
  const [breed, setBreed] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [baseLocation, setBaseLocation] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerSurname, setOwnerSurname] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const { addToast } = useToasts();

  useEffect(() => {
    setId(props?.editData?.id);
    setBreed(props?.editData?.breed);
    setDateOfBirth(props?.editData?.dateOfBirth);
    setBaseLocation(props?.editData?.baseLocation);
    setDeviceId(props?.editData?.deviceId);
    setOwnerId(props?.editData?.ownerId);
    setOwnerName(props?.editData?.ownerName);
    setOwnerSurname(props?.editData?.ownerSurname);
  }, []);

  useEffect(() => {
    console.log("--------isEdit changed--------", props);

    setOwnerId(props?.editData?.ownerId);
    setOwnerName(props?.editData?.ownerName);
    setOwnerSurname(props?.editData?.ownerSurname);
  }, [props.editData]);

  useEffect(() => {
    console.log("------changes owner sir name----", ownerSurname);
  }, [ownerSurname]);

  const validateAndAddCattle = () => {
    let isInvalid = false;

    setIsValidating(true);

    // if (id == "") {
    //   addToast(`Please add correct id`, {
    //     appearance: "error",
    //     autoDismiss: true,
    //   });
    //   isInvalid = true;
    // }
    // if (breed == "") {
    //   addToast(`Please add correct breed `, {
    //     appearance: "error",
    //     autoDismiss: true,
    //   });
    //   isInvalid = true;
    // }
    // if (dateOfBirth == "") {
    //   addToast(`Please enter correct date od birth`, {
    //     appearance: "error",
    //     autoDismiss: true,
    //   });
    //   isInvalid = true;
    // }

    // if (baseLocation == "") {
    //   addToast(`Please enter correct base location `, {
    //     appearance: "error",
    //     autoDismiss: true,
    //   });
    //   isInvalid = true;
    // }

    // if (deviceId == "") {
    //   addToast(`Please enter correct device id `, {
    //     appearance: "error",
    //     autoDismiss: true,
    //   });
    //   isInvalid = true;
    // }

    if (ownerId == "") {
      addToast(`Please enter correct owner id `, {
        appearance: "error",
        autoDismiss: true,
      });
      isInvalid = true;
    }

    if (ownerName == "") {
      addToast(`Please enter correct owner name `, {
        appearance: "error",
        autoDismiss: true,
      });
      isInvalid = true;
    }

    if (ownerSurname == "") {
      addToast(`Please enter correct owner surname `, {
        appearance: "error",
        autoDismiss: true,
      });
      isInvalid = true;
    }

    if (!isInvalid) {
      updateCattle();
    }
  };

  const resetInput = () => {
    setId("");
    setBreed("");
    setDateOfBirth("");
    setBaseLocation("");
    setDeviceId("");
    setOwnerId("");
    setOwnerName("");
    setOwnerSurname("");
  };

  const updateCattle = () => {
    const data = new FormData();
    let cattle = {
      id: props?.editData.id,
      breed: breed,
      dateOfBirth: dateOfBirth,
      baseLocation: baseLocation,
      deviceId: deviceId,
      ownerId: ownerId,
      ownerName: ownerName,
      ownerSurname: ownerSurname,
    };
    props.updateCattleItem(cattle);
    props.toggleEditModal();
    resetInput();
    // data.append("name", name);
    // data.append("deviceId", deviceId);
    // data.append("calibrationDate", getTimeStamp(calibrationDate));
    // data.append("calibrationExpiryDate", getTimeStamp(calibrationExpiryDate));
  };

  const inputChangeHandler = (value, fieldName) => {
    switch (fieldName) {
      // case "id":
      //   setId(value);
      //   break;
      // case "breed":
      //   setBreed(value);
      //   break;
      // case "dateOfBirth":
      //   setDateOfBirth(value);
      //   break;

      // case "baseLocation":
      //   setBaseLocation(value);
      //   break;

      // case "deviceId":
      //   setDeviceId(value);
      //   break;

      case "ownerId":
        setOwnerId(value);
        break;

      case "ownerName":
        setOwnerName(value);
        break;

      case "ownerSurname":
        setOwnerSurname(value);
        console.log("-----changing value-------", value);
        break;

      default:
        break;
    }
  };

  return (
    <div>
      <Modal
        isOpen={editModal}
        toggle={toggleEditModal}
        className={className}
        size={"lg"}
      >
        <ModalHeader toggle={toggleEditModal}>
          Update Cattle Details
        </ModalHeader>

        <>
          <Card className="bg-secondary  px-md-2">
            <ModalBody>
              <FormGroup row>
                <Label sm={2}>Id</Label>
                <Col sm={10}>
                  <Input type="text" value={id} disabled={true} />

                  <FormFeedback>*Required</FormFeedback>
                </Col>
              </FormGroup>

              <Form>
                <FormGroup row>
                  <Label sm={2}>Breed</Label>
                  <Col sm={10}>
                    <Input value={breed} disabled={true} />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Date Of Birth</Label>
                  <Col sm={10}>
                    <Input value={dateOfBirth} disabled={true} />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Base Location</Label>
                  <Col sm={10}>
                    <Input value={baseLocation} disabled={true} />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Device ID</Label>
                  <Col sm={10}>
                    <Input value={deviceId} disabled={true} />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Owner Id</Label>
                  <Col sm={10}>
                    <Input
                      value={ownerId}
                      invalid={isValidating && ownerId == ""}
                      onChange={(e) => {
                        inputChangeHandler(e.target.value, "ownerId");
                      }}
                      placeholder="please enter owner id"
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm={2}>Owner Name</Label>
                  <Col sm={10}>
                    <Input
                      value={ownerName}
                      invalid={isValidating && ownerName == ""}
                      onChange={(e) => {
                        inputChangeHandler(e.target.value, "ownerName");
                      }}
                      placeholder="please enter owner name"
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Owner Surname</Label>
                  <Col sm={10}>
                    <Input
                      value={ownerSurname}
                      invalid={isValidating && ownerSurname == ""}
                      onChange={(e) => {
                        inputChangeHandler(e.target.value, "ownerSurname");
                      }}
                      placeholder="please enter owner surname"
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
                validateAndAddCattle();
              }}
            >
              Submit Cattle
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
