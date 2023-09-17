import React, {useEffect, useState} from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from '../components/login.component';
import SignUp from '../components/signup.component';
import Home from '../components/home.component';
import Navbar from '../components/navbar.component';
import ErrorNotFound from '../components/error-notfound.component';
import { fetchAuthUserData } from '../api/api/auth-endpoints';

function App() {
  const [firstname, setName] = useState('');
  
  useEffect(() => {
    fetchAuthUserData()
    .then((res) => res.json())
    .then((data) => {
      setName(data.firstName);
    }).catch(err => {
      console.log(err);
    })
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
              <Route path='*' element={<ErrorNotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  )
}

export default App