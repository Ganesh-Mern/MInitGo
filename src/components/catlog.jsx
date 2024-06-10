 import Dropdown from "react-bootstrap/Dropdown";
import cartIcon from "../assets/cart-icon.svg";
import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTotalQuantity } from "../components/redux/Slices/CartSlice.js";
import { FiFilter } from "react-icons/fi";
import { FaLocationDot } from "react-icons/fa6";

import Filter from "./Filter.jsx";
import myContext from "./context/MyContext";
import { Link } from "react-router-dom"
import NavDropdown from "react-bootstrap/NavDropdown";
import { CiLocationArrow1 } from "react-icons/ci";
import { FaLocationCrosshairs } from "react-icons/fa6";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";



export default function Catlog() {
  const [mobileView, setMobileView] = useState(false);
  const totalQuantity = useSelector(selectTotalQuantity);
  const [addressDisplay, setAddressDisplay] = useState('')
  const context = useContext(myContext);

  const { products, addressStore, officeAddressStore, loginSuccess } = context;
  const [selectedAddress, setSelectedAddress] = useState(addressStore)


  const location = useLocation();
  const showFilter = () => {

    useEffect(() => {
      const display =
        selectedAddress === officeAddressStore ? officeAddressStore : addressStore;

      setAddressDisplay(display);
    }, [selectedAddress, addressStore, officeAddressStore]);


    return (
      location.pathname === "/products" ||
      location.pathname === "/mens-category" ||
      location.pathname === "/womens-category" ||
      location.pathname === "/accessories" ||
      location.pathname === "/category"
    );
  };

  const locationHy = useLocation();
  const showHyDropdown = () => {
    // Check if location pathname is not '/signin' or '/register'
    return (
      locationHy.pathname === "/"
    );
  };


  // State to manage the dropdown title
  const locationHY = (
    <>
      <CiLocationArrow1 /> Hyderabad
    </>
  );

  const [dropdownTitle, setDropdownTitle] = useState(locationHY);

  // Function to handle the dropdown item click
  const handleDropdownItemClick = (option) => {
    // Update the dropdown title based on the selected item
    setDropdownTitle(option);
  };


  const handleAddressTypeChange = (addressType) => {
    setSelectedAddress(addressType);
  };

  return (
    <>
      <div className="catlog filter ">
        {/* code start by ganesh  */}
        <div className="inr-catlog catlog-names  text-center  container-fluid    ">
          <div className="nav-link  cat-nav hidden md:flex pd-2 d-none d-md-flex justify-content-evenly w-100  mx-5   me-5 new-catlog align-items-center">
            {/* code end by ganesh */}
            <div className="dropdown  "> 
              <button className="btn dropdown-toggle" type="button" id="locationDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <FaLocationDot className="fs-4 p-1 mb-1" />
             <span > Deliver To</span>   <span> {addressDisplay}</span>
              </button>
              <ul className="dropdown-menu" aria-labelledby="locationDropdown">
                <li>
                  <a className={`dropdown-item ${addressDisplay && selectedAddress === addressStore ? 'active' : ''}`} href="#" onClick={() => handleAddressTypeChange(addressStore)}>

                    <span className="">Home Address</span><br />
                    <FaLocationDot className="fs-5 p-1 mb-1" />
                    {addressStore}
                  </a>
                </li>
                <li>
                  <a className={`dropdown-item ${addressDisplay && selectedAddress === officeAddressStore ? 'active' : ''}`} href="#" onClick={() => handleAddressTypeChange(officeAddressStore)}>
                    <span className="">Office Address</span><br />
                    <FaLocationDot className="fs-5 p-1 mb-1" />
                    {officeAddressStore}
                  </a>
                </li>
              </ul>
            </div>
              {/* added [fontSize: "16px", textDecoration:"none" ,paddingTop:"2px",fontWeight:"bolder"] by sonali */}
            <Link to={{ pathname: "/accessories", search: `?category=Accessories` }} style={{   color: "black", fontSize: "16px", textDecoration:"none" ,paddingTop:"2px", fontWeight:"bolder" }}>
              <span className="mt-3 ">Fashion</span>
            </Link>
            <Link
              to={{
                pathname: "/mens-category",
                search: `?category=Men's Fashion`,
              }}
              style={{ color: "black", fontSize: "14px", textDecoration:"none" ,paddingTop:"2px",fontWeight:"bolder"}}
            > <span className="mt-1  ">Mens</span></Link>
            <Link
              to={{
                pathname: "/womens-category",
                search: `?category=Women's Fashion`,
              }}
              style={{  color: "black", fontSize: "14px", textDecoration:"none" ,paddingTop:"2px",fontWeight:"bolder"  }}
            ><span className="mt-1 ">Women's</span></Link>
            <Link
              style={{ color: "black", fontSize: "14px", textDecoration:"none" ,paddingTop:"2px",fontWeight:"bolder"}}
            ><span className="mt-1 ">Kids</span></Link>
            <Link
              to={{
                pathname: "/accessories",
                search: `?category=Accessories`,
              }}
              style={{ color: "black", fontSize: "14px", textDecoration:"none" ,paddingTop:"2px",fontWeight:"bolder"}}
            ><span className="mt-1 ">Other</span></Link>
            <Link
              to={{
                pathname: "/accessories",
                search: `?category=Accessories`,
              }}
              style={{  color: "black", fontSize: "14px", textDecoration:"none" ,paddingTop:"2px",fontWeight:"bolder"}}
            >
              <span className="mt-1 ">Best deals</span></Link>
            <Link
              to={{
                pathname: "/accessories",
                search: `?category=Accessories`,
              }}
              style={{ color: "black", fontSize: "14px", textDecoration:"none" ,paddingTop:"2px",fontWeight:"bolder" }}
            > <span className="mt-1 ">Offers</span></Link>
          {/*  updated till this [fontSize: "16px", textDecoration:"none" ,paddingTop:"2px",fontWeight:"bolder"] by sonali */}

            {/* Add other links */}
          </div>

          {/* Add the image and dropdown for mobile view */}
          {showHyDropdown() && (
            <div className="dropdown nav-link cat-nav d-md-none d-flex justify-content-between w-100 align-items-center text-black">
              <div className="dropdown ">
                <button className="btn dropdown-toggle" type="button" id="mobileLocationDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  {dropdownTitle}
                </button>
                <ul className="dropdown-menu" aria-labelledby="mobileLocationDropdown">
                  <li><a className="dropdown-item" href="#">Hyderabad</a></li>
                  <li><a className="dropdown-item" href="#">Mumbai</a></li>
                  <li><a className="dropdown-item" href="#">Delhi</a></li>
                  <li><a className="dropdown-item" href="#">Banglore</a></li>
                </ul>
              </div>
              {/* <span>
                <img src="https://cdn.pixabay.com/photo/2016/11/21/16/55/high-heels-1846436_640.jpg" className="m-0 p-0 homeCatlogImg" style={{ height: "4rem", width: "12rem" }} />
              </span> */}
            </div>
          )}

          {/* Add the filter button for mobile view */}
          {showFilter() && (
            <div className="nav-link cat-nav d-md-none d-block">
              <button className="btn btn-primary rounded-pill" data-bs-toggle="modal" data-bs-target="#filterModal" onClick={() => setMobileView(true)}>Filter</button>
            </div>
          )}
        </div>


      




      {/* filter modal */}
      <div
        className="modal fade bottom"
        id="filterModal"
        tabIndex="-1"
        aria-labelledby="filterModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable filter-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="filterModal">
                Filter
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Filter mobileView={mobileView} />
            </div>
          </div>
        </div>
      </div>
      </div>
      {/* modal end */}
    </>
  );
}



