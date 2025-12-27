import React,{useState,useMemo,useRef, useEffect} from 'react';
import './Reportform.css';
import {MapContainer,TileLayer,useMap,Marker} from 'react-leaflet';
import L from 'leaflet';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl :'/marker-icon-2x.png',
  iconUrl :'/marker-icon.png',
  shadowUrl :'/marker-shadow.png'
});
function ChangeMapView({coords}){
  const map =useMap();
  map.setView(coords,15);
  return null;
}
const Reportform = () => {
  const [formData,setformData] = useState({
    location :{ lat:17.454299385717466, lng :78.42541349042502},
    description : '',
    dateandtime : '',
    evidence : null
  });
  const [searchQuery,setSearchQuery] = useState("");
  const [suggestions,setSuggestions] = useState([]);
  const [loading,setLoading] = useState(false);
  const [isSubmitting,setisSubmitting] = useState(false);
  const markerRef = useRef(null);

  useEffect(() =>{
    if(searchQuery.trim().length < 3) {
      setSuggestions([]);  
      return;
    };

    const timerId = setTimeout(async () =>{
      setLoading(true);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&limit=5`);
      const data = await response.json();
      setSuggestions(data || []);
      setLoading(false);
    },500);
    return () => clearTimeout(timerId);
  },[searchQuery]);

  const eventHandlers = useMemo(() =>({
    dragend() {
      const marker = markerRef.current;
      if(marker != null){
        const newlocation = marker.getLatLng();
        setformData((prev) =>({...prev,location :{lat :newlocation.lat,lng :newlocation.lng }}));
        fetchAddressFromCords(newlocation.lat,newlocation.lng)
      } 
    }
  }),[]);

  const handleSearch = async ()=>{
    if(searchQuery.trim() === '') return;
    setLoading(true);
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
    const data  = await response.json()
    setLoading(false);
    if( data && data.length > 0){
      const result = data[0];
      if(result && result.lat && result.lon){
        const newLoc = {
          lat : parseFloat(result.lat),
          lng : parseFloat(result.lon)
        };
        setformData((prev) => ({
          ...prev,
          location : newLoc,
          address : result.display_name
        }));
        setSearchQuery(result.display_name);
      }else{
         alert('Location data is incomplete. Please try another search.');
      }
      
    }
    else{
      alert("Location not found,please try again or pin it on the map");
    }
  };
  const handleSuggestionClick = (suggestion) =>{
    setSearchQuery(suggestion.display_name);
    setSuggestions([]);
    const newLoc = { lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) };
    setFormData((prev) => ({ 
        ...prev, 
        location: newLoc, 
        address: suggestion.display_name // Save the suggestion name
    }));
  };
  const fetchAddressFromCords = async(lat,lng) =>{
    try{
      const response = await fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}');
      const data = await response.json();
      if(data && data.display_name){
        setSearchQuery(data.display_name);
        setFormData(prev => ({ ...prev, address: data.display_name }));
      }
    }
    catch(error){
      console.error("Failed to fetch address name",error);
    }
  }
  const handleFileChange = (e) => {
    console.log(e.target.files);
    setformData((prev)=>({...prev,evidence : e.target.files[0]}));
  }

  const handleInputChange = (e) =>{
      const {name,value} = e.target;
      setformData((prev)=>({...prev,[name] : value}));
      
  }
  const handleSubmit = async (e) => {
      e.preventDefault();

      if(!formData.description||!formData.dateandtime){
        alert("please fill in the required details")
        return;
      }
      setisSubmitting(true);
      try{

        const dataPayLoad = new FormData();

        dataPayLoad.append('location',JSON.stringify(formData.location));
        dataPayLoad.append('address', formData.address || "Pinned Location");
        dataPayLoad.append('description',formData.description);
        dataPayLoad.append('dateandtime',formData.dateandtime);

        if(formData.evidence){
          dataPayLoad.append('evidence',formData.evidence);
        }
        const response = await fetch('http://localhost:4000/api/reports',{
          method : 'POST',
          body:dataPayLoad
        });
        const json = await response.json();
        if(response.ok){
          alert("report submitted");

          setformData({
            location :{ lat:17.454299385717466, lng :78.42541349042502},
            address:'',
            description : '',
            dateandtime : '',
            evidence : null
          });
          setSearchQuery('');
          document.getElementById('evidence').value = '';
        }
        else{
          throw new Error(json.error || "Failed to submit report due to a server error.");
        }
      }
      catch(error){
        
        alert(`error: ${error.message}`)
      }  
      finally{
        setisSubmitting(false);
      }
      
  }

  return (
    <div className='page-container'>
        <h2 className="Form_title">Submit Report</h2>
       <form className='report_form' onSubmit={handleSubmit} >
        <div className="form_section">
          <label htmlFor='location_search' className='form_label'>Location of Incident</label>
          <div className="map_search_wrapper">
            <div className="search_panel">
              <input
               type='text'
               placeholder='Enter address or landmark...'
               className='location_search_input'
               id='location_search'
               name='location_search'  
               value={searchQuery}
               onChange={(e)=>{
                setSearchQuery(e.target.value);
               }}
               />
              <button type='button' className='search_button' onClick={handleSearch}>
                {loading ? '...' : 'Search'}</button>

                {suggestions.length > 0 && (
                  <ul className='suggestion_list'>
                    {suggestions.map((suggestion) =>(
                      <li 
                       key={suggestion.place_id}
                       className='suggestion_item'
                       onClick={()=>
                        handleSuggestionClick(suggestion)}
                      >
                       {suggestion.display_name} 
                      </li>
                      ))};
                  </ul>
                )}
            </div>
            <div className="map_panel">
               <MapContainer center={formData.location} zoom={13} style={{height: '100%',width:'100%'}}>
                <TileLayer
                    // attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  /> 
                  <Marker
                    position={formData.location}
                    draggable={true}
                    eventHandlers={eventHandlers}
                    ref={markerRef}
                  />
                  <ChangeMapView coords={formData.location} />
               </MapContainer>
            </div>
          </div>
        </div>
        <div className="form_section">
          <label htmlFor="description" className='form_label' >Description of the Incident</label>
          <textarea rows='5' name="description" id="description" value={formData.description} 
          placeholder='Describe what you saw in detail'
          onChange={handleInputChange} required />
        </div>
         <div className="form_section">
          <label htmlFor="dateandtime" className='form_label' >Date and time of sighting</label>
          <input type="datetime-local" name="dateandtime" id="dateandtime" value={formData.dateandtime} 
          onChange={handleInputChange} required />
        </div>
        <div className="form_section">
          <label htmlFor="evidence" className='form_label' >Upload evidence (Optional)</label>
          <input type="file" name="evidence" id="evidence"  onChange={handleFileChange}
          />
        </div>
        <div className="submit_button_wrapper">
          <button className='submit_form' type='submit' disabled={isSubmitting}
          style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
          >
            {isSubmitting? 'Submitting Report' : 'Submit Form'}
          </button>
        </div>
       </form>


    </div>
)
}

export default Reportform;