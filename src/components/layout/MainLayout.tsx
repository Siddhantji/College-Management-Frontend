import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DeleteIcon from '@mui/icons-material/Delete';
import { AppBar, Toolbar, Typography, Button, Box, Container, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import axios from 'axios';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useFilters } from '../../context/FilterContext';

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = React.useState(false);
  const { clearFilters } = useFilters();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteExcel = async () => {
    try {
      await axios.delete('http://localhost:5000/api/upload', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setOpenDialog(false);
      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error('Error deleting Excel data:', error);
      // Optional: Add error handling here
    }
  };

  const handleCollegesClick = () => {
    clearFilters();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component={Link} to="/colleges" sx={{ 
            textDecoration: 'none', 
            color: 'inherit' 
          }}>
            College Management
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {user ? (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/colleges"
                  onClick={handleCollegesClick}
                >
                  Colleges
                </Button>
                {user.role === 'admin' && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to="/upload"
                      sx={{
                        fontWeight: 'bold',
                        textTransform: 'none',
                        px: 2,
                      }}
                    >
                      Upload Excel
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      component={Link}
                      to="/add-course"
                      startIcon={<AddCircleIcon />}
                      sx={{
                        fontWeight: 'bold',
                        textTransform: 'none',
                        px: 2,
                      }}
                    >
                      Add Course
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => setOpenDialog(true)}
                      startIcon={<DeleteIcon />}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'error.dark',
                        },
                        fontWeight: 'bold',
                        textTransform: 'none',
                        px: 2,
                      }}
                    >
                      Delete Excel
                    </Button>
                  </>
                )}
                <Button 
                  color="inherit"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                color="inherit"
                component={Link} 
                to="/login"
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '400px',
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ 
          color: 'error.main',
          fontWeight: 'bold'
        }}>
          Confirm Delete All Data
        </DialogTitle>
        <DialogContent>
          <Typography>
            This action will permanently delete all Excel data. Are you sure you want to continue?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteExcel} 
            color="error" 
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete All
          </Button>
        </DialogActions>
      </Dialog>

      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Container>

      <Box component="footer" sx={{ py: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            © 2024 Institute of Management & Technical Studies
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
