import React, { useEffect, useState } from "react";
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

// import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import { useHistory } from "react-router-dom";

import Header from "../components/Headers/Header.js";
import { useDispatch, useSelector } from "react-redux";
// import * as UserAction from "../actions/user.jsx";
// import Cattle from "./examples/Trust-Score/Cattle.js";
// import Device from "./examples/Trust-Score/Device.js";
// import AddDevice from "./examples/Trust-Score/AddDevice.js";
// import SlaughterHouse from "./examples/Trust-Score/SlaughterHouse.js";
// import Organization from "./examples/Fabric-Custom-Network/Organization.js";
// const axios = require("axios");
// const config = require("../helper/config.js");

export default function Index() {
  let history = useHistory();

  const userData = useSelector((state) => state?.User?.login?.decodedData);

  const [activeTab, setActiveTab] = useState("1");

  const selectActiveTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // useEffect(() => {
  //   if (!userData) {
  //     history.push("auth/login");
  //   }
  // }, []);

  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  return (
    <>
      <Header />
     
    </>
  );
}
