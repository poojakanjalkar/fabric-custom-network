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

import Header from "components/Headers/Header";
import AddSlaughter from "./AddSlaughter";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { headers } from "helper/config";

export default function SlaughterHouse() {
  const [slaughterList, setSlaughterList] = useState([]);
  //   {
  //     cattleId: "test",
  //     slaughterHouseName: "test",
  //     slaughtererName: "test",
  //     slaughtererSurname: "tets",
  //     slaughterDate: "test",

  //     coldRoomId: "tets",
  //     productId: "test",
  //     productName: "test",
  //     numberOfPieceCount: "test",
  //   },
  // ]);

  const [pageCount, setPageCount] = useState(0);
  const [paginationData, setPaginationData] = useState({ selectedPage: 0 });

  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  };
  useEffect(() => {
    getSlaughter(0);
  }, []);

  const getSlaughter = async (page) => {
    let result = await axios.get(
      `http://localhost:3000/v1/slaughter?page=${page}&size=2`,
      headers()
    );
    console.log("---------------------------", result.data);

    setSlaughterList(result?.data?.payload);
  };

  const addSlaughter = async (data) => {
    let result = await axios.post(
      "http://localhost:3000/v1/slaughter",
      data,
      headers()
    );
    getSlaughter(0);
  };

  useEffect(() => {
    console.log("------------pageCount---------------", pageCount);
  }, [pageCount]);

  useEffect(() => {
    console.log("======total pages=====", slaughterList?.totalPages);
    setPageCount(slaughterList?.totalPages);
  }, [slaughterList]);

  const handlePageClick = (page) => {
    console.log("selected page is@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", page);
    setPaginationData({
      ...paginationData,
      selectedPage: page.selected,
    });
  };

  useEffect(() => {
    console.log("pagination data changed", paginationData);
    getSlaughter(paginationData.selectedPage);
  }, [paginationData]);

  const addSlaughterItem = (data) => {
    // console.log("??????????????", slaughter);
    // const result = slaughterList.push(slaughter);
    // console.log("+++++++++++++", result);
    addSlaughter(data);
  };

  return (
    <>
      <Header />
      <AddSlaughter
        toggle={toggleModal}
        modal={modal}
        addSlaughterItem={addSlaughterItem}
      />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <FormGroup row>
                  <Col sm={9}>
                    <h3 className="mb-0">Slaughter</h3>
                  </Col>
                  <Col sm={3}>
                    <Button
                      className="my-1"
                      color="primary"
                      onClick={toggleModal}
                      type="button"
                    >
                      {"Add Data"}
                    </Button>
                  </Col>
                </FormGroup>
                <div style={{ overflowX: "auto" }}>
                  <Table
                    className="align-items-center table-flush"
                    striped
                    bordered
                    hover
                  >
                    <thead className="thead-light">
                      <tr>
                        <th>Cattle Id</th>
                        <th>Slaughter House Name</th>
                        <th scope="col">Slaughterer Name</th>
                        <th scope="col">Slaughterer Surname</th>
                        <th scope="col">Slaughter Date</th>

                        <th scope="col">Cold Room Id</th>
                        <th scope="col">Product ID</th>
                        <th scope="col">Product Name</th>
                        <th scope="col">Number Of Piece Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slaughterList?.docs?.map((info, index) => (
                        <tr key={index}>
                          <td>{info.cattleId}</td>
                          <td>{info.slaughterHouseName}</td>
                          <td>{info.slaughtererName}</td>
                          <td>{info.slaughtererSurname}</td>
                          <td>{info.slaughterDate}</td>

                          <td>{info.coldRoomId}</td>
                          <td>{info.productId}</td>
                          <td>{info.productName}</td>
                          <td>{info.numberOfPieceCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
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
