import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Course } from '../../services/collegeService';

interface CourseDetailsModalProps {
  course: Course | null;
  open: boolean;
  onClose: () => void;
}

const CourseDetailsModal = ({ course, open, onClose }: CourseDetailsModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!course) return null;

  const handleEdit = () => {
    navigate(`/edit-course/${course._id}`, { state: { course } });
    onClose();
  };

  const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
    <Grid container spacing={2} sx={{ py: 1 }}>
      <Grid item xs={5}>
        <Typography variant="subtitle2" color="text.secondary">{label}:</Typography>
      </Grid>
      <Grid item xs={7}>
        <Typography variant="body2">{value}</Typography>
      </Grid>
    </Grid>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant="h6">{course.course}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {course.collegeName} - {course.specialization}
            </Typography>
          </div>
          {user?.role === 'admin' && (
            <Button
              startIcon={<EditIcon />}
              onClick={handleEdit}
              color="primary"
              variant="outlined"
              size="small"
            >
              Edit
            </Button>
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Basic Information</Typography>
            <DetailRow label="Mode" value={course.mode} />
            <DetailRow label="Duration" value={`${course.durationYears} Years`} />
            <DetailRow label="Eligibility" value={course.eligibility} />
            <DetailRow label="Remarks" value={course.remark || 'N/A'} />
          </Grid>

          {/* Fee Structure */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Fee Structure</Typography>
            <DetailRow label="Course Fee (per year)" value={`₹${course.courseFeePerYear.toLocaleString()}`} />
            <DetailRow label="Prospectus Fee" value={`₹${course.prospectusFee.toLocaleString()}`} />
            <DetailRow label="Registration Fee" value={`₹${course.registrationFee.toLocaleString()}`} />
            <DetailRow label="Re-Registration Fee (Semester)" value={`₹${course.reRegistrationFeeSem.toLocaleString()}`} />
            <DetailRow label="Exam Fee (per period)" value={`₹${course.examFeePeriod.toLocaleString()}`} />
            <DetailRow label="Total Fee" value={`₹${course.totalFee.toLocaleString()}`} />
          </Grid>

          {/* Yearly Fee Breakdown */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Year-wise Fee Breakdown</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Year</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {course.yearlyFees.map((yearlyFee) => (
                  <TableRow key={yearlyFee._id}>
                    <TableCell>Year {yearlyFee.year}</TableCell>
                    <TableCell align="right">₹{yearlyFee.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>

          {/* Metadata */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="text.secondary" display="block">
              Last Updated: {new Date(course.updatedAt).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseDetailsModal;
