import React from "react";
import GoogleMap from 'google-map-react';


const AnyReactComponent = ({ text }) => <div>{text}</div>;

function Map (){

    const defaultProps = {
        center: {
          lat: 10.99835602,
          lng: 77.01502627
        },
        zoom: 11
      };    return(
        <div style={{ height:'90vh',width:'80%'}}>
            <GoogleMap
                    bootstrapURLKeys={{ key: "AIzaSyBXVXwP71O9fkv9yX70OnoDL1EbqhCqbqA"}}
                    defaultCenter = {defaultProps.center}
                    defaultZoom = {defaultProps.zoom}   
            >
    
         <AnyReactComponent
         lat={59.955413}
         lng={30.337844}
         text="My Marker"
         />
        </GoogleMap>

        </div>
    )
}
    


export default Map;