import Header from "components/Headers/Header";
import React, { useState, useEffect } from "react";
import {
  Button,
  TabContent,
  TabPane,
  Card,
  CardHeader,
  FormGroup,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  CardText,
  Table,
  Container,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
import AddDevice from "./AddDevice";
import UpdateDevice from "./UpdateDevice";
import axios from "axios";
import { headers } from "helper/config";
import ReactPaginate from "react-paginate";

export default function Device() {
  const [deviceList, setDeviceList] = useState([]);

  const [pageCount, setPageCount] = useState(0);
  const [paginationData, setPaginationData] = useState({ selectedPage: 0 });

  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState();

  useEffect(() => {
    getDevices(0);
  }, []);

  const getDevices = async (page) => {
    let result = await axios.get(
      `http://localhost:3000/v1/devices?page=${page}&size=2`,
      headers()
    );
    console.log("---------------------------", result.data);

    setDeviceList(result?.data?.payload);
  };

  const addDevice = async (data) => {
    let result = await axios.post(
      "http://localhost:3000/v1/devices",
      data,
      headers()
    );
    getDevices(0);
  };

  const updateDevice = async (data) => {
    console.log("---------------data------------", data);
    let result = await axios.put(
      `http://localhost:3000/v1/devices/${data.id}`,
      data,
      headers()
    );

    getDevices(0);
  };

  useEffect(() => {
    console.log("------------pageCount---------------", pageCount);
  }, [pageCount]);

  useEffect(() => {
    console.log("======total pages=====", deviceList?.totalPages);
    setPageCount(deviceList?.totalPages);
  }, [deviceList]);

  const handlePageClick = (page) => {
    console.log("selected page is@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", page);
    setPaginationData({
      ...paginationData,
      selectedPage: page.selected,
    });
  };

  useEffect(() => {
    console.log("pagination data changed", paginationData);
    getDevices(paginationData.selectedPage);
  }, [paginationData]);

  // const deviceInfo =
  const addItem = (data) => {
    // deviceList.push(data);
    addDevice(data);
  };

  const updateItem = (data) => {
    // deviceList.push(data);
    updateDevice(data);
  };

  const handleEditDevice = (data) => {
    // setIsEdit(true);

    setEditData(data);
    // setEditData();
    toggleEditModal();
  };

  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  // for edit
  const [editModal, setEditModal] = useState(false);
  const toggleEditModal = () => setEditModal(!editModal);

  return (
    <>
      <Header />
      <AddDevice toggle={toggleModal} modal={modal} addItem={addItem} />
      <UpdateDevice
        toggleEditModal={toggleEditModal}
        editModal={editModal}
        updateItem={updateItem}
        editData={editData}
      />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <FormGroup row>
                  <Col sm={9}>
                    <h3 className="mb-0">Device List</h3>
                  </Col>
                  <Col sm={3}>
                    <Button
                      className="my-1"
                      color="primary"
                      onClick={toggleModal}
                      type="button"
                    >
                      {"Add Device"}
                    </Button>
                  </Col>
                </FormGroup>
                <Table
                  className="align-items-center table-flush"
                  striped
                  bordered
                  hover
                >
                  <thead className="thead-light">
                    <tr>
                      <th>Name</th>
                      <th>Device Id</th>
                      <th>Calibration Date</th>
                      <th>Calibration Expiry Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {deviceList?.docs?.map((devInfo) => {
                      return (
                        <tr>
                          <td>{devInfo.name}</td>
                          <td>{devInfo.deviceId}</td>
                          <td>{devInfo.calibrationDate}</td>
                          <td>{devInfo.calibrationExpiryDate}</td>
                          <Button
                            className="my-1"
                            color="primary"
                            onClick={() => handleEditDevice(devInfo)}
                            type="button"
                          >
                            Edit
                          </Button>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CardHeader>
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={pageCount}
                marginPagesDisplayed={3}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              />
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
}
