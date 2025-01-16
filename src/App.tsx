import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';  // Changed to lowercase
import LoginPage from './pages/LoginPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';  // Update import
import { ThemeProvider, createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CollegesList from './components/colleges/CollegesList';
import CollegeCourses from './components/colleges/CollegeCourses';
import UploadPage from './pages/UploadPage';
import AddCoursePage from './pages/AddCoursePage';
import { FilterProvider } from './context/FilterContext';
import EditCoursePage from './pages/EditCoursePage';

const theme = createTheme();

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <FilterProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route element={<MainLayout />}>
                                <Route path="/login" element={<LoginPage />} />
                                {/* Only authentication required, no admin check */}
                                <Route 
                                    path="/colleges" 
                                    element={
                                        <ProtectedRoute>
                                            <CollegesList />
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route 
                                    path="/colleges/:collegeName/courses" 
                                    element={
                                        <ProtectedRoute>
                                            <CollegeCourses />
                                        </ProtectedRoute>
                                    } 
                                />
                                {/* Admin only route */}
                                <Route 
                                    path="/upload" 
                                    element={
                                        <ProtectedRoute adminOnly>
                                            <UploadPage />
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route 
                                    path="/add-course" 
                                    element={
                                        <ProtectedRoute adminOnly>
                                            <AddCoursePage />
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route 
                                    path="/edit-course/:id" 
                                    element={
                                        <ProtectedRoute adminOnly>
                                            <EditCoursePage />
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route path="/" element={<Navigate to="/colleges" replace />} />
                            </Route>
                        </Routes>
                        <ToastContainer />
                    </BrowserRouter>
                </FilterProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
