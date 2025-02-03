import { useState, useEffect, useCallback } from 'react';
import { Navbar, Nav } from "react-bootstrap";
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
            <AutomatonEditor/>}
          />
          <Route path="/automaton_test" element={
            <AutomatonEditor/>}
          />
        </Routes>
    </div>
    </GoogleOAuthProvider>
    </Router>
  );
}

export default App;
