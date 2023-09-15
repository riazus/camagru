import React, {useEffect, useState} from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Login from './components/login.component';
import SignUp from './components/signup.component';
import Home from './components/home.component';
import Navbar from './components/navbar.component';

function App() {
  const [firstname, setName] = useState('');

    useEffect(() => {
        (
            async () => {
              try {
                const response = await fetch('http://localhost:8000/api/user', {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });

                if (response.ok) {
                  const content = await response.json();
                  setName(content.firstName);
                } else {
                  console.error('Login failed');
                }
              } catch (error) {
                console.error('Error:', error);
              } 
            }
        )();
    }, []);

  
  return (
    <div className="App">
      <Router>
        <Navbar firstname={firstname} setName={setName}/>

        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route exact path="/" element={<Home firstname={firstname} />} />
              <Route path="/sign-in" element={<Login setName={setName}/>} />
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  )
}

export default App