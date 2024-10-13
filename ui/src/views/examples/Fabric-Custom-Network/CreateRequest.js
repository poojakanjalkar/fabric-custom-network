import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Button,
  Card,
  CardHeader,
  FormGroup,
  CardBody,
  NavItem,
  NavLink,
  Label,
  Nav,
  Input,
  Progress,
  CardText,
  FormFeedback,
  Container,
  CardTitle,
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
  message,
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
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
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
      <Input />
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

  const inputChangeHandler = (value) => {
    if (value > 0) {
      console.log("-------input changed--------", value);

      setTotalOrgs(value);
    }
  };

  const inputChangeHandlerChannel = (value) => {
    if (value > 0) {
      console.log("-------input changed--------", value);

      setTotalChannel(value);
    }
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
      console.log("________________", result.data);

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
          orgName: "Orderer",
          ca: `orderer-ca`,
          msp: `OrdererMSP`,
          peerCount: 3,
          stateDB: "NA",
          db: "Not Require",
        });
      } else {
        // console.log('===============inside loop', i, count);
        d.push({
          key: i.toString(),

          orgType: "Peer",
          orgName: `Org${i}`,
          ca: `org${i}-ca`,
          msp: `Org${i}MSP`,
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
      console.log("-------newData---------", key, newData);
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        console.log("--------------------before if-----------", item);
        if (item.dataType == "Channel" && !Array.isArray(item.orgName)) {
          console.log("--------------------inside if-----------");
          item.orgName = item?.orgName?.split(",");
        } else {
          console.log(
            "--------------------inside else-----------",
            Array.isArray(item.orgName)
          );
        }
        console.log("---item----newData---------", item, newData);
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        console.log("-------newData---66666------", newData);
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
    {
      title: "MSP",
      dataIndex: "msp",
      width: "15%",
      editable: false,
    },
    {
      title: "Certificate Authority",
      dataIndex: "ca",
      width: "15%",
      editable: false,
    },
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
                          <Input
                            value={totalOrgs}
                            type="Number"
                            invalid={isValidating && data?.length == 0}
                            onChange={(e) => {
                              inputChangeHandler(e.target.value);
                            }}
                            placeholder="please enter name "
                          />

                          <FormFeedback>*Required</FormFeedback>
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
                          />

                          <FormFeedback>*Required</FormFeedback>
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
                      <Button
                        disabled={data?.length == 0 || channelData?.length == 0}
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
