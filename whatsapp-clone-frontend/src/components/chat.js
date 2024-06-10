import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    IconButton,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
    display: 'none',
});

const socket = io('http://localhost:8080'); // Replace with your backend IP

function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('connected');
        });

        socket.on('message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        axios.get('/api/messages').then((response) => {
            setMessages(response.data);
        });

        return () => {
            socket.off('connect');
            socket.off('message');
        };
    }, []);

    const sendMessage = () => {
        if (input.trim() && username.trim()) {
            const message = { username, text: input, file: '' };
            socket.emit('message', message);
            axios.post('/api/messages', message);
            setInput('');
        }
    };

    const handleUsernameSubmit = () => {
        if (username.trim()) {
            setIsConnected(true);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = () => {
        if (selectedFile && username.trim()) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            axios.post('/api/upload', formData).then((response) => {
                const fileMessage = { username, text: '', file: response.data.filename };
                socket.emit('message', fileMessage);
                axios.post('/api/messages', fileMessage);
                setSelectedFile(null);
            });
        }
    };

    if (!isConnected) {
        return (
            <Container component={Paper} maxWidth="sm" sx={{ mt: 4, p: 2 }}>
                <Typography variant="h6">Enter your username</Typography>
                <TextField
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    fullWidth
                    margin="normal"
                />
                <Button onClick={handleUsernameSubmit} variant="contained" color="primary" fullWidth>
                    Connect
                </Button>
            </Container>
        );
    }

    return (
        <Container>
            <Box component={Paper} sx={{ p: 2, mt: 4 }}>
                <Typography variant="h6">Chat</Typography>
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {messages.map((msg, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={msg.username}
                                secondary={msg.text || (
                                    <a href={`/uploads/${msg.file}`} target="_blank" rel="noopener noreferrer">
                                        {msg.file}
                                    </a>
                                )}
                            />
                        </ListItem>
                    ))}
                </List>
                <Box display="flex" mt={2}>
                    <TextField
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message"
                        fullWidth
                        variant="outlined"
                    />
                    <Button onClick={sendMessage} variant="contained" color="primary">
                        Send
                    </Button>
                </Box>
                <Box mt={2}>
                    <label htmlFor="icon-button-file">
                        <Input accept="image/*" id="icon-button-file" type="file" onChange={handleFileChange} />
                        <IconButton color="primary" aria-label="upload picture" component="span">
                            <PhotoCamera />
                        </IconButton>
                    </label>
                    <Button onClick={handleFileUpload} variant="contained" color="secondary">
                        Upload
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Chat;
