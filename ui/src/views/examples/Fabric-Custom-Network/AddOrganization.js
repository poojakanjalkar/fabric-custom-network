import React, { useState } from 'react';
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
} from 'reactstrap';
import { useToasts } from 'react-toast-notifications';

// import type { TableProps } from 'antd';
import {
  Form,
  Input as antDInput,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
} from 'antd';

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

  for (let i = 0; i < 100; i++) {
    initialData.push({
      key: i.toString(),
      name: `Edward ${i}`,
      age: 32,
      address: `London Park no. ${i}`,
    });
  }

  const [form] = Form.useForm();
  const [data, setData] = useState(initialData);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
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

  const columns = [
    {
      title: 'Org Type',
      dataIndex: 'name',
      width: '10%',
      editable: true,
    },
    {
      title: 'Org Name',
      dataIndex: 'name',
      width: '15%',
      editable: true,
    },
    {
      title: 'MSP',
      dataIndex: 'age',
      width: '15%',
      editable: true,
    },
    {
      title: 'Peer count',
      dataIndex: 'address',
      width: '10%',
      editable: true,
    },
    {
      title: 'Chaincode',
      dataIndex: 'address',
      width: '10%',
      editable: true,
    },
    {
      title: 'State DB',
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

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const { addToast } = useToasts();
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const validateAndAddDevice = () => {
    let isInvalid = false;

    setIsValidating(true);

    if (name == '') {
      addToast(`Please enter correct name`, {
        appearance: 'error',
        autoDismiss: true,
      });
      isInvalid = true;
    }

    if (msp == '') {
      addToast(`Please enter MSP`, {
        appearance: 'error',
        autoDismiss: true,
      });
      isInvalid = true;
    }

    if (numberOfPeers == '') {
      addToast(`Please enter number of peers`, {
        appearance: 'error',
        autoDismiss: true,
      });
      isInvalid = true;
    }

    if (currentStateDb == '') {
      addToast(`Please enter current state db`, {
        appearance: 'error',
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
      case 'name':
        setName(value);
        break;
      case 'msp':
        setMsp(value);
        break;
      case 'numberOfPeers':
        setNumberOfPeers(value);
        break;
      case 'currentStateDb':
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

    console.log('OOOOOOOOO', organization);
    props.addOrganizationItem(organization);
    // props.handleDropdownSelect(selectedItem);
    props.toggle();
    resetInput();
  };

  const resetInput = () => {
    setType('');
    setName('');
    setMsp('');
    setNumberOfPeers('');
    setCurrentStateDb('');
  };

  const toggleDropdownItem = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDropdownSelect = (type) => {
    setType(type);
    // props.handleDropdownSelect(item);
    setDropdownOpen(false);
  };

  const [organizations, setOrganizations] = useState([]);

  const handleAddOrgs = () => {};
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} className={className} size={'xl'}>
        <ModalHeader toggle={toggle}>Add Organization Details</ModalHeader>

        <>
          <Card className='bg-secondary  px-md-2'>
            <ModalBody>
              <FormGroup row>
                <Label sm={2}>Number Of Orgs</Label>
                <Col sm={8}>
                  <Input
                    value={name}
                    type='Number'
                    invalid={isValidating && name == ''}
                    onChange={(e) => {
                      inputChangeHandler(e.target.value, 'name');
                    }}
                    placeholder='please enter name '
                  />

                  <FormFeedback>*Required</FormFeedback>
                </Col>
                <Col sm={2}>
                  <Button
                    color='primary'
                    onClick={() => {
                      validateAndAddDevice();
                    }}
                  >
                    Add Orgs
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
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName='editable-row'
                    pagination={{
                      onChange: cancel,
                    }}
                  />
                </Form>
              </FormGroup>

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
                        {type ? type : 'Select an item'}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          onClick={() => handleDropdownSelect('Peer')}
                        >
                          Peer
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => handleDropdownSelect('Orderer')}
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
                      invalid={isValidating && name == ''}
                      onChange={(e) => {
                        inputChangeHandler(e.target.value, 'name');
                      }}
                      placeholder='please enter name '
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>MSP</Label>
                  <Col sm={10}>
                    <Input
                      value={msp}
                      invalid={isValidating && msp == ''}
                      onChange={(e) => {
                        inputChangeHandler(e.target.value, 'msp');
                      }}
                      placeholder='please enter MSP '
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Number Of Peers</Label>
                  <Col sm={10}>
                    <Input
                      value={numberOfPeers}
                      type='Number'
                      invalid={isValidating && numberOfPeers == ''}
                      onChange={(e) => {
                        inputChangeHandler(e.target.value, 'numberOfPeers');
                      }}
                      placeholder='Enter number of peers'
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Current State DB</Label>
                  <Col sm={10}>
                    <Input
                      value={currentStateDb}
                      invalid={isValidating && currentStateDb == ''}
                      onChange={(e) => {
                        inputChangeHandler(e.target.value, 'currentStateDb');
                      }}
                      placeholder='please enter current state DB'
                    />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
              </form>
            </ModalBody>
          </Card>

          <ModalFooter>
            <Button
              color='primary'
              onClick={() => {
                validateAndAddDevice();
              }}
            >
              Submit
            </Button>{' '}
            <Button color='secondary' onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </>
      </Modal>
    </div>
  );
}
