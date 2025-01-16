import React from 'react';
import { 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Typography, Box, Chip, TablePagination,
  IconButton, Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { Course, FilterParams } from '../../services/collegeService';
import CourseDetailsModal from './CourseDetailsModal';
import { FilterPanel } from '../common/FilterPanel';

interface FilteredCoursesListProps {
  courses: Course[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  onFilterUpdate: (filters: FilterParams) => void;
  currentFilters: FilterParams;
}

const FilteredCoursesList: React.FC<FilteredCoursesListProps> = ({
  courses,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onFilterUpdate,
  currentFilters
}) => {
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <FilterPanel
        onApplyFilters={onFilterUpdate}
        excludeCollege={false}
        initialFilters={currentFilters}
      />
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          Filtered Courses
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
              <TableCell>College</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Eligibility</TableCell>  {/* Add Eligibility column */}
              <TableCell align="center">Duration</TableCell>
              <TableCell align="center">Mode</TableCell>
              <TableCell align="center">Fee/Year</TableCell>
              <TableCell align="center">Total Fee</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id} hover>
                <TableCell>{course.collegeName}</TableCell>
                <TableCell>{course.course}</TableCell>
                <TableCell>{course.specialization}</TableCell>
                <TableCell>{course.eligibility}</TableCell>  {/* Add Eligibility cell */}
                <TableCell align="center">{course.durationYears}</TableCell>
                <TableCell align="center">{course.mode}</TableCell>
                <TableCell align="center">₹{course.courseFeePerYear.toLocaleString()}</TableCell>
                <TableCell align="center">₹{course.totalFee.toLocaleString()}</TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => setSelectedCourse(course)}
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
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
      />
    </Paper>
  );
};

export default FilteredCoursesList;
