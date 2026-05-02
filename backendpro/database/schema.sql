-- BabyeyiPro 2.0 - Normalized Database Schema
-- Focus: Scalability, Integrity, and Multi-tenancy

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Schools (The Tenants)
CREATE TABLE IF NOT EXISTS schools (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    organization_type ENUM('School', 'Corporate') DEFAULT 'School',
    code VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    address TEXT,
    logo VARCHAR(255),
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    subscription_tier ENUM('basic', 'pro', 'enterprise') DEFAULT 'basic',
    settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Physical Locations (Modular Spaces)
CREATE TABLE IF NOT EXISTS locations (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM('Classroom', 'Laboratory', 'Hall', 'Field', 'Office', 'Other') DEFAULT 'Classroom',
    capacity INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    UNIQUE KEY unique_location_per_school (school_id, name)
) ENGINE=InnoDB;

-- 3. Academic Years & Terms
CREATE TABLE IF NOT EXISTS academic_years (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(50) NOT NULL, -- e.g. '2024-2025'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'inactive', 'archived') DEFAULT 'inactive',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS terms (
    id CHAR(36) PRIMARY KEY,
    academic_year_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL, -- e.g. 'Term 1', 'Term 2'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Educational Levels & Grades
CREATE TABLE IF NOT EXISTS levels (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL, -- e.g. 'Nursery', 'Primary', 'A Level'
    code VARCHAR(20) NOT NULL, -- e.g. 'NUR', 'PRI', 'ALE'
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    UNIQUE KEY unique_level_per_school (school_id, name)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS grades (
    id CHAR(36) PRIMARY KEY,
    level_id CHAR(36) NOT NULL,
    grade_number INT NOT NULL, -- e.g. 1 for P1, 2 for P2
    name VARCHAR(100) NOT NULL, -- e.g. 'P1', 'S4'
    code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE,
    UNIQUE KEY unique_grade_per_level (level_id, name)
) ENGINE=InnoDB;

-- 5. Combinations & Tracks (for A-Level/TVET)
CREATE TABLE IF NOT EXISTS combinations (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    level_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL, -- e.g. 'PCM', 'Construction'
    code VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE,
    UNIQUE KEY unique_comb_per_school (school_id, name)
) ENGINE=InnoDB;

-- 6. Academic Groups (The Cohorts)
-- Bundles Grade, Combination, and Year (e.g. '2024 S4 PCM')
CREATE TABLE IF NOT EXISTS academic_groups (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    academic_year_id CHAR(36) NOT NULL,
    grade_id CHAR(36) NOT NULL,
    combination_id CHAR(36), -- NULL for levels without combinations (e.g. Primary)
    name VARCHAR(255), -- e.g. 'S4 PCM 2024'
    head_id CHAR(36), -- Optional Head of Combination/Grade (FK to Staff)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE CASCADE,
    FOREIGN KEY (combination_id) REFERENCES combinations(id) ON DELETE SET NULL,
    UNIQUE KEY unique_group (academic_year_id, grade_id, combination_id)
) ENGINE=InnoDB;

-- 7. Classes (The Streams/Teaching Units)
CREATE TABLE IF NOT EXISTS classes (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    academic_group_id CHAR(36) NOT NULL,
    stream VARCHAR(50), -- e.g. 'A', 'B', 'Blue'
    custom_name VARCHAR(255), -- e.g. 'P1 Alpha'
    location_id CHAR(36), -- Default classroom/location
    capacity INT DEFAULT 40,
    class_teacher_id CHAR(36), -- FK to staff/users
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_group_id) REFERENCES academic_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
    UNIQUE KEY unique_stream (academic_group_id, stream)
) ENGINE=InnoDB;

-- 8. Subjects (The Academic Content)
CREATE TABLE IF NOT EXISTS subjects (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    level_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE,
    UNIQUE KEY unique_subject_per_level (level_id, name)
) ENGINE=InnoDB;

-- 9. School Calendar (Mapping Days to Routines)
CREATE TABLE IF NOT EXISTS school_calendar (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    date DATE NOT NULL,
    routine_template_id CHAR(36) NOT NULL,
    event_name VARCHAR(255), -- e.g. 'Public Holiday', 'Sports Day'
    is_academic_day BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (routine_template_id) REFERENCES routine_templates(id) ON DELETE CASCADE,
    UNIQUE KEY unique_date_per_school (school_id, date)
) ENGINE=InnoDB;

-- 10. Permissions (System-wide constants)
CREATE TABLE IF NOT EXISTS permissions (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    module VARCHAR(50) NOT NULL, -- e.g. 'Students', 'Staff', 'Finance', 'Discipline'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Core Permission Constants (to be seeded)
-- MANAGE_DISCIPLINE, APPROVE_LEAVE, MANAGE_CONDUCT_POLICIES, RECORD_ATTENDANCE


-- 9. Roles (School-specific / Tenant-specific)
CREATE TABLE IF NOT EXISTS roles (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE, -- To prevent deletion of core roles
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_per_school (school_id, name)
) ENGINE=InnoDB;

-- 10. Role Permissions (Junction)
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id CHAR(36) NOT NULL,
    permission_id CHAR(36) NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. Users (Authentication & Roles)
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36),
    role_id CHAR(36), -- Dynamic role instead of ENUM
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    last_login TIMESTAMP NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE SET NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 12. Organization Units (Departments, Sections, etc. - Hierarchical)
CREATE TABLE IF NOT EXISTS organization_units (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    parent_id CHAR(36),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'Department', -- e.g. 'Department', 'Wing', 'Unit'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES organization_units(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 13. Staff Assignments (Linking Users to Organization Units)
CREATE TABLE IF NOT EXISTS staff_assignments (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    unit_id CHAR(36) NOT NULL,
    position_name VARCHAR(255) NOT NULL, -- e.g. 'Director of Studies', 'HOD ICT'
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES organization_units(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 14. Workflow Policies (Modular Approval System)
CREATE TABLE IF NOT EXISTS workflow_policies (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    action_key VARCHAR(100) NOT NULL, -- e.g. 'MARK_DEDUCTION', 'ADMISSION_APPROVAL'
    trigger_role_id CHAR(36), -- Who initiates the action (NULL = any)
    approval_required BOOLEAN DEFAULT TRUE,
    approver_unit_id CHAR(36), -- Which department approves
    approver_role_id CHAR(36), -- Which specific role approves
    min_approvals INT DEFAULT 1,
    sequence_order INT DEFAULT 1, -- For multi-stage workflows
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (trigger_role_id) REFERENCES roles(id) ON DELETE SET NULL,
    FOREIGN KEY (approver_unit_id) REFERENCES organization_units(id) ON DELETE SET NULL,
    FOREIGN KEY (approver_role_id) REFERENCES roles(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 15. Routine Templates (The Modular Daily Ingredients)
CREATE TABLE IF NOT EXISTS routine_templates (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type ENUM('academic', 'half_day', 'exam', 'holiday', 'special') DEFAULT 'academic',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 16. Routine Time Slots
CREATE TABLE IF NOT EXISTS routine_time_slots (
    id CHAR(36) PRIMARY KEY,
    template_id CHAR(36) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES routine_templates(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 17. Routine Activities (Parallel Activities within a slot)
CREATE TABLE IF NOT EXISTS routine_activities (
    id CHAR(36) PRIMARY KEY,
    slot_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    location_id CHAR(36), -- Link to physical locations
    is_attendance_point BOOLEAN DEFAULT FALSE,
    attendance_method ENUM('mass', 'per_class', 'per_student') DEFAULT 'mass',
    responsible_role_id CHAR(36), -- Link to dynamic roles
    description TEXT,
    is_multi_instance BOOLEAN DEFAULT FALSE, -- e.g. 'Period 1' happens in many rooms
    transport_route_id CHAR(36), -- Optional link for trips/transport activities
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (slot_id) REFERENCES routine_time_slots(id) ON DELETE CASCADE,
    FOREIGN KEY (responsible_role_id) REFERENCES roles(id) ON DELETE SET NULL,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
    FOREIGN KEY (transport_route_id) REFERENCES transport_routes(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 18. Activity Target Groups (Junction)
CREATE TABLE IF NOT EXISTS routine_activity_target_groups (
    activity_id CHAR(36) NOT NULL,
    group_id CHAR(36) NOT NULL, -- Link to the universal Groups engine
    PRIMARY KEY (activity_id, group_id),
    FOREIGN KEY (activity_id) REFERENCES routine_activities(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 19. Modular Groups (Universal Targeting Engine)
-- Handles everything from 'All Staff' to 'Fans Club'
CREATE TABLE IF NOT EXISTS groups (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    parent_id CHAR(36), -- For sub-groups
    name VARCHAR(255) NOT NULL,
    type ENUM('System', 'Academic', 'Extracurricular', 'Administrative', 'Residential', 'Custom') DEFAULT 'Custom',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES groups(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 20. Group Roles (Internal Organization of a Group)
-- Allows a group to define its own titles (e.g. 'Captain', 'President')
CREATE TABLE IF NOT EXISTS group_roles (
    id CHAR(36) PRIMARY KEY,
    group_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_per_group (group_id, name)
) ENGINE=InnoDB;

-- 21. Group Memberships (Dynamic tracking)
CREATE TABLE IF NOT EXISTS group_memberships (
    id CHAR(36) PRIMARY KEY,
    group_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL, -- Links to User (can be student or staff)
    group_role_id CHAR(36), -- Link to modular roles
    status ENUM('active', 'inactive', 'left') DEFAULT 'active',
    joined_at DATE,
    left_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_role_id) REFERENCES group_roles(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 22. Staff Metadata
CREATE TABLE IF NOT EXISTS staff (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL UNIQUE,
    school_id CHAR(36) NOT NULL,
    staff_number VARCHAR(50) NOT NULL,
    designation VARCHAR(100),
    employment_type ENUM('Full-time', 'Part-time', 'Contract', 'Intern') DEFAULT 'Full-time',
    joining_date DATE,
    qualifications TEXT,
    skills JSON,
    base_salary DECIMAL(15, 2),
    status ENUM('active', 'on_leave', 'suspended', 'terminated') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    UNIQUE KEY unique_staff_per_school (school_id, staff_number)
) ENGINE=InnoDB;

-- 23. Students (Core Data)
CREATE TABLE IF NOT EXISTS students (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    student_id_number VARCHAR(50) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    dob DATE NOT NULL,
    nationality VARCHAR(100) DEFAULT 'Rwandan',
    residence TEXT,
    blood_group VARCHAR(5),
    allergies TEXT,
    admission_date DATE,
    dismissal_mode ENUM('Bus', 'Parent Pickup', 'Self', 'Other') DEFAULT 'Parent Pickup',
    transport_route_id CHAR(36), -- Link to transport_routes
    status ENUM('applicant', 'pending_approval', 'active', 'inactive', 'graduated', 'transferred', 'dropped') DEFAULT 'applicant',
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (transport_route_id) REFERENCES transport_routes(id) ON DELETE SET NULL,
    UNIQUE KEY unique_student_per_school (school_id, student_id_number)
) ENGINE=InnoDB;

-- 23b. Student Enrollments (The Promotion & History Engine)
-- Tracks which student is in which class for a specific academic year
CREATE TABLE IF NOT EXISTS enrollments (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    class_id CHAR(36) NOT NULL,
    academic_year_id CHAR(36) NOT NULL,
    status ENUM('Active', 'Withdrawn', 'Transferred', 'Suspended', 'Completed') DEFAULT 'Active',
    promotion_status ENUM('Pending', 'Promoted', 'Repeated', 'Graduated') DEFAULT 'Pending',
    promotion_decision ENUM('Pass', 'Fail', 'Incomplete') DEFAULT 'Incomplete',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_enrollment (student_id, academic_year_id) -- One active enrollment per year
) ENGINE=InnoDB;

-- 24. Parents / Guardians
CREATE TABLE IF NOT EXISTS parents (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    user_id CHAR(36), -- Optional link to a user account for portal access
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    occupation VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 25. Student-Parent Relationship (Many-to-Many)
CREATE TABLE IF NOT EXISTS student_parents (
    student_id CHAR(36) NOT NULL,
    parent_id CHAR(36) NOT NULL,
    relationship VARCHAR(50) DEFAULT 'Parent', -- e.g. 'Father', 'Mother', 'Guardian'
    is_emergency_contact BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (student_id, parent_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 26. Admission Applications (The Modular Process)
CREATE TABLE IF NOT EXISTS admission_applications (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    academic_year_id CHAR(36),
    target_class_id CHAR(36),
    current_stage VARCHAR(100) DEFAULT 'Initial Application',
    status ENUM('Draft', 'Pending', 'In Progress', 'Approved', 'Rejected') DEFAULT 'Pending',
    application_data JSON, -- For school-specific custom fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 27. Admission Workflow Logs (Tracking the movement)
CREATE TABLE IF NOT EXISTS admission_workflow_logs (
    id CHAR(36) PRIMARY KEY,
    application_id CHAR(36) NOT NULL,
    from_stage VARCHAR(100),
    to_stage VARCHAR(100),
    action VARCHAR(50), -- e.g. 'Approved', 'Sent Back', 'Deferred'
    processed_by_user_id CHAR(36),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES admission_applications(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 28. Transport Routes (The Logical Paths)
CREATE TABLE IF NOT EXISTS transport_routes (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL, -- e.g. 'Kigali - Kimironko Line'
    description TEXT,
    fee DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 29. Transport Vehicles (The Physical Buses)
CREATE TABLE IF NOT EXISTS transport_vehicles (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    plate_number VARCHAR(50) NOT NULL UNIQUE,
    model VARCHAR(255),
    capacity INT,
    status ENUM('active', 'maintenance', 'retired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 30. Transport Assignments (Dynamic Driver & Vehicle Linking)
-- Handles the 'Drivers can change' requirement
CREATE TABLE IF NOT EXISTS transport_assignments (
    id CHAR(36) PRIMARY KEY,
    route_id CHAR(36) NOT NULL,
    vehicle_id CHAR(36) NOT NULL,
    driver_id CHAR(36), -- Link to staff.id
    is_active BOOLEAN DEFAULT TRUE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES transport_routes(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES transport_vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 31. Timetables (The Roster Blueprints)
CREATE TABLE IF NOT EXISTS timetables (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    academic_year_id CHAR(36) NOT NULL,
    term_id CHAR(36),
    name VARCHAR(255) NOT NULL, -- e.g. '2024 S4 Term 1 Main'
    type ENUM('Academic', 'Extracurricular', 'Exam', 'Other') DEFAULT 'Academic',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 32. Timetable Entries (The Actual Roster)
CREATE TABLE IF NOT EXISTS timetable_entries (
    id CHAR(36) PRIMARY KEY,
    timetable_id CHAR(36) NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    slot_id CHAR(36) NOT NULL, -- Link to routine_time_slots
    staff_id CHAR(36), -- The Teacher / Coach (links to staff.id)
    group_id CHAR(36), -- Link to universal groups (AcademicGroup or ModularGroup)
    subject_id CHAR(36), -- Optional (for academic lessons)
    location_id CHAR(36), -- Optional override for this specific entry
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (timetable_id) REFERENCES timetables(id) ON DELETE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES routine_time_slots(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 33. Attendance Sessions (The Context)
CREATE TABLE IF NOT EXISTS attendance_sessions (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    reference_type ENUM('TimetableEntry', 'TransportRoute', 'RoutineActivity', 'General') NOT NULL,
    reference_id CHAR(36), -- Link to the specific timetable_entry, transport_route, etc.
    date DATE NOT NULL,
    taken_by_staff_id CHAR(36), -- The Staff who recorded the attendance
    session_status ENUM('open', 'closed', 'cancelled') DEFAULT 'open',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (taken_by_staff_id) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 34. Attendance Records (The Individual Entries)
CREATE TABLE IF NOT EXISTS attendance_records (
    id CHAR(36) PRIMARY KEY,
    session_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL, -- Links to users (student or staff)
    status ENUM('present', 'absent', 'late', 'excused') DEFAULT 'present',
    recording_method ENUM('manual', 'nfc', 'biometric', 'qr') DEFAULT 'manual',
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSON, -- Stores NFC tag IDs, GPS coordinates for buses, etc.
    FOREIGN KEY (session_id) REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 35. Attendance Authorizations (Modular Responsibility)
-- Defines WHO can take attendance for WHAT
CREATE TABLE IF NOT EXISTS attendance_authorizations (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    reference_type ENUM('TimetableEntry', 'TransportRoute', 'RoutineActivity', 'General') NOT NULL,
    reference_id CHAR(36) NOT NULL,
    staff_id CHAR(36), -- Specific staff member
    role_id CHAR(36), -- Or anyone with this specific role
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 36. Leave Requests (The Permission System)
-- Handles excused absences for students and staff
CREATE TABLE IF NOT EXISTS leave_requests (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL, -- The person requesting leave
    leave_type ENUM('Sick', 'Medical', 'Personal', 'Emergency', 'Official', 'Other') DEFAULT 'Personal',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status ENUM('Pending', 'Approved', 'Rejected', 'Cancelled') DEFAULT 'Pending',
    approved_by_staff_id CHAR(36), -- Who granted the permission
    approval_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by_staff_id) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 37. Discipline Policies (Modular Rules)
-- Defines mark deductions for specific activities/scenarios
CREATE TABLE IF NOT EXISTS discipline_policies (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    reference_type ENUM('RoutineActivity', 'TimetableEntry', 'General') DEFAULT 'General',
    reference_id CHAR(36), -- Optional link to a specific activity/lesson
    violation_type ENUM('Absent', 'Late', 'Misconduct', 'Uniform', 'Other') NOT NULL,
    marks_to_deduct DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    is_automatic BOOLEAN DEFAULT TRUE, -- Automatically deduct when attendance is taken?
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 38. Discipline Records (The Conduct Log)
CREATE TABLE IF NOT EXISTS discipline_records (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    recorded_by_staff_id CHAR(36),
    points DECIMAL(5, 2) NOT NULL, -- Negative for deduction, Positive for reward
    category VARCHAR(100) NOT NULL, -- e.g. 'Attendance', 'Behavior'
    reason TEXT,
    attendance_record_id CHAR(36), -- Optional link if auto-generated
    policy_id CHAR(36), -- Link to the policy that triggered it
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by_staff_id) REFERENCES staff(id) ON DELETE SET NULL,
    FOREIGN KEY (attendance_record_id) REFERENCES attendance_records(id) ON DELETE SET NULL,
    FOREIGN KEY (policy_id) REFERENCES discipline_policies(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 39. Pay Grades (Salary Scales)
CREATE TABLE IF NOT EXISTS pay_grades (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL, -- e.g. 'Senior Teacher Grade 1'
    base_salary DECIMAL(15, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 40. Salary Components (Allowances & Deductions)
CREATE TABLE IF NOT EXISTS salary_components (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL, -- e.g. 'Housing Allowance', 'NSSF Deduction'
    type ENUM('Allowance', 'Deduction') NOT NULL,
    calculation_type ENUM('Fixed', 'Percentage') DEFAULT 'Fixed',
    value DECIMAL(15, 2) NOT NULL, -- Fixed amount or Percentage value
    is_statutory BOOLEAN DEFAULT FALSE, -- e.g. Tax/Social Security
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 41. Staff Salary Configurations (Individual Setup)
CREATE TABLE IF NOT EXISTS staff_salary_configurations (
    id CHAR(36) PRIMARY KEY,
    staff_id CHAR(36) NOT NULL UNIQUE,
    pay_grade_id CHAR(36), -- Optional link to a scale
    custom_base_salary DECIMAL(15, 2), -- Overrides pay_grade base if set
    payment_method ENUM('Bank', 'Mobile Money', 'Cash', 'Cheque') DEFAULT 'Bank',
    bank_name VARCHAR(255),
    account_number VARCHAR(100),
    mobile_money_number VARCHAR(50),
    tax_id_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    FOREIGN KEY (pay_grade_id) REFERENCES pay_grades(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 42. Staff Salary Component Mapping
CREATE TABLE IF NOT EXISTS staff_salary_component_mappings (
    staff_id CHAR(36) NOT NULL,
    component_id CHAR(36) NOT NULL,
    custom_value DECIMAL(15, 2), -- Overrides the component's default value if set
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (staff_id, component_id),
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    FOREIGN KEY (component_id) REFERENCES salary_components(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 43. Payroll Runs (The Processing Periods)
CREATE TABLE IF NOT EXISTS payroll_runs (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL, -- e.g. 'May 2024 Regular'
    payroll_month INT NOT NULL,
    payroll_year INT NOT NULL,
    status ENUM('Draft', 'Processing', 'Approved', 'Paid', 'Cancelled') DEFAULT 'Draft',
    processed_at TIMESTAMP,
    processed_by_user_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 44. Payslips (The Final Record)
CREATE TABLE IF NOT EXISTS payslips (
    id CHAR(36) PRIMARY KEY,
    payroll_run_id CHAR(36) NOT NULL,
    staff_id CHAR(36) NOT NULL,
    base_salary DECIMAL(15, 2) NOT NULL,
    total_allowances DECIMAL(15, 2) DEFAULT 0.00,
    total_deductions DECIMAL(15, 2) DEFAULT 0.00,
    net_salary DECIMAL(15, 2) NOT NULL,
    status ENUM('Generated', 'Pending_Approval', 'Paid', 'Failed') DEFAULT 'Generated',
    payment_reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payroll_run_id) REFERENCES payroll_runs(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 45. Payslip Items (Line-by-line Breakdown)
CREATE TABLE IF NOT EXISTS payslip_items (
    id CHAR(36) PRIMARY KEY,
    payslip_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL, -- e.g. 'Housing Allowance'
    type ENUM('Allowance', 'Deduction') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (payslip_id) REFERENCES payslips(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 46. Staff Contracts (Employment Terms)
CREATE TABLE IF NOT EXISTS staff_contracts (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    staff_id CHAR(36) NOT NULL,
    contract_type ENUM('Permanent', 'Fixed-Term', 'Contractor', 'Intern', 'Volunteer') DEFAULT 'Permanent',
    pay_frequency ENUM('Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Termly') DEFAULT 'Monthly',
    start_date DATE NOT NULL,
    end_date DATE, -- NULL for permanent
    probation_end_date DATE,
    status ENUM('Draft', 'Active', 'Expired', 'Terminated', 'Resigned') DEFAULT 'Draft',
    terms_and_conditions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 47. Document Types (Modular Catalog)
CREATE TABLE IF NOT EXISTS document_types (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL, -- e.g. 'National ID', 'Contract', 'Medical Report'
    category ENUM('Identity', 'Academic', 'Employment', 'Legal', 'Medical', 'Other') DEFAULT 'Other',
    is_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    UNIQUE KEY unique_doc_type (school_id, name)
) ENGINE=InnoDB;

-- 48. Documents (Universal Vault)
CREATE TABLE IF NOT EXISTS documents (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    document_type_id CHAR(36) NOT NULL,
    owner_type ENUM('Staff', 'Student', 'School', 'Parent', 'FeePayment', 'FeeInvoice') NOT NULL,
    owner_id CHAR(36) NOT NULL, -- UUID of staff, student, fee_payment, fee_invoice, etc.
    title VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    expiry_date DATE,
    status ENUM('Active', 'Expired', 'Revoked', 'Pending_Review') DEFAULT 'Active',
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (document_type_id) REFERENCES document_types(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 49. Fee Categories (Modular Catalog)
CREATE TABLE IF NOT EXISTS fee_categories (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL, -- e.g. 'Tuition', 'Transport', 'Library', 'Uniform'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    UNIQUE KEY unique_fee_cat (school_id, name)
) ENGINE=InnoDB;

-- 50. Fee Structures (Group-Based Templates)
CREATE TABLE IF NOT EXISTS fee_structures (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    academic_year_id CHAR(36) NOT NULL,
    term_id CHAR(36), -- Optional (some fees are annual)
    target_group_id CHAR(36), -- Link to universal groups (AcademicGroup, ModularGroup, etc.)
    name VARCHAR(255) NOT NULL, -- e.g. 'S1 Boarding Term 1 Fees'
    total_amount DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE SET NULL,
    FOREIGN KEY (target_group_id) REFERENCES groups(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 51. Fee Structure Items (Line-by-line breakdown)
CREATE TABLE IF NOT EXISTS fee_structure_items (
    id CHAR(36) PRIMARY KEY,
    fee_structure_id CHAR(36) NOT NULL,
    fee_category_id CHAR(36) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    is_optional BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(id) ON DELETE CASCADE,
    FOREIGN KEY (fee_category_id) REFERENCES fee_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 52. Fee Invoices (Individual Student Bills)
CREATE TABLE IF NOT EXISTS fee_invoices (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    fee_structure_id CHAR(36), -- Optional if it's a one-off custom invoice
    academic_year_id CHAR(36) NOT NULL,
    term_id CHAR(36),
    total_amount DECIMAL(15, 2) NOT NULL,
    paid_amount DECIMAL(15, 2) DEFAULT 0.00,
    due_date DATE,
    status ENUM('Unpaid', 'Partial', 'Paid', 'Void', 'Refunded') DEFAULT 'Unpaid',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(id) ON DELETE SET NULL,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 53. Fee Payments (The Transactions)
CREATE TABLE IF NOT EXISTS fee_payments (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    invoice_id CHAR(36), -- Optional if paying into general balance
    student_id CHAR(36) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method ENUM('Bank', 'Mobile Money', 'Cash', 'Cheque', 'Scholarship', 'Waiver') NOT NULL,
    reference_number VARCHAR(255), -- Receipt or Transaction ID
    collected_by_staff_id CHAR(36),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (invoice_id) REFERENCES fee_invoices(id) ON DELETE SET NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (collected_by_staff_id) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 54. Advance Requests (ShuleAvance)
CREATE TABLE IF NOT EXISTS advance_requests (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    staff_id CHAR(36) NOT NULL,
    contract_id CHAR(36) NOT NULL,
    amount_requested DECIMAL(15, 2) NOT NULL, -- The Principal
    interest_rate DECIMAL(5, 2) DEFAULT 0.00, -- Modular interest (e.g. 2.50 for 2.5%)
    interest_amount DECIMAL(15, 2) DEFAULT 0.00,
    total_repayment_amount DECIMAL(15, 2) NOT NULL, -- Principal + Interest
    repayment_months INT DEFAULT 1,
    monthly_installment_amount DECIMAL(15, 2) NOT NULL,
    purpose ENUM('Personal', 'SchoolFees', 'TichaDeals', 'Other') DEFAULT 'Personal',
    target_student_id CHAR(36), -- If for school fees
    target_invoice_id CHAR(36), -- The specific bill being paid
    partner_id CHAR(36), -- The Fintech partner providing the funds
    reason TEXT,
    status ENUM('Pending', 'School_Approved', 'Partner_Approved', 'Disbursed', 'Rejected', 'Deducted', 'Fully_Paid') DEFAULT 'Pending',
    approved_by_staff_id CHAR(36),
    partner_reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    FOREIGN KEY (contract_id) REFERENCES staff_contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by_staff_id) REFERENCES staff(id) ON DELETE SET NULL,
    FOREIGN KEY (target_student_id) REFERENCES students(id) ON DELETE SET NULL,
    FOREIGN KEY (target_invoice_id) REFERENCES fee_invoices(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 55. Advance Installments (Repayment Tracking)
CREATE TABLE IF NOT EXISTS advance_installments (
    id CHAR(36) PRIMARY KEY,
    advance_id CHAR(36) NOT NULL,
    payroll_run_id CHAR(36), -- Links to the payroll run where it was deducted
    amount DECIMAL(15, 2) NOT NULL,
    status ENUM('Pending', 'Paid', 'Skipped') DEFAULT 'Pending',
    scheduled_date DATE, -- Approximate month for the deduction
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (advance_id) REFERENCES advance_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (payroll_run_id) REFERENCES payroll_runs(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 56. External Partners (Lenders, Vendors, Fintechs)
CREATE TABLE IF NOT EXISTS partners (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('Fintech', 'Vendor', 'Insurance', 'Bank', 'Other') DEFAULT 'Vendor',
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    api_credentials JSON, -- For automated integrations
    status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 57. Deal Products (TichaDeals Catalog & ShuleKits)
CREATE TABLE IF NOT EXISTS deal_products (
    id CHAR(36) PRIMARY KEY,
    partner_id CHAR(36) NULL, -- Can be NULL if it's an internal ShuleKit
    type ENUM('TichaDeal', 'ShuleKit', 'General') DEFAULT 'TichaDeal',
    bundle_contents JSON NULL, -- e.g., ["Uniform", "Math Set", "Books"]
    brand_name VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    specifications JSON, -- For technical details (e.g. RAM, Storage, Material)
    original_price DECIMAL(15, 2) NOT NULL,
    deal_price DECIMAL(15, 2) NOT NULL,
    stock_quantity INT DEFAULT -1,
    category VARCHAR(100),
    main_image_url VARCHAR(255),
    gallery_images JSON, -- Array of additional image URLs
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 57b. Product Variants (Size, Color, etc.)
CREATE TABLE IF NOT EXISTS deal_product_variants (
    id CHAR(36) PRIMARY KEY,
    product_id CHAR(36) NOT NULL,
    variant_name VARCHAR(255) NOT NULL, -- e.g. 'Blue - 256GB' or 'Size L'
    sku VARCHAR(100) UNIQUE,
    additional_price DECIMAL(15, 2) DEFAULT 0.00,
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES deal_products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 57c. School Deal Availability (Targeted Offers)
CREATE TABLE IF NOT EXISTS school_deal_availability (
    school_id CHAR(36) NOT NULL,
    product_id CHAR(36) NOT NULL,
    PRIMARY KEY (school_id, product_id),
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES deal_products(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- 58. Deal Orders (The Purchase & Logistics)
CREATE TABLE IF NOT EXISTS deal_orders (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    buyer_user_id CHAR(36) NOT NULL, -- Changed from staff_id to allow Parents to buy ShuleKits
    product_id CHAR(36) NOT NULL,
    quantity INT DEFAULT 1,
    total_amount DECIMAL(15, 2) NOT NULL,
    payment_mode ENUM('Immediate', 'Payroll_Deduction', 'Wallet', 'Proxy') DEFAULT 'Immediate',
    repayment_months INT DEFAULT 1,
    status ENUM('Pending', 'Approved', 'Dispatched', 'AtAgentStation', 'Delivered', 'Cancelled', 'Fully_Paid') DEFAULT 'Pending',
    delivery_method ENUM('AgentPickup', 'SchoolDelivery', 'HomeDelivery') DEFAULT 'AgentPickup',
    delivery_address TEXT,
    assigned_agent_id CHAR(36) NULL, -- The Agent responsible for the package
    partner_reference VARCHAR(255), -- Tracking ID from vendor
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES deal_products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 59. Deal Installments (Payroll Repayment for Products)
CREATE TABLE IF NOT EXISTS deal_installments (
    id CHAR(36) PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    payroll_run_id CHAR(36),
    amount DECIMAL(15, 2) NOT NULL,
    status ENUM('Pending', 'Paid', 'Skipped') DEFAULT 'Pending',
    scheduled_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES deal_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (payroll_run_id) REFERENCES payroll_runs(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 60. Inventory Items (School Stock)
CREATE TABLE IF NOT EXISTS inventory_items (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category ENUM('Stationary', 'Kitchen', 'Cleaning', 'Medical', 'Maintenance', 'Other') DEFAULT 'Other',
    unit VARCHAR(50) NOT NULL, -- e.g. 'kg', 'box', 'pieces'
    stock_quantity DECIMAL(15, 2) DEFAULT 0.00,
    reorder_level DECIMAL(15, 2) DEFAULT 0.00,
    unit_price DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 61. Inventory Transactions (IN/OUT tracking)
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id CHAR(36) PRIMARY KEY,
    inventory_item_id CHAR(36) NOT NULL,
    type ENUM('In', 'Out', 'Adjustment') NOT NULL,
    quantity DECIMAL(15, 2) NOT NULL,
    staff_id CHAR(36), -- Person who issued/received
    reason TEXT,
    reference_type ENUM('Purchase', 'Requisition', 'Adjustment', 'Loss') DEFAULT 'Requisition',
    reference_id CHAR(36), -- Link to requisition or purchase order
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 62. Requisitions (Material/Cash Requests)
CREATE TABLE IF NOT EXISTS requisitions (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    staff_id CHAR(36) NOT NULL, -- The requester
    type ENUM('Material', 'Cash', 'Service') DEFAULT 'Material',
    title VARCHAR(255) NOT NULL,
    reason TEXT,
    total_estimated_cost DECIMAL(15, 2) DEFAULT 0.00,
    status ENUM('Draft', 'Pending_Approval', 'Approved_By_HOD', 'Approved_By_Admin', 'Disbursed', 'Rejected', 'Cancelled') DEFAULT 'Pending_Approval',
    current_workflow_step_id CHAR(36), -- Link to workflow engine
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 63. Requisition Items
CREATE TABLE IF NOT EXISTS requisition_items (
    id CHAR(36) PRIMARY KEY,
    requisition_id CHAR(36) NOT NULL,
    inventory_item_id CHAR(36), -- NULL if requesting cash/new items not in stock
    item_description VARCHAR(255), -- Fallback for new items
    quantity_requested DECIMAL(15, 2) NOT NULL,
    quantity_approved DECIMAL(15, 2) DEFAULT 0.00,
    estimated_unit_cost DECIMAL(15, 2) DEFAULT 0.00,
    FOREIGN KEY (requisition_id) REFERENCES requisitions(id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 64. School Expenses (Expenditure Log)
CREATE TABLE IF NOT EXISTS expenses (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    requisition_id CHAR(36), -- Optional link to original request
    category VARCHAR(100) NOT NULL, -- e.g. 'Kitchen Supplies', 'Maintenance'
    amount DECIMAL(15, 2) NOT NULL,
    payment_method ENUM('Cash', 'Bank', 'Mobile Money', 'Cheque') DEFAULT 'Cash',
    paid_to VARCHAR(255), -- Vendor name or Staff name
    date_paid DATE NOT NULL,
    recorded_by_staff_id CHAR(36),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (requisition_id) REFERENCES requisitions(id) ON DELETE SET NULL,
    FOREIGN KEY (recorded_by_staff_id) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 65. Smart Cards (ShuleCard RFID)
CREATE TABLE IF NOT EXISTS smart_cards (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL, -- Owner (Student or Staff)
    card_number VARCHAR(100) NOT NULL UNIQUE, -- RFID / NFC Tag ID
    status ENUM('Active', 'Inactive', 'Lost', 'Blocked') DEFAULT 'Active',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 66. Smart Card Readers (Physical Hardware)
CREATE TABLE IF NOT EXISTS smart_card_readers (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    reader_serial VARCHAR(255) NOT NULL UNIQUE,
    location_name VARCHAR(255) NOT NULL, -- e.g. 'Main Gate', 'Bus 01', 'Class 4A'
    reader_type ENUM('Gate', 'Classroom', 'Bus', 'Library', 'Canteen', 'Generic') DEFAULT 'Generic',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 67. Smart Card Logs (The Raw Tap Stream)
CREATE TABLE IF NOT EXISTS smart_card_logs (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    card_id CHAR(36) NOT NULL,
    reader_id CHAR(36) NOT NULL,
    tap_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action_type ENUM('CheckIn', 'CheckOut', 'Attendance', 'Payment', 'Verify') DEFAULT 'Attendance',
    metadata JSON, -- Optional (e.g. GPS coordinates for Bus readers)
    attendance_record_id CHAR(36), -- Link to attendance if successfully mapped
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (card_id) REFERENCES smart_cards(id) ON DELETE CASCADE,
    FOREIGN KEY (reader_id) REFERENCES smart_card_readers(id) ON DELETE CASCADE,
    FOREIGN KEY (attendance_record_id) REFERENCES attendance_records(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 68. Library Books (Integrated with Inventory)
CREATE TABLE IF NOT EXISTS library_books (
    id CHAR(36) PRIMARY KEY,
    inventory_item_id CHAR(36) NOT NULL,
    isbn VARCHAR(50),
    author VARCHAR(255),
    publisher VARCHAR(255),
    edition VARCHAR(50),
    shelf_location VARCHAR(100), -- e.g. 'A-12'
    status ENUM('Available', 'Borrowed', 'Lost', 'Damaged', 'Reserved') DEFAULT 'Available',
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 69. Library Loans (Borrowing Records)
CREATE TABLE IF NOT EXISTS library_loans (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    book_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL, -- Student or Staff
    smart_card_log_id CHAR(36), -- Optional link to the 'Tap' that initiated this
    loan_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    status ENUM('Active', 'Returned', 'Overdue', 'Lost') DEFAULT 'Active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES library_books(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (smart_card_log_id) REFERENCES smart_card_logs(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 70. Library Fines (Financial & Discipline link)
CREATE TABLE IF NOT EXISTS library_fines (
    id CHAR(36) PRIMARY KEY,
    loan_id CHAR(36) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status ENUM('Unpaid', 'Paid', 'Waived') DEFAULT 'Unpaid',
    discipline_record_id CHAR(36), -- Optional link to conduct mark deduction
    fee_invoice_id CHAR(36), -- Optional link to student bill
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (loan_id) REFERENCES library_loans(id) ON DELETE CASCADE,
    FOREIGN KEY (discipline_record_id) REFERENCES discipline_records(id) ON DELETE SET NULL,
    FOREIGN KEY (fee_invoice_id) REFERENCES fee_invoices(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 71. Wallets (Internal School Ledger)
CREATE TABLE IF NOT EXISTS wallets (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    owner_type ENUM('Student', 'Staff', 'Vendor', 'System') NOT NULL,
    owner_id CHAR(36) NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    status ENUM('Active', 'Frozen', 'Closed') DEFAULT 'Active',
    pin_hash VARCHAR(255), -- For spending security
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(owner_type, owner_id),
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 72. Wallet Transactions (The Money Flow)
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    wallet_id CHAR(36) NOT NULL,
    type ENUM('Credit', 'Debit') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    transaction_type ENUM('TopUp', 'Purchase', 'Withdrawal', 'Transfer', 'CashOut', 'Refund') NOT NULL,
    reference_type VARCHAR(100), -- e.g. 'smart_card_logs', 'requisitions', 'fee_payments'
    reference_id CHAR(36),
    status ENUM('Pending', 'Completed', 'Failed', 'Cancelled') DEFAULT 'Completed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 73. Chat Rooms (Individual & Dynamic Group Chats)
CREATE TABLE IF NOT EXISTS chat_rooms (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(255), -- NULL for individual chats
    type ENUM('Individual', 'Group', 'Broadcast', 'System') DEFAULT 'Individual',
    target_group_id CHAR(36), -- Link to Universal Targeting Engine
    created_by CHAR(36),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (target_group_id) REFERENCES groups(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 74. Chat Participants (For Individual/Static groups)
CREATE TABLE IF NOT EXISTS chat_participants (
    id CHAR(36) PRIMARY KEY,
    room_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    role ENUM('Admin', 'Member') DEFAULT 'Member',
    last_read_at TIMESTAMP,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(room_id, user_id)
) ENGINE=InnoDB;

-- 75. Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id CHAR(36) PRIMARY KEY,
    room_id CHAR(36) NOT NULL,
    sender_id CHAR(36) NOT NULL,
    content TEXT,
    message_type ENUM('Text', 'Image', 'File', 'Audio', 'Video', 'Location') DEFAULT 'Text',
    attachment_url VARCHAR(255), -- Link to Universal Document Vault
    is_broadcast BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 80. audit_logs (System-Wide Security Trail)
CREATE TABLE audit_logs (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NULL, -- Null if system-wide
    user_id CHAR(36) NULL,   -- Null if automated job
    action ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'SYSTEM') NOT NULL,
    table_name VARCHAR(255) NOT NULL,
    record_id VARCHAR(255) NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 81. agent_stations (Physical Kiosks/Locations)
CREATE TABLE agent_stations (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location_address TEXT NOT NULL,
    gps_coordinates VARCHAR(100), -- "lat,long"
    region VARCHAR(100),
    status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 82. agents (The Global Workforce)
CREATE TABLE agents (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL, -- Links to global user account
    station_id CHAR(36) NOT NULL,
    wallet_balance DECIMAL(15, 2) DEFAULT 0.00,
    commission_earned DECIMAL(15, 2) DEFAULT 0.00,
    status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (station_id) REFERENCES agent_stations(id) ON DELETE CASCADE
);

-- 83. agent_transactions (Proxy Payments & Delivery Commissions)
CREATE TABLE agent_transactions (
    id CHAR(36) PRIMARY KEY,
    agent_id CHAR(36) NOT NULL,
    transaction_type ENUM('ProxyPayment', 'DeliveryCommission', 'WalletTopUp', 'Withdrawal') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    commission_amount DECIMAL(15, 2) DEFAULT 0.00,
    reference_id CHAR(36) NULL, -- Could link to a FeeInvoice or DealOrder
    status ENUM('Completed', 'Pending', 'Failed', 'Reversed') DEFAULT 'Completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;

-- 76. Notification Policies (School-level Triggers)
CREATE TABLE IF NOT EXISTS notification_policies (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    event_type ENUM('Attendance', 'Purchase', 'Discipline', 'FeePayment', 'LibraryOverdue', 'Requisition', 'StaffAdvance', 'StaffRoster', 'Announcement') NOT NULL,
    trigger_condition VARCHAR(100), -- e.g. 'CheckIn', 'CheckOut', 'LowBalance'
    is_enabled BOOLEAN DEFAULT TRUE,
    default_channels JSON, -- e.g. ["App", "WhatsApp"]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    UNIQUE(school_id, event_type, trigger_condition)
) ENGINE=InnoDB;

-- 77. User Notification Preferences
CREATE TABLE IF NOT EXISTS user_notification_preferences (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL UNIQUE,
    channel_priority JSON, -- e.g. ["App", "WhatsApp", "SMS"]
    is_muted BOOLEAN DEFAULT FALSE,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 78. Notifications (Sent Alerts History)
CREATE TABLE IF NOT EXISTS notifications (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    channel_used ENUM('App', 'WhatsApp', 'SMS', 'Email') NOT NULL,
    status ENUM('Queued', 'Sent', 'Delivered', 'Read', 'Failed') DEFAULT 'Queued',
    reference_type VARCHAR(100), -- The source of the trigger
    reference_id CHAR(36),
    error_message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

