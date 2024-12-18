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
import { useToasts } from "react-toast-notifications";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Header from "components/Headers/Header";
import AddOrganization from "./AddOrganization";
// import { headers } from "helper/config";
import { map } from "jquery";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faDownload } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faDownload } from "@fortawesome/free-solid-svg-icons";
import ViewOrgTable from "./ViewOrgTable";
import { routes, headers } from "../../../helper/config";
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

  let history=useHistory();
  const{addToast}=useToasts();

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
      `${routes.download}/${id}`,
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
    try {
      
      let result = await axios.get(
        `${routes.request}?page=${page}&size=5`,
        headers()
      );
  
      setRequestList(result?.data?.payload);
    } catch (error) {
      if(error?.response?.data?.message==
        "token expired"){
          addToast(`Session expired, please login `, {
            appearance: "error",
            autoDismiss: true,
          });
          localStorage.removeItem("token")
          history.push("/auth/login")
        }
    }
   
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
                          {request?.configuration?.Organizations?.length}
                          </td>
                          <td>{request?.configuration?.channels?.length}</td>
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
