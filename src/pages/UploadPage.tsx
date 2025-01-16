import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Alert, List, ListItem, ListItemText } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

interface UploadResponse {
  message: string;
  statistics: {
    totalProcessed: number;
    newRecordsCreated: number;
    recordsUpdated: number;
    recordsMatched: number;
    failedOperations: number;
  };
}

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [stats, setStats] = useState<UploadResponse['statistics'] | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError('');
      setSuccess('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post<UploadResponse>('http://localhost:5000/api/upload', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess(response.data.message);
      setStats(response.data.statistics);
      setFile(null);
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError('Error uploading file. Please try again.');
      console.error('Upload error:', err);
      setStats(null);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Upload Excel File
        </Typography>
        
        <Box sx={{ my: 3 }}>
          <input
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            id="excel-file-input"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="excel-file-input">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              Choose Excel File
            </Button>
          </label>
          
          {file && (
            <Typography sx={{ mt: 2 }}>
              Selected file: {file.name}
            </Typography>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <>
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
            {stats && (
              <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Processing Statistics:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Total Records Processed"
                      secondary={stats.totalProcessed}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="New Records Created"
                      secondary={stats.newRecordsCreated}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Records Updated"
                      secondary={stats.recordsUpdated}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Records Matched"
                      secondary={stats.recordsMatched}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Failed Operations"
                      secondary={stats.failedOperations}
                      sx={{ 
                        '& .MuiListItemText-secondary': { 
                          color: stats.failedOperations > 0 ? 'error.main' : 'inherit'
                        }
                      }}
                    />
                  </ListItem>
                </List>
              </Box>
            )}
          </>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file}
          fullWidth
        >
          Upload
        </Button>
      </Paper>
    </Box>
  );
};

export default UploadPage;
