import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormFeedback,
  Card,
  FormGroup,
  Label,
  Input,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CustomInput,
  Table,
  Row,
  CardHeader,
  CardBody,
  Container,
} from "reactstrap";
import { useToasts } from "react-toast-notifications";

// import type { TableProps } from 'antd';
import {
  Form,
  Input as antDInput,
  InputNumber,
  Popconfirm,
  Typography,
} from "antd";

export default function AddOrganization(props) {
  const { toggle, modal, className } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [type, setType] = useState(null);
  const [name, setName] = useState();
  const [msp, setMsp] = useState();
  const [numberOfPeers, setNumberOfPeers] = useState();
  const [currentStateDb, setCurrentStateDb] = useState();
  const [isValidating, setIsValidating] = useState(false);

  const initialData = [];
  useEffect(() => {
    console.log(
      "___swlected -----------------item changed___",
      props.selectedItem
    );
  }, [props.selectedItem]);

  // useEffect(() => {
  //   console.log("$$$$$$$$$$$$$", props.selectedItem.Organizations.length);
  // }, [props.selectedItem.Organizations.length]);

  const [form] = Form.useForm();
  const [data, setData] = useState(initialData);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const columns = [
    {
      title: "Org Type",
      dataIndex: "name",
      width: "10%",
      editable: true,
    },
    {
      title: "Org Name",
      dataIndex: "name",
      width: "15%",
      editable: true,
    },
    {
      title: "MSP",
      dataIndex: "age",
      width: "15%",
      editable: true,
    },
    {
      title: "Peer count",
      dataIndex: "address",
      width: "10%",
      editable: true,
    },
    {
      title: "Chaincode",
      dataIndex: "address",
      width: "10%",
      editable: true,
    },
    {
      title: "State DB",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const [organizations, setOrganizations] = useState([]);

  const handleAddOrgs = () => {};
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} className={className} size={"xl"}>
        <ModalHeader toggle={toggle}>Add Organization Details</ModalHeader>

        <>
          <Card className="bg-secondary  px-md-2">
            <ModalBody>
              <FormGroup row>
                <Label sm={2}>Number Of Orgs</Label>
                <Col sm={2}>
                  <Input
                    type="text"
                    value={
                      props?.selectedItem?.configuration?.Organizations?.length
                    }
                    disabled
                  ></Input>
                  <FormFeedback>*Required</FormFeedback>
                </Col>
                {/* <Col sm={2}>
                  <Button
                    color="primary"
                    onClick={() => {
                      validateAndAddDevice();
                    }}
                  >
                    Add Orgs
                  </Button>
                </Col> */}
              </FormGroup>

              <Table
                className="align-items-center table-flush"
                striped
                bordered
                hover
              >
                <thead className="thead-light">
                  <tr>
                    <th>Project Name</th>
                    <th>Org Count</th>
                    <th>Channel Count</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  <td>{props.selectedItem?.configuration?.projectName}</td>
                  <td>
                    {props.selectedItem?.configuration?.Organizations?.map(
                      (e) => e.orgName + ", "
                    )}
                  </td>
                  <td>
                    {props.selectedItem?.configuration?.channels?.map(
                      (e) => e.channelName + ", "
                    )}
                  </td>
                  <td>{props.selectedItem?.status}</td>
                </tbody>
              </Table>
              {/* <FormGroup>
                <Form form={form} component={false}>
                  <Table
                    components={{
                      body: {
                        cell: EditableCell,
                      },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                      onChange: cancel,
                    }}
                  />
                </Form>
              </FormGroup> */}

              {/* <FormGroup row>
                <Label sm={2}>Type</Label>
                <Col sm={10}>
                  <> */}
              {/* // invalid={isValidating && name == ""}
                    // onChange={(e) => { */}
              {/* //   inputChangeHandler(e.target.value, "name");
                    // }} */}
              {/* <Dropdown isOpen={dropdownOpen} toggle={toggleDropdownItem}>
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
              </FormGroup> */}

              {/* <FormGroup row>
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
                </FormGroup> */}
              {/* <FormGroup row>
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
                </FormGroup> */}
              {/* <FormGroup row>
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
                </FormGroup> */}
              {/* <FormGroup row>
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
                </FormGroup> */}
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
