import React, { useContext, useEffect, useState } from "react";
import cartIcon from "../../assets/cart-icon.svg";
import StarRatings from "./StarRatings";
import paypalIcon from "../../assets/paypal.svg";
import mastercardIcon from "../../assets/mastercard.svg";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import myContext from "../context/MyContext";
import { useDispatch } from "react-redux";
import { addToCart } from "../../components/redux/Slices/CartSlice";
import { toast } from "react-toastify";

function RightSection({ productId }) {
  const [cart, setCart] = useState([]);
  const totalQuantity = cart.reduce(
    (total, cartItem) => total + cartItem.quantity,
    0
  );
  const [snackbarOpen, setSnackbarOpen] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  // const [selectedSize, setSelectedSize] = useState("");
  const id = productId;

  const {handleImageClick}=useContext(myContext);



  useEffect(() => {
    axios
      .get("https://minitgo.com/api/fetch_products.php")
      .then((response) => {
        setProducts(response.data.data);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    const item = products.filter(
      (productItem) => productItem.product_id === id
    );
    const fProduct = item[0];
    if (fProduct) {
      setProduct(fProduct);
    }
  }, [id, products]);

  const dispatch = useDispatch();
  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success('Item added to cart!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  };
  const handleSizeClick = (size) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      product_size: size,
    }));
    console.log(product);
  };

console.log("products send ",product);


  return (
    <>
      {product && (
        <section className="w-100 md:w-50 px-md-4">
          <div className=" d-flex flex-column gap-1  ">
            <div className="d-flex flex-column gap-1">
              <h2 style={{ textAlign: "justify" }}>{product.product_name}</h2>

              <div className="d-flex  gap-4 align-items-center w-100 ">
                <div className="d-flex align-items-center   ">
                  <StarRatings rating={product.product_ratings} />
                </div>

                <span className="small pt-1">2347 Reviews</span>
                <span className="small pt-1">4873 sold</span>
              </div>
              <p className="fw-bold fs-3">
                <sup>&#x20B9;</sup> {product.product_price}
              </p>
            </div>

            <div className="border-top h-100   d-flex flex-column gap-3 ">
              <div className="d-flex flex-column gap-1  pt-2">
                <h2 className="fw-semibold fs-5 text-start">Select Color</h2>

                <div
                  className="d-flex gap-3 mx-1 mx-md-0 "
                  style={{ height: "60px" }}
                >
                  {Array.from({ length: 5 }).map((_, index) => 
                   product[`product_image${index + 1}`] && ( 
                  
                    <div
                      key={index}
                      className="border rounded-2 "
                      style={{ height: "100%", width: "60px",cursor:'pointer' }}
                      onClick={() => handleImageClick(index)}
                    >
                      {product && product[`product_image${index + 1}`] && (
                        <img
                          src={product[`product_image${index + 1}`]}
                          alt={`Image ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* <div className="d-grid gap-1">
                <h2 className="fw-semibold fs-5 text-start">Select Size</h2>
                <div
                  className="d-grid gap-4"
                  style={{
                    fontSize: "12px",
                    gridTemplateColumns: "repeat(auto-fit, minmax(35px, 1fr))",
                  }}
                >
                  <span
                    className="border py-1 px-1 bg-body-secondary rounded text-center"
                  >
                    M
                  </span>
                  <span
                    className="border py-1  bg-body-secondary rounded text-center"
                  >
                    S
                  </span>
                  <span
                    className="border py-1  bg-body-secondary rounded text-center"
                  >
                    L
                  </span>
                  <span
                    className="border py-1  bg-body-secondary rounded text-center"
                  >
                    XL
                  </span>
                  <span
                    className="border py-1  bg-body-secondary rounded text-center"
                  >
                    2XL
                  </span>
                  
                </div>
              </div> */}
              <div className="d-grid gap-1">
                <h2 className="fw-semibold fs-5 text-start">Select Size</h2>
                <div
                  className="d-grid gap-4"
                  style={{
                    fontSize: "12px",
                    gridTemplateColumns: "repeat(auto-fit, minmax(35px, 1fr))",
                  }}
                >
                  {["M", "S", "L", "XL", "2XL"].map((size) => (
                    <button
                      key={size}
                      className={`border py-1 px-1 rounded text-center ${
                        product.product_size=== size ? "bg-primary text-white" : "bg-body-secondary"
                      }`}
                      onClick={() => handleSizeClick(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="d-flex flex-column gap-1">
                <div className="d-flex flex-column flex-md-row  justify-content-between">
                  <h2 className="  fs-4 text-start d-flex align-items-center ">Product Details</h2>
                </div>

                <p className=" fs-6" style={{ textAlign: "justify" }}>
                  {product.product_discription}
                </p>
              </div>


              <div className="d-flex gap-3 pb-1">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn btn-primary my-2  ms-2 px-2 "
                      // style={{width:'60px'}}
                    >
                    Add to cart
                    </button>
              </div>

              <div className="d-flex flex-column gap-1 ">
                <h2 className="  fs-4 text-start">Description</h2>
                <ul className="list-unstyled d-flex flex-column gap-1 fs-6">
                  <li>
                    <span>→ </span>100% Cotton
                  </li>
                  <li>
                    <span>→ </span>32 Layer Print
                  </li>
                  <li>
                    <span>→ </span>Coloring Layer
                  </li>
                </ul>
              </div>

              <div className="d-flex flex-column gap-1 ">
                <h2 className=" fs-4 text-start">Shipping Information</h2>
                <ul
                  className=" list-unstyled d-flex flex-column  gap-1 "
                  style={{ fontSize: "16px" }}
                >
                  <li className="d-flex gap-4">
                    <span style={{ width: "80px" }}>Shipping: </span>
                    <span>Free Expeditions International</span>
                  </li>
                  <li className="d-flex gap-4">
                    <span style={{ width: "80px" }}>Estimated: </span>
                    <span>Estimated arrival on 17-20 March 2024</span>
                  </li>
                  <li className="d-flex gap-4">
                    <span style={{ width: "80px" }}>Delivery: </span>
                    <span>From Mumbai East</span>
                  </li>
                  <li className="d-flex gap-4">
                    <span style={{ width: "80px" }}>Payment: </span>
                    <div className="d-flex gap-2">
                      <img
                        src={paypalIcon}
                        alt="PayPal"
                        style={{ width: "20px" }}
                      />
                      <img
                        src={mastercardIcon}
                        alt="MasterCard"
                        style={{ width: "20px" }}
                      />
                    </div>
                  </li>
                </ul>
              </div>

             
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default RightSection;
