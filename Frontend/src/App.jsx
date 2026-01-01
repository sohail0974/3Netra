import React from 'react';
import  Navbar from './Components/Navbar/Navbar';
import {Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import Reportform from './sections/submitReport/Reportform/Reportform';
import 'leaflet/dist/leaflet.css';
import ViewReports from './sections/viewReports/ViewReport';
const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>

      <Route path='/' element = {<Home />}/>
      <Route path='/submit_report' element = {<Reportform/>}/>
      <Route path='/reports' element ={<ViewReports/>}/>
      
      </Routes>
    </div>
  )
}

export default App;