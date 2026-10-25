import './App.css'
import {useEffect, useRef, useState} from "react";
import * as React from "react";

type Message = { text: string, date: string }

function App() {
    const [messages, setMessages] = useState<Message[]>([]);
    const socketRef = useRef<WebSocket | null>(null);
    const [text, setText] = useState('');
    const [websocketConnectionState, setWebsocketConnectionState] = useState('connecting');

    useEffect(() => {
        const socket = new WebSocket("ws://practicetasks.kz/ws");
        socketRef.current = socket;

        socket.addEventListener('open', () => {
            setWebsocketConnectionState('connected');
        })

        socket.addEventListener('error', () => {
            setWebsocketConnectionState('disconnected');
        })

        socket.addEventListener('close', () => {
            setWebsocketConnectionState('disconnected');
        })

        socket.addEventListener('message', (event) => {
            const message = JSON.parse(event.data) as Message;

            setMessages(prev => [...prev, message]);
        })


    }, []);

    function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();

        const socket = socketRef.current;
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({text}));
        }
        setText('');
    }

    return (
        <>
            <h1>Websocket example</h1>
            <p>{websocketConnectionState}</p>

            <form onSubmit={handleSubmit}>
                <input value={text} onChange={e => setText(e.target.value)}/>
                <button>send</button>
            </form>

            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{message.text}</li>
                ))}
            </ul>
        </>
    )
}

export default App
