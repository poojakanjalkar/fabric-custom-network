import React, { useState } from "react";
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
import AddOrganization from "./AddOrganization";
export default function Organization() {
  const orgList = [
    {
      type: "tets",
      name: "test",
      msp: "tets",
      numberOfPeers: "test",
      currentStateDb: "tets",
    },
  ];

  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <>
      <Header />
      <AddOrganization toggle={toggleModal} modal={modal} />
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
                    >
                      {"Add Organization"}
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
                      <th>Type</th>
                      <th>Name</th>
                      <th>MSP</th>
                      <th>No. Of Peers</th>
                      <th>Current State DB</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orgList.map((orgInfo) => {
                      return (
                        <tr>
                          <td>{orgInfo.type}</td>
                          <td>{orgInfo.name}</td>
                          <td>{orgInfo.msp}</td>
                          <td>{orgInfo.numberOfPeers}</td>
                          <td>{orgInfo.currentStateDb}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CardHeader>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
}
