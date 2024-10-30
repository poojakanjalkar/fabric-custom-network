import React, { useState, useEffect } from "react";
import axios from "axios";

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFileAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
// import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Button,
  Card,
  CardHeader,
  FormGroup,
  CardBody,
  NavItem,
  NavLink,
  Label,
  Collapse,
  Nav,
  Input,
  Progress,
  CardText,
  FormFeedback,
  Container,
  CardTitle,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
} from "reactstrap";


import ProgressBar from "../ProgressBar";
import {
  Form,
  Input as antDInput,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Divider,
  Select,
} from "antd";

import Header from "components/Headers/Header";
import AddOrganization from "./AddOrganization";

import { useToasts } from "react-toast-notifications";
import { headers } from "helper/config";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
const { Option } = Select;
// import type { TableProps } from 'antd';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {

  // console.log("--------record------------", record)

  // const isEditableRow = record && record.isEditable
  const handleInputChange = (e) => {
    // Remove non-alphanumeric characters for orgName field
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
  };
  const handlNumberChange = (e) => {
    const value = e.target.value.toLowerCase(); // Convert to lowercase
    e.target.value = value.replace(/[^0-9]/g, ""); // Remove non-alphanumeric characters
  };

  const preventInvalidKeys = (e) => {
    // Block spacebar and uppercase letters
    if (e.key === " ") {
      e.preventDefault();
    }
  };


  const inputNode =
    dataIndex === "peerCount" ? (
      <InputNumber
      min={1}
      // max={10}
placeholder="Enter a number between 1 and 10"
onKeyPress={(e) => {
  // Prevent non-numeric input
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault();
  }
}}
parser={(value) => (isNaN(parseInt(value)) ? "" : parseInt(value))}
      />
    ) : (
      <Input
        onChange={dataIndex === "orgName" ? handleInputChange : undefined}
        onKeyPress={dataIndex === "orgName" ? (e) => e.key === " " && e.preventDefault() : undefined}
        placeholder="Enter alphanumeric, no spaces"
      />
    );
  return (
    <td {...restProps}>
      {editing  ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please input ${title}!`,
            },
            ...(dataIndex === "orgName"
              ? [
                  {
                    pattern: /^[a-zA-Z0-9]+$/, // Alphanumeric pattern, allows uppercase letters
                    message: `${title} should only contain letters and numbers with no spaces!`,
                  },
                ]
              : []),
              ...(dataIndex === "peerCount"
                ? [
                    {
                      type: "number",
                      min: 1,
                      message: `${title} should be a positive number!`,
                      transform: (value) => (value ? Number(value) : 0),
                    },
                    {
                      type: "number",
                      max: 10,
                      message: `${title} should not be more than 10!`,
                      transform: (value) => (value ? Number(value) : 0),
                    },
                  ]
                : []),
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableCellChannel = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  orgNameList,
  ...restProps
}) => {
  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;

    const color = "violet"; //getColorForOption(value); // Your function to get color for option value

    return (
      <div
        style={{
          color: "white",
          backgroundColor: color, // Apply background color
          border: `1px solid ${color}`, // Apply border color
          borderRadius: "4px",
          padding: "2px 8px",
          display: "inline-flex",
          alignItems: "center",
          marginRight: "8px",
          marginBottom: "8px",
        }}
      >
        <span>{label}</span>
        {closable && (
          <span style={{ marginLeft: "8px" }} onClick={onClose}>
            x
          </span>
        )}
      </div>
    );
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase(); // Convert to lowercase
    e.target.value = value.replace(/[^a-zA-Z0-9]/g, ""); // Remove non-alphanumeric characters
  };

  const preventInvalidKeys = (e) => {
    // Block spacebar and uppercase letters
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  const inputNode =
    dataIndex === "orgName" ? (
      <Select
        // options={orgNameList}
        mode="multiple" // Set mode to 'multiple' for multi-select
        style={{ width: "100%" }} // Set width as per your requirement
        placeholder="Select orgs"
        tagRender={tagRender}
      // value={record.orgName}
      // onChange={(value) => handleOrgChange(value, record.key)}
      >
        {orgNameList?.map((e) => {
          return (
            <Option value={e} style={{ color: "green" }}>
              {e}
            </Option>
          );
        })}
      </Select>
    ) : (
      <Input onChange={(dataIndex === "channelName" || dataIndex === "ChaincodeName") ? handleInputChange : undefined}
        onKeyPress={(dataIndex === "channelName" || dataIndex === "ChaincodeName") ? preventInvalidKeys : undefined}
        placeholder="Enter lowercase, no spaces" />
    );

  // console.log('-----------ssssssssssssssssssss-----', orgNameList);
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
            ...(dataIndex === "channelName" || dataIndex === "ChaincodeName"
              ? [
                {
                  pattern: /^[a-zA-Z0-9]+$/, // Alphanumeric pattern, allows uppercase letters
                  message: `${title} should only contain letters and numbers with no spaces!`,
                },
              ]
              : []),
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : dataIndex === "orgName" ? (
        <Select
          mode="tags" // Set mode to 'multiple' for multi-select
          style={{ width: "100%" }} // Set width as per your requirement
          placeholder="Select orgs"
          value={record.orgName}
          tagRender={tagRender}
          disabled={true}
        >
          {orgNameList?.map((e) => {
            return (
              <Option value={e} style={{ color: "green" }}>
                {e}
              </Option>
            );
          })}
        </Select>
      ) : (
        children
      )}
    </td>
  );
};

export default function CreateRequest(props) {
  const [totalOrgs, setTotalOrgs] = useState(0);
  const [validationMessage, setValidationMessage] = useState('')
  const [validationMessageChannel, setValidationMessageChannel] = useState('')

  const [totalChannel, setTotalChannel] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  let history = useHistory();

  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [channelData, setChannelData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [channelEditKey, setChannelEditKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const isChannelEditing = (record) => record.key === channelEditKey;
  const [orgNameList, setOrgNameList] = useState([]);
  // let orgNameList = []
  useEffect(() => {
    // console.log('---------------------org count changed', totalOrgs);
  }, [totalOrgs]);

  useEffect(() => {
    // console.log('---------------------orgNameList changed', orgNameList);
  }, [orgNameList]);

  useEffect(() => {
    console.log("----------333333-----------Final Org Data", data);
    let l = [];
    data?.map((e) => {
      if (e.orgType != "Orderer") {
        // orgNameList.push(e.orgName)
        l.push(e.orgName);
      }
    });
    setOrgNameList(l);
  }, [data]);

  useEffect(() => {
    console.log(
      "------------333333---------Final Channel Data is",
      channelData
    );
  }, [channelData]);

  // console.log('-----------data111111', data);

  const [checkboxes, setCheckboxes] = useState({
    caliper: true,
    api: true,
    blockchainExplorer: true,
  });

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckboxes({
      ...checkboxes,
      [name]: checked,
    });
  };

  const inputChangeHandler = (value) => {


    const numericValue = Number(value);
    
    // Validate based on min and max
    if (value === '') {
      setTotalOrgs(value);
      setValidationMessage(''); // Clear validation message if input is empty
    } else if (numericValue < 1) {
      setValidationMessage('Minimum count is 1'); // Set validation message for min
    } else if (numericValue > 50) {
      setValidationMessage('Maximum count is 50'); // Set validation message for max
    } else {
      setTotalOrgs(value);
      setValidationMessage(''); // Clear validation message if valid
    }
    // if (value > 0) {
    //   console.log("-------input changed--------", value);

    //   setTotalOrgs(value);
    // }
  };

  const inputChangeHandlerChannel = (value) => {
    const numericValue = Number(value);
    
    // Validate based on min and max
    if (value === '') {
      setTotalChannel(value);
      setValidationMessageChannel(''); // Clear validation message if input is empty
    } else if (numericValue < 1) {
      setValidationMessage('Minimum count is 1'); // Set validation message for min
    } else if (numericValue > 50) {
      setValidationMessage('Maximum count is 50'); // Set validation message for max
    } else {
      setTotalChannel(value);
      setValidationMessage(''); // Clear validation message if valid
    }
    

    // if (value > 0) {
    //   console.log("-------input changed--------", value);

    //   setTotalChannel(value);
    // }
  };
  const [projectName, setProjectName] = useState("");

  const projectNameChangeHandler = (value) => {
    setProjectName(value);
  };

  const createChannelConfig = () => {
    let d = [];
    console.log("---total orgs---------", totalOrgs);
    let count = parseInt(totalChannel);
    for (let i = 0; i < count; i++) {
      // console.log('===============inside loop', i, count);
      d.push({
        key: i.toString(),

        channelName: `mychannel${i + 1}`,
        orgName: orgNameList,
        ChaincodeName: `chaincode${i + 1}`,
        endorsement: "Org1",
        dataType: "Channel",
      });
    }

    setChannelData(d);
  };

  const sendRequestDataToServer = async () => {
    let payload = {
      projectName,
      Organizations: data,
      channels: channelData,
    };
    setIsLoading(true);
    try {
      let result = await axios.post(
        "http://localhost:3000/v1/org/",
        payload,
        headers()
      );
      console.log("______pavan__________", result.data);

      // {
      //   "success": true,
      //   "message": "organization created successfully",
      //   "status": 200,
      //   "timestamp": "2024-05-24T05:36:02.522Z",
      // }

      let message = result?.data?.message;
      if (message == "Insufficient balance, please buy credit") {
        addToast(message, { appearance: "error", autoDismiss: false });
      } else {
        addToast("Request created successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        history.push("/admin/Organization");
      }
    } catch (error) {
      console.log("----------pavan------------", error)
      addToast(error?.response?.data?.message, { appearance: "error", autoDismiss: false });
      console.log("error occured", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createConfig = () => {
    let d = [];
    console.log("---total orgs---------", totalOrgs);
    let count = parseInt(totalOrgs) + 1;
    for (let i = 0; i < count; i++) {
      if (i === 0) {
        // console.log('===============inside loop', i, count);
        d.push({
          key: i.toString(),

          orgType: "Orderer",
          orgName: "orderer",
          ca: `orderer-ca`,
          msp: `ordererMSP`,
          peerCount: 3,
          isEditable:false,
          stateDB: "NA",
          db: "Not Require",
        });
      } else {
        // console.log('===============inside loop', i, count);
        d.push({
          key: i.toString(),

          orgType: "Peer",
          orgName: `org${i}`,
          ca: `org${i}-ca`,
          msp: `org${i}MSP`,
          isEditable: true,
          peerCount: "1",
          db: "Couchdb",
        });
      }
    }

    setData(d);
  };

  const editChannel = (record) => {
    form.setFieldsValue({
      channelName: "",
      orgName: "",
      ChaincodeName: "",
      endorsement: "",

      ...record,
    });
    setChannelEditKey(record.key);
  };

  const edit = (record) => {
    form.setFieldsValue({
      orgType: "",
      orgName: "",
      MSP: "",
      peerCount: "",
      stateDB: "",

      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };
  const cancelChannel = () => {
    setChannelEditKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      console.log("-----rowrowrowrowrow---", row);
      if (index > -1) {
        const item = newData[index];
        console.log("-----------all info------------", index, item, newData);
        item.msp = `${row.orgName}MSP`;
        item.ca = `${row.orgName}-ca`;
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const saveChannel = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...channelData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        if (item.dataType == "Channel" && !Array.isArray(item.orgName)) {
          item.orgName = item?.orgName?.split(",");
        } else {
          console.log(
            "--------------------inside else-----------",
            Array.isArray(item.orgName)
          );
        }
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        setChannelData(newData);
        setChannelEditKey("");
      } else {
        newData.push(row);
        setChannelData(newData);
        setChannelEditKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "Org Type",
      dataIndex: "orgType",
      width: "15%",
      editable: false,
    },
    {
      title: "Org Name",
      dataIndex: "orgName",
      width: "20%",
      editable: true,
    },
    // {
    //   title: "MSP",
    //   dataIndex: "msp",
    //   width: "15%",
    //   editable: false,
    // },
    // {
    //   title: "Certificate Authority",
    //   dataIndex: "ca",
    //   width: "15%",
    //   editable: false,
    // },
    {
      title: "Current State DB",
      dataIndex: "db",
      width: "15%",
      editable: false,
    },
    {
      title: "Peer count",
      dataIndex: "peerCount",
      width: "10%",
      editable: true,
    },
    {
      title: "Action",
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
            // disabled={!record.isEditable}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const EditableCellOrg = ({ editable, value, onChange, options }) => {
    const [selectedValues, setSelectedValues] = useState(value);

    const handleChange = (selectedValues) => {
      setSelectedValues(selectedValues);
      onChange(selectedValues);
    };

    return editable ? (
      <Select
        mode="multiple"
        style={{ width: "100%" }}
        placeholder="Select organizations"
        value={selectedValues}
        onChange={handleChange}
      >
        {/* {options.map(e=> {
          return <Option value="org1">e</Option>
        })} */}
        <Option value="org1">e</Option>
        <Option value="org2">Organization 2</Option>
        <Option value="org3">Organization 3</Option>
      </Select>
    ) : (
      value
    );
  };

  const channelColumns = [
    {
      title: "Channel Name",
      dataIndex: "channelName",
      width: "25%",
      editable: true,
    },
    {
      title: "Participating Orgs",
      dataIndex: "orgName",
      width: "30%",
      editable: true,
    },
    {
      title: "Chaincode Name",
      dataIndex: "ChaincodeName",
      width: "25%",
      editable: true,
    },
    {
      title: "Action",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isChannelEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => saveChannel(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancelChannel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={channelEditKey !== ""}
            onClick={() => editChannel(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "peerCount" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  const mergedColumnsChannel = channelColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,

      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "orgName" ? "multiSelect" : "multiSelect",
        dataIndex: col.dataIndex,
        orgNameList: orgNameList,
        title: col.title,
        editing: isChannelEditing(record),
      }),
    };
  });
  const { addToast } = useToasts();

  const [isValidating, setIsValidating] = useState(false);

  const validateAndCreateRequest = () => {
    setIsValidating(true);
    if (!projectName) {
      addToast(`Please add projectName `, {
        appearance: "error",
        autoDismiss: true,
      });
    }

    sendRequestDataToServer();
  };

  const instructions = [
    "1. The organization name should be a small letter and no space",
    "2. the channel name should be the small case and no space",
    "3. chain code name should be the small case and no space",
    "4. Max 20 Orgs configuration can be created",
    "5. Explorer will be configured for the first organization",
    "6. Caliper will be configured for the first organization",
    "7. A basic API structure will be given for basic asset operation"
  ];

  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => setIsOpen(!isOpen);


  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <FormGroup row>
                  <Col sm={9}>
                    <h3 className="mb-0">Create Custom Configuration</h3>
                  </Col>
                </FormGroup>
                {/* <div className="bg-light p-4" style={{ backgroundColor: '#F3E5F5', minHeight: '400px', position: 'relative', fontFamily: 'Arial, sans-serif' }}> */}
                {/* <div className="bg-light p-4" style={{ backgroundColor: '#F3E5F5', minHeight: '400px', position: 'relative', fontFamily: 'Arial, sans-serif' }}> */}
                <Card className="shadow-sm">
                  <CardHeader
                    className="bg-primary text-white d-flex justify-content-between align-items-center"
                    onClick={toggle}
                    style={{ cursor: 'pointer' }}
                  >
                    <h2 className="mb-0" style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>Instructions</h2>
                    <span>{isOpen ? '▲' : '▼'}</span>
                  </CardHeader>
                  <Collapse isOpen={isOpen}>
                    <CardBody>
                      <ListGroup flush numbered>
                        {instructions.map((instruction, index) => (
                          <ListGroupItem key={index} className="border-0 py-2 px-3" style={{ fontSize: '0.9rem', color: 'purple' }}>
                            {instruction}
                          </ListGroupItem>
                        ))}
                      </ListGroup>
                    </CardBody>
                  </Collapse>
                </Card>

                {/* </div> */}
                {/* </div> */}
              </CardHeader>
              {isLoading ? (
                <ProgressBar />
              ) : (
                <CardBody>
                  <Card>
                    <CardBody>
                      <FormGroup row>
                        <Label sm={2}>Project Name</Label>
                        <Col sm={10}>
                          <Input
                            value={projectName}
                            invalid={isValidating && projectName == ""}
                            onChange={(e) => {
                              projectNameChangeHandler(e.target.value);
                            }}
                            placeholder="Enter Project Name"
                          />
                          <FormFeedback>*Required</FormFeedback>
                        </Col>
                      </FormGroup>
                      <Divider />

                      <FormGroup row>
                        <Label sm={2}>Number Of Orgs</Label>
                        <Col sm={2}>
                        <div>
      <Input
        value={totalOrgs}
        type="number"
        onChange={(e) => {
          inputChangeHandler(e.target.value);
        }}
        placeholder="Please enter count"
        status={validationMessage ? 'error' : ''} // Set status based on validation message
      />
      {validationMessage && (
        <FormFeedback style={{ color: 'red' }}>
          {validationMessage}
        </FormFeedback>
      )}
    </div>
                        </Col>
                        <Col sm={4}>
                          <Button
                            color="primary"
                            onClick={() => {
                              createConfig();
                            }}
                          >
                            Create Org Configuration
                          </Button>
                        </Col>
                      </FormGroup>
                      {data?.length ? (
                        <FormGroup>
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
                              pagination={false}
                            // pagination={{
                            //   onChange: cancel,
                            // }}
                            />
                          </Form>
                        </FormGroup>
                      ) : null}
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <FormGroup row>
                        <Label sm={2}>Channels Count</Label>
                        <Col sm={2}>
                          <Input
                            value={totalChannel}
                            type="Number"
                            // invalid={ name == ''}
                            onChange={(e) => {
                              inputChangeHandlerChannel(e.target.value);
                            }}
                            status={validationMessage ? 'error' : ''} // Set status based on validation message
                          />

{validationMessageChannel && (
        <FormFeedback style={{ color: 'red' }}>
          {validationMessage}
        </FormFeedback>
      )}
                        </Col>
                        <Col sm={4}>
                          <Button
                            color="primary"
                            onClick={() => {
                              createChannelConfig();
                            }}
                          >
                            Configure Channels
                          </Button>
                        </Col>
                      </FormGroup>
                      {channelData?.length ? (
                        <FormGroup>
                          <Form form={form} component={false}>
                            <Table
                              components={{
                                body: {
                                  cell: EditableCellChannel,
                                },
                              }}
                              bordered
                              dataSource={channelData}
                              columns={mergedColumnsChannel}
                              rowClassName="editable-row"
                              pagination={false}
                            // pagination={{
                            //   onChange: cancel,
                            // }}
                            />
                          </Form>
                        </FormGroup>
                      ) : null}
                      <Divider></Divider>

                      <FormGroup row  >
                        <Label sm={3}>
                          <Input
                            type="checkbox"
                            name="caliper"
                            checked={checkboxes.caliper}
                            onChange={handleCheckboxChange}
                            disabled={true}
                          />
                          Caliper
                        </Label>
                        <Label sm={2}>
                          <Input
                            type="checkbox"
                            name="api"
                            checked={checkboxes.api}
                            onChange={handleCheckboxChange}
                            disabled={true}
                          />
                          API
                        </Label>
                        <Label sm={4}>
                          <Input
                            type="checkbox"
                            name="blockchainExplorer"
                            checked={checkboxes.blockchainExplorer}
                            onChange={handleCheckboxChange}
                            disabled={true}
                          />
                          Blockchain Explorer
                        </Label>
                      </FormGroup>
                      <Button
                        disabled={data?.length == 0 || channelData?.length == 0 || !projectName}
                        color="primary"
                        onClick={() => {
                          validateAndCreateRequest();
                        }}
                      >
                        Submit
                      </Button>{" "}
                    </CardBody>
                  </Card>
                </CardBody>
              )}
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
}
