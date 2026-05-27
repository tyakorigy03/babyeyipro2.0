import { API_BASE } from '@/config/api';

/**
 * Foundation Service
 * Handles core institutional setup data including Academic Years, Levels, Grades, 
 * Sections, Locations, and Routines.
 * 
 * Migrating from mock data to backend API integration.
 */

// --- Helper for Authorized Requests ---
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}/v1${url}`, { ...options, headers });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
};

// --- Mock Data Constants (Retained for non-migrated endpoints) ---
// ... (omitting other mocks for brevity in this replace call, but I will include them in the final file content)
// Wait, I should probably keep the other mocks if they aren't migrated yet.

const MOCK_ACADEMIC_YEARS = [
  {
    id: 1,
    name: '2024-2025',
    status: 'Active',
    startDate: '2024-01-10',
    endDate: '2024-12-05',
    terms: [
      {
        id: 101,
        name: 'Term 1',
        startDate: '2024-01-10',
        endDate: '2024-03-28',
        isActive: true,
        operationalCalendar: {
          phases: [
            { id: 1, name: 'Registration & Orientation', mode: 'RESUMPTION', startDate: '2024-01-10', endDate: '2024-01-14' },
            { id: 2, name: 'Normal Academic Weeks', mode: 'REGULAR', startDate: '2024-01-15', endDate: '2024-02-20' },
            { id: 3, name: 'Mid-Term Assessments (CATs)', mode: 'ASSESSMENT', startDate: '2024-02-21', endDate: '2024-02-25' },
          ],
          exceptions: [
            { date: '2024-02-06', mode: 'HOLIDAY', reason: 'Heroes Day' }
          ]
        }
      },
      { id: 102, name: 'Term 2', startDate: '2024-04-08', endDate: '2024-07-25', isActive: false, operationalCalendar: { phases: [] } },
    ]
  }
];

const MOCK_LEVELS = [
  { level_id: 1, name: 'Primary', code: 'PRI', promotion_rule: 'conditional' },
  { level_id: 2, name: 'O Level (S1-S3)', code: 'OLE', promotion_rule: 'conditional' },
  { level_id: 3, name: 'A Level (S4-S6)', code: 'ALE', promotion_rule: 'strict' },
  { level_id: 4, name: 'TVET', code: 'TVT', promotion_rule: 'competency' },
];

const MOCK_GRADES = [
  { grade_id: 1, level_id: 1, name: 'P1', code: 'P1' },
  { grade_id: 2, level_id: 1, name: 'P2', code: 'P2' },
  { grade_id: 3, level_id: 2, name: 'S1', code: 'S1' },
  { grade_id: 4, level_id: 3, name: 'S4', code: 'S4' },
];

const MOCK_SECTIONS = [
  { section_id: 1, grade_id: 1, stream: 'A', capacity: 45 },
  { section_id: 2, grade_id: 1, stream: 'B', capacity: 45 },
  { section_id: 3, grade_id: 3, stream: 'A', capacity: 48 },
];

const MOCK_ROUTINES = [
  {
    id: 'rt_001',
    name: 'Standard School Day',
    description: 'Regular academic day with periods and breaks',
    type: 'academic',
    isActive: true,
    timeSlots: [
      {
        id: 'slot_001',
        startTime: '07:30',
        endTime: '08:00',
        duration: 30,
        activities: [
          { id: 'act_001', name: 'Morning Assembly', targetGroups: ['all_students'], location: 'School Ground', responsibleRole: 'principal', isAttendancePoint: true }
        ]
      },
      {
        id: 'slot_002',
        startTime: '08:00',
        endTime: '08:40',
        duration: 40,
        activities: [
          { id: 'act_002', name: 'Period 1', targetGroups: ['all_students'], location: 'Classrooms', responsibleRole: 'subject_teacher', isAttendancePoint: true }
        ]
      }
    ]
  }
];

const MOCK_STUDENT_GROUPS = [
  { id: 'all_students', name: 'All Students', color: '#2563eb', type: 'global' },
  { id: 'boarding', name: 'Boarding Students', color: '#9333ea', type: 'residence' },
  { id: 'day', name: 'Day Students', color: '#16a34a', type: 'residence' },
  { id: 'bus_students', name: 'Bus Students', color: '#ea580c', type: 'transport' },
  { id: 'parent_pickup', name: 'Parent Pickup', color: '#d97706', type: 'transport' },
  { id: 'staff', name: 'Staff', color: '#64748b', type: 'role' }
];

const MOCK_BUSES = [
  { id: 1, plateNumber: 'RAA 123 A', model: 'Toyota Coaster', driver: 'Jean Pierre', capacity: 30, status: 'Active' },
  { id: 2, plateNumber: 'RAB 456 B', model: 'Hyundai County', driver: 'Moses', capacity: 28, status: 'Active' },
  { id: 3, plateNumber: 'RAC 789 C', model: 'Toyota Coaster', driver: 'Samuel', capacity: 30, status: 'Maintenance' },
];

const MOCK_TRANS_ROUTES = [
  { id: 101, busId: 1, name: 'Kigali - Kimironko', stops: 'Giporoso, Kimironko Market, Zindiro', morningTime: '06:30', afternoonTime: '16:30' },
  { id: 102, busId: 1, name: 'Kigali - Kabeza', stops: 'Remera, Kabeza Market, Kanombe', morningTime: '06:45', afternoonTime: '16:45' },
  { id: 201, busId: 2, name: 'Kigali - Nyamirambo', stops: 'Nyabugogo, Nyamirambo Stadium, Kigali View', morningTime: '06:15', afternoonTime: '16:15' },
];

// --- Service Implementation ---

/**
 * Foundation API Service
 */
const foundationService = {
  /**
   * Fetches all academic years
   */
  async getAcademicYears() {
    try {
      const response = await authFetch('/academicYears');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch academic years:', error);
      return [];
    }
  },

  /**
   * Fetches academic levels
   */
  async getLevels() {
    try {
      const response = await authFetch('/levels');
      // Map id to level_id for frontend compatibility
      return (response.data || []).map(l => ({ ...l, level_id: l.id }));
    } catch (error) {
      console.error('Failed to fetch levels:', error);
      return [];
    }
  },

  /**
   * Fetches grades for a specific level or all grades
   */
  async getGrades(levelId = null) {
    try {
      const url = levelId ? `/grades?level_id=${levelId}` : '/grades';
      const response = await authFetch(url);
      // Map id to grade_id and ensure level_id is present
      return (response.data || []).map(g => ({ ...g, grade_id: g.id }));
    } catch (error) {
      console.error('Failed to fetch grades:', error);
      return [];
    }
  },

  /**
   * Fetches terms for a specific academic year
   */
  async getTerms(yearId) {
    try {
      const response = await authFetch(`/terms?academic_year_id=${yearId}`);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch terms:', error);
      return [];
    }
  },

  /**
   * Fetches named phases (date ranges) for a specific term
   * Results are ordered by display_order
   */
  async getTermPhases(termId) {
    try {
      const response = await authFetch(`/termPhases?term_id=${termId}`);
      return (response.data || []).sort((a, b) => a.display_order - b.display_order);
    } catch (error) {
      console.error('Failed to fetch term phases:', error);
      return [];
    }
  },

  /**
   * Fetches school calendar entries (individual days with routine_template_id)
   * Filter by date range or any other field
   */
  async getSchoolCalendar(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await authFetch(`/schoolCalendars?${queryParams}`);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch school calendar:', error);
      return [];
    }
  },

  /**
   * Saves school calendar entries (individual or bulk)
   */
  async saveSchoolCalendar(data) {
    return authFetch('/schoolCalendars', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Fetches sections (Classes) for a specific grade
   * Note: In backend, Class is tied to AcademicGroup (Year + Grade)
   */
  async getSections(gradeId = null) {
    try {
      // For foundation setup, we might want to see classes associated with the grade
      // We'll fetch from /classes. If gradeId is provided, the generic handler 
      // might need a join or we might need a specialized route.
      // For now, we'll use the generic /classes route.
      const response = await authFetch('/classes');
      return (response.data || []).map(c => ({ 
        ...c, 
        section_id: c.id,
        grade_id: c.grade_id // Note: Class model has academic_group_id, but we'll try to find grade_id if mapped
      }));
    } catch (error) {
      console.error('Failed to fetch sections:', error);
      return [];
    }
  },

  /**
   * Creates a new level
   */
  async createLevel(data) {
    return authFetch('/levels', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Updates an existing level
   */
  async updateLevel(id, data) {
    return authFetch(`/levels/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  /**
   * Deletes a level
   */
  async deleteLevel(id) {
    return authFetch(`/levels/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Creates a new grade
   */
  async createGrade(data) {
    return authFetch('/grades', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Updates an existing grade
   */
  async updateGrade(id, data) {
    return authFetch(`/grades/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  /**
   * Deletes a grade
   */
  async deleteGrade(id) {
    return authFetch(`/grades/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Fetches school locations/blocks (Now from Real DB)
   */
  async getLocations() {
    try {
      const response = await authFetch('/blocks');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch blocks from database:', error);
      return []; // Fallback to empty if DB fails
    }
  },

  /**
   * Creates a new block
   */
  async createBlock(data) {
    return authFetch('/blocks', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Updates an existing block
   */
  async updateBlock(id, data) {
    return authFetch(`/blocks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  /**
   * Deletes a block
   */
  async deleteBlock(id) {
    return authFetch(`/blocks/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Fetches rooms within a block (Now from Real DB)
   */
  async getRooms(blockId = null) {
    try {
      const url = blockId ? `/locations?block_id=${blockId}` : '/locations';
      const response = await authFetch(url);
      
      // Map back to expected structure (block_id vs blockId)
      return (response.data || []).map(room => ({
        ...room,
        blockId: room.block_id // Ensure compatibility with existing UI
      }));
    } catch (error) {
      console.error('Failed to fetch rooms from database:', error);
      return [];
    }
  },

  /**
   * Creates a new room
   */
  async createRoom(data) {
    return authFetch('/locations', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Updates an existing room
   */
  async updateRoom(id, data) {
    return authFetch(`/locations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  /**
   * Deletes a room
   */
  async deleteRoom(id) {
    return authFetch(`/locations/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Deletes a routine activity
   */
  async deleteActivity(id) {
    return authFetch(`/routineActivities/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Fetches routine templates from the real database
   */
  async getRoutines() {
    try {
      const response = await authFetch('/routineTemplates');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch routine templates:', error);
      return [];
    }
  },

  /**
   * Fetches roles from the real database
   */
  async getRoles() {
    try {
      const response = await authFetch('/roles');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      return [];
    }
  },

  /**
   * Fetches departments (Organization Units) from the database
   */
  async getDepartments() {
    try {
      const response = await authFetch('/organizationUnits');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      return [];
    }
  },

  /**
   * Fetches academic groups from the database
   */
  async getAcademicGroups() {
    try {
      const response = await authFetch('/academicGroups');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch academic groups:', error);
      return [];
    }
  },

  /**
   * Fetches student enrollments from the database
   */
  async getEnrollments() {
    try {
      const response = await authFetch('/enrollments');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
      return [];
    }
  },


  /**
   * Fetches student groups (mapped to generic Groups in backend)
   */
  async getStudentGroups() {
    try {
      const response = await authFetch('/groups');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      return [];
    }
  },

  /**
   * Fetches students from the database
   */
  async getStudents() {
    try {
      const response = await authFetch('/students');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch students:', error);
      return [];
    }
  },

  /**
   * Fetches staff members from the database
   */
  async getStaff() {
    try {
      const response = await authFetch('/staff');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch staff:', error);
      return [];
    }
  },

  /**
   * Fetches parents/guardians from the database
   */
  async getParents() {
    try {
      const response = await authFetch('/parents');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch parents:', error);
      return [];
    }
  },

  /**
   * Creates a new routine template
   */
  async createRoutine(data) {
    return authFetch('/routineTemplates', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Updates an existing routine template
   */
  async updateRoutine(id, data) {
    return authFetch(`/routineTemplates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  /**
   * Creates a new time slot for a routine
   */
  async createTimeSlot(data) {
    return authFetch('/routineTimeSlots', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Creates a new activity for a time slot
   */
  async createActivity(data) {
    return authFetch('/routineActivities', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Updates an existing routine activity
   */
  async updateActivity(id, data) {
    return authFetch(`/routineActivities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  /**
   * Updates an existing time slot
   */
  async updateTimeSlot(id, data) {
    return authFetch(`/routineTimeSlots/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  /**
   * Universal entity creator for modular types
   */
  async createEntity(type, data) {
    const endpointMap = {
      rooms: '/locations',
      groups: '/groups',
      parents: '/parents',
      students: '/students',
      staff: '/staff'
    };
    
    const endpoint = endpointMap[type] || `/${type}`;
    return authFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Universal entity updater for modular types
   */
  async updateEntity(type, id, data) {
    const endpointMap = {
      rooms: '/locations',
      groups: '/groups',
      parents: '/parents',
      students: '/students',
      staff: '/staff'
    };
    
    const endpoint = endpointMap[type] || `/${type}`;
    return authFetch(`${endpoint}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  /**
   * Fetches levels from the database
   */
  async getLevels() {
    try {
      const response = await authFetch('/levels');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch levels:', error);
      return [];
    }
  },

  /**
   * Fetches locations/rooms from the database
   */
  async getLocations() {
    try {
      const response = await authFetch('/locations');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      return [];
    }
  },

  /**
   * Creates a new class
   */
  async createClass(data) {
    return authFetch('/classes', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Creates a new role
   */
  async createRole(data) {
    return authFetch('/roles', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Creates a new organization unit (department)
   */
  async createDepartment(data) {
    return authFetch('/organizationUnits', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Fetches grades from the database
   */
  async getGrades() {
    try {
      const response = await authFetch('/grades');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch grades:', error);
      return [];
    }
  },

  /**
   * Creates a new grade
   */
  async createGrade(data) {
    return authFetch('/grades', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Creates a new level
   */
  async createLevel(data) {
    return authFetch('/levels', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Fetches academic groups from the database
   */
  async getAcademicGroups() {
    try {
      const response = await authFetch('/academicGroups');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch academicGroups:', error);
      return [];
    }
  },

  /**
   * Creates a new academic group
   */
  async createAcademicGroup(data) {
    return authFetch('/academicGroups', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Fetches transport buses
   */
  async getBuses() {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_BUSES]), 400);
    });
  },

  /**
   * Fetches transport routes
   */
  async getTransportRoutes() {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_TRANS_ROUTES]), 400);
    });
  }
};

export default foundationService;
