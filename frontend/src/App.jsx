import { useState, useEffect, useCallback } from 'react';
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";

import AutomatonEditor from "./components/AutomatonEditor"

// import "./css/core.css";
// import "./css/automaton.css";
// import "./css/edgeModal.css";
// import "./css/icons.css";
// import "./css/stack.css";
// import "./css/tape.css";

// import AutomataList from "./components/AutomataList";
// import AutomatonEditor from "./components/AutomatonEditor";

import Login from "./components/Login";
import Logout from "./components/Logout";

import './App.css';

const clientId = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    let loginData = JSON.parse(localStorage.getItem("login"));
    if (loginData) {
      let loginExp = loginData.exp;
      let now = Date.now()/1000;
      if (now < loginExp) {
        // Not expired
        setUser(loginData);
      } else {
        // Expired
        localStorage.setItem("login", null);
      }
    }
  }, []);

  return (
    <Router>
      <GoogleOAuthProvider clientId={clientId}>
    <div className="App">
      <Navbar bg="automaton-navbar" expand="lg" sticky="top" variant="dark">
          <Container className="container-fluid">
            <Navbar.Brand href="/">
                AUTOMATA
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              {user && (
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="create-automaton"
                        className="create-button">
                Create
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="/automata/newtm">Finite State Automaton (FSA)</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Pushdown Automaton (PDA)</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Turing Machine (TM)</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            )}
              {/* <Nav className="ml-auto">
                <Nav.Link as={Link} to="/automata">
                  Automata
                </Nav.Link>
                {
                  user &&
                  <Nav.Link as={Link}  to={"/favorites"}>
                    Favorites
                  </Nav.Link>
                }
              </Nav> */}

            </Navbar.Collapse>
            { user ? (
                <Logout setUser={setUser}/>
              ) : (
                <Login setUser={setUser}/>
              )}
          </Container>
        </Navbar>
        <Routes>
          {/* <Route exact path="/" element={
            <AutomataList/>}
          />
          <Route exact path="/automata" element={
            <AutomataList/>}
          /> */}
          <Route path="/automata/:id" element={
            <AutomatonEditor user={user}/>}
          />
          <Route path="/automaton_test" element={
            <AutomatonEditor/>}
          />
          {/* <Route path="/automata/newtm" element={
            <AutomatonEditor user={user} type="tm"/>}
          /> */}
        </Routes>
    </div>
    </GoogleOAuthProvider>
    </Router>
  );
}

export default App;
