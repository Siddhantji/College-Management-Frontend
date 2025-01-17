import React, { useEffect, useState } from 'react';
import { 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Typography, CircularProgress, Box, Chip, TablePagination,
  IconButton, Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
// import SearchIcon from '@mui/icons-material/Search';
import { useParams } from 'react-router-dom';
import { collegeService, Course, FilterParams } from '../../services/collegeService';
import { toast } from 'react-toastify';
import CourseDetailsModal from './CourseDetailsModal';
import { FilterPanel } from '../common/FilterPanel';

const CollegeCourses = () => {
  const { collegeName } = useParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  // const [searchTerm, setSearchTerm] = useState('');
  // const [mode, setMode] = useState('all');
  const [filterParams, setFilterParams] = useState<FilterParams>({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!collegeName) return;
        
        const response = filterParams && Object.keys(filterParams).length > 0 ?
          await collegeService.getFilteredCourses({
            ...filterParams,
            collegeName,
            page: page + 1,
            limit: rowsPerPage
          }) :
          await collegeService.getCollegeCourses(collegeName, {
            page: page + 1,
            limit: rowsPerPage
          });

        setCourses(response.data.courses);
        
        // Use count for total records, not results
        const totalRecords = response.data.count;
        setCount(totalRecords);
        
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [collegeName, page, rowsPerPage, filterParams]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course);
  };

  // const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(event.target.value);
  // };

  // const handleApplyFilters = (event: React.MouseEvent) => {
  //   event.preventDefault();
  //   setFilterParams({
  //     mode: tempMode !== 'all' ? tempMode : undefined,
  //     search: tempSearchTerm || undefined
  //   });
  //   setPage(0);
  // };

  const handleFilterUpdate = (newFilters: FilterParams) => {
    setFilterParams(newFilters);
    // Reset pagination when filters change
    setPage(0);
    setRowsPerPage(10);
  };

  // const handleClearFilters = () => {
  //   setTempSearchTerm('');
  //   setTempMode('all');
  //   setSearchTerm('');
  //   setMode('all');
  // };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <FilterPanel
        onApplyFilters={handleFilterUpdate}
        excludeCollege={true}
        initialFilters={{ collegeName }}
      />
      
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          Courses - {collegeName}
        </Typography>
        <Chip 
          label={`Total Courses: ${count}`} 
          color="primary" 
          variant="outlined"
        />
      </Box>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper', fontSize: '17px' }}>Course</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper', fontSize: '17px' }}>Specialization</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper', fontSize: '17px' }}>Eligibility</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'background.paper', fontSize: '17px' }}>Duration (Years)</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'background.paper', fontSize: '17px' }}>Mode</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'background.paper', fontSize: '17px' }}>Fee per Year</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'background.paper', fontSize: '17px' }}>Total Fee</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'background.paper', fontSize: '17px' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id} hover>
                <TableCell>{course.course}</TableCell>
                <TableCell>{course.specialization}</TableCell>
                <TableCell>{course.eligibility}</TableCell>
                <TableCell align="center">{course.durationYears}</TableCell>
                <TableCell align="center">{course.mode}</TableCell>
                <TableCell align="center">₹{course.courseFeePerYear.toLocaleString()}</TableCell>
                <TableCell align="center">₹{course.totalFee.toLocaleString()}</TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleViewDetails(course)}
                    >
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CourseDetailsModal
        course={selectedCourse}
        open={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default CollegeCourses;