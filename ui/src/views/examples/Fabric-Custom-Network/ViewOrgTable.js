import React, { useEffect } from "react";

import { Table } from "antd";
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
  Row,
  CardHeader,
  CardBody,
  Container,
} from "reactstrap";
import Header from "components/Headers/Header";
export default function ViewOrgTable(props) {
  const { toggle, modal, className, selectedItem } = props;

  useEffect(() => {
    console.log("+++selected itemmmmmm++++++", props.selectedItem);
  }, [props.selectedItem]);

  console.log("+++++++++", props.selectedItem);
  const dataSource = [
    {
      key: "1",
      orgType: "testtt",
      orgName: "",
      msp: "",

      certificateAuthority: "",
      currentStateDb: "",
      peerCount: "",
    },
  ];

  // console.log(
  //   "@@@@@@@@@@@@@@@@",
  //   props.selectedItem.configuration.Organizations
  // );

  const columns = [
    {
      title: "Org Type",
      dataIndex: "orgType",
      key: "orgType",
    },
    {
      title: "Org Name",
      dataIndex: "orgName",
      key: "orgName",
    },
    {
      title: "MSP",
      dataIndex: "msp",
      key: "msp",
    },
    {
      title: "Certificate Authority",
      dataIndex: "ca",
      key: "ca",
    },
    {
      title: "Current State DB",
      dataIndex: "db",
      key: "db",
    },
    {
      title: "Peer count",
      dataIndex: "peerCount",
      key: "peerCount",
    },
  ];

  const channelColumns = [
    {
      title: "Channel Name",
      dataIndex: "channelName",
      key: "channelName",
    },
    {
      title: "Participating Orgs",
      dataIndex: "orgName",
      key: "orgName",
      render: (orgName) => orgName.join(", "), // Convert array to comma-separated string
    },
    {
      title: "Chaincode Name",
      dataIndex: "ChaincodeName",
      key: "ChaincodeName",
    },
  ];

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} className={className} size={"xl"}>
        <ModalHeader toggle={toggle}></ModalHeader>
        <Container className="mt--7" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <FormGroup row>
                    <Col sm={9}>
                      <h3 className="mb-0">Organization Details</h3>
                    </Col>
                  </FormGroup>
                </CardHeader>

                <Card>
                  <CardBody>
                    <FormGroup row>
                      <Label sm={3}>Project Name</Label>
                      <Col sm={5}>
                        <Input
                          value={
                            props?.selectedItem?.configuration?.projectName
                          }
                          disabled
                        />
                        <FormFeedback>*Required</FormFeedback>
                      </Col>
                    </FormGroup>
                  </CardBody>
                </Card>
                <div>
                  <Card>
                    <CardBody>
                      <FormGroup row>
                        <Col sm={11}>
                          {" "}
                          <Table
                            dataSource={
                              props?.selectedItem?.configuration?.Organizations
                            }
                            columns={columns}
                            pagination={false}
                          />
                        </Col>
                      </FormGroup>
                    </CardBody>
                  </Card>
                </div>
                <Card>
                  <CardBody>
                    <FormGroup row>
                      <Col sm={12}>
                        <div>
                          <Table
                            dataSource={
                              props?.selectedItem?.configuration?.channels
                            }
                            columns={channelColumns}
                            pagination={false}
                          />
                        </div>
                      </Col>
                    </FormGroup>
                  </CardBody>
                </Card>
              </Card>
            </div>
          </Row>
        </Container>
      </Modal>
    </div>
  );
}
