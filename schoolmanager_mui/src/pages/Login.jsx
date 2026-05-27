import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { setUser } from "@/core/auth";

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser({
          id: data.user.id,
          orgId: data.user.school_id || 'system',
          permissions: data.user.permissions || ['app.students.access', 'app.parents.access'],
          metadata: { 
            name: data.user.name, 
            email: data.user.email,
            school: data.user.school,
            role: data.user.role
          }
        });
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection to backend failed.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            pt:6,
            width: '100%',
            maxWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Login here .
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email or Phone"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              fullWidth
              variant="standard"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              variant="standard"
            />
            <Button 
              sx={{mt:6}} 
              type="submit" 
              variant="contained" 
              size="large" 
              fullWidth 
              color="secondary"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Box component="footer" sx={{ width: '100%', py: 8, mt: 'auto' }}>
        <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ height: '1px', width: 48, background: (theme) => `linear-gradient(to right, transparent, ${theme.palette.primary.main}33)` }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 'bold', opacity: 0.7 }}>
                Managed by
              </Typography>
              <Typography sx={{ color: 'primary.main', fontWeight: 900, letterSpacing: '-0.05em', fontSize: '1.125rem', display: 'flex', alignItems: 'center' }}>
                EDU<Box component="span" sx={{ color: 'secondary.main' }}>POTO</Box>
              </Typography>
            </Box>
            <Box sx={{ height: '1px', width: 48, background: (theme) => `linear-gradient(to left, transparent, ${theme.palette.primary.main}33)` }} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ color: 'text.secondary', fontSize: '11px', fontWeight: 500, letterSpacing: '0.025em', textTransform: 'uppercase', opacity: 0.8 }}>
              Elevating Education through Technology
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'secondary.main', opacity: 0.4 }} />
              <Typography sx={{ color: 'text.secondary', fontSize: '9px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.5 }}>
                © {new Date().getFullYear()} Edupoto Global. All rights reserved.
              </Typography>
              <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'secondary.main', opacity: 0.4 }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}