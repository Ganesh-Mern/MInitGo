import React, { useEffect, useState } from "react";
import StarRatings from "./ProductInfo/StarRatings";
import cartIcon from "../assets/cart-icon.svg";
import { Link } from "react-router-dom";

import {
  addToCart,
  showSnackbar,
  hideSnackbar,
  addItemToWishlist,
  hideSnackbarForWishlist,
  showSnackbarForWishlist,
} from "../components/redux/Slices/CartSlice.js";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./ProductInfo/ProductCard";

function AdsCarousel({ products }) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const handleAddToCart = (product, index) => {
    dispatch(addToCart(product));
    dispatch(showSnackbar({ message: "Product added successfully!", index }));

    // Wait for 1 second, then hide snackbar
    setTimeout(() => {
      dispatch(hideSnackbar());
    }, 1000);
  };

  useEffect(() => {
    setCurrentSlide(0); // Reset current slide to the first one
  }, [products]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);

  const goToPrevSlide = () => {
    setCurrentSlide(
      currentSlide === 0 ? products.length - 1 : currentSlide - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentSlide(
      currentSlide === products.length - 1 ? 0 : currentSlide + 1
    );
  };

  

  return (
    <>
      <div
        id="adsCarousel"
        className="carousel slide v w-100    rounded-2"
        data-bs-ride="carousel"
        style={{ height: "100%" }}
      >
        <div className="carousel-inner rounded h-100">
          {products.map((product, index) => (
            <div
              key={index} // Ensure each carousel item has a unique key
              className={`h-100 carousel-item rounded ${
                index === currentSlide ? "active" : ""
              }`}
            >
              <div key={index} className=" w-100 ">
                <div className="product-card " style={{ height: "100%" }}>
                  <a
                    href={`/${product.product_id}`}
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                  >
                    {/* code start by ganesh */}
                    <div className="product-image" style={{ position: "relative" }}>
                      <img src={product.product_image1} alt="Product 1" />

                      <div
                        className="offer-tag text-center p-1 text-bold mt-2" style={{
                          position: "absolute",
                          bottom: "15px",
                          right: "15px",
                          fontSize: "0.8rem",
                          padding: "1rem",
                          textDecorationColor: "HighlightText",
                          border: "2px solid",
                          borderRadius: "50px",
                          fontWeight: "bold",
                          backgroundColor: product.offers === "0" ? "" : "#e8d9b7",
                          opacity: product.offers === "0" ? 0 : 0.5,
                          
                      }}>
                  
                      {product.offers === "0" ? "No Offer" : `${product.offers}% Off`}
                      </div>
                    </div>
                    {/* code end by ganesh */}

                    <div className="product-content">
                      {product.product_name.length > 15
                        ? product.product_name.substring(0, 25) + "..."
                        : product.product_name}
                      <h5>
                        Price: <sup>&#x20B9;</sup>
                        {product.product_price}
                        <span className="text-decoration-line-through text-muted fs-6 fw-light">
                          599
                        </span>
                        <span
                          className="text-muted"
                          style={{
                            fontSize: "13px",
                          }}
                        >
                          {" "}
                          {product.product_stock}
                        </span>
                      </h5>
                      <div className="product-rating text-warning">
                        Rating: <StarRatings rating={product.product_ratings} />
                      </div>
                      <p className="product-distance text-secondary ">
                        Distance: {product.distance}km away.
                      </p>
                      {cart.snackbar.open && cart.snackbar.index === index && (
                        <div
                          style={{ fontSize: "12px" }}
                          className="border text-center rounded w-75 mx-auto"
                        >
                          {cart.snackbar.message}
                        </div>
                      )}
                    </div>
                  </a>

                  <div className="cart-btn d-flex justify-content-end mb-1 px-2">
                    <button
                      className="btn btn-secondary text-dark"
                      onClick={() => handleAddToCart(product, index)}
                    >
                      {/* <img
                        className="img-fluid"
                        src={cartIcon}
                        style={{ height: "20px" }}
                      /> */}
                      Add To Cart
                    </button>
                    {/* <button className="btn btn-primary my-2  ms-2 px-2">
                      Buy Now
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev rounded-circle p-2 ms-1"
          type="button"
          data-bs-target="#adsCarousel" // Correct data-bs-target
          data-bs-slide="prev"
          style={{
            height: "30px",
            top: "35%",
            width: "35px",
            backgroundColor: "#b3b3b4",
          }}
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
        </button>
        <button
          className="carousel-control-next rounded-circle p-2 me-1"
          type="button"
          data-bs-target="#adsCarousel" // Correct data-bs-target
          data-bs-slide="next"
          style={{
            height: "30px",
            top: "35%",
            width: "35px",
            backgroundColor: "#b3b3b4",
          }}
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
        </button>
      </div>
      <br/>
      <br/>
    </>
  );
}

export default AdsCarousel;
