import React from "react";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Lobby from "./Lobby";
import Room from "./Room";

function App() {
    return (

        <BrowserRouter>
        
        <Routes>
            <Route path="/" element={<Lobby/>}/>
            <Route path="/Room/:RoomId" element={<Room/>}/>
        </Routes>
        
          </BrowserRouter>
       
           
        
    )
}

export default App;
