import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import axios from "axios";
import myContext from "../components/context/MyContext";


// SHUBHAM- SignUp functioanlity

function SignUp() {

  const [address, setAddress] = useState("");
  const [state, setState] = useState("");

  const [latLong,setLatLong]=useState('');

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [addresss, setAddresss] = useState("");
  const [password, setPassword] = useState("");
  const [timer, setTimer] = useState(30);
  const [sendOTPagain, setSendOTPagain] = useState(false);

  const [showOTP, setShowOTP] = useState(false);
  const [OTP, setOTP] = useState("");
  const [showSignUpModal, setShowSignUpModal] = useState(true);

  const [credentials, setCredentials] = useState("");

  const navigate = useNavigate();

  const context = useContext(myContext);

  const { showModal, setShowModal } = context;

  useEffect(() => {
    let intervalId;

    if (showOTP && sendOTPagain) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(intervalId);
            setSendOTPagain(false);
            return 30; 
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(intervalId); 
    };
  }, [showOTP, sendOTPagain]);

  function handleOTP() {
    setTimer(30);
    setShowOTP(true);
    setSendOTPagain(true);
    toast.success("OTP sent successfully", {
      autoClose: 1000,
      hideProgressBar: true,
    });
  }

  function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("GENERATED OTP:", otp);
    return otp.toString();
  }

  function handleSendOTPAgain() {
    setSendOTPagain(true);
    const newOTP = generateOTP();
    setOTP(newOTP);
    sendOTPtoEmail(newOTP);
  }

  function sendOTPtoEmail(OTP) {
    if (OTP) {
      handleOTP();
    }
  }

  function verifySentOTP() {
    const otpInputs = document.querySelectorAll(".otp-input");
    let enteredOTP = "";

    otpInputs.forEach((input) => {
      enteredOTP += input.value;
    });

    console.log("ENTERED OTP:", enteredOTP);

    if (enteredOTP === OTP) {
      
      axios
        .post(
          "https://minitgo.com/api/user_reg.php",
          JSON.stringify(credentials),
          {}
        )
        .then((response) => {
          // console.log("RESPONSE", response);
          const responseData = response.data.message;
          if (responseData==='Data inserted successfully.') {
            const userData = {
              userId: credentials.id,
              fullName: credentials.full_name,
              phoneNumber: credentials.phone_number,
              email: credentials.email,
              address: credentials.Address,
              officeAddress: credentials.office_address,
              lat: credentials.lat,
              log: credentials.log,
            };
            localStorage.setItem("user", JSON.stringify(userData));
            setShowOTP(false);
            setShowSignUpModal(false);
            setShowModal(false);
            toast.success("User registered successfully", {
              autoClose: 1000,
              hideProgressBar: true,
            });
          } else {
            console.error("Login failed: No user data returned.");
          }
        })
        .catch((error) => {
          console.error("Login failed:", error);
        });
      navigate("/");

    } else {
      toast.error("Invalid OTP. Please try again.", {
        autoClose: 1000,
        hideProgressBar: true,
      });
    }
  }

  function handleRegister(e) {
    e.preventDefault();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    const phonePattern = /^[0-9]{10}$/;
  
    if (
      fullName === "" ||
      phoneNumber === "" ||
      email === "" ||
      addresss === "" ||
      password === ""
    ) {
      toast.error("All fields are required", {
        autoClose: 1000,
        hideProgressBar: true,
      });
      return;
    } else if (!phonePattern.test(phoneNumber)) {
      toast.error("Please enter a valid phone number", {
        autoClose: 1000,
        hideProgressBar: true,
      });
      return;
    } else if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email", {
        autoClose: 1000,
        hideProgressBar: true,
      });
      return;
    } else if (password.length < 8 || password.length > 12) {
      toast.error("Password must be between 8 and 12 characters long", {
        autoClose: 1000,
        hideProgressBar: true,
      });
      return;
    } else {
      axios
        .get("https://minitgo.com/api/fetch_login.php")
        .then((response) => {
          if (response.data && response.data.length > 0) {
            const allUsers = response.data;
  
            const foundUser = allUsers.find((user) => user.email === email);
  
            if (foundUser) {
              toast.error("Email already exists", {
                autoClose: 1000,
                hideProgressBar: true,
              });
              return;
            } else {
              handleUseCurrentLocation().then(({ latitude, longitude }) => {
                setLatLong({lat:latitude,log:longitude})

              })

              const data = {
                full_name: fullName,
                phone_number: phoneNumber,
                email: email,
                password: password,
                Address: addresss,
                lat:latLong.lat,
                log: latLong.log,
              };
  
              setCredentials(data);
  
              // console.log("DATA", data);
  
              const OTPvalue = generateOTP();
  
              setOTP(OTPvalue);
  
              sendOTPtoEmail(OTPvalue);
  
            }
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user information:", error);
        });
    }
  }
  

 

  const handleUseCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      // Use browser geolocation API to get the current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
              resolve({ latitude, longitude });

            // try {
            //   const response = await fetch(
            //     `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`
            //   ); 
            //   const data = await response.json();
            //   if (data.results.length > 0) {
            //     const { components } = data.results[0];
            //     setAddress(components.road || "");
            //     setCity(
            //       components.city || components.town || components.village || ""
            //     );
            //     setPincode(components.postcode || "");
            //     setTownDistrict(components.town || components.district || "");
            //     setState(components.state || "");
  
            //   } else {
            //     reject(new Error("No results found"));
            //   }
            // } catch (error) {
            //   reject(error);
            // }
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error("Geolocation not supported"));
      }
    });
  };
  

  return (
    <>
      {showOTP ? (
        <>
          <div
            className="d-flex flex-column gap-2 pt-2 pb-3  align-items-center position-relative "
            style={{
              minWidth: "70%",
              backgroundColor: "#fff5f5",
            }}
          >
            <div
              onClick={() => setShowOTP(false)}
              className="fs-3 px-1  positon-absolute w-100"
              style={{
                cursor: "pointer",
                position: "relative",
                bottom: "0.5rem",
                left: "1rem",
              }}
            >
              ←
            </div>
            <h2 className="text-start ">OTP Verification</h2>
            <p>OTP has sent to {email}</p>

            <ul
              className="d-flex gap-1  justify-content-start   p-0 "
              style={{ listStyle: "none" }}
            >
              <input
                type="text"
                className=" otp-input p-1 rounded-pill border text-center"
                style={{ width: "30px", outline: "none" }}
                maxLength={1}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    e.target.previousElementSibling
                  ) {
                    if (e.target.value === "") {
                      e.target.previousElementSibling.focus();
                    }
                  } else if (
                    e.key.length === 1 &&
                    e.target.nextElementSibling
                  ) {
                    if (e.target.value !== "") {
                      e.target.nextElementSibling.focus();
                    }
                  }
                }}
              />

              <input
                type="text"
                className="otp-input p-1 rounded-pill border text-center"
                style={{ width: "30px", outline: "none" }}
                maxLength={1}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    e.target.previousElementSibling
                  ) {
                    if (e.target.value === "") {
                      e.target.previousElementSibling.focus();
                    }
                  } else if (
                    e.key.length === 1 &&
                    e.target.nextElementSibling
                  ) {
                    if (e.target.value !== "") {
                      e.target.nextElementSibling.focus();
                    }
                  }
                }}
              />

              <input
                type="text"
                className="otp-input p-1 rounded-pill border text-center"
                style={{ width: "30px", outline: "none" }}
                maxLength={1}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    e.target.previousElementSibling
                  ) {
                    if (e.target.value === "") {
                      e.target.previousElementSibling.focus();
                    }
                  } else if (
                    e.key.length === 1 &&
                    e.target.nextElementSibling
                  ) {
                    if (e.target.value !== "") {
                      e.target.nextElementSibling.focus();
                    }
                  }
                }}
              />

              <input
                type="text"
                className="otp-input p-1 rounded-pill border text-center"
                style={{ width: "30px", outline: "none" }}
                maxLength={1}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    e.target.previousElementSibling
                  ) {
                    if (e.target.value === "") {
                      e.target.previousElementSibling.focus();
                    }
                  } else if (
                    e.key.length === 1 &&
                    e.target.nextElementSibling
                  ) {
                    if (e.target.value !== "") {
                      e.target.nextElementSibling.focus();
                    }
                  }
                }}
              />

              <input
                type="text"
                className="otp-input p-1 rounded-pill border text-center"
                style={{ width: "30px", outline: "none" }}
                maxLength={1}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    e.target.previousElementSibling
                  ) {
                    if (e.target.value === "") {
                      e.target.previousElementSibling.focus();
                    }
                  } else if (
                    e.key.length === 1 &&
                    e.target.nextElementSibling
                  ) {
                    if (e.target.value !== "") {
                      e.target.nextElementSibling.focus();
                    }
                  }
                }}
              />

              <input
                type="text"
                className=" otp-input p-1 rounded-pill border text-center"
                style={{ width: "30px", outline: "none" }}
                maxLength={1}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    e.target.previousElementSibling
                  ) {
                    if (e.target.value === "") {
                      e.target.previousElementSibling.focus();
                    }
                  } else if (
                    e.key.length === 1 &&
                    e.target.nextElementSibling
                  ) {
                    if (e.target.value !== "") {
                      e.target.nextElementSibling.focus();
                    }
                  }
                }}
              />
            </ul>

            <button className="btn btn-success px-4" onClick={verifySentOTP}>
              Verify
            </button>
            <div>
              <div className=" w-75 text-center fs-3">00:{timer}</div>
            </div>

            <div className="mt-2  ">
              <div className=" text-center " style={{ fontSize: "14px" }}>
                Didn't get it?
              </div>
            </div>

            {timer === 30 && (
              <div className=" text-center ">
                <p
                  className="underline"
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={handleSendOTPAgain}
                >
                  Send OTP (SMS)
                </p>
              </div>
            )}
          </div>

          <div
            style={{ backgroundColor: "#e3e3e3" }}
            className="d-flex flex-column justify-content-center align-items-center px-3 py-5"
          >
            <h1 className="fs-5 text-center mb-5">
              Our app will be launching soon.
            </h1>

            <a
              className="download-btn btn-google"
              href="#"
              style={{ width: "9.5rem" }}
              title="Google Play"
            >
              Google Play
            </a>
            <a
              className="download-btn btn-apple"
              href="#"
              style={{ width: "9.5rem" }}
              title="App Store"
            >
              App Store
            </a>
          </div>
        </>
      ) : (
        showSignUpModal && (
          <>
            <div
              style={{
                minWidth: "70%",
                backgroundColor: "#fff5f5",
              }}
              className="d-flex flex-column gap-2 px-4 pt-1 pb-3   "
            >
              <Form>
                <Form.Control
                  type="text"
                  placeholder="Full Name"
                  className=" w-100 px-4 mb-3 my-5 rounded rounded-pill"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Form.Control
                  type="text"
                  placeholder="+91"
                  className=" w-100 px-4 mb-3 rounded rounded-pill"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Form.Control
                  type="text"
                  placeholder="Email"
                  className=" w-100 px-4 mb-4  rounded rounded-pill"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Form.Control
                  type="text"
                  placeholder="Address"
                  className=" w-100 px-4 mb-3 rounded rounded-pill"
                  value={addresss}
                  onChange={(e) => setAddresss(e.target.value)}
                />
                <Form.Control
                  type="password"
                  placeholder="Password"
                  className=" w-100 px-4 mb-3 rounded rounded-pill"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form>
              <Button variant="secondary" onClick={handleUseCurrentLocation}>
                Use Current Location
              </Button>

              <Button
                variant="success"
                className="my-2"
                onClick={handleRegister}
              >
                Continue
              </Button>
              <p style={{ marginTop: "10px" }} className="text-center">
                By continuing, you agree to our <br />
                <a
                  target="_blank"
                  href="#"
                  className="text-danger fw-semibold"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  Terms of Service
                </a>
                . &{" "}
                <a
                  target="_blank"
                  href="#"
                  className="text-danger fw-semibold"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  Privacy Policy
                </a>
              </p>
            </div>
            <div
              style={{ backgroundColor: "#e3e3e3" }}
              className="d-flex flex-column justify-content-center align-items-center px-3 py-5"
            >
              <h1 className="fs-5 text-center mb-5">
                Our app will be launching soon.
              </h1>

              <a
                className="download-btn btn-google"
                href="#"
                style={{ width: "9.5rem" }}
                title="Google Play"
              >
                Google Play
              </a>
              <a
                className="download-btn btn-apple"
                href="#"
                style={{ width: "9.5rem" }}
                title="App Store"
              >
                App Store
              </a>
            </div>
          </>
        )
      )}
    </>
  );
}

export default SignUp;
