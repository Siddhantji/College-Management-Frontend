import axios from '../utils/axios';

export interface College {
  collegeName: string;
  courseCount: number;
}

interface CollegeResponse {
  count: number;
  colleges: College[];
}

export interface YearlyFee {
  year: number;
  amount: number;
  _id: string;
}

export interface Course {
  _id: string;
  collegeName: string;
  course: string;
  specialization: string;
  remark: string;
  eligibility: string;
  durationYears: string;
  mode: string;
  courseFeePerYear: number;
  prospectusFee: number;
  registrationFee: number;
  reRegistrationFeeSem: number;
  examFeePeriod: number;
  yearlyFees: YearlyFee[];
  totalFee: number;
  createdAt: string;
  updatedAt: string;
}

interface CourseResponse {
  count: number;
  courses: Course[];
}

interface PaginationParams {
  page: number;
  limit: number;
}

export interface QueryParams {  // Add export here
  page?: number;        // Make page optional
  limit?: number;       // Make limit optional
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filter?: Record<string, string>;
}

export interface FilterOptions {
  collegeNames?: string[];
  courses?: string[];
  specializations?: string[];
  eligibilities?: string[];
  durationYears?: string[];
  modes?: string[];
}

export interface FilterParams {
  collegeName?: string;
  course?: string;
  specialization?: string;
  eligibility?: string;
  durationYears?: string;
  mode?: string;
  minTotalFee?: number;
  maxTotalFee?: number;
  search?: string;
  [key: string]: string | number | undefined;  // Add index signature
}

interface PaginatedResponse<T> {
  count: number;
  courses: T[];
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  results?: number;  // Add optional results field
}

// Update FilterResponse to match actual API response
interface FilterResponse extends Array<string> {}

interface CollegeListResponse {
  count: number;
  colleges: College[];
}

interface FilteredResponse {
  status: string;
  count: number;      // Total number of records
  currentPage: number;
  totalPages: number;
  results: number;    // Number of records in current page
  courses: Course[];
}

export const collegeService = {
  getAll: (params?: QueryParams) => axios.get<CollegeResponse>('/courses/colleges', { params }),
  getById: (id: string) => axios.get<College>(`/colleges/${id}`),
  create: (data: Partial<College>) => axios.post('/colleges', data),
  update: (id: string, data: Partial<College>) => axios.put(`/colleges/${id}`, data),
  delete: (id: string) => axios.delete(`/colleges/${id}`),
  uploadExcel: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post('/colleges/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getCollegeCourses: (collegeName: string, params?: QueryParams) => 
    axios.get<PaginatedResponse<Course>>(`/courses/colleges/${encodeURIComponent(collegeName)}`, { 
      params: {
        ...params,
        filter: params?.filter ? JSON.stringify(params.filter) : undefined
      }
    }),
  getFilteredCourses: (params?: FilterParams & { page?: number; limit?: number }) => 
    axios.get<FilteredResponse>('/courses/filter', { 
      params: {
        ...params,
        page: params?.page || 1,
        limit: params?.limit || 10
      }
    }),
};

export const filterService = {
  getColleges: (params?: FilterParams) => 
    axios.get<CollegeListResponse>('/courses/colleges', { params }),
  
  getCourses: (params?: FilterParams) => 
    axios.get<FilterResponse>('/courses/courses', { params }),  // Updated path
  
  getSpecializations: (params?: FilterParams) => 
    axios.get<FilterResponse>('/courses/specializations', { params }),
  
  getEligibilities: (params?: FilterParams) => 
    axios.get<FilterResponse>('/courses/eligibilities', { params }),
  
  getDurationYears: (params?: FilterParams) => 
    axios.get<FilterResponse>('/courses/durations', { params }),
  
  getModes: (params?: FilterParams) => 
    axios.get<FilterResponse>('/courses/modes', { params })
};