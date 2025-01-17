import { useState, useEffect } from 'react';
import { Paper, TextField, Button, Typography, Box, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        let isSubscribed = true;

        if (user) {
            navigate('/colleges', { replace: true });
            return;
        }

        const checkBackend = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/`);
                if (isSubscribed) {
                    if (response.data.status === 'success') {
                        toast.success('Backend is connected', {
                            toastId: 'backend-connection' // Prevent duplicate toasts
                        });
                    } else {
                        toast.warning('Backend status unclear', {
                            toastId: 'backend-warning'
                        });
                    }
                }
            } catch (error) {
                if (isSubscribed) {
                    console.error('Backend connection error:', error);
                    toast.error('Backend is unreachable', {
                        toastId: 'backend-error'
                    });
                }
            }
        };

        checkBackend();

        return () => {
            isSubscribed = false;
        };
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password);
            // Navigation will happen automatically through useEffect
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 8 }}>
            <Typography variant="h5" gutterBottom>Login</Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Login
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default LoginForm;
