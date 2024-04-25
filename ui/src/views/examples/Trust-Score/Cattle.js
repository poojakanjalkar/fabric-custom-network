import React, { useState, useEffect } from "react";
import Header from "components/Headers/Header";
import ContractListView from "../ContractListView";

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
import AddCattle from "./AddCattle";
import UpdateCattle from "./UpdateCattle";

import ReactPaginate from "react-paginate";
import { headers } from "helper/config";
import axios from "axios";

export default function Cattle() {
  const [cattleList, setCattleList] = useState([]);

  const [pageCount, setPageCount] = useState(0);
  const [paginationData, setPaginationData] = useState({ selectedPage: 0 });

  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  };
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState();
  const [editModal, setEditModal] = useState(false);
  const toggleEditModal = () => setEditModal(!editModal);

  useEffect(() => {
    getCattle(0);
  }, []);

  const getCattle = async (page) => {
    let result = await axios.get(
      `http://localhost:3000/v1/cattle?page=${page}&size=2`,
      headers()
    );
    console.log("---------------------------", result.data);

    setCattleList(result?.data?.payload);
  };

  const addCattle = async (data) => {
    let result = await axios.post(
      "http://localhost:3000/v1/cattle",
      data,
      headers()
    );
    getCattle(0);
  };

  const updateCattle = async (data) => {
    console.log("---------------data------------", data);
    let result = await axios.put(
      `http://localhost:3000/v1/cattle/${data.id}`,
      data,
      // data.ownerName,
      // data.ownerSurname,
      headers()
    );
    getCattle(0);
    // console.log("--***********----", data.id);
  };

  useEffect(() => {
    console.log("------------pageCount---------------", pageCount);
  }, [pageCount]);

  useEffect(() => {
    console.log("======total pages=====", cattleList?.totalPages);
    setPageCount(cattleList?.totalPages);
  }, [cattleList]);

  const handlePageClick = (page) => {
    console.log("selected page is@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", page);
    setPaginationData({
      ...paginationData,
      selectedPage: page.selected,
    });
  };

  useEffect(() => {
    console.log("pagination data changed", paginationData);
    getCattle(paginationData.selectedPage);
  }, [paginationData]);

  const addCattleItem = (data) => {
    addCattle(data);
  };

  const updateCattleItem = (data) => {
    updateCattle(data);
  };

  const handleEditCattle = (data) => {
    setEditData(data);
    toggleEditModal();
  };

  return (
    <>
      <Header />
      <AddCattle
        toggle={toggleModal}
        modal={modal}
        addCattleItem={addCattleItem}
      />
      <UpdateCattle
        toggleEditModal={toggleEditModal}
        editModal={editModal}
        updateCattleItem={updateCattleItem}
        editData={editData}
      />

      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <FormGroup row>
                  <Col sm={9}>
                    <h3 className="mb-0">Cattle List</h3>
                  </Col>
                  <Col sm={3}>
                    <Button
                      className="my-1"
                      color="primary"
                      onClick={toggleModal}
                      type="button"
                    >
                      {"Add Cattle"}
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
                      <th>ID</th>
                      <th>Breed</th>
                      <th>Date Of Birth</th>
                      <th>Base Location</th>
                      <th>Device Id</th>
                      <th>Owner Id</th>
                      <th>Owner Name</th>
                      <th>Owner Surname</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cattleList?.docs?.map((list, index) => (
                      <tr key={index}>
                        <td>{list.cattleId}</td>
                        <td>{list.breed}</td>
                        <td>{list.dateOfBirth}</td>
                        <td>{list.baseLocation}</td>
                        <td>{list.deviceId}</td>
                        <td>{list.ownerId}</td>
                        <td>{list.ownerName}</td>
                        <td>{list.ownerSurname}</td>
                        <Button
                          className="my-1"
                          color="primary"
                          onClick={() => handleEditCattle(list)}
                          type="button"
                        >
                          Edit
                        </Button>
                      </tr>
                    ))}
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
