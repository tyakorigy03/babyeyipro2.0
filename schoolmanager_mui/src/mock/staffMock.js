export const staffHierarchy = [
  {
    id: 'academic',
    name: 'Academic Department',
    count: 2,
    children: [
      { id: 'teachers', name: 'Teachers', count: 2 },
      { id: 'hods', name: 'Heads of Department', count: 0 }
    ]
  },
  {
    id: 'administrative',
    name: 'Administrative Department',
    count: 1,
    children: [
      { id: 'admins', name: 'System Admins', count: 1 },
      { id: 'finance', name: 'Finance & Accounts', count: 0 }
    ]
  },
  {
    id: 'operations',
    name: 'Operations Department',
    count: 1,
    children: [
      { id: 'registrars', name: 'Registrar Staff', count: 1 },
      { id: 'maintenance', name: 'Maintenance & IT', count: 0 }
    ]
  }
];

export const mockStaffList = [
  { 
    id: 1, 
    name: 'Jean-Luc Ndayisenga', 
    staff_number: 'STAFF-001', 
    role: 'Teacher', 
    department: 'Academic Department', 
    employment_type: 'Full-time', 
    status: 'Active',
    email: 'jeanluc@school.com',
    phone: '(+250) 788-123-456',
    joinDate: '2025-01-01',
    jobTitle: 'Mathematics Teacher'
  },
  { 
    id: 2, 
    name: 'Marie-Claire Uwineza', 
    staff_number: 'STAFF-002', 
    role: 'Registrar', 
    department: 'Operations Department', 
    employment_type: 'Full-time', 
    status: 'Active',
    email: 'marieclaire@school.com',
    phone: '(+250) 788-234-567',
    joinDate: '2025-01-01',
    jobTitle: 'Head Registrar'
  },
  { 
    id: 3, 
    name: 'Eric Mutabazi', 
    staff_number: 'STAFF-003', 
    role: 'Teacher', 
    department: 'Academic Department', 
    employment_type: 'Contract', 
    status: 'Active',
    email: 'eric@school.com',
    phone: '(+250) 788-345-678',
    joinDate: '2025-01-01',
    jobTitle: 'Physics Teacher'
  },
  { 
    id: 4, 
    name: 'Alice Umutoni', 
    staff_number: 'STAFF-004', 
    role: 'Administrator', 
    department: 'Administrative Department', 
    employment_type: 'Full-time', 
    status: 'Active',
    email: 'alice@school.com',
    phone: '(+250) 788-456-789',
    joinDate: '2025-01-01',
    jobTitle: 'IT Administrator'
  }
];
