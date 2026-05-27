// Dynamic Rwanda Payroll Calculator
export function calculatePayslip(basic, allowances = {}, statutoryConfig = {}) {
  const basicSalary = parseFloat(basic) || 0;
  const housing = parseFloat(allowances.housing) || 0;
  const transport = parseFloat(allowances.transport) || 0;
  const responsibility = parseFloat(allowances.responsibility) || 0;
  const other = parseFloat(allowances.other) || 0;

  const grossSalary = basicSalary + housing + transport + responsibility + other;
  
  const rssbEnabled = statutoryConfig.rssbEnabled !== false;
  const ramaEnabled = statutoryConfig.ramaEnabled !== false;

  const rssbContribution = rssbEnabled ? grossSalary * 0.03 : 0;
  const ramaContribution = ramaEnabled ? grossSalary * 0.075 : 0;

  let paye = 0;
  const taxableSalary = Math.max(0, grossSalary - rssbContribution);
  
  if (taxableSalary > 1000000) {
    paye = (60000 * 0) + (40000 * 0.10) + (900000 * 0.20) + ((taxableSalary - 1000000) * 0.30);
  } else if (taxableSalary > 100000) {
    paye = (60000 * 0) + (40000 * 0.10) + ((taxableSalary - 100000) * 0.20);
  } else if (taxableSalary > 60000) {
    paye = (60000 * 0) + ((taxableSalary - 60000) * 0.10);
  }

  const deductions = rssbContribution + ramaContribution + paye;
  const netSalary = grossSalary - deductions;

  return {
    grossSalary,
    rssbContribution,
    ramaContribution,
    paye,
    deductions,
    netSalary
  };
}

// 1. Monthly Payroll Runs Mocks
export const payrollHierarchy = [
  {
    id: 'academic',
    name: 'Academic Department',
    count: 2,
    children: [
      { id: 'teachers', name: 'Teachers', count: 2 }
    ]
  },
  {
    id: 'administrative',
    name: 'Administrative Department',
    count: 1,
    children: [
      { id: 'admins', name: 'System Admins', count: 1 }
    ]
  },
  {
    id: 'operations',
    name: 'Operations Department',
    count: 1,
    children: [
      { id: 'registrars', name: 'Registrar Staff', count: 1 }
    ]
  }
];

export const mockMonthlyPayrollList = [
  {
    id: 1,
    name: 'Jean-Luc Ndayisenga',
    staff_number: 'STAFF-001',
    role: 'Teacher',
    department: 'Academic Department',
    basicSalary: 550000,
    housingAllowance: 50000,
    transportAllowance: 30000,
    responsibilityAllowance: 20000,
    status: 'Paid',
    rssbEnabled: true,
    ramaEnabled: true,
    bankName: 'BK (Bank of Kigali)',
    bankAccount: '00045-0697-1234',
    nationality: 'Rwandan',
    nationalId: '1199580048593021',
    email: 'jeanluc@school.com',
    phone: '(+250) 788-123-456',
    joinDate: '2025-01-01',
    jobTitle: 'Mathematics Teacher',
    ...calculatePayslip(550000, { housing: 50000, transport: 30000, responsibility: 20000 })
  },
  {
    id: 2,
    name: 'Marie-Claire Uwineza',
    staff_number: 'STAFF-002',
    role: 'Registrar',
    department: 'Operations Department',
    basicSalary: 650000,
    housingAllowance: 60000,
    transportAllowance: 40000,
    responsibilityAllowance: 40000,
    status: 'Paid',
    rssbEnabled: true,
    ramaEnabled: true,
    bankName: 'Equity Bank',
    bankAccount: '10023-4567-8901',
    nationality: 'Rwandan',
    nationalId: '1199480059302918',
    email: 'marieclaire@school.com',
    phone: '(+250) 788-234-567',
    joinDate: '2025-01-01',
    jobTitle: 'Head Registrar',
    ...calculatePayslip(650000, { housing: 60000, transport: 40000, responsibility: 40000 })
  },
  {
    id: 3,
    name: 'Eric Mutabazi',
    staff_number: 'STAFF-003',
    role: 'Teacher',
    department: 'Academic Department',
    basicSalary: 480000,
    housingAllowance: 40000,
    transportAllowance: 20000,
    responsibilityAllowance: 10000,
    status: 'Draft',
    rssbEnabled: true,
    ramaEnabled: false, // Optional
    bankName: 'Mwalimu SACCO',
    bankAccount: '40056-7890-1234',
    nationality: 'Rwandan',
    nationalId: '1199680029304910',
    email: 'eric@school.com',
    phone: '(+250) 788-345-678',
    joinDate: '2025-01-01',
    jobTitle: 'Physics Teacher',
    ...calculatePayslip(480000, { housing: 40000, transport: 20000, responsibility: 10000 }, { ramaEnabled: false })
  },
  {
    id: 4,
    name: 'Alice Umutoni',
    staff_number: 'STAFF-004',
    role: 'Administrator',
    department: 'Administrative Department',
    basicSalary: 850000,
    housingAllowance: 100000,
    transportAllowance: 50000,
    responsibilityAllowance: 50000,
    status: 'Paid',
    rssbEnabled: true,
    ramaEnabled: true,
    bankName: 'BK (Bank of Kigali)',
    bankAccount: '00045-0697-5678',
    nationality: 'Rwandan',
    nationalId: '1199380029485920',
    email: 'alice@school.com',
    phone: '(+250) 788-456-789',
    joinDate: '2025-01-01',
    jobTitle: 'IT Administrator',
    ...calculatePayslip(850000, { housing: 100000, transport: 50000, responsibility: 50000 })
  }
];

// 2. Salary Structures & Components Mocks
export const structuresHierarchy = [
  {
    id: 'allowances',
    name: 'Allowances',
    count: 3,
    children: [
      { id: 'housing', name: 'Housing Allowances', count: 1 },
      { id: 'transport', name: 'Transport Allowances', count: 1 },
      { id: 'responsibility', name: 'Responsibility Allowances', count: 1 }
    ]
  },
  {
    id: 'deductions',
    name: 'Deductions',
    count: 3,
    children: [
      { id: 'pension', name: 'RSSB Pension', count: 1 },
      { id: 'medical', name: 'RAMA Medical', count: 1 },
      { id: 'tax', name: 'PAYE Income Tax', count: 1 }
    ]
  }
];

export const mockStructuresList = [
  {
    id: 'comp_1',
    name: 'Housing Allowance',
    type: 'Allowance',
    category: 'Housing Allowances',
    calculationType: 'Flat Amount',
    value: 'Variable per Staff',
    status: 'Active',
    description: 'Allowance to support employee residential rent'
  },
  {
    id: 'comp_2',
    name: 'Transport Allowance',
    type: 'Allowance',
    category: 'Transport Allowances',
    calculationType: 'Flat Amount',
    value: 'Variable per Staff',
    status: 'Active',
    description: 'Allowance to support standard work commute expenses'
  },
  {
    id: 'comp_3',
    name: 'Responsibility Allowance',
    type: 'Allowance',
    category: 'Responsibility Allowances',
    calculationType: 'Flat Amount',
    value: 'Variable per Staff',
    status: 'Active',
    description: 'Allowance for staff holding extra administrative duties'
  },
  {
    id: 'comp_4',
    name: 'RSSB Pension',
    type: 'Deduction',
    category: 'RSSB Pension',
    calculationType: 'Percentage',
    value: '3% Employee, 5% Employer',
    status: 'Active',
    description: 'Rwanda Social Security Board national pension fund'
  },
  {
    id: 'comp_5',
    name: 'RAMA Medical',
    type: 'Deduction',
    category: 'RAMA Medical',
    calculationType: 'Percentage',
    value: '7.5% gross',
    status: 'Active',
    description: 'Standard medical coverage contributions'
  },
  {
    id: 'comp_6',
    name: 'PAYE Income Tax',
    type: 'Deduction',
    category: 'PAYE Income Tax',
    calculationType: 'Bracket-based',
    value: 'Progressive Rates',
    status: 'Active',
    description: 'Rwanda progressive PAYE income tax schedule'
  }
];

// 3. Salary Advance Mocks
export const advanceHierarchy = [
  {
    id: 'pending',
    name: 'Pending Requests',
    count: 1
  },
  {
    id: 'approved',
    name: 'Active Repayments',
    count: 2
  },
  {
    id: 'completed',
    name: 'Completed Repayments',
    count: 1
  }
];

export const mockAdvanceList = [
  {
    id: 1,
    name: 'Jean-Luc Ndayisenga',
    staff_number: 'STAFF-001',
    role: 'Teacher',
    amount: 150000,
    monthlyDeduction: 50000,
    term: '3 Months',
    remaining: 100000,
    status: 'Active Repayments',
    requestDate: '2026-04-10',
    description: 'Emergency household repair support'
  },
  {
    id: 2,
    name: 'Eric Mutabazi',
    staff_number: 'STAFF-003',
    role: 'Teacher',
    amount: 100000,
    monthlyDeduction: 25000,
    term: '4 Months',
    remaining: 100000,
    status: 'Pending Requests',
    requestDate: '2026-05-18',
    description: 'Medical billing advance'
  },
  {
    id: 3,
    name: 'Marie-Claire Uwineza',
    staff_number: 'STAFF-002',
    role: 'Registrar',
    amount: 200000,
    monthlyDeduction: 100000,
    term: '2 Months',
    remaining: 0,
    status: 'Completed Repayments',
    requestDate: '2026-02-05',
    description: 'School fees quick advance'
  },
  {
    id: 4,
    name: 'Alice Umutoni',
    staff_number: 'STAFF-004',
    role: 'Administrator',
    amount: 300000,
    monthlyDeduction: 50000,
    term: '6 Months',
    remaining: 150000,
    status: 'Active Repayments',
    requestDate: '2026-01-15',
    description: 'Purchase laptop accessory advance'
  }
];

// 4. Statutory Compliance Mocks
export const statutoryHierarchy = [
  {
    id: 'rssb_stat',
    name: 'RSSB Pension Fund',
    count: 1
  },
  {
    id: 'rama_stat',
    name: 'RAMA Medical Insurance',
    count: 1
  },
  {
    id: 'paye_stat',
    name: 'PAYE Income Tax',
    count: 1
  }
];

export const mockStatutoryList = [
  {
    id: 1,
    name: 'RSSB Monthly Declaration',
    type: 'RSSB Pension Fund',
    period: 'May 2026',
    declarantsCount: 4,
    totalGrossContribution: '2,530,000 RWF',
    employerShare: '126,500 RWF (5%)',
    employeeShare: '75,900 RWF (3%)',
    status: 'Declared & Unpaid'
  },
  {
    id: 2,
    name: 'RAMA Monthly Declaration',
    type: 'RAMA Medical Insurance',
    period: 'May 2026',
    declarantsCount: 3,
    totalGrossContribution: '2,050,000 RWF',
    employerShare: '153,750 RWF (7.5%)',
    employeeShare: '153,750 RWF (7.5%)',
    status: 'Declared & Paid'
  },
  {
    id: 3,
    name: 'PAYE Institutional Declaration',
    type: 'PAYE Income Tax',
    period: 'May 2026',
    declarantsCount: 4,
    totalGrossContribution: '2,530,000 RWF',
    employerShare: 'N/A',
    employeeShare: '360,530 RWF',
    status: 'Pending Declaration'
  }
];
