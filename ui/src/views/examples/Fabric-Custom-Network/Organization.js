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
import ReactPaginate from "react-paginate";
import axios from "axios";
import Header from "components/Headers/Header";
import AddOrganization from "./AddOrganization";
import { headers } from "helper/config";
import { map } from "jquery";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faDownload } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faDownload } from "@fortawesome/free-solid-svg-icons";
import ViewOrgTable from "./ViewOrgTable";
export default function Organization() {
  const [orgList, setOrgList] = useState([
    {
      type: "tets",
      name: "test",
      msp: "tets",
      numberOfPeers: "test",
      currentStateDb: "tets",
    },
  ]);

  const [requestList, setRequestList] = useState([]);

  const [pageCount, setPageCount] = useState(0);
  const [paginationData, setPaginationData] = useState({ selectedPage: 0 });
  const [selectedItem, setSelectedItem] = useState();
  const [modal, setModal] = useState(false);
  const toggleModal = (row) => {
    if (row) {
      setSelectedItem(row);
    }
    setModal(!modal);
  };

  useEffect(() => {
    console.log("======total pages=====", requestList?.totalPages);
    setPageCount(requestList?.totalPages);
  }, [requestList]);

  const handlePageClick = (page) => {
    console.log("selected page is@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", page);
    setPaginationData({
      ...paginationData,
      selectedPage: page.selected,
    });
  };

  const handleDownloadClick = async(id) => {
    let h = headers()
    h.headers.Accept = 'application/zip'
    h.headers['Access-Control-Allow-Origin']= '*'
    h.responseType = 'arraybuffer'
    let result = await axios.get(
      `http://localhost:3000/v1/org/download/${id}`,
      h
    );

    const url = window.URL.createObjectURL(new Blob([result.data], { type: 'application/zip' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'file.zip';
      link.click();

      window.URL.revokeObjectURL(url);
    console.log(
      "----------------dsfgdsrfgdfhdfhdhdthdthjjjjjjjjjjjjjj-----------",
      result.data
    );
  };

  const addOrganizationItem = (organization) => {
    setOrgList([...orgList, organization]);
    // console.log("++++++++++++", result);
  };

  useEffect(() => {
    getData(0);
  }, []);

  const getData = async (page) => {
    let result = await axios.get(
      `http://localhost:3000/v1/org/?page=${page}&size=10`,
      headers()
    );
    console.log(
      "----------------dsfgdsrfgdfhdfhdhdthdthjjjjjjjjjjjjjj-----------",
      result.data
    );

    setRequestList(result?.data?.payload);
  };

  // const handleDropdownSelect = (selectedItem) => {
  //   const result = orgList.push(selectedItem);
  //   console.log("---dropdown value--", result);
  // };

  // useEffect(() => {
  //   console.log("0000000000-----", selectedItem);
  // }, [selectedItem]);

  // const ItemView = (item) => {
  //   console.log("^%^^%&&^^&%^&%^$^&$^&$-----------", item);
  //   setSelectedItem(item);

  //   toggleModal();
  // };

  return (
    <>
      <Header />

      <ViewOrgTable
        toggle={toggleModal}
        modal={modal}
        selectedItem={selectedItem}
      />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <FormGroup row>
                  <Col sm={9}>
                    <h3 className="mb-0">Organization Data</h3>
                  </Col>
                  <Col sm={3}>
                    <Button
                      className="my-1"
                      color="primary"
                      onClick={toggleModal}
                      type="button"
                    ></Button>
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
                      <th>Project Name</th>
                      <th>Org Count</th>
                      <th>Channel Count</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {requestList?.docs?.map((request) => {
                      return (
                        <tr>
                          <td>{request?.configuration?.projectName}</td>
                          <td>
                            {request?.configuration?.Organizations?.map(
                              (e) => e.orgName + ", "
                            )}
                          </td>
                          <td>
                            {request?.configuration?.channels?.map(
                              (e) => e.channelName + ", "
                            )}
                          </td>
                          <td>{request?.status}</td>
                          {/* <td>{request?.configuration?.currentStateDb}</td> */}
                          <td>
                            <Button onClick={() => toggleModal(request)}>
                              <FontAwesomeIcon icon={faEye} />
                            </Button>
                            <span style={{ marginRight: "15px" }}></span>

                            <FontAwesomeIcon onClick={()=> handleDownloadClick(request?.id)} icon={faDownload} />
                          </td>
                          {/* <Button color="success" onClick={""}>
                           
                          </Button> */}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CardHeader>
              <CardBody>
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
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
}
