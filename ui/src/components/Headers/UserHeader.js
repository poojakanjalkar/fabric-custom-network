
import React from "react";
import { connect } from 'react-redux';
// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";

class UserHeader extends React.Component {
  render() {
    return (
      <>
        <div
          className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
          style={{
            minHeight: "400px",
            // backgroundImage:
            //   "url(" + require("../../assets/img/theme/profile-cover.jpg") + ")",
            backgroundSize: "cover",
            backgroundPosition: "center top"
          }}
        >
          {/* Mask */}
          <span className="mask bg-gradient-default opacity-8" />
          {/* Header container */}
          <Container className="d-flex align-items-center" fluid>
            <Row>
              <Col lg="7" md="10">
                <h2 className="display-3 text-white">{`Hello ${(JSON.parse(localStorage.getItem('user-data')).name)}` }</h2>
                {/* <p className="text-white mt-0 mb-5">
                 Profile details
                </p> */}
                {/* <Button
                  color="info"
                  href="#pablo"
                  onClick={e => e.preventDefault()}
                >
                  Edit profile
                </Button> */}
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  decodedData: state?.User?.login?.decodedData, // Replace with the actual state key
});


// export default UserHeader;

export default connect(mapStateToProps)(UserHeader);
