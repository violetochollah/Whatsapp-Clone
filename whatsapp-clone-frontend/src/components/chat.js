import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import {
    Box,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Typography,
    Container,
    Paper,
} from '@mui/material';

const socket = io('http://192.168.100.59:8080');  

function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('connected');
        });

        socket.on('message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off('connect');
            socket.off('message');
        };
    }, []);

    const sendMessage = () => {
        if (input.trim() && username.trim()) {
            const message = `${username}: ${input}`;
            socket.emit('message', message);
            setInput('');
        }
    };

    const handleUsernameSubmit = () => {
        if (username.trim()) {
            setIsConnected(true);
        }
    };

    if (!isConnected) {
        return (
            <Container>
                <Box display="flex" flexDirection="column"
alignItems="center" mt={4}>
                    <Typography variant="h4">Enter your username</Typography>
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        variant="outlined"
                        margin="normal"
                    />
                    <Button variant="contained" color="primary"
onClick={handleUsernameSubmit}>
                        Join Chat
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container>
            <Box display="flex" flexDirection="column"
alignItems="center" mt={4}>
                <Paper elevation={3} style={{ padding: '20px', width:
'100%', maxWidth: '500px' }}>
                    <List>
                        {messages.map((msg, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={msg} />
                            </ListItem>
                        ))}
                    </List>
                    <Box display="flex" mt={2}>
                        <TextField
                            label="Message"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            variant="outlined"
                            fullWidth
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    sendMessage();
                                }
                            }}
                        />
                        <Button variant="contained" color="primary"
onClick={sendMessage}>
                            Send
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default Chat;