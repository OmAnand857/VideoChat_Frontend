import React , {useState ,useCallback , useContext ,useEffect } from "react";
import "../styles/lobby.css"
import {SocketContext} from "./SocketProvider"
import { useNavigate } from "react-router-dom";

function Lobby(){

        const [email , setEmail ] = useState('');
        const [room , setRoom ] = useState('');

    const Navigate=useNavigate();
        const socket = useContext(SocketContext);
        

        const handleJoinRoom= useCallback(({email,room})=>{
                    Navigate(`/Room/${room}`)
        },[Navigate])




useEffect(()=>{
   socket.on('roomJoin',handleJoinRoom);
    return ()=>{
        socket.off('roomJoin',handleJoinRoom);
    }
},[socket]);







        function handleClick(e){
            e.preventDefault();
            socket.emit('roomJoin' , { email , room });
        }




            return (
                    <div className='lobby'>
                    <div className='credentials'>
                        <h1>Welcome to Lobby</h1>
                    <form>

                        <label for='userName' >Email</label><br/>
                        <input id='userName' type="email" value={email} onChange={(e)=>setEmail(e.target.value)}></input><br/>
                        <label for='roomName'>Room No</label><br/>
                        <input id='roomName' type="text" value={room} onChange={(e)=>setRoom(e.target.value)}></input>
 
                    </form>
                   <button onClick={handleClick}>Join</button>
                    
                    </div>
                    </div>
                    
            );
}

export default Lobby;