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

export default function AddOrganization(props) {
  const { toggle, modal, className } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const handleDropdownSelect = (item) => {
    setSelectedItem(item);
    setDropdownOpen(false);
  };
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} className={className} size={"lg"}>
        <ModalHeader toggle={""}>Add Organization Details</ModalHeader>

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
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                      <DropdownToggle caret>
                        {selectedItem ? selectedItem : "Select an item"}
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
                      value={""}
                      invalid={""}
                      // onChange={(e) => {
                      //   inputChangeHandler(e.target.value, "");
                      // }}
                      placeholder="please enter name "
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>MSP</Label>
                  <Col sm={10}>
                    <Input
                      value={""}
                      invalid={""}
                      // onChange={(e) => {
                      //   inputChangeHandler(e.target.value, "");
                      // }}
                      placeholder="please enter MSP "
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Number Of Peers</Label>
                  <Col sm={10}>
                    <Input
                      value={""}
                      type="Number"
                      // invalid={isValidating && numberOfPieceCount == ""}
                      // onChange={(e) => {
                      //   inputChangeHandler(
                      //     e.target.value,
                      //     "numberOfPieceCount"
                      //   );
                      // }}
                      placeholder="Enter number of peers"
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Current State DB</Label>
                  <Col sm={10}>
                    <Input
                      value={""}
                      invalid={""}
                      // onChange={(e) => {
                      //   inputChangeHandler(e.target.value, "");
                      // }}
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
              // onClick={() => {
              //   validateAndAddDevice();
              // }}
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
