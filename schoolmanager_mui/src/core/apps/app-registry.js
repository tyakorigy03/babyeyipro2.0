import { defineAppContract } from "./app-contract.js";

/**
 * Central source of truth for app module contracts.
 * Structure only; no UI, layout, or business execution logic.
 */
export const appRegistry = Object.freeze([
  defineAppContract({
    id: "students",
    name: "Students",
    icon: "school",
    permission: "app.students.access",
    defaultView: "all",
    views: [
      { id: "all", permission: "app.students.view.all", label: "All Students" },
      { id: "parents", permission: "app.students.view.parents", label: "Parents" },
      { id: "enroll", permission: "app.students.view.enroll", label: "Enrollment" },
    ],
    subPages: [
      { 
        id: "new", 
        name: "Enroll Student", 
        permission: "app.students.hire", 
        type: "form",
        metadata: { 
          schema: "student_hire_v1",
          steps: ["Draft", "Academic", "Review"],
          headerFields: [
            { id: "full_name", label: "Full Legal Name", type: "text", isPrimary: true },
            { id: "level", label: "Level", type: "text", icon: "school" },
            { id: "class", label: "Class", type: "text", icon: "groups" },
            { id: "parent", label: "Parent", type: "text", icon: "family" },
            { id: "admission_date", label: "Joining Date", type: "text", icon: "calendar" }
          ],
          tabs: [
            {
              id: "Personal",
              sections: [
                {
                  title: "Identity Details",
                  fields: [
                    { id: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
                    { id: "dob", label: "Date of Birth", type: "date" }
                  ]
                },
                {
                  title: "Origin",
                  fields: [
                    { id: "nationality", label: "Nationality", type: "text", placeholder: "e.g. Rwandan" },
                    { id: "residence", label: "Residence", type: "text", placeholder: "Street, Sector, District" }
                  ]
                }
              ]
            },
            {
              id: "Family",
              sections: [
                {
                  id: "family_members",
                  title: "Parent / Guardian",
                  isRepeater: true,
                  fields: [
                    { 
                      id: "parent", 
                      label: "Link Parent", 
                      type: "discovery", 
                      discoveryType: "parent",
                      options: [
                        { name: "Eric Kayisire", phone: "(+250) 788-111-222" },
                        { name: "Sarah Uwase", phone: "(+250) 788-333-444" },
                        { name: "Jean Bizimana", phone: "(+250) 788-555-666" },
                        { name: "Alice Umutoni", phone: "(+250) 788-777-888" },
                        { name: "Pierre Ntaganda", phone: "(+250) 788-999-000" },
                        { name: "Marie Claire", phone: "(+250) 788-000-000" }
                      ]
                    },
                    { id: "relation", label: "Relation", type: "select", options: ["Father", "Mother", "Guardian", "Sibling"] }
                  ]
                }
              ]
            },
            {
              id: "Academic",
              sections: [
                {
                  title: "Enrollment Details",
                  fields: [
                    { id: "academicYear", label: "Academic Year", type: "select", options: ["2023-2024", "2024-2025", "2025-2026"] },
                    { 
                      id: "level", 
                      label: "Level", 
                      type: "discovery", 
                      discoveryType: "level",
                      options: [
                        { name: "P1", category: "Primary", capacity: "30" },
                        { name: "P2", category: "Primary", capacity: "30" },
                        { name: "S1", category: "Secondary", capacity: "40" }
                      ]
                    },
                    { 
                      id: "class", 
                      label: "Class", 
                      type: "discovery", 
                      discoveryType: "class",
                      options: [
                        { name: "P1 A", level: "P1", students: "25" },
                        { name: "P1 B", level: "P1", students: "28" },
                        { name: "S1 Alpha", level: "S1", students: "35" }
                      ]
                    },
                    { id: "term", label: "Admission Term", type: "select", options: ["Term 1", "Term 2", "Term 3"] }
                  ]
                }
              ]
            },
            {
              id: "Medical",
              sections: [
                {
                  title: "Health & Well-being",
                  fields: [
                    { id: "blood_group", label: "Blood Group", type: "select", options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] },
                    { id: "allergies", label: "Allergies", type: "text", placeholder: "List any allergies" }
                  ]
                }
              ]
            }
          ]
        }
      }
    ],
    actions: [],
    metadata: { domain: "academic" },
  }),
  defineAppContract({
    id: "staff",
    name: "Staff Members",
    icon: "groups",
    permission: "app.staff.access",
    defaultView: "all",
    views: [
      { id: "all", permission: "app.staff.view.all", label: "All Staff" },
      { id: "dept", permission: "app.staff.view.dept", label: "Departments" },
    ],
    subPages: [
      { 
        id: "new", 
        name: "Staff Onboarding Form", 
        permission: "app.staff.create", 
        type: "form",
        metadata: { 
          schema: "staff_onboarding_v1",
          steps: ["Draft", "Account Created", "Active"],
          headerFields: [
            { id: "name", label: "Staff Full Legal Name", type: "text", isPrimary: true },
            { id: "email", label: "Work Email", type: "email", icon: "email" },
            { id: "phone", label: "Work Phone", type: "phone", icon: "phone" },
            { id: "dept", label: "Department", type: "text", icon: "business" },
            { id: "joinDate", label: "Join Date", type: "text", icon: "calendar" }
          ],
          tabs: [
            {
              id: "Work",
              sections: [
                {
                  title: "Professional Info",
                  fields: [
                    { id: "jobTitle", label: "Job Title", type: "text" },
                    { id: "employeeType", label: "Employee Type", type: "select", options: ["Full-time", "Contract", "Part-time"] }
                  ]
                }
              ]
            },
            { id: "Resume", sections: [] },
            { id: "Personal", sections: [] },
            { id: "Payroll", sections: [] }
          ]
        }
      }
    ],
    actions: [],
    metadata: { domain: "hr" },
  }),
  defineAppContract({
    id: "parents",
    name: "Parents & Guardians",
    icon: "family_restroom",
    permission: "app.parents.access",
    defaultView: "all",
    views: [
      { id: "all", permission: "app.parents.view.all", label: "All Parents" },
    ],
    subPages: [
      { 
        id: "new", 
        name: "Parent Registration Form", 
        permission: "app.parents.create", 
        type: "form",
        metadata: { 
          schema: "parent_registration_v1",
          steps: ["Draft", "Review"],
          headerFields: [
            { id: "full_name", label: "Guardian Full Legal Name", type: "text", isPrimary: true },
            { id: "email", label: "Email Address", type: "email", icon: "email" },
            { id: "phone", label: "Mobile Number", type: "phone", icon: "smartphone" },
            { id: "occupation", label: "Occupation", type: "text", icon: "business" }
          ],
          tabs: [
            {
              id: "Parent Info",
              sections: [
                {
                  title: "Contact Details",
                  fields: [
                    { id: "phone", label: "Phone Number", type: "text", placeholder: "e.g. +250 788 000 000" },
                    { id: "alt_phone", label: "Alternative Phone", type: "text", placeholder: "Optional" },
                    { id: "email", label: "Email Address", type: "text", placeholder: "parent@example.com" }
                  ]
                },
                {
                  title: "Home & Address",
                  fields: [
                    { id: "nationality", label: "Nationality", type: "text" },
                    { id: "province", label: "Province", type: "select", options: ["Kigali City", "Northern", "Southern", "Eastern", "Western"] },
                    { id: "district", label: "District", type: "text" },
                    { id: "sector", label: "Sector", type: "text" }
                  ]
                }
              ]
            },
            {
              id: "Students",
              sections: [
                {
                  id: "children_list",
                  title: "Linked Children",
                  isRepeater: true,
                  fields: [
                    { id: "child", label: "Assign Student", type: "discovery", discoveryType: "student", options: [
                      { name: "Jean Baptiste Murenzi", code: "STD-001", class: "S1 Alpha" },
                      { name: "Marie Claire Uwase", code: "STD-002", class: "S1 Alpha" },
                      { name: "Samuel Bizimana", code: "STD-003", class: "S4 PCM" }
                    ]}
                  ]
                }
              ]
            },
            { 
              id: "Private Info", 
              sections: [
                {
                  title: "Personal & Confidential",
                  fields: [
                    { id: "idNumber", label: "National ID / Passport", type: "text" },
                    { id: "relationshipStatus", label: "Relationship Status", type: "select", options: ["Married", "Single", "Divorced", "Widowed"] },
                    { id: "occupation", label: "Occupation", type: "text" },
                    { id: "employer", label: "Employer / Business Name", type: "text" }
                  ]
                }
              ] 
            }
          ]
        }
      }
    ],
    actions: [],
    metadata: { domain: "academic" },
  }),
  defineAppContract({
    id: "attendance",
    name: "Attendance",
    icon: "event_available",
    permission: "app.attendance.access",
    defaultView: "students",
    views: [
      { id: "students", permission: "app.attendance.view.students" },
      { id: "teachers", permission: "app.attendance.view.teachers" },
      { id: "config", permission: "app.attendance.view.config" },
    ],
    actions: [],
    metadata: { domain: "academic" },
  }),
  defineAppContract({
    id: "timetable",
    name: "Timetable",
    icon: "calendar_month",
    permission: "app.timetable.access",
    defaultView: "weekly",
    views: [
      { id: "weekly", permission: "app.timetable.view.weekly" },
      { id: "schooldays", permission: "app.timetable.view.schooldays" },
    ],
    actions: [],
    metadata: { domain: "academic" },
  }),
  defineAppContract({
    id: "payroll",
    name: "Payroll",
    icon: "payments",
    permission: "app.payroll.access",
    defaultView: "monthly",
    views: [
      { id: "monthly", permission: "app.payroll.view.monthly" },
      { id: "structures", permission: "app.payroll.view.structures" },
      { id: "advance", permission: "app.payroll.view.advance" },
      { id: "statutory", permission: "app.payroll.view.statutory" },
    ],
    actions: [],
    metadata: { domain: "hr" },
  }),
  defineAppContract({
    id: "setup",
    name: "Setup",
    icon: "settings",
    permission: "app.setup.access",
    defaultView: "foundation",
    views: [
      { id: "foundation", permission: "app.setup.view.foundation" },
      { id: "system", permission: "app.setup.view.system" },
    ],
    actions: [],
    metadata: { domain: "admin" },
  }),
  defineAppContract({
    id: "routines",
    name: "Routine Templates",
    icon: "access_time",
    permission: "app.routines.access",
    defaultView: "all",
    views: [
      { id: "all", permission: "app.routines.view.all", label: "All Templates" },
    ],
    subPages: [
      { 
        id: "new", 
        name: "Create Routine Template", 
        permission: "app.routines.create", 
        type: "form",
        metadata: { 
          schema: "routine_template_v1",
          steps: ["Draft", "Structure", "Review"],
          headerFields: [
            { id: "name", label: "Routine Name", type: "text", isPrimary: true },
            { id: "type", label: "Template Type", type: "text", icon: "category" },
            { id: "slots", label: "Time Slots", type: "text", icon: "timer" }
          ],
          tabs: [
            {
              id: "General",
              sections: [
                {
                  title: "Template Information",
                  fields: [
                    { id: "name", label: "Template Name", type: "text", placeholder: "e.g. Standard Monday - Friday" },
                    { id: "description", label: "Description", type: "text", multiline: true, rows: 3 },
                    { id: "type", label: "Routine Type", type: "select", options: ["Academic", "Half Day", "Exam Schedule", "Event Schedule"] }
                  ]
                }
              ]
            }
          ]
        }
      }
    ],
    actions: [],
    metadata: { domain: "admin" },
  }),
  defineAppContract({
    id: "time_slots",
    name: "Time Slot",
    icon: "timer",
    permission: "app.routines.edit",
    defaultView: "all",
    subPages: [
      {
        id: "new",
        name: "Add Time Slot",
        type: "form",
        metadata: {
          schema: "time_slot_v1",
          steps: ["Config"],
          tabs: [
            {
              id: "Time",
              sections: [
                {
                  title: "Slot Configuration",
                  fields: [
                    { id: "startTime", label: "Start Time", type: "time" },
                    { id: "endTime", label: "End Time", type: "time" },
                    { id: "name", label: "Display Name (Optional)", type: "text", placeholder: "e.g. Morning Prayer" }
                  ]
                }
              ]
            }
          ]
        }
      }
    ],
    actions: [],
    metadata: { domain: "admin" },
  }),
  defineAppContract({
    id: "activities",
    name: "Activity",
    icon: "local_activity",
    permission: "app.routines.edit",
    defaultView: "all",
    subPages: [
      {
        id: "new",
        name: "Create Activity",
        type: "form",
        metadata: {
          schema: "activity_v1",
          steps: ["Details"],
          tabs: [
            {
              id: "Info",
              sections: [
                {
                  title: "Activity Details",
                  fields: [
                    { id: "name", label: "Activity Name", type: "text", placeholder: "e.g. Physics Lab" },
                    { id: "location", label: "Location", type: "discovery", discoveryType: "location" },
                    { id: "responsible", label: "Responsible Role", type: "select", options: ["Class Teacher", "Subject Teacher", "Principal", "Coach"] },
                    { id: "isAttendancePoint", label: "Is Attendance Point?", type: "select", options: ["Yes", "No"] }
                  ]
                }
              ]
            }
          ]
        }
      }
    ],
    actions: [],
    metadata: { domain: "admin" },
  }),
  defineAppContract({
    id: "rooms",
    name: "Location",
    icon: "room",
    permission: "app.setup.edit",
    defaultView: "all",
    subPages: [
      {
        id: "new",
        name: "Create Location",
        permission: "app.setup.edit",
        type: "form",
        metadata: {
          schema: "location_v1",
          steps: ["Details"],
          tabs: [
            {
              id: "Info",
              sections: [
                {
                  title: "Location Details",
                  fields: [
                    { id: "name", label: "Room/Location Name", type: "text", placeholder: "e.g. Science Lab A" },
                    { id: "type", label: "Location Type", type: "select", options: ["Classroom", "Laboratory", "Office", "Sport Ground", "Hall", "Other"] },
                    { id: "capacity", label: "Capacity", type: "text", placeholder: "e.g. 40" }
                  ]
                }
              ]
            }
          ]
        }
      }
    ],
    actions: [],
    metadata: { domain: "admin" },
  }),
  defineAppContract({
    id: "groups",
    name: "Group / Role",
    icon: "groups",
    permission: "app.setup.edit",
    defaultView: "all",
    subPages: [
      {
        id: "new",
        name: "Create Group",
        permission: "app.setup.edit",
        type: "form",
        metadata: {
          schema: "group_v1",
          steps: ["Details"],
          tabs: [
            {
              id: "Basic Info",
              sections: [
                {
                  title: "Group Details",
                  fields: [
                    { id: "name", label: "Group Name", type: "text", placeholder: "e.g. Grade 1 Athletes" },
                    { id: "type", label: "Group Category", type: "select", options: ["Academic", "Administrative", "Extracurricular", "System"] },
                    { id: "description", label: "Description", type: "text", multiline: true, rows: 2 }
                  ]
                }
              ]
            },
            {
              id: "Resolution Logic",
              sections: [
                {
                  title: "Membership Strategy",
                  fields: [
                    { id: "resolution_strategy", label: "Resolution Strategy", type: "select", options: ["static", "dynamic", "hybrid"] },
                    { id: "member_type", label: "Member Type", type: "select", options: ["Student", "Staff", "Parent", "Universal"] },
                    { id: "resolution_builder", label: "Visual Rule Builder", type: "resolution-builder" }
                  ]
                }
              ]
            }
          ]
        }
      }
    ],
    actions: [],
    metadata: { domain: "admin" },
  }),
]);

