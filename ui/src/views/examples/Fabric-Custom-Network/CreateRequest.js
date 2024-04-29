import React, { useState, useEffect } from 'react';
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
} from 'reactstrap';
import {
  Form,
  Input as antDInput,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Select,
} from 'antd';

import Header from 'components/Headers/Header';
import AddOrganization from './AddOrganization';

import { useToasts } from 'react-toast-notifications';

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
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
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

export default function CreateRequest() {
  const [totalOrgs, setTotalOrgs] = useState(0);

  const [totalChannel, setTotalChannel] = useState(0);

  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [channelData, setChannelData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [channelEditKey, setChannelEditKey] = useState('');
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
    // console.log('---------------------data changed', data);
    let l = [];
    data?.map((e) => {
      if (e.orgType != 'Orderer') {
        // orgNameList.push(e.orgName)
        l.push(e.orgName);
      }
    });
    setOrgNameList(l);
  }, [data]);

  // console.log('-----------data111111', data);

  const inputChangeHandler = (value) => {
    if (value > 0) {
      console.log('-------input changed--------', value);

      setTotalOrgs(value);
    }
  };

  const inputChangeHandlerChannel = (value) => {
    if (value > 0) {
      console.log('-------input changed--------', value);

      setTotalChannel(value);
    }
  };

  const createChannelConfig = () => {
    let d = [];
    console.log('---total orgs---------', totalOrgs);
    let count = parseInt(totalChannel);
    for (let i = 0; i < count; i++) {
      // console.log('===============inside loop', i, count);
      d.push({
        key: i.toString(),

        channelName: 'channel1',
        orgName: ['Org1', 'Org2'],
        ChaincodeName: `chaincode1`,
        endorsement: 'Org1',
        dataType: 'Channel',
      });
    }

    setChannelData(d);
  };

  const createConfig = () => {
    let d = [];
    console.log('---total orgs---------', totalOrgs);
    let count = parseInt(totalOrgs) + 1;
    for (let i = 0; i < count; i++) {
      if (i === 0) {
        // console.log('===============inside loop', i, count);
        d.push({
          key: i.toString(),

          orgType: 'Orderer',
          orgName: 'Orderer',
          MSP: `OrdererMSP`,
          peerCount: '3',
          stateDB: 'NA',
        });
      } else {
        // console.log('===============inside loop', i, count);
        d.push({
          key: i.toString(),

          orgType: 'Peer',
          orgName: `Org${i}`,
          MSP: `Org${i}MSP`,
          peerCount: '1',
          stateDB: 'Couchdb',
        });
      }
    }

    setData(d);
  };

  const editChannel = (record) => {
    form.setFieldsValue({
      channelName: '',
      orgName: '',
      ChaincodeName: '',
      endorsement: '',

      ...record,
    });
    setChannelEditKey(record.key);
  };

  const edit = (record) => {
    form.setFieldsValue({
      orgType: '',
      orgName: '',
      MSP: '',
      peerCount: '',
      stateDB: '',

      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };
  const cancelChannel = () => {
    setChannelEditKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const saveChannel = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...channelData];
      console.log('-------newData---------', key, newData);
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        console.log('--------------------before if-----------', item);
        if (item.dataType == 'Channel' && !Array.isArray(item.orgName)) {
          console.log('--------------------inside if-----------');
          item.orgName = item?.orgName?.split(',');
        } else {
          console.log(
            '--------------------inside else-----------',
            Array.isArray(item.orgName)
          );
        }
        console.log('---item----newData---------', item, newData);
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        console.log('-------newData---66666------', newData);
        setChannelData(newData);
        setChannelEditKey('');
      } else {
        newData.push(row);
        setChannelData(newData);
        setChannelEditKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Org Type',
      dataIndex: 'orgType',
      width: '10%',
      editable: false,
    },
    {
      title: 'Org Name',
      dataIndex: 'orgName',
      width: '15%',
      editable: true,
    },
    {
      title: 'MSP',
      dataIndex: 'MSP',
      width: '15%',
      editable: true,
    },
    {
      title: 'Peer count',
      dataIndex: 'peerCount',
      width: '10%',
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'operation',
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
            <Popconfirm title='Sure to cancel?' onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ''}
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
        mode='multiple'
        style={{ width: '100%' }}
        placeholder='Select organizations'
        value={selectedValues}
        onChange={handleChange}
      >
        {/* {options.map(e=> {
          return <Option value="org1">e</Option>
        })} */}
        <Option value='org1'>e</Option>
        <Option value='org2'>Organization 2</Option>
        <Option value='org3'>Organization 3</Option>
      </Select>
    ) : (
      value
    );
  };

  const handleOrgChange = (value, key) => {
    console.log('---------handleOrgChange---------', value, key);
    // setData(prevData =>
    //   prevData.map(item => {
    //     if (item.key === key) {
    //       return { ...item, org: value };
    //     }
    //     return item;
    //   })
    // );
  };

  const channelColumns = [
    {
      title: 'Channel Name',
      dataIndex: 'channelName',
      width: '12%',
      inputType: 'text',
      editable: true,
    },
    {
      title: 'Participating Orgs',
      dataIndex: 'orgName',
      width: '30%',
      inputType: 'multiSelect',
      editable: true,
      // render: (text, record) => {
      //   const editable = isChannelEditing(record);
      //   console.log("0000000000000000000Rendering started----00000000000000000", record, editable)
      //   if (editable) {
      //     return (
      //       <Select
      //         mode='tags'
      //         style={{ width: '100%' }}
      //         defaultValue={record.orgName}
      //       >
      //         {orgNameList?.map((e) => {
      //           return <Option value={e}>{e}</Option>;
      //         })}
      //       </Select>
      //     );
      //   } 
      // },
      render: (text, record) =>{
        const editable = isChannelEditing(record);
        return editable? (
        <Select
        options={orgNameList}
          mode='multiple' // Set mode to 'multiple' for multi-select
          style={{ width: '100%' }} // Set width as per your requirement
          placeholder='Select orgs'
          // value={record.orgName}

          // onChange={(value) => handleOrgChange(value, record.key)}
        >
          {/* {orgNameList?.map((e) => {
            return <Option value={e}>{e}</Option>;
          })} */}
          {/* <Option value="Org1">Org1</Option>
          <Option value="Org2">Org2</Option>
          <Option value="Org3">Org3</Option> */}
        </Select>
        ) :(
          Array.isArray(record.orgName)?  record?.orgName?.join(', '): record.orgName
        )
      },
    },
    {
      title: 'Chaincode Name',
      dataIndex: 'ChaincodeName',
      width: '15%',
      inputType: 'text',
      editable: true,
    },
    {
      title: 'Endorsement Policy',
      dataIndex: 'endorsement',
      width: '10%',
      inputType: 'text',
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'operation',
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
            <Popconfirm title='Sure to cancel?' onConfirm={cancelChannel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={channelEditKey !== ''}
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
        inputType: col.dataIndex === 'orgName' ? 'number' : 'text',
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
        inputType: col.dataIndex === 'orgName' ? 'multiSelect' : 'multiSelect',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isChannelEditing(record),
        
      }),
    };
  });

  return (
    <>
      <Header />
      <Container className='mt--7' fluid>
        <Row>
          <div className='col'>
            <Card className='shadow'>
              <CardHeader className='border-0'>
                <FormGroup row>
                  <Col sm={9}>
                    <h3 className='mb-0'>Create Custom Configuration</h3>
                  </Col>
                </FormGroup>
              </CardHeader>
              <CardBody>
                <Card>
                  <CardBody>
                    <FormGroup row>
                      <Label sm={2}>Number Of Orgs</Label>
                      <Col sm={1.2}>
                        <Input
                          value={totalOrgs}
                          type='Number'
                          // invalid={ name == ''}
                          onChange={(e) => {
                            inputChangeHandler(e.target.value);
                          }}
                          placeholder='please enter name '
                        />

                        <FormFeedback>*Required</FormFeedback>
                      </Col>
                      <Col sm={4}>
                        <Button
                          color='primary'
                          onClick={() => {
                            createConfig();
                          }}
                        >
                          Create Configuration
                        </Button>
                      </Col>
                    </FormGroup>
                  </CardBody>
                </Card>

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
                      rowClassName='editable-row'
                      pagination={false}
                      // pagination={{
                      //   onChange: cancel,
                      // }}
                    />
                  </Form>
                </FormGroup>
                <Card>
                  <CardBody>
                    <FormGroup row>
                      <Label sm={2}>Number Of Channels</Label>
                      <Col sm={1.2}>
                        <Input
                          value={totalChannel}
                          type='Number'
                          // invalid={ name == ''}
                          onChange={(e) => {
                            inputChangeHandlerChannel(e.target.value);
                          }}
                          placeholder='please enter name '
                        />

                        <FormFeedback>*Required</FormFeedback>
                      </Col>
                      <Col sm={4}>
                        <Button
                          color='primary'
                          onClick={() => {
                            createChannelConfig();
                          }}
                        >
                          Configure Channel
                        </Button>
                      </Col>
                    </FormGroup>

                    <FormGroup>
                      <Form form={form} component={false}>
                        <Table
                          components={{
                            body: {
                              cell: EditableCell,
                            },
                          }}
                          bordered
                          dataSource={channelData}
                          columns={mergedColumnsChannel}
                          rowClassName='editable-row'
                          pagination={false}
                          // pagination={{
                          //   onChange: cancel,
                          // }}
                        />
                      </Form>
                    </FormGroup>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
}
