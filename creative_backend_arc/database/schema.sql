-- =====================================================
-- BabyeyiPro 2.1 - Original Schema + Dynamic Groups
-- ONLY essential changes added to support dynamic resolution
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Schools (The Tenants) - UNCHANGED
CREATE TABLE IF NOT EXISTS schools (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    organization_type ENUM('School', 'Corporate') DEFAULT 'School',
    code VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    motto VARCHAR(255),
    website VARCHAR(255),
    founded VARCHAR(50),
    address TEXT,
    logo_url VARCHAR(255),
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    subscription_tier ENUM('basic', 'pro', 'enterprise') DEFAULT 'basic',
    settings JSON,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Physical Blocks (Buildings / Wings)
CREATE TABLE IF NOT EXISTS blocks (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    description TEXT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    UNIQUE KEY unique_block_per_school (school_id, name)
) ENGINE=InnoDB;

-- 3. Physical Locations (Rooms within Blocks)
CREATE TABLE IF NOT EXISTS locations (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    block_id CHAR(36),
    name VARCHAR(255) NOT NULL,
    type ENUM('Classroom', 'Laboratory', 'Hall', 'Field', 'Office', 'Other') DEFAULT 'Classroom',
    capacity INT,
    description TEXT,
    is_virtual BOOLEAN DEFAULT FALSE,
    resolution_type VARCHAR(100) DEFAULT 'physical',
    resolution_config JSON,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE SET NULL,
    UNIQUE KEY unique_location_per_school (school_id, name)
) ENGINE=InnoDB;

-- 4. Academic Years & Terms - UNCHANGED
CREATE TABLE IF NOT EXISTS academic_years (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'inactive', 'archived') DEFAULT 'inactive',
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS terms (
    id CHAR(36) PRIMARY KEY,
    academic_year_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Term Phases (named date-range segments within a term for UI organization)
CREATE TABLE IF NOT EXISTS term_phases (
    id CHAR(36) PRIMARY KEY,
    term_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL COMMENT 'e.g. Orientation Week, Teaching Weeks, Examination Period',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    display_order INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Educational Levels & Grades - UNCHANGED
CREATE TABLE IF NOT EXISTS levels (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    display_order INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    UNIQUE KEY unique_level_per_school (school_id, name)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS grades (
    id CHAR(36) PRIMARY KEY,
    level_id CHAR(36) NOT NULL,
    grade_number INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE,
    UNIQUE KEY unique_grade_per_level (level_id, name)
) ENGINE=InnoDB;

-- 5. Combinations & Tracks - UNCHANGED
CREATE TABLE IF NOT EXISTS combinations (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    level_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE,
    UNIQUE KEY unique_comb_per_school (school_id, name)
) ENGINE=InnoDB;

-- 6. Academic Groups - UNCHANGED
CREATE TABLE IF NOT EXISTS academic_groups (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    academic_year_id CHAR(36) NOT NULL,
    grade_id CHAR(36) NOT NULL,
    combination_id CHAR(36),
    name VARCHAR(255),
    head_id CHAR(36),
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE CASCADE,
    FOREIGN KEY (combination_id) REFERENCES combinations(id) ON DELETE SET NULL,
    UNIQUE KEY unique_group (academic_year_id, grade_id, combination_id)
) ENGINE=InnoDB;

-- 7. Classes (The Streams/Teaching Units) - UNCHANGED
CREATE TABLE IF NOT EXISTS classes (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    academic_group_id CHAR(36) NOT NULL,
    stream VARCHAR(50),
    custom_name VARCHAR(255),
    location_id CHAR(36),
    capacity INT DEFAULT 40,
    class_teacher_id CHAR(36),
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_group_id) REFERENCES academic_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
    UNIQUE KEY unique_stream (academic_group_id, stream)
) ENGINE=InnoDB;

-- 8. Subjects - UNCHANGED
CREATE TABLE IF NOT EXISTS subjects (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    level_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    description TEXT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE,
    UNIQUE KEY unique_subject_per_level (level_id, name)
) ENGINE=InnoDB;

-- 9. School Calendar - CHANGED (routine_template_id FK removed - will add later)
CREATE TABLE IF NOT EXISTS school_calendar (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    date DATE NOT NULL,
    routine_template_id CHAR(36) NOT NULL,
    event_name VARCHAR(255),
    is_academic_day BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (routine_template_id) REFERENCES routine_templates(id) ON DELETE CASCADE,
    UNIQUE KEY unique_date_per_school (school_id, date)
) ENGINE=InnoDB;

-- 10. Permissions - UNCHANGED
CREATE TABLE IF NOT EXISTS permissions (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    module VARCHAR(50) NOT NULL,
    description TEXT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 11. Roles - UNCHANGED
CREATE TABLE IF NOT EXISTS roles (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_per_school (school_id, name)
) ENGINE=InnoDB;

-- 12. Role Permissions - UNCHANGED
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id CHAR(36) NOT NULL,
    permission_id CHAR(36) NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 13. Users - UNCHANGED
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36),
    role_id CHAR(36),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password VARCHAR(255) NOT NULL,
    last_login TIMESTAMP NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE SET NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 14. Organization Units - UNCHANGED
CREATE TABLE IF NOT EXISTS organization_units (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    parent_id CHAR(36),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'Department',
    description TEXT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES organization_units(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 15. Staff Assignments - UNCHANGED
CREATE TABLE IF NOT EXISTS staff_assignments (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    unit_id CHAR(36) NOT NULL,
    position_name VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES organization_units(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 16. Workflow Policies - UNCHANGED
CREATE TABLE IF NOT EXISTS workflow_policies (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    action_key VARCHAR(100) NOT NULL,
    trigger_role_id CHAR(36),
    approval_required BOOLEAN DEFAULT TRUE,
    approver_unit_id CHAR(36),
    approver_role_id CHAR(36),
    min_approvals INT DEFAULT 1,
    sequence_order INT DEFAULT 1,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (trigger_role_id) REFERENCES roles(id) ON DELETE SET NULL,
    FOREIGN KEY (approver_unit_id) REFERENCES organization_units(id) ON DELETE SET NULL,
    FOREIGN KEY (approver_role_id) REFERENCES roles(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 17. Routine Templates - UNCHANGED
CREATE TABLE IF NOT EXISTS routine_templates (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 18. Routine Time Slots - UNCHANGED
CREATE TABLE IF NOT EXISTS routine_time_slots (
    id CHAR(36) PRIMARY KEY,
    template_id CHAR(36) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES routine_templates(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 19. Routine Activities - CHANGED (added target fields, removed responsible_role_id)
CREATE TABLE IF NOT EXISTS routine_activities (
    id CHAR(36) PRIMARY KEY,
    slot_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    location_id CHAR(36),
    is_attendance_point BOOLEAN DEFAULT FALSE,
    attendance_method ENUM('mass', 'per_class', 'per_student') DEFAULT 'mass',
    -- CHANGED: replaced responsible_role_id with responsible_group_id
    responsible_group_id CHAR(36),
    description TEXT,
    is_multi_instance BOOLEAN DEFAULT FALSE,
    transport_route_id CHAR(36),
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (slot_id) REFERENCES routine_time_slots(id) ON DELETE CASCADE,
    FOREIGN KEY (responsible_group_id) REFERENCES groups(id) ON DELETE SET NULL,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
    FOREIGN KEY (transport_route_id) REFERENCES transport_routes(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 20. Activity Target Groups - UNCHANGED (but now groups can be dynamic)
CREATE TABLE IF NOT EXISTS routine_activity_target_groups (
    activity_id CHAR(36) NOT NULL,
    group_id CHAR(36) NOT NULL,
    PRIMARY KEY (activity_id, group_id),
    FOREIGN KEY (activity_id) REFERENCES routine_activities(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 21. Modular Groups - CHANGED (added dynamic resolution fields)
CREATE TABLE IF NOT EXISTS groups (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    parent_id CHAR(36),
    name VARCHAR(255) NOT NULL,
    type ENUM('System', 'Academic', 'Extracurricular', 'Administrative', 'Residential', 'Custom') DEFAULT 'Custom',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    -- NEW: Dynamic resolution fields
    resolution_type VARCHAR(50) DEFAULT 'static',
    -- Values: 'static', 'query', 'role_in_context', 'grade_students', 'combination_students', 'class_students', 'users_with_role'
    resolution_config JSON,
    cache_ttl INT DEFAULT 300,
    last_resolved_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES groups(id) ON DELETE SET NULL,
    INDEX idx_groups_resolution (school_id, resolution_type, is_active)
) ENGINE=InnoDB;

-- 22. Group Memberships - UNCHANGED
CREATE TABLE IF NOT EXISTS group_memberships (
    id CHAR(36) PRIMARY KEY,
    group_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    group_role_id CHAR(36),
    status ENUM('active', 'inactive', 'left') DEFAULT 'active',
    joined_at DATE,
    left_at DATE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_role_id) REFERENCES group_roles(id) ON DELETE SET NULL,
    INDEX idx_group_memberships_lookup (group_id, status, user_id)
) ENGINE=InnoDB;

-- 23. Group Roles - UNCHANGED
CREATE TABLE IF NOT EXISTS group_roles (
    id CHAR(36) PRIMARY KEY,
    group_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_per_group (group_id, name)
) ENGINE=InnoDB;

-- 24. Staff Metadata - UNCHANGED
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
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    UNIQUE KEY unique_staff_per_school (school_id, staff_number)
) ENGINE=InnoDB;

-- 25. Students - CHANGED (added user_id)
CREATE TABLE IF NOT EXISTS students (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    user_id CHAR(36) UNIQUE,
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
    transport_route_id CHAR(36),
    status ENUM('applicant', 'pending_approval', 'active', 'inactive', 'graduated', 'transferred', 'dropped') DEFAULT 'applicant',
    photo_url VARCHAR(255),
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (transport_route_id) REFERENCES transport_routes(id) ON DELETE SET NULL,
    UNIQUE KEY unique_student_per_school (school_id, student_id_number)
) ENGINE=InnoDB;

-- 26. Enrollments - UNCHANGED
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
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_enrollment (student_id, academic_year_id)
) ENGINE=InnoDB;

-- 27. Parents - UNCHANGED
CREATE TABLE IF NOT EXISTS parents (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    user_id CHAR(36),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    occupation VARCHAR(255),
    address TEXT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 28. Student-Parent Relationship - UNCHANGED
CREATE TABLE IF NOT EXISTS student_parents (
    student_id CHAR(36) NOT NULL,
    parent_id CHAR(36) NOT NULL,
    relationship VARCHAR(50) DEFAULT 'Parent',
    is_emergency_contact BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (student_id, parent_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 29. Admission Applications - UNCHANGED
CREATE TABLE IF NOT EXISTS admission_applications (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    academic_year_id CHAR(36),
    target_class_id CHAR(36),
    current_stage VARCHAR(100) DEFAULT 'Initial Application',
    status ENUM('Draft', 'Pending', 'In Progress', 'Approved', 'Rejected') DEFAULT 'Pending',
    application_data JSON,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 30. Admission Workflow Logs - UNCHANGED
CREATE TABLE IF NOT EXISTS admission_workflow_logs (
    id CHAR(36) PRIMARY KEY,
    application_id CHAR(36) NOT NULL,
    from_stage VARCHAR(100),
    to_stage VARCHAR(100),
    action VARCHAR(50),
    processed_by_user_id CHAR(36),
    notes TEXT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES admission_applications(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 31. Transport Routes - UNCHANGED
CREATE TABLE IF NOT EXISTS transport_routes (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    fee DECIMAL(15, 2) DEFAULT 0.00,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 32. Transport Vehicles - UNCHANGED
CREATE TABLE IF NOT EXISTS transport_vehicles (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    plate_number VARCHAR(50) NOT NULL UNIQUE,
    model VARCHAR(255),
    capacity INT,
    status ENUM('active', 'maintenance', 'retired') DEFAULT 'active',
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 33. Transport Assignments - UNCHANGED
CREATE TABLE IF NOT EXISTS transport_assignments (
    id CHAR(36) PRIMARY KEY,
    route_id CHAR(36) NOT NULL,
    vehicle_id CHAR(36) NOT NULL,
    driver_id CHAR(36),
    is_active BOOLEAN DEFAULT TRUE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES transport_routes(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES transport_vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 34. Timetables - UNCHANGED
CREATE TABLE IF NOT EXISTS timetables (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    academic_year_id CHAR(36) NOT NULL,
    term_id CHAR(36),
    name VARCHAR(255) NOT NULL,
    type ENUM('Academic', 'Extracurricular', 'Exam', 'Other') DEFAULT 'Academic',
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 35. Timetable Entries - CHANGED (group_id now points to dynamic groups)
CREATE TABLE IF NOT EXISTS timetable_entries (
    id CHAR(36) PRIMARY KEY,
    timetable_id CHAR(36) NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    slot_id CHAR(36) NOT NULL,
    staff_id CHAR(36),
    group_id CHAR(36),
    subject_id CHAR(36),
    location_id CHAR(36),
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (timetable_id) REFERENCES timetables(id) ON DELETE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES routine_time_slots(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 36. Attendance Sessions - NEW (using schedule paradigm)
CREATE TABLE IF NOT EXISTS attendance_sessions (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    reference_type ENUM('TimetableEntry', 'TransportRoute', 'RoutineActivity', 'General') NOT NULL,
    reference_id CHAR(36),
    date DATE NOT NULL,
    taken_by_staff_id CHAR(36),
    session_status ENUM('open', 'closed', 'cancelled') DEFAULT 'open',
    remarks TEXT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (taken_by_staff_id) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 37. Attendance Records - UNCHANGED
CREATE TABLE IF NOT EXISTS attendance_records (
    id CHAR(36) PRIMARY KEY,
    session_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    status ENUM('present', 'absent', 'late', 'excused') DEFAULT 'present',
    recording_method ENUM('manual', 'nfc', 'biometric', 'qr') DEFAULT 'manual',
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSON,
    FOREIGN KEY (session_id) REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 38. Attendance Authorizations - UNCHANGED
CREATE TABLE IF NOT EXISTS attendance_authorizations (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    reference_type ENUM('TimetableEntry', 'TransportRoute', 'RoutineActivity', 'General') NOT NULL,
    reference_id CHAR(36) NOT NULL,
    staff_id CHAR(36),
    role_id CHAR(36),
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 39. Leave Requests - UNCHANGED
CREATE TABLE IF NOT EXISTS leave_requests (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    leave_type ENUM('Sick', 'Medical', 'Personal', 'Emergency', 'Official', 'Other') DEFAULT 'Personal',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status ENUM('Pending', 'Approved', 'Rejected', 'Cancelled') DEFAULT 'Pending',
    approved_by_staff_id CHAR(36),
    approval_notes TEXT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by_staff_id) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 40. Discipline Policies - UNCHANGED
CREATE TABLE IF NOT EXISTS discipline_policies (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    reference_type ENUM('RoutineActivity', 'TimetableEntry', 'General') DEFAULT 'General',
    reference_id CHAR(36),
    violation_type ENUM('Absent', 'Late', 'Misconduct', 'Uniform', 'Other') NOT NULL,
    marks_to_deduct DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    is_automatic BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 41. Discipline Records - UNCHANGED
CREATE TABLE IF NOT EXISTS discipline_records (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    recorded_by_staff_id CHAR(36),
    points DECIMAL(5, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    reason TEXT,
    attendance_record_id CHAR(36),
    policy_id CHAR(36),
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by_staff_id) REFERENCES staff(id) ON DELETE SET NULL,
    FOREIGN KEY (attendance_record_id) REFERENCES attendance_records(id) ON DELETE SET NULL,
    FOREIGN KEY (policy_id) REFERENCES discipline_policies(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 42. Pay Grades - UNCHANGED
CREATE TABLE IF NOT EXISTS pay_grades (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    base_salary DECIMAL(15, 2) NOT NULL,
    description TEXT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 43. Salary Components - UNCHANGED
CREATE TABLE IF NOT EXISTS salary_components (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM('Allowance', 'Deduction') NOT NULL,
    calculation_type ENUM('Fixed', 'Percentage') DEFAULT 'Fixed',
    value DECIMAL(15, 2) NOT NULL,
    is_statutory BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 44. Staff Salary Configurations - UNCHANGED
CREATE TABLE IF NOT EXISTS staff_salary_configurations (
    id CHAR(36) PRIMARY KEY,
    staff_id CHAR(36) NOT NULL UNIQUE,
    pay_grade_id CHAR(36),
    custom_base_salary DECIMAL(15, 2),
    payment_method ENUM('Bank', 'Mobile Money', 'Cash', 'Cheque') DEFAULT 'Bank',
    bank_name VARCHAR(255),
    account_number VARCHAR(100),
    mobile_money_number VARCHAR(50),
    tax_id_number VARCHAR(100),
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    FOREIGN KEY (pay_grade_id) REFERENCES pay_grades(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 45. Staff Salary Component Mapping - UNCHANGED
CREATE TABLE IF NOT EXISTS staff_salary_component_mappings (
    staff_id CHAR(36) NOT NULL,
    component_id CHAR(36) NOT NULL,
    custom_value DECIMAL(15, 2),
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (staff_id, component_id),
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    FOREIGN KEY (component_id) REFERENCES salary_components(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 46. Payroll Runs - UNCHANGED
CREATE TABLE IF NOT EXISTS payroll_runs (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    payroll_month INT NOT NULL,
    payroll_year INT NOT NULL,
    status ENUM('Draft', 'Processing', 'Approved', 'Paid', 'Cancelled') DEFAULT 'Draft',
    processed_at TIMESTAMP,
    processed_by_user_id CHAR(36),
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 47. Payslips - UNCHANGED
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
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payroll_run_id) REFERENCES payroll_runs(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 48. Payslip Items - UNCHANGED
CREATE TABLE IF NOT EXISTS payslip_items (
    id CHAR(36) PRIMARY KEY,
    payslip_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM('Allowance', 'Deduction') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (payslip_id) REFERENCES payslips(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 49. Staff Contracts - UNCHANGED
CREATE TABLE IF NOT EXISTS staff_contracts (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    staff_id CHAR(36) NOT NULL,
    contract_type ENUM('Permanent', 'Fixed-Term', 'Contractor', 'Intern', 'Volunteer') DEFAULT 'Permanent',
    pay_frequency ENUM('Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Termly') DEFAULT 'Monthly',
    start_date DATE NOT NULL,
    end_date DATE,
    probation_end_date DATE,
    status ENUM('Draft', 'Active', 'Expired', 'Terminated', 'Resigned') DEFAULT 'Draft',
    terms_and_conditions TEXT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 50. Document Types - UNCHANGED
CREATE TABLE IF NOT EXISTS document_types (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category ENUM('Identity', 'Academic', 'Employment', 'Legal', 'Medical', 'Other') DEFAULT 'Other',
    is_required BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    UNIQUE KEY unique_doc_type (school_id, name)
) ENGINE=InnoDB;

-- 51. Documents - UNCHANGED
CREATE TABLE IF NOT EXISTS documents (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    document_type_id CHAR(36) NOT NULL,
    owner_type ENUM('Staff', 'Student', 'School', 'Parent', 'FeePayment', 'FeeInvoice') NOT NULL,
    owner_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    expiry_date DATE,
    status ENUM('Active', 'Expired', 'Revoked', 'Pending_Review') DEFAULT 'Active',
    metadata JSON,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (document_type_id) REFERENCES document_types(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 52. Fee Categories - UNCHANGED
CREATE TABLE IF NOT EXISTS fee_categories (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    UNIQUE KEY unique_fee_cat (school_id, name)
) ENGINE=InnoDB;

-- 53. Fee Structures - UNCHANGED
CREATE TABLE IF NOT EXISTS fee_structures (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    academic_year_id CHAR(36) NOT NULL,
    term_id CHAR(36),
    target_group_id CHAR(36),
    name VARCHAR(255) NOT NULL,
    total_amount DECIMAL(15, 2) DEFAULT 0.00,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE SET NULL,
    FOREIGN KEY (target_group_id) REFERENCES groups(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 54. Fee Structure Items - UNCHANGED
CREATE TABLE IF NOT EXISTS fee_structure_items (
    id CHAR(36) PRIMARY KEY,
    fee_structure_id CHAR(36) NOT NULL,
    fee_category_id CHAR(36) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    is_optional BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(id) ON DELETE CASCADE,
    FOREIGN KEY (fee_category_id) REFERENCES fee_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 55. Fee Invoices - UNCHANGED
CREATE TABLE IF NOT EXISTS fee_invoices (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    fee_structure_id CHAR(36),
    academic_year_id CHAR(36) NOT NULL,
    term_id CHAR(36),
    total_amount DECIMAL(15, 2) NOT NULL,
    paid_amount DECIMAL(15, 2) DEFAULT 0.00,
    due_date DATE,
    status ENUM('Unpaid', 'Partial', 'Paid', 'Void', 'Refunded') DEFAULT 'Unpaid',
    notes TEXT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(id) ON DELETE SET NULL,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 56. Fee Payments - UNCHANGED
CREATE TABLE IF NOT EXISTS fee_payments (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    invoice_id CHAR(36),
    student_id CHAR(36) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method ENUM('Bank', 'Mobile Money', 'Cash', 'Cheque', 'Scholarship', 'Waiver') NOT NULL,
    reference_number VARCHAR(255),
    collected_by_staff_id CHAR(36),
    remarks TEXT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (invoice_id) REFERENCES fee_invoices(id) ON DELETE SET NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (collected_by_staff_id) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 57. Advance Requests - UNCHANGED
CREATE TABLE IF NOT EXISTS advance_requests (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    staff_id CHAR(36) NOT NULL,
    contract_id CHAR(36) NOT NULL,
    amount_requested DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) DEFAULT 0.00,
    interest_amount DECIMAL(15, 2) DEFAULT 0.00,
    total_repayment_amount DECIMAL(15, 2) NOT NULL,
    repayment_months INT DEFAULT 1,
    monthly_installment_amount DECIMAL(15, 2) NOT NULL,
    purpose ENUM('Personal', 'SchoolFees', 'TichaDeals', 'Other') DEFAULT 'Personal',
    target_student_id CHAR(36),
    target_invoice_id CHAR(36),
    partner_id CHAR(36),
    reason TEXT,
    status ENUM('Pending', 'School_Approved', 'Partner_Approved', 'Disbursed', 'Rejected', 'Deducted', 'Fully_Paid') DEFAULT 'Pending',
    approved_by_staff_id CHAR(36),
    partner_reference VARCHAR(255),
    deleted_at TIMESTAMP NULL,
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

-- 58. Advance Installments - UNCHANGED
CREATE TABLE IF NOT EXISTS advance_installments (
    id CHAR(36) PRIMARY KEY,
    advance_id CHAR(36) NOT NULL,
    payroll_run_id CHAR(36),
    amount DECIMAL(15, 2) NOT NULL,
    status ENUM('Pending', 'Paid', 'Skipped') DEFAULT 'Pending',
    scheduled_date DATE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (advance_id) REFERENCES advance_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (payroll_run_id) REFERENCES payroll_runs(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 59. External Partners - UNCHANGED
CREATE TABLE IF NOT EXISTS partners (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('Fintech', 'Vendor', 'Insurance', 'Bank', 'Other') DEFAULT 'Vendor',
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    api_credentials JSON,
    status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 60. Deal Products - UNCHANGED
CREATE TABLE IF NOT EXISTS deal_products (
    id CHAR(36) PRIMARY KEY,
    partner_id CHAR(36) NULL,
    type ENUM('TichaDeal', 'ShuleKit', 'General') DEFAULT 'TichaDeal',
    bundle_contents JSON NULL,
    brand_name VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    specifications JSON,
    original_price DECIMAL(15, 2) NOT NULL,
    deal_price DECIMAL(15, 2) NOT NULL,
    stock_quantity INT DEFAULT -1,
    category VARCHAR(100),
    main_image_url VARCHAR(255),
    gallery_images JSON,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 61. Product Variants - UNCHANGED
CREATE TABLE IF NOT EXISTS deal_product_variants (
    id CHAR(36) PRIMARY KEY,
    product_id CHAR(36) NOT NULL,
    variant_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    additional_price DECIMAL(15, 2) DEFAULT 0.00,
    stock_quantity INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES deal_products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 62. School Deal Availability - UNCHANGED
CREATE TABLE IF NOT EXISTS school_deal_availability (
    school_id CHAR(36) NOT NULL,
    product_id CHAR(36) NOT NULL,
    PRIMARY KEY (school_id, product_id),
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES deal_products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 63. Deal Orders - UNCHANGED
CREATE TABLE IF NOT EXISTS deal_orders (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    buyer_user_id CHAR(36) NOT NULL,
    product_id CHAR(36) NOT NULL,
    quantity INT DEFAULT 1,
    total_amount DECIMAL(15, 2) NOT NULL,
    payment_mode ENUM('Immediate', 'Payroll_Deduction', 'Wallet', 'Proxy') DEFAULT 'Immediate',
    repayment_months INT DEFAULT 1,
    status ENUM('Pending', 'Approved', 'Dispatched', 'AtAgentStation', 'Delivered', 'Cancelled', 'Fully_Paid') DEFAULT 'Pending',
    delivery_method ENUM('AgentPickup', 'SchoolDelivery', 'HomeDelivery') DEFAULT 'AgentPickup',
    delivery_address TEXT,
    assigned_agent_id CHAR(36) NULL,
    partner_reference VARCHAR(255),
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES deal_products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 64. Deal Installments - UNCHANGED
CREATE TABLE IF NOT EXISTS deal_installments (
    id CHAR(36) PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    payroll_run_id CHAR(36),
    amount DECIMAL(15, 2) NOT NULL,
    status ENUM('Pending', 'Paid', 'Skipped') DEFAULT 'Pending',
    scheduled_date DATE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES deal_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (payroll_run_id) REFERENCES payroll_runs(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 65. Inventory Items - UNCHANGED
CREATE TABLE IF NOT EXISTS inventory_items (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category ENUM('Stationary', 'Kitchen', 'Cleaning', 'Medical', 'Maintenance', 'Other') DEFAULT 'Other',
    unit VARCHAR(50) NOT NULL,
    stock_quantity DECIMAL(15, 2) DEFAULT 0.00,
    reorder_level DECIMAL(15, 2) DEFAULT 0.00,
    unit_price DECIMAL(15, 2) DEFAULT 0.00,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 66. Inventory Transactions - UNCHANGED
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id CHAR(36) PRIMARY KEY,
    inventory_item_id CHAR(36) NOT NULL,
    type ENUM('In', 'Out', 'Adjustment') NOT NULL,
    quantity DECIMAL(15, 2) NOT NULL,
    staff_id CHAR(36),
    reason TEXT,
    reference_type ENUM('Purchase', 'Requisition', 'Adjustment', 'Loss') DEFAULT 'Requisition',
    reference_id CHAR(36),
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 67. Requisitions - UNCHANGED
CREATE TABLE IF NOT EXISTS requisitions (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    staff_id CHAR(36) NOT NULL,
    type ENUM('Material', 'Cash', 'Service') DEFAULT 'Material',
    title VARCHAR(255) NOT NULL,
    reason TEXT,
    total_estimated_cost DECIMAL(15, 2) DEFAULT 0.00,
    status ENUM('Draft', 'Pending_Approval', 'Approved_By_HOD', 'Approved_By_Admin', 'Disbursed', 'Rejected', 'Cancelled') DEFAULT 'Pending_Approval',
    current_workflow_step_id CHAR(36),
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 68. Requisition Items - UNCHANGED
CREATE TABLE IF NOT EXISTS requisition_items (
    id CHAR(36) PRIMARY KEY,
    requisition_id CHAR(36) NOT NULL,
    inventory_item_id CHAR(36),
    item_description VARCHAR(255),
    quantity_requested DECIMAL(15, 2) NOT NULL,
    quantity_approved DECIMAL(15, 2) DEFAULT 0.00,
    estimated_unit_cost DECIMAL(15, 2) DEFAULT 0.00,
    FOREIGN KEY (requisition_id) REFERENCES requisitions(id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 69. Expenses - UNCHANGED
CREATE TABLE IF NOT EXISTS expenses (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    requisition_id CHAR(36),
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    payment_method ENUM('Cash', 'Bank', 'Mobile Money', 'Cheque') DEFAULT 'Cash',
    paid_to VARCHAR(255),
    date_paid DATE NOT NULL,
    recorded_by_staff_id CHAR(36),
    notes TEXT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (requisition_id) REFERENCES requisitions(id) ON DELETE SET NULL,
    FOREIGN KEY (recorded_by_staff_id) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 70. Smart Cards - UNCHANGED
CREATE TABLE IF NOT EXISTS smart_cards (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    card_number VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('Active', 'Inactive', 'Lost', 'Blocked') DEFAULT 'Active',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at DATE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 71. Smart Card Readers - UNCHANGED
CREATE TABLE IF NOT EXISTS smart_card_readers (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    reader_serial VARCHAR(255) NOT NULL UNIQUE,
    location_name VARCHAR(255) NOT NULL,
    reader_type ENUM('Gate', 'Classroom', 'Bus', 'Library', 'Canteen', 'Generic') DEFAULT 'Generic',
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 72. Smart Card Logs - UNCHANGED
CREATE TABLE IF NOT EXISTS smart_card_logs (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    card_id CHAR(36) NOT NULL,
    reader_id CHAR(36) NOT NULL,
    tap_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action_type ENUM('CheckIn', 'CheckOut', 'Attendance', 'Payment', 'Verify') DEFAULT 'Attendance',
    metadata JSON,
    attendance_record_id CHAR(36),
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (card_id) REFERENCES smart_cards(id) ON DELETE CASCADE,
    FOREIGN KEY (reader_id) REFERENCES smart_card_readers(id) ON DELETE CASCADE,
    FOREIGN KEY (attendance_record_id) REFERENCES attendance_records(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 73. Library Books - UNCHANGED
CREATE TABLE IF NOT EXISTS library_books (
    id CHAR(36) PRIMARY KEY,
    inventory_item_id CHAR(36) NOT NULL,
    isbn VARCHAR(50),
    author VARCHAR(255),
    publisher VARCHAR(255),
    edition VARCHAR(50),
    shelf_location VARCHAR(100),
    status ENUM('Available', 'Borrowed', 'Lost', 'Damaged', 'Reserved') DEFAULT 'Available',
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 74. Library Loans - UNCHANGED
CREATE TABLE IF NOT EXISTS library_loans (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    book_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    smart_card_log_id CHAR(36),
    loan_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    status ENUM('Active', 'Returned', 'Overdue', 'Lost') DEFAULT 'Active',
    notes TEXT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES library_books(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (smart_card_log_id) REFERENCES smart_card_logs(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 75. Library Fines - UNCHANGED
CREATE TABLE IF NOT EXISTS library_fines (
    id CHAR(36) PRIMARY KEY,
    loan_id CHAR(36) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status ENUM('Unpaid', 'Paid', 'Waived') DEFAULT 'Unpaid',
    discipline_record_id CHAR(36),
    fee_invoice_id CHAR(36),
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (loan_id) REFERENCES library_loans(id) ON DELETE CASCADE,
    FOREIGN KEY (discipline_record_id) REFERENCES discipline_records(id) ON DELETE SET NULL,
    FOREIGN KEY (fee_invoice_id) REFERENCES fee_invoices(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 76. Wallets - UNCHANGED
CREATE TABLE IF NOT EXISTS wallets (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    owner_type ENUM('Student', 'Staff', 'Vendor', 'System') NOT NULL,
    owner_id CHAR(36) NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    status ENUM('Active', 'Frozen', 'Closed') DEFAULT 'Active',
    pin_hash VARCHAR(255),
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(owner_type, owner_id),
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 77. Wallet Transactions - UNCHANGED
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    wallet_id CHAR(36) NOT NULL,
    type ENUM('Credit', 'Debit') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    transaction_type ENUM('TopUp', 'Purchase', 'Withdrawal', 'Transfer', 'CashOut', 'Refund') NOT NULL,
    reference_type VARCHAR(100),
    reference_id CHAR(36),
    status ENUM('Pending', 'Completed', 'Failed', 'Cancelled') DEFAULT 'Completed',
    notes TEXT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 78. Chat Rooms - UNCHANGED
CREATE TABLE IF NOT EXISTS chat_rooms (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    name VARCHAR(255),
    type ENUM('Individual', 'Group', 'Broadcast', 'System') DEFAULT 'Individual',
    target_group_id CHAR(36),
    created_by CHAR(36),
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (target_group_id) REFERENCES groups(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 79. Chat Participants - UNCHANGED
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

-- 80. Chat Messages - UNCHANGED
CREATE TABLE IF NOT EXISTS chat_messages (
    id CHAR(36) PRIMARY KEY,
    room_id CHAR(36) NOT NULL,
    sender_id CHAR(36) NOT NULL,
    content TEXT,
    message_type ENUM('Text', 'Image', 'File', 'Audio', 'Video', 'Location') DEFAULT 'Text',
    attachment_url VARCHAR(255),
    is_broadcast BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 81. Audit Logs - UNCHANGED
-- (Moved to end of file to ensure all dependencies are met)

-- 82. Agent Stations - UNCHANGED
CREATE TABLE IF NOT EXISTS agent_stations (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location_address TEXT NOT NULL,
    gps_coordinates VARCHAR(100),
    region VARCHAR(100),
    status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 83. Agents - UNCHANGED
CREATE TABLE IF NOT EXISTS agents (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    station_id CHAR(36) NOT NULL,
    wallet_balance DECIMAL(15, 2) DEFAULT 0.00,
    commission_earned DECIMAL(15, 2) DEFAULT 0.00,
    status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (station_id) REFERENCES agent_stations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 84. Agent Transactions - UNCHANGED
CREATE TABLE IF NOT EXISTS agent_transactions (
    id CHAR(36) PRIMARY KEY,
    agent_id CHAR(36) NOT NULL,
    transaction_type ENUM('ProxyPayment', 'DeliveryCommission', 'WalletTopUp', 'Withdrawal') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    commission_amount DECIMAL(15, 2) DEFAULT 0.00,
    reference_id CHAR(36) NULL,
    status ENUM('Completed', 'Pending', 'Failed', 'Reversed') DEFAULT 'Completed',
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 85. Notification Policies - UNCHANGED
CREATE TABLE IF NOT EXISTS notification_policies (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    event_type ENUM('Attendance', 'Purchase', 'Discipline', 'FeePayment', 'LibraryOverdue', 'Requisition', 'StaffAdvance', 'StaffRoster', 'Announcement') NOT NULL,
    trigger_condition VARCHAR(100),
    is_enabled BOOLEAN DEFAULT TRUE,
    default_channels JSON,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    UNIQUE(school_id, event_type, trigger_condition)
) ENGINE=InnoDB;

-- 86. User Notification Preferences - UNCHANGED
CREATE TABLE IF NOT EXISTS user_notification_preferences (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL UNIQUE,
    channel_priority JSON,
    is_muted BOOLEAN DEFAULT FALSE,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 87. Notifications - UNCHANGED
CREATE TABLE IF NOT EXISTS notifications (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    channel_used ENUM('App', 'WhatsApp', 'SMS', 'Email') NOT NULL,
    status ENUM('Queued', 'Sent', 'Delivered', 'Read', 'Failed') DEFAULT 'Queued',
    reference_type VARCHAR(100),
    reference_id CHAR(36),
    error_message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- (Constraints and Indexes moved to table definitions)

SET FOREIGN_KEY_CHECKS = 1;


-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id CHAR(36) PRIMARY KEY,
    school_id CHAR(36),
    user_id CHAR(36),
    action ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'SYSTEM') NOT NULL,
    table_name VARCHAR(255) NOT NULL,
    record_id VARCHAR(255),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


