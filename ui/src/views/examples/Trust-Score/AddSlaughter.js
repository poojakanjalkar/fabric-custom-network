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

export default function AddSlaughter(props) {
  const { className, modal, toggle } = props;
  const [cattleId, setCattleId] = useState();
  const [slaughterHouseName, setSlaughterHouseName] = useState();
  const [slaughtererName, setSlaughterName] = useState();
  const [slaughtererSurname, setSlaughterSurname] = useState();
  const [slaughterDate, setSlaughterDate] = useState();

  const [coldRoomId, setColdRoomId] = useState();
  const [productId, setProductId] = useState();
  const [productName, setProductName] = useState();
  const [numberOfPieceCount, setNumberOfPieceCount] = useState();
  const [isValidating, setIsValidating] = useState(false);

  const { addToast } = useToasts();

  const validateAndAddSlaughter = () => {
    let isInvalid = false;

    setIsValidating(true);

    if (cattleId == "") {
      addToast(`Please add correct cattle id`, {
        appearance: "error",
        autoDismiss: true,
      });
      isInvalid = true;
    }
    if (slaughterHouseName == "") {
      addToast(`Please add correct slaughterHouseName`, {
        appearance: "error",
        autoDismiss: true,
      });
      isInvalid = true;
    }
    if (slaughtererName == "") {
      addToast(`Please add correct slaughterer name`, {
        appearance: "error",
        autoDismiss: true,
      });
      isInvalid = true;
    }
    if (slaughtererSurname == "") {
      addToast(`Please add correct slaughterer name`, {
        appearance: "error",
        autoDismiss: true,
      });
      isInvalid = true;
    }
    if (slaughterDate == "") {
      addToast(`Please add correct slaughter date`, {
        appearance: "error",
        autoDismiss: true,
      });
      isInvalid = true;
    }

    if (coldRoomId == "") {
      addToast(`Please add correct cold Room Id `, {
        appearance: "error",
        autoDismiss: true,
      });
      console.log("<><><><><><>", coldRoomId);
      isInvalid = true;
    }
    if (productId == "") {
      addToast(`Please add correct product id`, {
        appearance: "error",
        autoDismiss: true,
      });
      isInvalid = true;
    }
    if (productName == "") {
      addToast(`Please add correct product name`, {
        appearance: "error",
        autoDismiss: true,
      });
      isInvalid = true;
    }
    if (numberOfPieceCount == "") {
      addToast(`Please add number of piece count`, {
        appearance: "error",
        autoDismiss: true,
      });
      isInvalid = true;
    }
    if (!isInvalid) {
      addSlaughter();
    }
  };

  const resetInput = () => {
    setCattleId("");
    setSlaughterHouseName("");
    setSlaughterName("");
    setSlaughterSurname("");
    setSlaughterDate("");

    setColdRoomId("");
    setProductId("");
    setProductName("");
    setNumberOfPieceCount("");
  };

  const addSlaughter = () => {
    let slaughter = {
      cattleId: cattleId,
      slaughterHouseName: slaughterHouseName,
      slaughtererName: slaughtererName,
      slaughtererSurname: slaughtererSurname,
      slaughterDate: slaughterDate,

      coldRoomId: coldRoomId,
      productId: productId,
      productName: productName,
      numberOfPieceCount: numberOfPieceCount,
    };
    props.addSlaughterItem(slaughter);
    props.toggle();
    resetInput();
  };

  const inputChangeHandler = (value, fieldName) => {
    console.log("----------------", value, fieldName);
    switch (fieldName) {
      case "cattleId":
        setCattleId(value);
        break;
      case "slaughterHouseName":
        setSlaughterHouseName(value);
        break;
      case "slaughtererName":
        setSlaughterName(value);
        break;

      case "slaughtererSurname":
        setSlaughterSurname(value);
        break;

      case "slaughterDate":
        console.log("++QQQQQQ333333333333QQQQ+++", value);

        setSlaughterDate(value);
        break;

      case "coldRoomId":
        setColdRoomId(value);
        break;
      case "productId":
        setProductId(value);
        break;
      case "productName":
        setProductName(value);
        break;
      case "numberOfPieceCount":
        setNumberOfPieceCount(value);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    console.log(
      "---------product name is changing and value is----",
      productName
    );
  }, [productName]);

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} className={className} size={"lg"}>
        <ModalHeader toggle={toggle}>Add Slaughter Details</ModalHeader>

        <>
          <Card className="bg-secondary  px-md-2">
            <ModalBody>
              <FormGroup row>
                <Label sm={2}>Cattle ID</Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    value={cattleId}
                    invalid={isValidating && cattleId == ""}
                    onChange={(e) => {
                      inputChangeHandler(e.target.value, "cattleId");
                    }}
                    placeholder="Enter cattle ID"
                  />

                  <FormFeedback>*Required</FormFeedback>
                </Col>
              </FormGroup>

              <Form>
                <FormGroup row>
                  <Label sm={2}>Slaughter House Name</Label>
                  <Col sm={10}>
                    <Input
                      value={slaughterHouseName}
                      invalid={isValidating && slaughterHouseName == ""}
                      onChange={(e) => {
                        inputChangeHandler(
                          e.target.value,
                          "slaughterHouseName"
                        );
                      }}
                      placeholder="Enter Slaughter House Name"
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Slaughter Name</Label>
                  <Col sm={10}>
                    <Input
                      value={slaughtererName}
                      invalid={isValidating && slaughtererName == ""}
                      onChange={(e) => {
                        inputChangeHandler(e.target.value, "slaughtererName");
                      }}
                      placeholder="Enter Slaughter Name"
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Slaughter Surname</Label>
                  <Col sm={10}>
                    <Input
                      value={slaughtererSurname}
                      invalid={isValidating && slaughtererSurname == ""}
                      onChange={(e) => {
                        inputChangeHandler(
                          e.target.value,
                          "slaughtererSurname"
                        );
                      }}
                      placeholder="Enter Slaughter surname"
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Slaughter Date and Time</Label>
                  <Col sm={10}>
                    <Input
                      value={slaughterDate}
                      type="datetime-local"
                      name="dateTime"
                      id="dateTime"
                      invalid={isValidating && slaughterDate == ""}
                      onChange={(e) => {
                        inputChangeHandler(e.target.value, "slaughterDate");
                      }}
                      placeholder="Enter Slaughter date"
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm={2}>Cold Room ID</Label>
                  <Col sm={10}>
                    <Input
                      value={coldRoomId}
                      invalid={isValidating && coldRoomId == ""}
                      onChange={(e) => {
                        inputChangeHandler(e.target.value, "coldRoomId");
                      }}
                      placeholder="Enter cold room id"
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Product ID</Label>
                  <Col sm={10}>
                    <Input
                      value={productId}
                      invalid={isValidating && productId == ""}
                      onChange={(e) => {
                        inputChangeHandler(e.target.value, "productId");
                      }}
                      placeholder="Enter Product ID"
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Product Name</Label>
                  <Col sm={10}>
                    <Input
                      value={productName}
                      invalid={isValidating && productName == ""}
                      onChange={(e) => {
                        inputChangeHandler(e.target.value, "productName");
                      }}
                      placeholder="Enter product name"
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Number Of Piece Count</Label>
                  <Col sm={10}>
                    <Input
                      value={numberOfPieceCount}
                      type="Number"
                      invalid={isValidating && numberOfPieceCount == ""}
                      onChange={(e) => {
                        inputChangeHandler(
                          e.target.value,
                          "numberOfPieceCount"
                        );
                      }}
                      placeholder="Enter number of piece count"
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
                validateAndAddSlaughter();
              }}
            >
              Submit
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
