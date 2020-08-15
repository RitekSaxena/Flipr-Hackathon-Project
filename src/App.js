import React, { useEffect, useState } from "react";
import firebase from "firebase";
import { db, auth } from "./firebase";
import "./App.css";
import nifty from "./nifty.json";
import bsx from "./bsx.json";
import cipla from "./cipla.json";
import tata from "./tata.json";
import reliance from "./reliance.json";
import eicher from "./eicher.json";
import ashok from "./ashok.json";
import { DropdownButton, Dropdown, ProgressBar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { Chart } from "react-google-charts";
import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";

//styles for login and signup modals
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

// component starts here
function App() {
  //states for data and other frontend things

  const [drop, Adddrop] = useState("NSE");
  const [topic, Addtopic] = useState("NIFTY 50");
  const [date, SetDate] = useState("");
  const [value, SetValue] = useState("Please choose a valid date");
  const [Open, SetOpen] = useState("");
  const [close, SetClose] = useState("");

  const [High, SetHIgh] = useState("");
  const [Low, SetLow] = useState("");
  const [WeekHigh, SetWeekHIgh] = useState("");
  const [WeekLow, SetWeekLow] = useState("");
  const [company, SetCompany] = useState("TATA");
  const [car, SetCar] = useState("TATA");
  const [data_arr, SetArr] = useState([["Month", "Stocks"]]);
  const [compare, SetCompare] = useState("");
  const [color, SetColor] = useState("");
  const [modalStyle] = useState(getModalStyle);
  //authentication states
  const [openSignin, setOpenSignin] = useState(false);
  const [openSignup, setSignupOpen] = useState(false);
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const classes = useStyles();

  //calculations for showing up percentages etc.

  let num = ((Open - Low) * 100) / (High - Low);
  let weekNum = ((Open - WeekLow) * 100) / (WeekHigh - WeekLow);
  let weekpercentage = weekNum.toString() + "%";
  let percentageDay = num.toString() + "%";

  //user checking
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authuser) => {
      if (authuser) {
        setUser(authuser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);
  // data fetch to show in graph
  useEffect(() => {
    let v = tata;
    if (car === "tata") {
      v = tata;
    } else if (car === "ashok") {
      v = ashok;
    } else if (car === "reliance") {
      v = reliance;
    } else if (car === "eicher") {
      v = eicher;
    } else if (car === "cipla") {
      v = cipla;
    }
    let w = [["Month", "Stocks"]];
    v.map((m) => {
      w.push([m.Date, m.Open]);
    });
    SetArr(w);
  }, [car]);

  //signup hadler
  const handleSignup = (event) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authuser) => {
        return authuser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setSignupOpen(false);
  };

  //signin handler
  const handleSignin = (event) => {
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((e) => alert(e.message));
    setOpenSignin(false);
  };

  // stock data of nifty and bse fetching function
  const fetchStock = () => {
    let d;
    let o = date;

    if (drop === "BSE") {
      let arr_max = [];
      let arr_min = [];
      let i = -1;
      d = "bsx";
      bsx.map((m) => {
        if (m.Date.slice(0, 4) === o.slice(0, 4)) {
          arr_max.push(m.High);
          arr_min.push(m.Low);
        }

        if (m.Date === o) {
          SetValue(m.Open);
          SetLow(m.Low);
          SetHIgh(m.High);
          SetOpen(m.Open);
          i = bsx.findIndex((item) => {
            return item.Date === m.Date;
          });
          SetClose(bsx[i - 1].Close);
          const k = bsx[i - 1].Close;

          SetCompare(
            `${Math.round((m.Open - k + Number.EPSILON) * 100) / 100}(${
              Math.round((((m.Open - k) * 100) / k + Number.EPSILON) * 100) /
              100
            }%)`
          );
          if (m.Open - k >= 0) {
            SetColor("green");
          } else {
            SetColor("red");
          }
        }
      });
      SetWeekHIgh(Math.max(...arr_max));
      SetWeekLow(Math.min(...arr_min));
    } else {
      let arr_max = [];
      let arr_min = [];
      d = "Nifty";
      let i = -1;
      nifty.map((m) => {
        if (m.Date.slice(0, 4) === o.slice(0, 4)) {
          arr_max.push(m.High);
          arr_min.push(m.Low);
        }
        if (m.Date === o) {
          SetValue(m.Open);
          SetLow(m.Low);
          SetHIgh(m.High);
          SetOpen(m.Open);

          i = nifty.findIndex((item) => {
            return item.Date === m.Date;
          });
          SetClose(nifty[i - 1].Close);
          const j = nifty[i - 1].Close;
          SetCompare(
            `${Math.round((m.Open - j + Number.EPSILON) * 100) / 100}(${
              Math.round((((m.Open - j) * 100) / j + Number.EPSILON) * 100) /
              100
            }%)`
          );
          if (m.Open - j >= 0) {
            SetColor("green");
          } else {
            SetColor("red");
          }
        }
      });
      SetWeekHIgh(Math.max(...arr_max));
      SetWeekLow(Math.min(...arr_min));
    }
  };

  //returning
  return (
    <div className="App">
      {/* Header Part */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ textAlign: "center", fontWeight: "bold", flex: "10" }}>
          Ritek Flipr Hackathon 5.0
        </h2>
        {user ? (
          <>
            <p
              className="btn btn-secondary"
              style={{ flex: "1", margin: "1vh 1vw", cursor: "default" }}
            >
              {user.displayName}
            </p>
            <button
              className="btn btn-danger"
              style={{ flex: "1", margin: "1vh 1vw" }}
              onClick={() => auth.signOut()}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-primary"
              style={{ flex: "1", margin: "1vh 1vw" }}
              onClick={() => setSignupOpen(true)}
            >
              Sign Up
            </button>
            <button
              className="btn btn-success"
              style={{ flex: "1", margin: "1vh" }}
              onClick={() => setOpenSignin(true)}
            >
              Login
            </button>
          </>
        )}
      </div>
      {/*Header ends here*/}

      {/* Showing the website if the user is logged in  */}

      {user ? (
        <>
          {/* dropdown to select nse/bse */}
          <DropdownButton
            id="dropdown-basic-button"
            title={drop}
            style={{ position: "absolute", marginLeft: "20px" }}
          >
            <Dropdown.Item
              onClick={() => {
                Adddrop("BSE");
                Addtopic("SENSEX");
              }}
            >
              BSE
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                Adddrop("NSE");
                Addtopic("NIFTY 50");
              }}
            >
              NSE
            </Dropdown.Item>
          </DropdownButton>
          <h4
            style={{
              position: "relative",
              marginTop: "50px",
              marginLeft: "20px",
            }}
          >
            {topic}
          </h4>

          <hr
            style={{
              height: "5px",
              border: "none",
              color: "#E0E0E0",
              backgroundColor: "#E0E0E0",
            }}
          />

          <input
            style={{ marginLeft: "3px" }}
            type="date"
            value={date}
            onChange={(e) => {
              SetDate(e.target.value);
            }}
          />
          <button onClick={fetchStock} className="btn btn-info">
            Get data
          </button>
          <div className="data">
            <div>
              <div className="mycard">{value}</div>
              <hr
                style={{
                  height: "0.5px",
                  border: "none",
                  color: "#E0E0E0",
                  backgroundColor: "#E0E0E0",
                }}
              />
              <div style={{ fontSize: "2rem", color: color }}>{compare}</div>
            </div>

            {/* Progress Bars */}
            <div>
              <h6>Day Range</h6>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <p>{Low}</p>
                <p>{High}</p>
              </div>
              <div className="progress" data-label={Open}>
                <span className="value" style={{ width: percentageDay }}></span>
              </div>
              <hr
                style={{
                  height: "1px",
                  border: "none",
                  color: "#E0E0E0",
                  backgroundColor: "#E0E0E0",
                }}
              />
              <h6>52 Week Range</h6>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <p>{WeekLow}</p>
                <p>{WeekHigh}</p>
              </div>
              <div className="progress">
                <span
                  className="value"
                  style={{ width: weekpercentage }}
                ></span>
              </div>
            </div>
          </div>
          <hr
            style={{
              height: "1px",
              border: "none",
              color: "#E0E0E0",
              backgroundColor: "#E0E0E0",
            }}
          />
          <hr
            style={{
              height: "1px",
              border: "none",
              color: "#E0E0E0",
              backgroundColor: "#E0E0E0",
            }}
          />

          {/* Overview Section */}
          <p style={{ marginLeft: "20px" }}>Overview</p>
          <hr
            style={{
              height: "1px",
              border: "none",
              color: "#E0E0E0",
              backgroundColor: "#E0E0E0",
            }}
          />
          <div className="overview">
            <div>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <p style={{ marging: "15px" }}>Open : </p>
                {Open}
              </div>
              <hr
                style={{
                  height: "1px",
                  border: "none",
                  color: "#E0E0E0",
                  backgroundColor: "#E0E0E0",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <p style={{ marging: "15px" }}>previous Close : </p>
                {close}
              </div>
              <hr
                style={{
                  height: "1px",
                  border: "none",
                  color: "#E0E0E0",
                  backgroundColor: "#E0E0E0",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <p style={{ marging: "15px" }}>Day High : </p>
                {High}
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <p style={{ marging: "15px" }}>Day Low : </p>
                {Low}
              </div>
              <hr
                style={{
                  height: "1px",
                  border: "none",
                  color: "#E0E0E0",
                  backgroundColor: "#E0E0E0",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <p style={{ marging: "15px" }}>52 Week High : </p>
                {WeekHigh}
              </div>
              <hr
                style={{
                  height: "1px",
                  border: "none",
                  color: "#E0E0E0",
                  backgroundColor: "#E0E0E0",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <p style={{ marging: "15px" }}>52 Week Low : </p>
                {WeekLow}
              </div>
            </div>
          </div>

          {/* Dropdown for selecting Company */}
          <DropdownButton
            id="dropdown-basic-button"
            title={company}
            style={{ marginLeft: "20px" }}
          >
            <Dropdown.Item
              onClick={() => {
                SetCompany("TATA");
                SetCar("tata");
              }}
            >
              TATA
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                SetCompany("ASHOK LEYLANDS");
                SetCar("ashok");
              }}
            >
              ASHOK LEYLAND
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                SetCompany("RELIANCE");
                SetCar("reliance");
              }}
            >
              RELIANCE
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                SetCompany("EICHER");
                SetCar("eicher");
              }}
            >
              EICHER
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                SetCompany("CIPLA");
                SetCar("cipla");
              }}
            >
              CIPLA
            </Dropdown.Item>
          </DropdownButton>

          {/* Data visulization Chart */}
          <Chart
            style={{ marginTop: "40px" }}
            width={"80vw"}
            height={"auto"}
            chartType="AreaChart"
            loader={<div>Loading Chart</div>}
            data={data_arr}
            options={{
              title: { company },
              hAxis: { title: "Year", titleTextStyle: { color: "#333" } },
              vAxis: { minValue: 0 },
              // For the legend to fit, we make the chart area smaller
              chartArea: { width: "85%", height: "70%" },
              // lineWidth: 25
            }}
          />
        </>
      ) : (
        <>
          {/* Website View when user is not logged in */}
          <br />
          <h4>You need to login first</h4>
          <ul>
            <li>Please write your email in all lowerCase letters</li>
            <li>
              Please Format your email correctly, don't write blank spaces in
              email
            </li>
            <li>Now go Signup :)</li>
          </ul>

          {/* Model for signup */}
          <Modal
            open={openSignup}
            onClose={() => {
              setSignupOpen(false);
            }}
          >
            <div style={modalStyle} className={classes.paper}>
              <form>
                <center className="app__form">
                  <center
                    style={{
                      marginBottom: "10px",
                    }}
                  >
                    RITEK FLIPR HACKATHON
                  </center>
                  <Input
                    placeholder="username"
                    type="text"
                    value={username}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    placeholder="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button type="submit" onClick={handleSignup}>
                    SIGNUP
                  </Button>
                </center>
              </form>
            </div>
          </Modal>

          {/* model for login */}
          <Modal
            open={openSignin}
            onClose={() => {
              setOpenSignin(false);
            }}
          >
            <div style={modalStyle} className={classes.paper}>
              <form>
                <center className="app__form">
                  <center
                    style={{
                      marginBottom: "10px",
                    }}
                  >
                    RITEK FLIPR HACKATHON
                  </center>
                  <Input
                    placeholder="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <Button type="submit" onClick={handleSignin}>
                    LOGIN
                  </Button>
                </center>
              </form>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}

export default App;
