import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Add from "./images/shop.jpg";
import { BiInfoCircle } from "react-icons/bi";
import myContext from "./context/MyContext";

/* banner */
export default function Banner() {
  // const context = useContext(myContext);
  // const { setSearchQuery } = context;

  const navigate = useNavigate();

  function handleNavigateToProducts() {
    navigate("/products");
    // setSearchQuery("");
  }
  return (
    <>
      <div className="container" style={{ marginTop: "15px" }}>
        <Row>
          <div className="custom-bg ">
            <Col className="left-box ">
              <br></br>
              <h1 className="typing-text">
                Get Delivery In{" "}
                <span className="" style={{ color: "#5F6D79" }}>
                  {" "}
                  <br></br>Minutes
                </span>{" "}
                <span className="cursor">&nbsp;</span>
              </h1>
              <br></br>
              <Button className="buynow " onClick={handleNavigateToProducts}>
                Buy now{" "}
              </Button>
              <Button className="find-btn" onClick={handleNavigateToProducts}>
                Find near me 
              </Button>
              
              <p>
                {" "}
                <BiInfoCircle style={{ fontSize: "10pt" }} /> Get the products
                from nearest & trusted stores
              </p>
            </Col>
            <Col xs={6} sm={6} className="right-box">
              <img className="imgs " src={Add}  />
            </Col>
          </div>
        </Row>
      </div>
      <br></br>
    </>
  );
}