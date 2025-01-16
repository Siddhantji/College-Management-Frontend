import React, { useEffect, useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button, Grid, CircularProgress } from '@mui/material';
import { FilterOptions, FilterParams, filterService } from '../../services/collegeService';
import { toast } from 'react-toastify';

interface FilterPanelProps {
  onApplyFilters: (filters: FilterParams) => void;
  excludeCollege?: boolean;
  initialFilters?: FilterParams;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  onApplyFilters,
  excludeCollege,
  initialFilters
}) => {
  const [filters, setFilters] = useState<FilterParams>(initialFilters || {});
  const [options, setOptions] = useState<FilterOptions>({});
  const [loading, setLoading] = useState(true);
  const [loadedFields, setLoadedFields] = useState<Set<keyof FilterParams>>(new Set());

  const loadFilterOptions = async (currentFilters?: FilterParams, changedField?: keyof FilterParams) => {
    try {
      setLoading(true);
      const queryParams = currentFilters || filters;

      const apiCalls = {
        modes: !loadedFields.has('mode') ? 
          filterService.getModes(queryParams) : Promise.resolve({ data: options.modes }),
        courses: !loadedFields.has('course') ? 
          filterService.getCourses(queryParams) : Promise.resolve({ data: options.courses }),
        specializations: (!loadedFields.has('specialization') || changedField === 'course') ? 
          filterService.getSpecializations(queryParams) : Promise.resolve({ data: options.specializations }),
        eligibilities: !loadedFields.has('eligibility') ? 
          filterService.getEligibilities(queryParams) : Promise.resolve({ data: options.eligibilities }),
        durations: !loadedFields.has('durationYears') ? 
          filterService.getDurationYears(queryParams) : Promise.resolve({ data: options.durationYears }),
        colleges: (!excludeCollege && !loadedFields.has('collegeName')) ? 
          filterService.getColleges(queryParams) : Promise.resolve({ data: { colleges: [] } })
      };

      const [modes, courses, specs, eligs, durations, colleges] = await Promise.all([
        apiCalls.modes,
        apiCalls.courses,
        apiCalls.specializations,
        apiCalls.eligibilities,
        apiCalls.durations,
        apiCalls.colleges
      ]);

      setOptions(prevOptions => ({
        modes: Array.isArray(modes.data) ? modes.data : prevOptions.modes || [],
        courses: Array.isArray(courses.data) ? courses.data : prevOptions.courses || [],
        specializations: Array.isArray(specs.data) ? specs.data : prevOptions.specializations || [],
        eligibilities: Array.isArray(eligs.data) ? eligs.data : prevOptions.eligibilities || [],
        durationYears: Array.isArray(durations.data) ? durations.data : prevOptions.durationYears || [],
        collegeNames: colleges.data?.colleges?.map(college => college.collegeName) || prevOptions.collegeNames || []
      }));

      if (changedField) {
        setLoadedFields(prev => new Set([...prev, changedField]));
      }

    } catch (error) {
      console.error('Error loading filter options:', error);
      toast.error('Failed to load filter options');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (key: keyof FilterParams, value: any) => {
    const newFilters = { 
      ...filters,
      [key]: value === '' ? undefined : value 
    };

    if (key === 'course') {
      newFilters.specialization = undefined;
      setLoadedFields(prev => {
        const next = new Set(prev);
        next.delete('specialization');
        return next;
      });
    }

    setFilters(newFilters);
    await loadFilterOptions(newFilters, key);
  };

  useEffect(() => {
    loadFilterOptions(filters);
  }, [excludeCollege]);

  const handleApply = () => {
    const filterParams: FilterParams = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        if (key === 'minTotalFee' || key === 'maxTotalFee') {
          filterParams[key as keyof FilterParams] = Number(value);
        } else {
          filterParams[key as keyof FilterParams] = value;
        }
      }
    });

    onApplyFilters(filterParams);
  };

  const handleClear = () => {
    setFilters({});
    setLoadedFields(new Set());
    onApplyFilters({});
    loadFilterOptions();
  };

  return (
    <Box sx={{ p: 2 }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      <Grid container spacing={2}>
        {!excludeCollege && (
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <FormControl fullWidth size="small">
              <InputLabel>College</InputLabel>
              <Select
                value={filters.collegeName || ''}
                label="College"
                onChange={(e) => handleFilterChange('collegeName', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {options.collegeNames?.map(name => (
                  <MenuItem key={name} value={name}>{name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Course</InputLabel>
            <Select
              value={filters.course || ''}
              label="Course"
              onChange={(e) => handleFilterChange('course', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {options.courses?.map(course => (
                <MenuItem key={course} value={course}>{course}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Specialization</InputLabel>
            <Select
              value={filters.specialization || ''}
              label="Specialization"
              onChange={(e) => handleFilterChange('specialization', e.target.value)}
              disabled={!filters.course}
            >
              <MenuItem value="">All</MenuItem>
              {options.specializations?.map(spec => (
                <MenuItem key={spec} value={spec}>{spec}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Eligibility</InputLabel>
            <Select
              value={filters.eligibility || ''}
              label="Eligibility"
              onChange={(e) => handleFilterChange('eligibility', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {options.eligibilities?.map(elig => (
                <MenuItem key={elig} value={elig}>{elig}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Duration</InputLabel>
            <Select
              value={filters.durationYears || ''}
              label="Duration"
              onChange={(e) => handleFilterChange('durationYears', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {options.durationYears?.map(duration => (
                <MenuItem key={duration} value={duration}>{duration} Years</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Mode</InputLabel>
            <Select
              value={filters.mode || ''}
              label="Mode"
              onChange={(e) => handleFilterChange('mode', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {options.modes?.map(mode => (
                <MenuItem key={mode} value={mode}>{mode}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            fullWidth
            size="small"
            label="Min Fee"
            type="number"
            value={filters.minTotalFee || ''}
            onChange={(e) => handleFilterChange('minTotalFee', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
            fullWidth
            size="small"
            label="Max Fee"
            type="number"
            value={filters.maxTotalFee || ''}
            onChange={(e) => handleFilterChange('maxTotalFee', e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleClear}
              color="secondary"
            >
              Clear All
            </Button>
            <Button
              variant="contained"
              onClick={handleApply}
              color="primary"
            >
              Apply Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
