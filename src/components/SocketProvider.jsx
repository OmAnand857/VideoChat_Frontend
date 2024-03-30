import React , { createContext , useMemo } from 'react';
import {io} from "socket.io-client";


export const SocketContext = createContext(null);

        


export const SocketProvider = (props) =>{
            
            const socket = useMemo(()=>io('https://server-backend-p3ey.vercel.app'),[]) ;

    return (<SocketContext.Provider value={socket}>
        {props.children}
    </SocketContext.Provider>);

}
