export const studentHierarchy = [
  {
    id: 'nursery',
    name: 'Nursery',
    count: 120,
    children: [
      { id: 'baby-class', name: 'Baby Class', count: 40 },
      { id: 'middle-class', name: 'Middle Class', count: 40 },
      { id: 'top-class', name: 'Top Class', count: 40 },
    ]
  },
  {
    id: 'primary',
    name: 'Primary',
    count: 450,
    children: [
      { id: 'p1', name: 'P1', count: 75 },
      { id: 'p2', name: 'P2', count: 75 },
      { id: 'p3', name: 'P3', count: 75 },
      { id: 'p4', name: 'P4', count: 75 },
      { id: 'p5', name: 'P5', count: 75 },
      { id: 'p6', name: 'P6', count: 75 },
    ]
  },
  {
    id: 'secondary',
    name: 'Secondary',
    count: 320,
    children: [
      { id: 's1', name: 'S1', count: 80 },
      { id: 's2', name: 'S2', count: 80 },
      { id: 's3', name: 'S3', count: 80 },
      { 
        id: 's4', 
        name: 'S4', 
        count: 80,
        children: [
          { id: 'pcm', name: 'PCM', count: 20 },
          { id: 'pcb', name: 'PCB', count: 20 },
          { id: 'mcb', name: 'MCB', count: 20 },
          { id: 'meg', name: 'MEG', count: 20 },
        ]
      }
    ]
  }
];

export const studentsList = [
  { id: 1, name: 'Jean Baptiste Murenzi', gender: 'M', class: 'Senior 1A', parent: 'Murenzi Eric', status: 'Active' },
  { id: 2, name: 'Marie Claire Uwase', gender: 'F', class: 'Senior 1A', parent: 'Uwase Sarah', status: 'Active' },
  { id: 3, name: 'Samuel Bizimana', gender: 'M', class: 'Senior 4 PCM', parent: 'Bizimana Jean', status: 'Active' },
  { id: 4, name: 'Diane Umutoni', gender: 'F', class: 'Primary 6', parent: 'Umutoni Alice', status: 'Inactive' },
  { id: 5, name: 'Robert Ntaganda', gender: 'M', class: 'Senior 3', parent: 'Ntaganda Pierre', status: 'Active' },
  { id: 6, name: 'Alice Uwimana', gender: 'F', class: 'Primary 5', parent: 'Uwimana John', status: 'Active' },
  { id: 7, name: 'Patrick Karangwa', gender: 'M', class: 'Senior 2', parent: 'Karangwa Silas', status: 'Active' },
  { id: 8, name: 'Sophie Ingabire', gender: 'F', class: 'Baby Class', parent: 'Ingabire Martha', status: 'Active' },
];

export const parentsList = [
  { id: 101, name: 'Murenzi Eric', phone: '(+250) 788-111-222', students: ['Jean Baptiste Murenzi'], location: 'Kigali, Rwanda' },
  { id: 102, name: 'Uwase Sarah', phone: '(+250) 788-333-444', students: ['Marie Claire Uwase'], location: 'Musanze, Rwanda' },
  { id: 103, name: 'Bizimana Jean', phone: '(+250) 788-555-666', students: ['Samuel Bizimana'], location: 'Rubavu, Rwanda' },
  { id: 104, name: 'Umutoni Alice', phone: '(+250) 788-777-888', students: ['Diane Umutoni'], location: 'Huye, Rwanda' },
];

export const enrollmentList = [
  { id: 201, name: 'Junior Kamana', date: '2024-05-01', level: 'Primary 1', status: 'Draft' },
  { id: 202, name: 'Bella Umutesi', date: '2024-05-02', level: 'Nursery', status: 'Review' },
  { id: 203, name: 'Kevin Rukundo', date: '2024-05-03', level: 'Senior 1', status: 'Pending' },
];

