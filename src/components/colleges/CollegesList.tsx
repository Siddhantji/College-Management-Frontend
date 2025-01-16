import React, { useEffect, useState } from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography,
  CircularProgress,
  Box,
  Chip,
  Button
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { collegeService, College, Course, FilterParams } from '../../services/collegeService';  // Add Course to imports
import { FilterPanel } from '../common/FilterPanel';
import { toast } from 'react-toastify';
import FilteredCoursesList from './FilteredCoursesList';
import { useFilters } from '../../context/FilterContext';

const CollegesList: React.FC = () => {
  const navigate = useNavigate();
  const { shouldClearFilters, setShouldClearFilters } = useFilters();
  const [colleges, setColleges] = useState<College[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterParams, setFilterParams] = useState<FilterParams>({});
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const hasAdvancedFilters = (filters: FilterParams) => {
    const { collegeName, ...otherFilters } = filters;
    return Object.values(otherFilters).some(value => value !== undefined && value !== '');
  };

  useEffect(() => {
    if (shouldClearFilters) {
      // Reset all your filter states here
      setFilterParams({});
      // Reset any other filters you have
      setShouldClearFilters(false);
    }
  }, [shouldClearFilters, setShouldClearFilters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (hasAdvancedFilters(filterParams)) {
          // Fetch filtered courses
          const response = await collegeService.getFilteredCourses({
            ...filterParams,
            page: page + 1,
            limit: rowsPerPage
          });
          setFilteredCourses(response.data.courses);
          setTotalCount(response.data.count);
        } else {
          // Fetch colleges list
          const response = await collegeService.getAll({
            ...filterParams
          });
          setColleges(response.data.colleges);
          setTotalCount(response.data.count);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterParams, page, rowsPerPage]);

  const handleViewCourses = (collegeName: string) => {
    navigate(`/colleges/${encodeURIComponent(collegeName)}/courses`);
  };

  const handleFilterUpdate = (newFilters: FilterParams) => {
    setFilterParams(newFilters);
    // Reset pagination when filters change
    setPage(0);
    setRowsPerPage(10);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return hasAdvancedFilters(filterParams) ? (
    <FilteredCoursesList
      courses={filteredCourses}
      count={totalCount}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={setPage}
      onRowsPerPageChange={setRowsPerPage}
      onFilterUpdate={handleFilterUpdate}
      currentFilters={filterParams}
    />
  ) : (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          Colleges List
        </Typography>
        <Chip 
          label={`Total Colleges: ${totalCount}`} 
          color="primary" 
          variant="outlined"
        />
      </Box>
      <FilterPanel
        onApplyFilters={handleFilterUpdate}
        excludeCollege={false}
      />
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>College Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Course Count</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {colleges.length > 0 ? (
              colleges.map((college) => (
                <TableRow key={college.collegeName} hover>
                  <TableCell>{college.collegeName}</TableCell>
                  <TableCell align="center">{college.courseCount}</TableCell>
                  <TableCell align="center">
                    <Button
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewCourses(college.collegeName)}
                      color="primary"
                      size="small"
                    >
                      View Courses
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No colleges found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CollegesList;
