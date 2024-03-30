import React , {useCallback, useContext , useEffect , useState} from "react";
import { SocketContext } from "./SocketProvider";
import ReactPlayer from 'react-player';
import peer from "../services/peer";



function Room(){
       
    const socket = useContext(SocketContext);
    const [ remoteSocketId , setRemoteSocketId ] = useState(null);
    const [remoteStream,setRemoteStream]=useState();
    const [myStream,setMyStream]=useState();


    const handleUserJoined = useCallback(({email,id})=>{
        console.log('email joined the room',email);
        setRemoteSocketId(id);
    },[])


    const handleCallUser = useCallback( async ()=>{
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio:true,
                    video:true,
                });

            const offer = await peer.getOffer();
            socket.emit('userCall',{to:remoteSocketId , offer});
                setMyStream(stream);
    },[remoteSocketId,socket]);


    const handleIncomingCall = useCallback(async ({from , offer })=>{
        console.log('Incoming call',from, offer);
        setRemoteSocketId(from);
        const ans = await peer.getAnswer(offer)
        const stream = await navigator.mediaDevices.getUserMedia({
            audio:true,
            video:true,
        });
        setMyStream(stream);
        socket.emit('callAccepted',{to:from,ans});
    },[socket])


    const sendStreams = useCallback(()=>{
        for(const track of myStream.getTracks()){
            peer.peer.addTrack(track,myStream);
        }
    },[myStream]);
    



    const handleCallAccepted =useCallback(({from,ans})=>{
        peer.setLocalDescription(ans);
        console.log('call accepted');
        sendStreams();
    
    },[sendStreams]);
    const handleNegoNeeded = useCallback(async()=>{
        const offer = await peer.getOffer();
        socket.emit('peer:nego:needed',{offer, to: remoteSocketId});
    })

    useEffect(()=>{
                peer.peer.addEventListener('negotiationneeded',handleNegoNeeded);
                return()=>{
                    peer.peer.removeEventListener('negotiationneeded',handleNegoNeeded);
                };
    },[handleNegoNeeded]);




    useEffect(()=>{
        peer.peer.addEventListener('track',async ev=>{
            const remoteStream =ev.streams;
            setRemoteStream(remoteStream[0])
        });
    },[])
    const handleNegoNeedIncoming = useCallback(async({from,offer})=>{
        const ans = await peer.getAnswer(offer);
        socket.emit('peer:nego:done',{to:from,ans});
    },
    [socket]);

    const handleNegoNeedFinal = useCallback( async({ans})=>{
       await peer.setLocalDescription(ans)
    },[])

        useEffect(()=>{
            socket.on('userJoined',handleUserJoined);
            socket.on('incomingCall',handleIncomingCall);
            socket.on('callAccepted',handleCallAccepted);
            socket.on('peer:nego:needed',handleNegoNeedIncoming);
            socket.on('peer:nego:final', handleNegoNeedFinal);
            return ()=> {
                socket.off('userJoined',handleUserJoined);
                socket.off('incomingCall',handleIncomingCall);
                socket.off('callAccepted',handleCallAccepted);
                socket.off('peer:nego:needed',handleNegoNeedIncoming);
                socket.off('peer:nego:final', handleNegoNeedFinal);

            };
        },[socket,handleUserJoined,handleIncomingCall,handleCallAccepted,handleNegoNeedFinal,handleNegoNeedIncoming]);


            return (
                <div>
                    <h1>Hi this is the Video CHAT ROOM</h1>
                    <h4> {remoteSocketId?'Connected':'No one in the room'}</h4>
                    {
                        remoteSocketId?<button onClick={handleCallUser}>CALL</button>:null
                    }
                    {
                        myStream?<button onClick={sendStreams}>SEND STREAM</button>:null
                    }
                    {
                        myStream && (<><h1>My Stream</h1> <ReactPlayer playing muted height='100px' width='200px' url={myStream}/></>)
                    }
                    {
                        remoteStream && (<><h1>My Stream</h1> <ReactPlayer playing muted height='100px' width='200px' url={myStream}/></>)
                    }
                </div>
                    
            );
}

export default Room;