import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import AddCoursePage from './AddCoursePage';

const API_URL = import.meta.env.VITE_API_URL;

const EditCoursePage = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (formData: any) => {
    try {
      const response = await axios.put(
        `${API_URL}/courses/${id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      toast.success('Course updated successfully');
      navigate(-1);
    } catch (error) {
      toast.error('Error updating course');
      console.error('Update error:', error);
    }
  };

  if (!state?.course) {
    navigate('/colleges');
    return null;
  }

  return (
    <AddCoursePage 
      initialData={state.course}
      onSubmit={handleSubmit}
      isEditing={true}
    />
  );
};

export default EditCoursePage;
