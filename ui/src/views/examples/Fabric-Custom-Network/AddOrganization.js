import React, { useState } from "react";
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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CustomInput,
} from "reactstrap";
import { useToasts } from "react-toast-notifications";

export default function AddOrganization(props) {
  const { toggle, modal, className } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [type, setType] = useState(null);
  const [name, setName] = useState();
  const [msp, setMsp] = useState();
  const [numberOfPeers, setNumberOfPeers] = useState();
  const [currentStateDb, setCurrentStateDb] = useState();
  const [isValidating, setIsValidating] = useState(false);

  const { addToast } = useToasts();
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const validateAndAddDevice = () => {
    let isInvalid = false;

    setIsValidating(true);

    if (name == "") {
      addToast(`Please enter correct name`, {
        appearance: "error",
        autoDismiss: true,
      });
      isInvalid = true;
    }

    if (msp == "") {
      addToast(`Please enter MSP`, {
        appearance: "error",
        autoDismiss: true,
      });
      isInvalid = true;
    }

    if (numberOfPeers == "") {
      addToast(`Please enter number of peers`, {
        appearance: "error",
        autoDismiss: true,
      });
      isInvalid = true;
    }

    if (currentStateDb == "") {
      addToast(`Please enter current state db`, {
        appearance: "error",
        autoDismiss: true,
      });
      isInvalid = true;
    }

    if (!isInvalid) {
      // handleDropdownSelect();
      addOrganization();
    }
  };

  const inputChangeHandler = (value, fieldName) => {
    switch (fieldName) {
      // case "selectedItem":
      //   setSelectedItem(value);
      //   break;
      case "name":
        setName(value);
        break;
      case "msp":
        setMsp(value);
        break;
      case "numberOfPeers":
        setNumberOfPeers(value);
        break;
      case "currentStateDb":
        setCurrentStateDb(value);
        break;
      default:
        break;
    }
  };

  const addOrganization = () => {
    let organization = {
      type: type,
      name: name,
      msp: msp,
      numberOfPeers: numberOfPeers,
      currentStateDb: currentStateDb,
    };

    console.log("OOOOOOOOO", organization);
    props.addOrganizationItem(organization);
    // props.handleDropdownSelect(selectedItem);
    props.toggle();
    resetInput();
  };

  const resetInput = () => {
    setType("");
    setName("");
    setMsp("");
    setNumberOfPeers("");
    setCurrentStateDb("");
  };

  const toggleDropdownItem = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDropdownSelect = (type) => {
    setType(type);
    // props.handleDropdownSelect(item);
    setDropdownOpen(false);
  };
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} className={className} size={"lg"}>
        <ModalHeader toggle={toggle}>Add Organization Details</ModalHeader>

        <>
          <Card className="bg-secondary  px-md-2">
            <ModalBody>
              <FormGroup row>
                <Label sm={2}>Type</Label>
                <Col sm={10}>
                  <>
                    {/* // invalid={isValidating && name == ""}
                    // onChange={(e) => { */}
                    {/* //   inputChangeHandler(e.target.value, "name");
                    // }} */}
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdownItem}>
                      <DropdownToggle caret>
                        {type ? type : "Select an item"}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          onClick={() => handleDropdownSelect("Peer")}
                        >
                          Peer
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => handleDropdownSelect("Orderer")}
                        >
                          Orderer
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </>

                  <FormFeedback>*Required</FormFeedback>
                </Col>
              </FormGroup>
              <form>
                <FormGroup row>
                  <Label sm={2}>Name</Label>
                  <Col sm={10}>
                    <Input
                      value={name}
                      invalid={isValidating && name == ""}
                      onChange={(e) => {
                        inputChangeHandler(e.target.value, "name");
                      }}
                      placeholder="please enter name "
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>MSP</Label>
                  <Col sm={10}>
                    <Input
                      value={msp}
                      invalid={isValidating && msp == ""}
                      onChange={(e) => {
                        inputChangeHandler(e.target.value, "msp");
                      }}
                      placeholder="please enter MSP "
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Number Of Peers</Label>
                  <Col sm={10}>
                    <Input
                      value={numberOfPeers}
                      type="Number"
                      invalid={isValidating && numberOfPeers == ""}
                      onChange={(e) => {
                        inputChangeHandler(e.target.value, "numberOfPeers");
                      }}
                      placeholder="Enter number of peers"
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Current State DB</Label>
                  <Col sm={10}>
                    <Input
                      value={currentStateDb}
                      invalid={isValidating && currentStateDb == ""}
                      onChange={(e) => {
                        inputChangeHandler(e.target.value, "currentStateDb");
                      }}
                      placeholder="please enter current state DB"
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
              </form>
            </ModalBody>
          </Card>

          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                validateAndAddDevice();
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
