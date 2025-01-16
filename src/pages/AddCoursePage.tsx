import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

interface YearlyFee {
  year: number;
  amount: number;
}

interface CourseData {
  collegeName: string;
  course: string;
  specialization: string;
  remark: string;
  eligibility: string;
  durationYears: string;
  mode: string;
  courseFeePerYear: string;
  prospectusFee: string;
  registrationFee: string;
  reRegistrationFeeSem: string;
  examFeePeriod: string;
  totalFee: number;
  yearlyFees: YearlyFee[];
}

interface ApiResponse {
  status: string;
  message: string;
  data: CourseData & {
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

interface AddCoursePageProps {
  initialData?: CourseData;
  onSubmit?: (data: CourseData) => Promise<void>;
  isEditing?: boolean;
}

const AddCoursePage: React.FC<AddCoursePageProps> = ({ 
  initialData, 
  onSubmit,
  isEditing = false 
}) => {
  const [formData, setFormData] = useState<CourseData>(initialData || {
    collegeName: '',
    course: '',
    specialization: '',
    remark: '',
    eligibility: '',
    durationYears: '1',
    mode: 'Sem',
    courseFeePerYear: '',      // Change from 0 to ''
    prospectusFee: '',         // Change from 0 to ''
    registrationFee: '',       // Change from 0 to ''
    reRegistrationFeeSem: '',  // Change from 0 to ''
    examFeePeriod: '',         // Change from 0 to ''
    totalFee: 0,
    yearlyFees: [{ year: 1, amount: 0 }]
  } as CourseData);  // Type assertion to handle empty string values

  useEffect(() => {
    // Update yearly fees array when duration changes
    const duration = parseInt(formData.durationYears);
    const newYearlyFees = Array.from({ length: duration }, (_, index) => ({
      year: index + 1,
      amount: calculateYearlyFee(index + 1)
    }));
    setFormData(prev => ({ ...prev, yearlyFees: newYearlyFees }));
  }, [formData.durationYears, formData.courseFeePerYear, formData.examFeePeriod, 
      formData.registrationFee, formData.prospectusFee, formData.reRegistrationFeeSem]);

  const calculateYearlyFee = (year: number): number => {
    const baseFee = parseFloat(String(formData.courseFeePerYear)) || 0;
    const examFee = parseFloat(String(formData.examFeePeriod)) || 0;
    const regFee = year === 1 
      ? parseFloat(String(formData.registrationFee)) || 0 
      : parseFloat(String(formData.reRegistrationFeeSem)) || 0;
    const prospectus = year === 1 
      ? parseFloat(String(formData.prospectusFee)) || 0 
      : 0;
    return baseFee + examFee + regFee + prospectus;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Fee') ? (value === '' ? '' : parseFloat(value) || 0) : value
    }));
  };

  const calculateTotalFee = (): number => {
    return formData.yearlyFees.reduce((total, year) => total + year.amount, 0);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        totalFee: calculateTotalFee()
      };
      
      if (onSubmit) {
        await onSubmit(dataToSubmit);
      } else {
        // Original add course logic
        const response = await axios.post<ApiResponse>(
          'http://localhost:5000/api/courses', 
          dataToSubmit, 
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        toast.success(response.data.message);
        setFormData({
          collegeName: '',
          course: '',
          specialization: '',
          remark: '',
          eligibility: '',
          durationYears: '1',
          mode: 'Sem',
          courseFeePerYear: '',      // Change from 0 to ''
          prospectusFee: '',         // Change from 0 to ''
          registrationFee: '',       // Change from 0 to ''
          reRegistrationFeeSem: '',  // Change from 0 to ''
          examFeePeriod: '',         // Change from 0 to ''
          totalFee: 0,
          yearlyFees: [{ year: 1, amount: 0 }]
        });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      toast.error(isEditing ? 'Error updating course' : 'Error adding course');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {isEditing ? 'Edit Course' : 'Add New Course'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="College Name"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Eligibility"
                name="eligibility"
                value={formData.eligibility}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Duration (Years)"
                name="durationYears"
                value={formData.durationYears}
                onChange={handleInputChange}
                required
              >
                {[1,2,3,4,5,6].map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Mode"
                name="mode"
                value={formData.mode}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="Sem">Semester</MenuItem>
                <MenuItem value="Year">Yearly</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remark"
                name="remark"
                value={formData.remark}
                onChange={handleInputChange}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Fee Structure
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Course Fee Per Year"
                name="courseFeePerYear"
                value={formData.courseFeePerYear}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Prospectus Fee"
                name="prospectusFee"
                value={formData.prospectusFee}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Registration Fee"
                name="registrationFee"
                value={formData.registrationFee}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Re-Registration Fee"
                name="reRegistrationFeeSem"
                value={formData.reRegistrationFeeSem}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Exam Fee"
                name="examFeePeriod"
                value={formData.examFeePeriod}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Yearly Fee Breakdown
              </Typography>
              <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
                {formData.yearlyFees.map((yearFee) => (
                  <Typography key={yearFee.year}>
                    Year {yearFee.year}: ₹{yearFee.amount.toLocaleString()}
                  </Typography>
                ))}
                <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                  Total Fee: ₹{calculateTotalFee().toLocaleString()}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
              >
                {isEditing ? 'Update Course' : 'Add Course'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddCoursePage;
