


import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import { FaLocationDot } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";

import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.css";
import Logo from "../components/images/minitgo.png";
import profileIcon from "../assets/profile.svg";


import {
  FaBox,
  FaCartShopping,
  FaCommentDots,
  FaLink,
  FaLocationCrosshairs,
  FaRegNewspaper,
} from "react-icons/fa6";
import { CiLocationArrow1 } from "react-icons/ci";

// import { BiCartAlt } from "react-icons/bi";
import cartIcon from "../assets/cart-icon.svg";
import { BiLogIn } from "react-icons/bi";
import { BiMenuAltRight } from "react-icons/bi";
import Catlog from "./catlog.jsx";
import Offcanvas from "react-bootstrap/Offcanvas"; // Import Offcanvas
import { useContext } from "react";
import myContext from "../components/context/MyContext.js";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTotalQuantity, showSnackbar } from "../components/redux/Slices/CartSlice.js";
import Login from "../pages/Signin.jsx";
import { Col, Modal, Row } from "react-bootstrap";
import SignUp from "../pages/SignUp.jsx";

import { IoHome } from "react-icons/io5";
import { FaCircleInfo, FaUserPlus, FaListCheck } from "react-icons/fa6";
import { FiLogIn } from "react-icons/fi";
import { MdContactSupport, MdHelp, MdOutlineUpdate } from "react-icons/md";
import { BsPersonCircle } from "react-icons/bs";
import { PiHandshakeBold } from "react-icons/pi";

import "./header.css";
import ResetPassword from "./ResetPassword.jsx";

function Header() {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [townDistrict, setTownDistrict] = useState("");
  const [state, setState] = useState("");


  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const navigate = useNavigate();
  const totalQuantity = useSelector(selectTotalQuantity);
  const [loginModal, setLoginModal] = useState(false);

  // State to manage the dropdown title
  const location = (
    <>
      <CiLocationArrow1 /> Hyderabad
    </>
  );
  const [dropdownTitle, setDropdownTitle] = useState(location);

  // Function to handle the dropdown item click
  const handleDropdownItemClick = (option) => {
    // Update the dropdown title based on the selected item
    setDropdownTitle(option);
  };
  // State to manage Offcanvas visibility
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showLeftSideOffcanvas, setShowLeftSideOffcanvas] = useState(false);

  // context code add
  const context = useContext(myContext);
  const {
    searchQuery,
    setSearchQuery,
    handleSearchInputChange,
    products,
    setSelectedCategory,
    showModal,
    setShowModal,
    forgetPasswordModal,
    addressStore,
    setAddressStore,
    setOfficeAddressStore
  
  
  } = context;


  // code for serach
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const focusSearchInput = () => {
    const searchInput = document.querySelector(".search-box");
    if (searchInput) {
      searchInput.focus();
    }
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("https://randomuser.me/api");
        const data = await response.json();
        const userData = data.results[0];
  
        const userName = ` ${userData.name.first} ${userData.name.last}`;
        const userNumber = userData.cell;
        const userLocation = `${userData.location.country}, ${userData.location.state}`;
  
        const responseAvatar = await fetch(
          `https://ui-avatars.com/api/?name=${userName}&background=FFCCBC`
        );
        const dataAvatar = await responseAvatar.blob();
        const userImage = URL.createObjectURL(dataAvatar);
  
        setUser({
          name: userName,
          image: userImage,
          number: userNumber,
          location: userLocation,
          address: userLocation // Assuming userLocation is the address
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    console.log('uss',userData)
  
    fetchUserData();
  }, []);
  
  useEffect(() => {
   if (userData && userData.address) {
      setAddressStore(userData.address);
    }
  if(userData && userData.officeAddress){
    setOfficeAddressStore(userData.officeAddress)
  }
  }, [user]);
  


  useEffect(() => {
    if (searchQuery !== "") {
      setSelectedCategory("");

      const normalizedQuery = searchQuery
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, "");

      const suggestions = products.filter((product) => {
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase());
        // Normalize the product name for comparison
        const normalizedProductName = product.product_name
          .toLowerCase()
          .replace(/[^a-zA-Z0-9 ]/g, "");
        return normalizedProductName.includes(normalizedQuery);
      });
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, products]);

  const handleGoButton = () => {
    if (searchQuery !== "") {
      navigate("/products", { state: { data: searchSuggestions } });
    } else {
      navigate("/products");
    }
    setSearchSuggestions([]);
  };

  const handleSuggestionClick = (productName) => {
    setSearchQuery(productName);
  };

  const handleKeyPress = (event, productName) => {
    if (event.key === "Enter") {
      handleGoButton();
    }
  };

  const locationState = useLocation();
  const openLoginModal = locationState?.state?.openLoginModal;

  useEffect(() => {
    if (openLoginModal) {
      setLoginModal(true);
    }
  }, [openLoginModal]);

  const handleUseCurrentLocation = () => {
    // Use browser geolocation API to get the current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=AIzaSyCMG4GzxbEmqfSZ-uaDOhF55sgxi9sumc4`
            ); // Replace 'YOUR_API_KEY' with your actual API key
            const data = await response.json();
            if (data.results.length > 0) {
              const { components } = data.results[0];
              setAddress(components.road || "");
              setCity(
                components.city || components.town || components.village || ""
              );
              setPincode(components.postcode || "");
              setTownDistrict(components.town || components.district || "");
              setState(components.state || "");
            }
          } catch (error) { }
        },
        (error) => {
          return;
        }
      );
    } else {
    }
  };

  //code for location
  {/*code started by isha */}
  const [locationForWeather, setLocationForWeather] = useState({  latitude: 17.385044, longitude: 78.486671, });
  const [cityAccordingToLocation, setCityAccordingToLocation] = useState("Hyderabad")
  const [error, setError] = useState(null);
const API_KEY ="cdbf68f3afc557e674b97c9f52536ab6";
const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (locationForWeather.latitude && locationForWeather.longitude) {
      const fetchWeatherData = async () => {
        try {
          const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${locationForWeather.latitude}&lon=${locationForWeather.longitude}&appid=${API_KEY}`);
          if (!response.ok) {
            throw new Error('Failed to fetch weather data');
          }
          const data = await response.json();
          setWeatherData((data?.main?.temp - 273.15).toFixed(2));
        setCityAccordingToLocation( data?.name)
        } catch (error) {
          setError(error.message);
        } 
      };

      fetchWeatherData();
    }
  }, [locationForWeather]);
{/*code end by isha */}

  const userData = JSON.parse(localStorage.getItem("user"));

  const fullName = userData ? userData.fullName : null;
  const userLocation = userData ? userData.address : null;
  const phoneNumber = userData ? userData.phoneNumber : null;


  function getInitials(fullName) {  
    return fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("");
  }
  const login = fullName ? (
    fullName
  ) : (
    <span>
      <BiLogIn /> Signin
    </span>
  );


  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        className="fixed-top flex-wrap "
        style={{background:'#e8d9b7'}}
      >
        <Container className="justify-content-between ">
          <Navbar.Brand className="d-flex  navbar-brand">
            <Link to="/">
              {/* sonali  */}
              {/* code start by ganesh */}
              <img className="minitgo-logo" src={Logo} style={{ width: "100px", marginRight:"10px"}} />
{/* code end by ganesh */}
              {/* original code */}
              {/* <img className="minitgo-logo" src={Logo} style={{ width: "90px" }} /> */}
            </Link>
            <div className="mobile-menu-logo d-lg-none d-flex profile-data " style={{marginLeft:'8px'}}>
              <span
                className="profile d-flex align-items-centrer "
                onClick={() => setShowLeftSideOffcanvas(true)}
              >
          
               <CgProfile className="profile-icon " style={{ height:"2rem", width: "2rem" }} />
              
              </span>
              {fullName && (
                <div className="userData  d-flex flex-column">
                  <span style={{ fontSize: "10px" }}>{fullName.length > 10 ? fullName.substring(0, 12) + '...' : fullName}</span>
                  <span style={{ fontSize: "10px" }}>
                    <div className="d-flex">
                      {userLocation && userLocation.length > 0 && (
                        <>
                          <FaLocationDot className="fs-5 p-1 locationSymbolFold" />
                          <span style={{ fontSize: '12px' }}>
                            {userLocation.length > 20 ? userLocation.substring(0, 8) + '...' : userLocation}
                          </span>
                        </>
                      )}

                    </div>

                  </span>
                </div>
              )}

            </div>


          </Navbar.Brand>

          {/* for mobile vieww */}
          <div className="mobile-menu-logo d-lg-none d-flex align-items-center" >
            {/* weather add in mobile view */}

            <div className="d-flex flex-column align-items-center temp-block" >
              <div className="d-flex  align-items-center justify-content-center" >
                <img className="tempSymbol"  style={{height:"13px", width:"13px"}}
                src="data:image/png;base64,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"
                //  style={{ height: "1rem", width: "1rem" }}
                  />
                {/* <div className="fw-semibold ">32&deg;C</div> */}
                <div className="fw-semibold" style={{fontSize:"13px"}}>{weatherData}&deg;C</div>
              </div>
              <div>
                 {/* <div style={{ fontSize: "10px" }}>Location</div> */}
                 <div style={{ fontSize: "10px" }}>{cityAccordingToLocation}</div>
              </div>
            </div>



            <Link
              to="/cart" style={{ color: "#000" }}>
              <div
                className="nav-link cat-nav d-lg-none d-block text-center "
                style={{ position: "relative" }}
              >
                <img
                className="cartIcon"
                  src={cartIcon}
                  alt="Cart"
                  style={{ height: "2rem", width: "2rem" }}
                />
                <h6
                  className="QTYValue"
                  style={{ position: "absolute", top: "0.5rem", left: "1.3rem" }}
                >
                  {totalQuantity}
                </h6>
              </div>
            </Link>

            <BiMenuAltRight
              className="mobile-menu-logo d-lg-none hamIcon"
              onClick={() => setShowOffcanvas(true)}
              style={{ fontSize: "33px",}}
            />
          </div>

          <Navbar.Collapse id="responsive-navbar-nav">
              
            <Nav className="me-auto">
              <NavDropdown
                title={dropdownTitle}
                id="collasible-nav-dropdown"
                // updated sonali
                style={{ border: "2.6px solid #d8dfab", borderRadius: "13px",marginLeft:"3px" }}
                // style={{ border: "2.6px solid #d8dfab", borderRadius: "13px" }}
              >
                <NavDropdown.Item
                  onClick={() => {
                    setLocationForWeather({
                      latitude: 17.385044,
                      longitude: 78.486671,
                    });
                    handleDropdownItemClick("Hyderabad")
                  }}
                >
                  <FaLocationCrosshairs /> Hyderabad
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={() =>{
                    setLocationForWeather({
                      latitude: 19.075983,
                      longitude: 72.877655,
                    });
                     handleDropdownItemClick("Mumbai")
                    }}
                >
                  Mumbai
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() =>{
                    setLocationForWeather({
                      latitude:28.704060,
                      longitude: 77.102493,
                    });
                     handleDropdownItemClick("Delhi")
                    }}
                >
                  Delhi
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() =>{
                    setLocationForWeather({
                      latitude: 12.971599,
                      longitude: 77.594566,
                    });
                     handleDropdownItemClick("Bangalore")
                    }}
                >
                  Bangalore
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            
            <Form.Control
              //sonali //updates
              style={{ margin: "0 -40px 0 32px", borderRadius:"13px" }}
              //orginal code
              // style={{ margin: "0 0px 0 32px", }}
              type="search"
              placeholder=" Ex: T-Shirt near me"
              className=" search-box"
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
            />

            <Form />

            <Button
              className=" search-btn  "
              //sonali //updates
              style={{ borderRadius:"13px" }}
              // original
              // style={{ margin: "0 0px 0 32px"}}
              variant="outline-success"
              onClick={handleGoButton}
            >
             GO
            </Button>
            

            <div
              className="suggestion position-absolute"
              style={{ width: "760px" }}
            >
              <div
                className="container position-absolute"
                style={{
                  marginLeft: "165px",
                  marginTop: "20px",
                  background: "rgb(217, 223, 175",
                }}
              >
                {searchSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.product_id}
                    onKeyDown={(event) =>
                      handleKeyPress(event, suggestion.product_name)
                    }
                    tabIndex={0}
                  >
                    <span
                      style={{ cursor: "Pointer" }}
                      onClick={() =>
                        handleSuggestionClick(suggestion.product_name)
                      }
                    >
                      <span className="py-2 px-2 m-1 fs-6">
                        {suggestion.product_name}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* updates sonali */}
            <Nav className="spacing">
            {/* <Nav> */}
              <NavDropdown
                title={login}
                id="collasible-nav-dropdown"
                //updates//sonali
                className="Dropdown my-2 "
                // //original code
                // className="Dropdown "
              >
                {fullName && (
                  <>
                    <NavDropdown.Item>
                      <Link to="/profile" className="text-decoration-none ">
                        {" "}
                        Profile{" "}
                      </Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      <Link to="/profile" className="text-decoration-none ">
                        {" "}
                        Address change{" "}
                      </Link>
                    </NavDropdown.Item>
                  </>
                )}
                {fullName ? (
                  <NavDropdown.Item>
                    <div
                      onClick={() => {
                        localStorage.removeItem("user");
                        window.location.reload();
                      }}
                      style={{ color: "red" }}
                    >
                      <BiLogIn className="me-2" />
                      Logout
                    </div>
                  </NavDropdown.Item>
                ) : (
                  <>
                    <NavDropdown.Item >
                      <div
                        onClick={() => setShowModal(true)}
                        style={{ color: "blue" }}
                      >
                        SignUp
                      </div>
                    </NavDropdown.Item>

                    <NavDropdown.Item>
                      <div
                        onClick={() => setLoginModal(true)}
                        style={{ color: "blue" }}
                      >
                        Login
                      </div>
                    </NavDropdown.Item>
                  </>
                )}

                {/* Shubham- Desktop Login modal ends here */}

                <NavDropdown.Divider />
              </NavDropdown>
              <Link
                to="/orders"
                //updated//sonali
                className="nav-link text-decoration-none text-dark my-2"
                //original code
                // className="nav-link text-decoration-none text-dark "
              >
                Orders
              </Link>

              {/* <Link to="/cart" className='text-secondary' style={{ fontSize: '33px', margin: '-5.8% 0 0 0' }}><BiCartAlt /></Link> */}
              <Link
                to="/cart"
                className="text-secondary position-relative   "
                style={{
                  textDecoration: "none",
                  width: "50px",
                }}
              >
                <div className=" w-100 h-100 position-relative d-flex flex-column justify-content-center align-items-center">
                  <img
                    src={cartIcon}
                    alt="Cart"
                    //updated code//sonali
                    className="w-100 mx-auto "
                    // origial code
                    // className="w-100 mx-auto "

                    style={{ height: "40px", marginRight:"50px", marginLeft:"20px"}}
                  />
                  <h6
                    className=" w-100  position-absolute text-center "
                    id="cartNo"
                    style={{ top: "3px", left: "1px", fontSize: "14px" }}
                  >
                    {totalQuantity}
                  </h6>
                </div>
              </Link>

              {/* weather add in desktop view */}
              <div className="d-flex flex-column align-items-center  gap-x-5 pt-1">

                <div className="dot d-flex  align-items-center justify-content-center" >
                  <img src="data:image/png;base64,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" style={{ height: "1rem", width: "1rem" }} />
                  {/* <span className="fw-semibold">32&deg;C</span> */}
                  <span className="fw-semibold">{weatherData}&deg;C</span>
                </div>
                <div>
                <p style={{ fontSize: "10px" }}>{cityAccordingToLocation}</p>
                {/* <p style={{ fontSize: "10px" }}>Location</p> */}
                </div>

              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
        <div className="mobile-menu-logo d-lg-none w-100  ">
          <div className="mobile-search mt-2 container">
            <Form.Control
              type="search"
              placeholder="Ex: T-Shirt near me"
              className=" search-box  "
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
              style={{ width: "100%" }}
            />

            <Form />

            <Button
              className=" search-btn"
              variant="outline-success"
              onClick={handleGoButton}

            >
              Go
            </Button>
            <div
              className="suggestion position-absolute"
              style={{ width: "350px" }}
            >
              <div
                className="container position-absolute"
                style={{ marginTop: "50px", background: "rgb(217, 223, 175" }}
              >
                {searchSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.product_id}
                    onKeyDown={(event) =>
                      handleKeyPress(event, suggestion.product_name)
                    }
                    tabIndex={0}
                  >
                    <span
                      style={{ cursor: "Pointer" }}
                      onClick={() =>
                        handleSuggestionClick(suggestion.product_name)
                      }
                    >
                      <span className=" px-2 m-1 fs-6">
                        {suggestion.product_name}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Navbar>

      <Catlog />

      {showModal && (
        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(false);
          }}
          // dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
          className="p-0"
        >
          <Modal.Body
            className="p-0 d-flex w-max flex-lg-row flex-column  "
            style={{ minWidth: "10rem", backgroundColor: "#fff5f5" }}
          >
            <Modal.Header closeButton className="d-block d-lg-none" />

            <SignUp />
          </Modal.Body>
        </Modal>
      )}

      {/* Login Modal */}

      <Modal
        show={loginModal}
        onHide={() => setLoginModal(false)}
        aria-labelledby="example-custom-modal-styling-title"
        className=" bg-opacity"
      >
        <Modal.Body
          className="p-0 rounded-4 d-flex w-max "
          style={{ minWidth: "100%" }}
        >

          <Login closeLoginModal={() => setLoginModal(false)} />
        </Modal.Body>
      </Modal>

      {
        forgetPasswordModal && (
          <ResetPassword setLoginModal={() => setLoginModal(true)} />
        )
      }


      {/* Offcanvas Sidebar */}

      {/* Mobile view starts here */}

      {/* this is right side */}
      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <img
              src="/src/components/images/minitgo.png"
              width={100}
              height={20}
            />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-flex flex-column justify-content-center align-items-center border rounded   my-2 " style={{ height: '150px' }}>
            <img src="man-working.jpg" alt="IMG" className="w-100 h-100" />
          </div>
          {/* Sidebar content goes here */}

          <Row className="py-1">
            <Col className="col-6">
              <Nav className="flex-column w-100">
                <Link
                  to="/"
                  className="border-bottom py-3 fw-semibold px-2"
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                  onClick={() => setShowOffcanvas(false)}
                >
                  <IoHome
                    className="me-3 "
                    style={{
                      width: "1.3rem",
                      height: "1.3rem",
                      color: "#E4AAAA",
                    }}
                  />
                  Home
                </Link>

                <Link
                  to="/about"
                  className="border-bottom py-3 fw-semibold px-2"
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                  onClick={() => setShowOffcanvas(false)}
                >
                  <FaCircleInfo
                    className="me-3 "
                    style={{
                      width: "1.3rem",
                      height: "1.3rem",
                      color: "#E4AAAA",
                    }}
                  />
                  About
                </Link>

                <Link
                  to="/orders"
                  className="border-bottom py-3 fw-semibold px-2"
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                  onClick={() => setShowOffcanvas(false)}
                >
                  <FaListCheck
                    className="me-3 "
                    style={{
                      width: "1.3rem",
                      height: "1.3rem",
                      color: "#E4AAAA",
                    }}
                  />
                  Orders
                </Link>

                <Link
                  to="/products"
                  className="border-bottom py-3 fw-semibold px-2"
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                  onClick={() => setShowOffcanvas(false)}
                >
                  <FaBox
                    className="me-3 "
                    style={{
                      width: "1.3rem",
                      height: "1.3rem",
                      color: "#E4AAAA",
                    }}
                  />
                  Products
                </Link>

                <Link
                  to="/contact"
                  className="border-bottom py-3 fw-semibold px-2"
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                  onClick={() => setShowOffcanvas(false)}
                >
                  <MdContactSupport
                    className="me-3 "
                    style={{
                      width: "1.3rem",
                      height: "1.3rem",
                      color: "#E4AAAA",
                    }}
                  />
                  Contact Us
                </Link>
              </Nav>
            </Col>
            <Col className="col-6">
              <Nav className="flex-column w-100">
                <Link
                  to="/connect"
                  className="border-bottom py-3 fw-semibold px-2"
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                  onClick={() => setShowOffcanvas(false)}
                >
                  <FaLink
                    className="me-3 "
                    style={{
                      width: "1.3rem",
                      height: "1.3rem",
                      color: "#E4AAAA",
                    }}
                  />
                  Connect
                </Link>

                <Link
                  to="/feedback"
                  className="border-bottom py-3 fw-semibold px-2"
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                  onClick={() => setShowOffcanvas(false)}
                >
                  <FaCommentDots
                    className="me-3 "
                    style={{
                      width: "1.3rem",
                      height: "1.3rem",
                      color: "#E4AAAA",
                    }}
                  />
                  Feedback
                </Link>
                <Link
                  to="/blog"
                  className="border-bottom py-3 fw-semibold px-2"
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                  onClick={() => setShowOffcanvas(false)}
                >
                  <FaRegNewspaper
                    className="me-3 "
                    style={{
                      width: "1.3rem",
                      height: "1.3rem",
                      color: "#E4AAAA",
                    }}
                  />
                  Blog
                </Link>

                <Link
                  to="/updates"
                  className="border-bottom py-3 fw-semibold px-2"
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                  onClick={() => setShowOffcanvas(false)}
                >
                  <MdOutlineUpdate
                    className="me-3 "
                    style={{
                      width: "1.3rem",
                      height: "1.3rem",
                      color: "#E4AAAA",
                    }}
                  />
                  Updates
                </Link>

                <Link
                  to="/partner"
                  className="border-bottom py-3 fw-semibold px-2"
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                  onClick={() => setShowOffcanvas(false)}
                >
                  <PiHandshakeBold
                    className="me-3 "
                    style={{
                      width: "1.3rem",
                      height: "1.3rem",
                      color: "#E4AAAA",
                    }}
                  />
                  Become a Partner
                </Link>

                <Link
                  to="/help"
                  className="border-bottom py-3 fw-semibold px-2"
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                  onClick={() => setShowOffcanvas(false)}
                >
                  <MdHelp
                    className="me-3 "
                    style={{
                      width: "1.3rem",
                      height: "1.3rem",
                      color: "#E4AAAA",
                    }}
                  />
                  Help
                </Link>
              </Nav>
            </Col>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>

      {/* this is left side */}
      <Offcanvas
        show={showLeftSideOffcanvas}
        onHide={() => setShowLeftSideOffcanvas(false)}
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <img
              src="/src/components/images/minitgo.png"
              width={100}
              height={20}
            />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {fullName && (
            <div className="d-flex flex-column justify-content-center align-items-center border rounded  py-4 my-2">

              <div
                className="rounded rounded-circle  border-2 border-primary "
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "1.5rem",
                  height: '60px',
                  width: '60px'
                }}>
                {getInitials(fullName)}
              </div>

              <h2 className="mt-2">{fullName}</h2>
              <h5>{phoneNumber}</h5>
              <p>
                <span className="fw-bold">Location:</span> {userLocation}
              </p>
            </div>
          )}

          {/* Sidebar content goes here */}
          <div className="btn-block">
            {fullName && <></>}

            {fullName ? (
              <div >
                <div className=" py-3 px-2 w-100 ">
                  <Link
                    to="/profile"
                    className="border-bottom py-3 fw-semibold  d-block w-100 "
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                    onClick={() => setShowLeftSideOffcanvas(false)}
                  >
                    <BsPersonCircle
                      className="me-3 "
                      style={{
                        width: "1.3rem",
                        height: "1.3rem",
                        color: "#E4AAAA",
                      }}
                    />
                    Profile
                  </Link>
                </div>

                <div
                  onClick={() => {
                    localStorage.removeItem("user");
                    window.location.reload();
                  }}
                  style={{ color: "red" }}
                  className=" py-3 px-2"
                >
                  <BiLogIn className="me-3" />
                  Logout
                </div>
              </div>
            ) : (
              <>
                <div
                  className="border-bottom py-3 fw-semibold px-2 "
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                  onClick={() => {
                    setShowLeftSideOffcanvas(false);
                    setShowModal(true);
                    console.log(true, showModal);
                  }}
                >
                  <FaUserPlus
                    className="me-3 "
                    style={{
                      width: "1.3rem",
                      height: "1.3rem",
                      color: "#E4AAAA",
                    }}
                  />
                  SignUp
                </div>

                <div
                  className="border-bottom py-3 fw-semibold px-2  "
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                  onClick={() => {
                    setShowLeftSideOffcanvas(false);
                    setLoginModal(true);
                  }}
                >
                  <FiLogIn
                    className="me-3 "
                    style={{
                      width: "1.3rem",
                      height: "1.3rem",
                      color: "#E4AAAA",
                    }}
                  />
                  Login
                </div>
              </>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Header;

