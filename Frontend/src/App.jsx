import React from 'react';
import  Navbar from './Components/Navbar/Navbar';
import {Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import Reportform from './sections/submitReport/Reportform/Reportform';
import 'leaflet/dist/leaflet.css';
import ViewReports from './sections/viewReports/ViewReport';
import Signup from './sections/Auth/Signup/signup';
import Login from './sections/Auth/Login/login';
import MapOverview from './sections/mapOverview/MapOverview'
import MySubmissions from './sections/mySubmissions/MySubmissions';
import 'react-toastify/ReactToastify.css';
const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
      <Route path='/' element = {<Home />}/>
      <Route path='/submit_report' element = {<Reportform/>}/>
      <Route path='/reports' element ={<ViewReports/>}/>
      <Route path='//my-submissions' element={<MySubmissions/>}/>
      <Route path='/signup' element ={<Signup/>}/>
      <Route path='/login' element ={<Login/>}/>
      <Route path="/map-overview" element={<MapOverview />} />
      </Routes>
    </div>
  )
}

export default App;