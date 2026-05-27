-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 27, 2026 at 08:23 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `babyeyipro2`
--

-- --------------------------------------------------------

--
-- Table structure for table `academic_groups`
--

CREATE TABLE `academic_groups` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `academic_year_id` char(36) NOT NULL,
  `grade_id` char(36) NOT NULL,
  `combination_id` char(36) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `head_id` char(36) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `academic_groups`
--

INSERT INTO `academic_groups` (`id`, `school_id`, `academic_year_id`, `grade_id`, `combination_id`, `name`, `head_id`, `deleted_at`, `created_at`) VALUES
('053806a5-fb47-44b1-9a3c-bc0e52f95744', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '50e74b49-d56d-4cf7-92df-696a9caadc48', 'dfa19284-4ba0-433f-8e48-7661535661fb', NULL, 'P2 2024-2025', NULL, NULL, '2026-05-13 16:10:05'),
('23f9994a-bafe-4ca0-8a33-2364ccb0fb4d', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '50e74b49-d56d-4cf7-92df-696a9caadc48', 'e2fdce88-03fb-4023-921d-0c63e8360b4b', NULL, 'P1 2024-2025', NULL, NULL, '2026-05-13 16:10:05'),
('6884743a-8708-4ece-a52b-f7bd0a800e4d', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '50e74b49-d56d-4cf7-92df-696a9caadc48', 'd58330b4-0f25-449a-927b-0b0d62ae3aaa', NULL, 'S1 2024-2025', NULL, NULL, '2026-05-13 16:10:05');

-- --------------------------------------------------------

--
-- Table structure for table `academic_years`
--

CREATE TABLE `academic_years` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('active','inactive','archived') DEFAULT 'inactive',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `academic_years`
--

INSERT INTO `academic_years` (`id`, `school_id`, `name`, `start_date`, `end_date`, `status`, `deleted_at`, `created_at`, `updated_at`) VALUES
('50e74b49-d56d-4cf7-92df-696a9caadc48', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '2024-2025', '2024-01-10', '2024-12-05', 'active', NULL, '2026-05-13 16:10:05', '2026-05-13 16:10:05');

-- --------------------------------------------------------

--
-- Table structure for table `admission_applications`
--

CREATE TABLE `admission_applications` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `student_id` char(36) NOT NULL,
  `academic_year_id` char(36) DEFAULT NULL,
  `target_class_id` char(36) DEFAULT NULL,
  `current_stage` varchar(100) DEFAULT 'Initial Application',
  `status` enum('Draft','Pending','In Progress','Approved','Rejected') DEFAULT 'Pending',
  `application_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`application_data`)),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admission_workflow_logs`
--

CREATE TABLE `admission_workflow_logs` (
  `id` char(36) NOT NULL,
  `application_id` char(36) NOT NULL,
  `from_stage` varchar(100) DEFAULT NULL,
  `to_stage` varchar(100) DEFAULT NULL,
  `action` varchar(50) DEFAULT NULL,
  `processed_by_user_id` char(36) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `advance_installments`
--

CREATE TABLE `advance_installments` (
  `id` char(36) NOT NULL,
  `advance_id` char(36) NOT NULL,
  `payroll_run_id` char(36) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` enum('Pending','Paid','Skipped') DEFAULT 'Pending',
  `scheduled_date` date DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `advance_requests`
--

CREATE TABLE `advance_requests` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `staff_id` char(36) NOT NULL,
  `contract_id` char(36) NOT NULL,
  `amount_requested` decimal(15,2) NOT NULL,
  `interest_rate` decimal(5,2) DEFAULT 0.00,
  `interest_amount` decimal(15,2) DEFAULT 0.00,
  `total_repayment_amount` decimal(15,2) NOT NULL,
  `repayment_months` int(11) DEFAULT 1,
  `monthly_installment_amount` decimal(15,2) NOT NULL,
  `purpose` enum('Personal','SchoolFees','TichaDeals','Other') DEFAULT 'Personal',
  `target_student_id` char(36) DEFAULT NULL,
  `target_invoice_id` char(36) DEFAULT NULL,
  `partner_id` char(36) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('Pending','School_Approved','Partner_Approved','Disbursed','Rejected','Deducted','Fully_Paid') DEFAULT 'Pending',
  `approved_by_staff_id` char(36) DEFAULT NULL,
  `partner_reference` varchar(255) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `agents`
--

CREATE TABLE `agents` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `station_id` char(36) NOT NULL,
  `wallet_balance` decimal(15,2) DEFAULT 0.00,
  `commission_earned` decimal(15,2) DEFAULT 0.00,
  `status` enum('Active','Inactive','Suspended') DEFAULT 'Active',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `agent_stations`
--

CREATE TABLE `agent_stations` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location_address` text NOT NULL,
  `gps_coordinates` varchar(100) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `status` enum('Active','Inactive','Suspended') DEFAULT 'Active',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `agent_transactions`
--

CREATE TABLE `agent_transactions` (
  `id` char(36) NOT NULL,
  `agent_id` char(36) NOT NULL,
  `transaction_type` enum('ProxyPayment','DeliveryCommission','WalletTopUp','Withdrawal') NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `commission_amount` decimal(15,2) DEFAULT 0.00,
  `reference_id` char(36) DEFAULT NULL,
  `status` enum('Completed','Pending','Failed','Reversed') DEFAULT 'Completed',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance_authorizations`
--

CREATE TABLE `attendance_authorizations` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `reference_type` enum('TimetableEntry','TransportRoute','RoutineActivity','General') NOT NULL,
  `reference_id` char(36) NOT NULL,
  `staff_id` char(36) DEFAULT NULL,
  `role_id` char(36) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance_records`
--

CREATE TABLE `attendance_records` (
  `id` char(36) NOT NULL,
  `session_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `status` enum('present','absent','late','excused') DEFAULT 'present',
  `recording_method` enum('manual','nfc','biometric','qr') DEFAULT 'manual',
  `recorded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance_sessions`
--

CREATE TABLE `attendance_sessions` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `reference_type` enum('TimetableEntry','TransportRoute','RoutineActivity','General') NOT NULL,
  `reference_id` char(36) DEFAULT NULL,
  `date` date NOT NULL,
  `taken_by_staff_id` char(36) DEFAULT NULL,
  `session_status` enum('open','closed','cancelled') DEFAULT 'open',
  `remarks` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` char(36) NOT NULL,
  `school_id` char(36) DEFAULT NULL,
  `user_id` char(36) DEFAULT NULL,
  `action` enum('CREATE','UPDATE','DELETE','LOGIN','SYSTEM') NOT NULL,
  `table_name` varchar(255) NOT NULL,
  `record_id` varchar(255) DEFAULT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `school_id`, `user_id`, `action`, `table_name`, `record_id`, `old_values`, `new_values`, `ip_address`, `deleted_at`, `created_at`) VALUES
('0347f2bc-2ae8-4347-bebf-f98e4d9cee13', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'academic_groups', '23f9994a-bafe-4ca0-8a33-2364ccb0fb4d', NULL, '{\"id\":\"23f9994a-bafe-4ca0-8a33-2364ccb0fb4d\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"academic_year_id\":\"50e74b49-d56d-4cf7-92df-696a9caadc48\",\"grade_id\":\"e2fdce88-03fb-4023-921d-0c63e8360b4b\",\"name\":\"P1 2024-2025\",\"createdAt\":\"2026-05-13T16:10:05.562Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('0865e4ad-a721-4a6c-a99e-b727ab7e9247', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'locations', '9cfda7ea-23b5-40eb-83a5-b941ab181df6', NULL, '{\"id\":\"9cfda7ea-23b5-40eb-83a5-b941ab181df6\",\"is_virtual\":false,\"resolution_type\":\"physical\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"block_id\":\"66225e84-d406-4e5e-82eb-2d902c7f310d\",\"name\":\"Physics Lab\",\"type\":\"Laboratory\",\"capacity\":30,\"updatedAt\":\"2026-05-13T16:10:05.226Z\",\"createdAt\":\"2026-05-13T16:10:05.226Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('094ba874-c0ff-458e-8658-e2f91ab17b67', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'locations', '7d308506-c37d-4af2-8263-3c0112448e7c', NULL, '{\"id\":\"7d308506-c37d-4af2-8263-3c0112448e7c\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"name\":\"Home Classroom\",\"type\":\"Classroom\",\"is_virtual\":true,\"resolution_type\":\"target_group_homeroom\",\"updatedAt\":\"2026-05-13T16:10:05.273Z\",\"createdAt\":\"2026-05-13T16:10:05.273Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('14691ee0-9a23-4c34-a35a-4ba2ce893ada', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'students', 'c14f6bee-b33b-455f-8009-db4b17ffd9ca', NULL, '{\"id\":\"c14f6bee-b33b-455f-8009-db4b17ffd9ca\",\"dismissal_mode\":\"Parent Pickup\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"full_name\":\"Fiona Umuhoza\",\"student_id_number\":\"REG-003\",\"dob\":\"2012-11-10\",\"gender\":\"Female\",\"status\":\"active\",\"nationality\":\"Rwandan\",\"updatedAt\":\"2026-05-19T12:27:43.804Z\",\"createdAt\":\"2026-05-19T12:27:43.804Z\"}', NULL, NULL, '2026-05-19 12:27:43'),
('16571dfc-a720-4d05-a609-721c80a8fe62', NULL, NULL, 'CREATE', 'grades', 'e2fdce88-03fb-4023-921d-0c63e8360b4b', NULL, '{\"id\":\"e2fdce88-03fb-4023-921d-0c63e8360b4b\",\"level_id\":\"ff495efe-f967-47c3-915a-7dcf73ee7013\",\"name\":\"P1\",\"grade_number\":1,\"code\":\"P1\",\"createdAt\":\"2026-05-13T16:10:05.482Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('1b1bd5d2-86bc-4052-bdb6-a394cac6656e', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'blocks', '66225e84-d406-4e5e-82eb-2d902c7f310d', NULL, '{\"id\":\"66225e84-d406-4e5e-82eb-2d902c7f310d\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"name\":\"Science Center\",\"code\":\"SCI\",\"description\":\"Laboratories & Research\",\"updatedAt\":\"2026-05-13T16:10:05.126Z\",\"createdAt\":\"2026-05-13T16:10:05.126Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('1e256cce-613c-43d3-8a98-e33babc51756', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '12f45286-9153-44c2-83b3-2e19af672dfd', 'UPDATE', 'students', '04b43109-9ed4-45c8-8e37-fcde82ee7391', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshutiisi\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":null,\"blood_group\":null,\"allergies\":null,\"admission_date\":\"0000-00-00\",\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:45:32.000Z\",\"deletedAt\":null}', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshutiisi\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":null,\"blood_group\":null,\"allergies\":null,\"admission_date\":\"Invalid date\",\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"Active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:46:55.227Z\",\"deletedAt\":null}', NULL, NULL, '2026-05-19 18:46:55'),
('1e3b60d5-d21d-4e9e-a0a4-ac2f6b583d8c', NULL, NULL, 'CREATE', 'routine_activities', 'af3dccca-a8ef-4940-b10f-f535988f0ba7', NULL, '{\"id\":\"af3dccca-a8ef-4940-b10f-f535988f0ba7\",\"attendance_method\":\"mass\",\"is_multi_instance\":false,\"slot_id\":\"26b2220a-6b11-4e2a-aca1-19f260bc5daf\",\"name\":\"Morning Assembly\",\"is_attendance_point\":true,\"responsible_group_id\":\"99bdeed8-dbea-4c93-b12c-c84da5f5c7bc\",\"location_id\":\"fcf84c57-9e2d-4fc1-b526-413e2af004ca\",\"createdAt\":\"2026-05-13T16:10:05.959Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('1f7afe97-ae54-42c8-bf5f-1648301a5814', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'students', '9603f74b-89a9-4660-9969-8721e3b997c2', NULL, '{\"id\":\"9603f74b-89a9-4660-9969-8721e3b997c2\",\"dismissal_mode\":\"Parent Pickup\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"full_name\":\"Kevine Irakoze\",\"student_id_number\":\"REG-001\",\"dob\":\"2018-05-15\",\"gender\":\"Female\",\"status\":\"active\",\"nationality\":\"Rwandan\",\"updatedAt\":\"2026-05-19T12:27:43.406Z\",\"createdAt\":\"2026-05-19T12:27:43.406Z\"}', NULL, NULL, '2026-05-19 12:27:43'),
('221aa424-86a8-4b82-a5e6-8f8d34d523e9', NULL, NULL, 'CREATE', 'terms', 'a84a2650-a4e8-4c5e-967e-c62a7d26cf94', NULL, '{\"id\":\"a84a2650-a4e8-4c5e-967e-c62a7d26cf94\",\"academic_year_id\":\"50e74b49-d56d-4cf7-92df-696a9caadc48\",\"name\":\"Term 3\",\"start_date\":\"2024-08-05\",\"end_date\":\"2024-12-05\",\"is_active\":false,\"updatedAt\":\"2026-05-13T16:10:05.380Z\",\"createdAt\":\"2026-05-13T16:10:05.380Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('289dfa07-384a-40db-ad09-3eb36b7e1383', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'academic_groups', '053806a5-fb47-44b1-9a3c-bc0e52f95744', NULL, '{\"id\":\"053806a5-fb47-44b1-9a3c-bc0e52f95744\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"academic_year_id\":\"50e74b49-d56d-4cf7-92df-696a9caadc48\",\"grade_id\":\"dfa19284-4ba0-433f-8e48-7661535661fb\",\"name\":\"P2 2024-2025\",\"createdAt\":\"2026-05-13T16:10:05.584Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('2951999d-fad5-4be2-9124-7f03b48b8665', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '12f45286-9153-44c2-83b3-2e19af672dfd', 'UPDATE', 'students', '04b43109-9ed4-45c8-8e37-fcde82ee7391', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshutiisi\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":\"\",\"blood_group\":\"N/A\",\"allergies\":\"\",\"admission_date\":\"0000-00-00\",\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:56:39.000Z\",\"deletedAt\":null}', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshutiisi\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":\"\",\"blood_group\":\"N/A\",\"allergies\":\"\",\"admission_date\":\"0000-00-00\",\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"Active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:58:39.941Z\",\"deletedAt\":null}', NULL, NULL, '2026-05-19 18:58:39'),
('2a589768-724d-4007-b425-568d45216d24', NULL, NULL, 'CREATE', 'routine_time_slots', 'b9dd1ac1-03c2-4fdf-908e-94f591a1d97b', NULL, '{\"id\":\"b9dd1ac1-03c2-4fdf-908e-94f591a1d97b\",\"template_id\":\"c4dc6e49-af26-4d4c-b683-bb24e942a40f\",\"start_time\":\"08:40:00\",\"end_time\":\"09:20:00\",\"duration_minutes\":40,\"createdAt\":\"2026-05-13T16:10:06.039Z\"}', NULL, NULL, '2026-05-13 16:10:06'),
('2bd8f4f0-1544-4b14-99ec-89556a249704', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '12f45286-9153-44c2-83b3-2e19af672dfd', 'UPDATE', 'students', '04b43109-9ed4-45c8-8e37-fcde82ee7391', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshutiisi\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":\"\",\"blood_group\":\"N/A\",\"allergies\":\"\",\"admission_date\":\"0000-00-00\",\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:58:39.000Z\",\"deletedAt\":null}', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshutiisi\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":\"\",\"blood_group\":\"N/A\",\"allergies\":\"\",\"admission_date\":\"0000-00-00\",\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"Active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T19:03:39.952Z\",\"deletedAt\":null}', NULL, NULL, '2026-05-19 19:03:39'),
('2e1f0bf1-6bf3-47f5-9f50-c3ba7bae1ca9', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'routine_templates', 'fe1aed75-5f38-4a6e-b0d5-f0b9eb9c0aa2', NULL, '{\"id\":\"fe1aed75-5f38-4a6e-b0d5-f0b9eb9c0aa2\",\"is_active\":true,\"name\":\"Staff Only / Training\",\"description\":\"Non-student day for staff development\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"updatedAt\":\"2026-05-13T16:10:05.767Z\",\"createdAt\":\"2026-05-13T16:10:05.767Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('2ef11eb5-2229-4d7c-b9ee-3632f2da225a', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'students', '6334fe6e-bc2e-40c3-b279-8bdb956b531e', NULL, '{\"id\":\"6334fe6e-bc2e-40c3-b279-8bdb956b531e\",\"dismissal_mode\":\"Parent Pickup\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"full_name\":\"Clairis Gasana\",\"student_id_number\":\"REG-004\",\"dob\":\"2017-02-28\",\"gender\":\"Female\",\"status\":\"active\",\"nationality\":\"Rwandan\",\"updatedAt\":\"2026-05-19T12:27:43.991Z\",\"createdAt\":\"2026-05-19T12:27:43.991Z\"}', NULL, NULL, '2026-05-19 12:27:43'),
('2f688c7f-4455-42b5-8a97-5c8564315f7d', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'organization_units', 'c4421261-be09-4c38-bd10-53eaf3b50b9a', NULL, '{\"id\":\"c4421261-be09-4c38-bd10-53eaf3b50b9a\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"name\":\"Administrative Department\",\"type\":\"Administrative\",\"updatedAt\":\"2026-05-19T13:16:22.868Z\",\"createdAt\":\"2026-05-19T13:16:22.868Z\"}', NULL, NULL, '2026-05-19 13:16:22'),
('30912eb2-da5d-4e99-80fb-cda1e3cb9d3b', NULL, NULL, 'CREATE', 'staff_assignments', 'a4444444-4444-4444-a444-444444444444', NULL, '{\"id\":\"a4444444-4444-4444-a444-444444444444\",\"user_id\":\"da7fd392-40c3-451b-b9a6-2820d24499b5\",\"unit_id\":\"4b983c9e-5e1f-4b6e-98ee-eda18fcf0f60\",\"position_name\":\"Teacher\",\"is_primary\":true,\"createdAt\":\"2026-05-19T16:31:05.305Z\"}', NULL, NULL, '2026-05-19 16:31:05'),
('329ea763-43e8-4306-b469-2fe441a32726', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'users', '12f45286-9153-44c2-83b3-2e19af672dfd', NULL, '{\"id\":\"12f45286-9153-44c2-83b3-2e19af672dfd\",\"name\":\"Super Admin\",\"email\":\"admin@babyeyi.local\",\"phone\":\"+250780000000\",\"password\":\"$2a$10$BpOhXYt7JSZxs3nTks1WtO8HVtiqiwhJwqbxk0kUUP1dfXO64Wsnm\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"role_id\":\"a10b2857-4a51-47ca-930f-465ca5d095a1\",\"status\":\"active\",\"updatedAt\":\"2026-05-13T16:10:04.439Z\",\"createdAt\":\"2026-05-13T16:10:04.439Z\"}', NULL, NULL, '2026-05-13 16:10:04'),
('33d7412b-cdf4-4aa3-b5a9-7aeb81a74294', NULL, NULL, 'CREATE', 'staff_assignments', 'a2222222-2222-4222-a222-222222222222', NULL, '{\"id\":\"a2222222-2222-4222-a222-222222222222\",\"user_id\":\"51d0b2d1-2264-4b14-9084-610e906e9efb\",\"unit_id\":\"c4421261-be09-4c38-bd10-53eaf3b50b9a\",\"position_name\":\"Administrator\",\"is_primary\":true,\"createdAt\":\"2026-05-19T16:31:05.272Z\"}', NULL, NULL, '2026-05-19 16:31:05'),
('357ba09e-404d-4fbb-8583-52bb97c23ba6', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'staff', '257a28e2-c741-4dfa-9eba-4bffa2c926c6', NULL, '{\"id\":\"257a28e2-c741-4dfa-9eba-4bffa2c926c6\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"user_id\":\"aa51113d-a6e2-4abd-8423-4124de35f5ed\",\"staff_number\":\"STAFF-002\",\"designation\":\"Registrar\",\"employment_type\":\"Full-time\",\"status\":\"active\",\"joining_date\":\"2025-01-01\",\"updatedAt\":\"2026-05-19T13:16:24.356Z\",\"createdAt\":\"2026-05-19T13:16:24.356Z\"}', NULL, NULL, '2026-05-19 13:16:24'),
('36864b17-508b-4708-bfe0-00f69f0d3b23', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'levels', '5ddfb1ae-422f-4362-943f-2627fd96e824', NULL, '{\"id\":\"5ddfb1ae-422f-4362-943f-2627fd96e824\",\"name\":\"O Level\",\"code\":\"OLE\",\"display_order\":2,\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"createdAt\":\"2026-05-13T16:10:05.423Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('392d4ed0-91b3-4d10-9b83-2a292b171be4', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'classes', '785bdf3a-128f-4e24-b08e-b35a9d2bdd9d', NULL, '{\"id\":\"785bdf3a-128f-4e24-b08e-b35a9d2bdd9d\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"academic_group_id\":\"23f9994a-bafe-4ca0-8a33-2364ccb0fb4d\",\"stream\":\"A\",\"custom_name\":\"P1 A\",\"capacity\":40,\"is_active\":true,\"updatedAt\":\"2026-05-19T12:21:44.776Z\",\"createdAt\":\"2026-05-19T12:21:44.776Z\"}', NULL, NULL, '2026-05-19 12:21:44'),
('3b0cc10e-7a29-4f1c-b8ed-5a386fe06826', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'enrollments', 'dca57bd9-47c4-48da-a9f9-88312314add4', NULL, '{\"id\":\"dca57bd9-47c4-48da-a9f9-88312314add4\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id\":\"9603f74b-89a9-4660-9969-8721e3b997c2\",\"class_id\":\"785bdf3a-128f-4e24-b08e-b35a9d2bdd9d\",\"academic_year_id\":\"50e74b49-d56d-4cf7-92df-696a9caadc48\",\"status\":\"Active\",\"promotion_status\":\"Pending\",\"promotion_decision\":\"Incomplete\",\"updatedAt\":\"2026-05-19T12:27:43.553Z\",\"createdAt\":\"2026-05-19T12:27:43.553Z\"}', NULL, NULL, '2026-05-19 12:27:43'),
('3bf2f3ba-a4dd-444f-b41c-92d6c7f51268', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'staff', 'e08ae54b-f83d-43ad-9ee6-f4856e28b3f5', NULL, '{\"id\":\"e08ae54b-f83d-43ad-9ee6-f4856e28b3f5\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"user_id\":\"da7fd392-40c3-451b-b9a6-2820d24499b5\",\"staff_number\":\"STAFF-003\",\"designation\":\"Teacher\",\"employment_type\":\"Contract\",\"status\":\"active\",\"joining_date\":\"2025-01-01\",\"updatedAt\":\"2026-05-19T13:16:24.998Z\",\"createdAt\":\"2026-05-19T13:16:24.998Z\"}', NULL, NULL, '2026-05-19 13:16:25'),
('3c4a8862-33d4-48d5-83ce-60d365d29d80', NULL, NULL, 'CREATE', 'schools', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, '{\"id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"name\":\"Babyeyi System\",\"organization_type\":\"School\",\"code\":\"BABYEYI-001\",\"email\":\"admin@babyeyi.local\",\"phone\":null,\"address\":\"Kigali, Rwanda\",\"logo_url\":null,\"status\":\"Active\",\"updatedAt\":\"2026-05-13T16:10:04.359Z\",\"createdAt\":\"2026-05-13T16:10:04.359Z\"}', NULL, NULL, '2026-05-13 16:10:04'),
('426f1f43-a63f-4571-ad70-992f91d1980b', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'routine_templates', 'c4dc6e49-af26-4d4c-b683-bb24e942a40f', NULL, '{\"id\":\"c4dc6e49-af26-4d4c-b683-bb24e942a40f\",\"is_active\":true,\"name\":\"Standard Full Day\",\"description\":\"Regular academic day with periods and breaks\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"updatedAt\":\"2026-05-13T16:10:05.706Z\",\"createdAt\":\"2026-05-13T16:10:05.706Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('4d64154e-9c93-48c3-ab18-0d78d9a9172c', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'organization_units', 'd49deec1-981e-4ff4-81c2-96ac348c7c26', NULL, '{\"id\":\"d49deec1-981e-4ff4-81c2-96ac348c7c26\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"name\":\"Operations Department\",\"type\":\"Operations\",\"updatedAt\":\"2026-05-19T13:16:23.034Z\",\"createdAt\":\"2026-05-19T13:16:23.034Z\"}', NULL, NULL, '2026-05-19 13:16:23'),
('4da09b04-f139-4127-8f1a-269afb2f1485', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'roles', '52641026-033f-41e3-bfbb-abe13c6503ac', NULL, '{\"id\":\"52641026-033f-41e3-bfbb-abe13c6503ac\",\"is_system\":false,\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"name\":\"Accountant\",\"description\":\"Financial operations manager\",\"updatedAt\":\"2026-05-19T13:16:22.523Z\",\"createdAt\":\"2026-05-19T13:16:22.523Z\"}', NULL, NULL, '2026-05-19 13:16:22'),
('52d199b0-ff02-4a51-8a9a-e8e8190f060e', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '12f45286-9153-44c2-83b3-2e19af672dfd', 'UPDATE', 'students', '04b43109-9ed4-45c8-8e37-fcde82ee7391', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshutiisi\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":\"\",\"blood_group\":\"N/A\",\"allergies\":\"\",\"admission_date\":\"0000-00-00\",\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:56:02.000Z\",\"deletedAt\":null}', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshutiisi\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":\"\",\"blood_group\":\"N/A\",\"allergies\":\"\",\"admission_date\":\"Invalid date\",\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"Active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:56:39.015Z\",\"deletedAt\":null}', NULL, NULL, '2026-05-19 18:56:39'),
('55a07bbc-f424-4480-ac30-17822c5cad63', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'users', '51d0b2d1-2264-4b14-9084-610e906e9efb', NULL, '{\"id\":\"51d0b2d1-2264-4b14-9084-610e906e9efb\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"name\":\"Alice Umutoni\",\"email\":\"alice@school.com\",\"password\":\"$2a$10$84ngt2sJJfNH1LMuJi8RtuYi6IUL.hsnsOagzKHgiYI.RSh5oEDay\",\"role_id\":\"82cb214f-cfb1-4f56-bdef-ce33064c0629\",\"status\":\"active\",\"updatedAt\":\"2026-05-19T13:16:25.060Z\",\"createdAt\":\"2026-05-19T13:16:25.060Z\"}', NULL, NULL, '2026-05-19 13:16:25'),
('5a573f4e-e4f0-464c-aea7-6d7507bf7c99', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'users', 'da7fd392-40c3-451b-b9a6-2820d24499b5', NULL, '{\"id\":\"da7fd392-40c3-451b-b9a6-2820d24499b5\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"name\":\"Eric Mutabazi\",\"email\":\"eric@school.com\",\"password\":\"$2a$10$.PWito6h0/Kf.dDYBci6hOl.1GDD6HYRt/H17WJ.VOgH.YmMrI.76\",\"role_id\":\"772aa8c1-4851-4803-90d5-926d78bd207c\",\"status\":\"active\",\"updatedAt\":\"2026-05-19T13:16:24.387Z\",\"createdAt\":\"2026-05-19T13:16:24.387Z\"}', NULL, NULL, '2026-05-19 13:16:24'),
('619c42ea-160f-496a-b672-919612ad0577', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'enrollments', 'c3cf7bcb-1f3c-4682-9c92-5e7fb0426555', NULL, '{\"id\":\"c3cf7bcb-1f3c-4682-9c92-5e7fb0426555\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"class_id\":\"91005b92-a002-4fd1-8b43-09f4909b05ac\",\"academic_year_id\":\"50e74b49-d56d-4cf7-92df-696a9caadc48\",\"status\":\"Active\",\"promotion_status\":\"Pending\",\"promotion_decision\":\"Incomplete\",\"updatedAt\":\"2026-05-19T12:27:43.745Z\",\"createdAt\":\"2026-05-19T12:27:43.745Z\"}', NULL, NULL, '2026-05-19 12:27:43'),
('6394261a-aa38-4b5b-958c-91dd86f9faca', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'enrollments', 'af7c6528-6284-4b70-9396-fd480fef87dd', NULL, '{\"id\":\"af7c6528-6284-4b70-9396-fd480fef87dd\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id\":\"c14f6bee-b33b-455f-8009-db4b17ffd9ca\",\"class_id\":\"91005b92-a002-4fd1-8b43-09f4909b05ac\",\"academic_year_id\":\"50e74b49-d56d-4cf7-92df-696a9caadc48\",\"status\":\"Active\",\"promotion_status\":\"Pending\",\"promotion_decision\":\"Incomplete\",\"updatedAt\":\"2026-05-19T12:27:43.968Z\",\"createdAt\":\"2026-05-19T12:27:43.968Z\"}', NULL, NULL, '2026-05-19 12:27:43'),
('64db3580-2f6e-4d05-be3a-e3729951b3f6', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'academic_groups', '6884743a-8708-4ece-a52b-f7bd0a800e4d', NULL, '{\"id\":\"6884743a-8708-4ece-a52b-f7bd0a800e4d\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"academic_year_id\":\"50e74b49-d56d-4cf7-92df-696a9caadc48\",\"grade_id\":\"d58330b4-0f25-449a-927b-0b0d62ae3aaa\",\"name\":\"S1 2024-2025\",\"createdAt\":\"2026-05-13T16:10:05.605Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('6551a18f-b412-4904-96fd-e898eea99f30', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '12f45286-9153-44c2-83b3-2e19af672dfd', 'UPDATE', 'students', '04b43109-9ed4-45c8-8e37-fcde82ee7391', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshutiisi\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":\"\",\"blood_group\":\"N/A\",\"allergies\":\"\",\"admission_date\":\"0000-00-00\",\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-20T06:19:36.000Z\",\"deletedAt\":null}', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshutiisi\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":\"\",\"blood_group\":\"AB-\",\"allergies\":\"\",\"admission_date\":\"0000-00-00\",\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"Active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-20T06:24:37.632Z\",\"deletedAt\":null}', NULL, NULL, '2026-05-20 06:24:37'),
('6d53d87f-6518-4d23-8a84-1829d74d849f', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'classes', '979ac4fb-4256-45ed-9abe-3e4a83d0689e', NULL, '{\"id\":\"979ac4fb-4256-45ed-9abe-3e4a83d0689e\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"academic_group_id\":\"23f9994a-bafe-4ca0-8a33-2364ccb0fb4d\",\"stream\":\"B\",\"custom_name\":\"P1 B\",\"capacity\":40,\"is_active\":true,\"updatedAt\":\"2026-05-19T12:21:44.963Z\",\"createdAt\":\"2026-05-19T12:21:44.963Z\"}', NULL, NULL, '2026-05-19 12:21:44'),
('79111f40-f6b4-473c-be84-2a47fb141c29', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'blocks', '59661b49-a201-4761-a92c-0a6222c3744b', NULL, '{\"id\":\"59661b49-a201-4761-a92c-0a6222c3744b\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"name\":\"Academic Block A\",\"code\":\"BLKA\",\"description\":\"Primary & O-Level Classrooms\",\"updatedAt\":\"2026-05-13T16:10:04.971Z\",\"createdAt\":\"2026-05-13T16:10:04.971Z\"}', NULL, NULL, '2026-05-13 16:10:04'),
('7d961941-c375-45ce-a006-043b9bc2c3d9', NULL, NULL, 'CREATE', 'routine_time_slots', '26b2220a-6b11-4e2a-aca1-19f260bc5daf', NULL, '{\"id\":\"26b2220a-6b11-4e2a-aca1-19f260bc5daf\",\"template_id\":\"c4dc6e49-af26-4d4c-b683-bb24e942a40f\",\"start_time\":\"07:30:00\",\"end_time\":\"08:00:00\",\"duration_minutes\":30,\"createdAt\":\"2026-05-13T16:10:05.932Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('7f6f57c9-5b1b-4486-a516-4cc4a881c37f', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'levels', 'ff495efe-f967-47c3-915a-7dcf73ee7013', NULL, '{\"id\":\"ff495efe-f967-47c3-915a-7dcf73ee7013\",\"name\":\"Primary\",\"code\":\"PRI\",\"display_order\":1,\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"createdAt\":\"2026-05-13T16:10:05.404Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('7f8e5d36-cb0b-4a04-a4de-13da675019d7', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '12f45286-9153-44c2-83b3-2e19af672dfd', 'UPDATE', 'students', '04b43109-9ed4-45c8-8e37-fcde82ee7391', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshutiisi\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":null,\"blood_group\":null,\"allergies\":null,\"admission_date\":\"0000-00-00\",\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:46:55.000Z\",\"deletedAt\":null}', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshutiisi\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":\"\",\"blood_group\":\"N/A\",\"allergies\":\"\",\"admission_date\":\"Invalid date\",\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"Active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:56:02.097Z\",\"deletedAt\":null}', NULL, NULL, '2026-05-19 18:56:02'),
('83ba8d6b-a27a-4949-be52-73c3b98de5a9', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'groups', 'c04b8ff9-1c87-4a34-b292-42c1f33d4e9a', NULL, '{\"id\":\"c04b8ff9-1c87-4a34-b292-42c1f33d4e9a\",\"is_active\":true,\"cache_ttl\":300,\"name\":\"All Teachers\",\"type\":\"System\",\"resolution_type\":\"users_with_role\",\"resolution_config\":{\"role\":\"Teacher\"},\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"updatedAt\":\"2026-05-13T16:10:05.625Z\",\"createdAt\":\"2026-05-13T16:10:05.625Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('86d1488a-a8c3-409b-9401-0a750a2a287e', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '12f45286-9153-44c2-83b3-2e19af672dfd', 'UPDATE', 'students', '04b43109-9ed4-45c8-8e37-fcde82ee7391', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshuti\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":null,\"blood_group\":null,\"allergies\":null,\"admission_date\":null,\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:20:57.000Z\",\"deletedAt\":null}', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshuti\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":null,\"blood_group\":null,\"allergies\":null,\"admission_date\":null,\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"Active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:23:46.140Z\",\"deletedAt\":null}', NULL, NULL, '2026-05-19 18:23:46'),
('87c9e81e-baa6-4479-897c-9e357946134b', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'locations', 'fcf84c57-9e2d-4fc1-b526-413e2af004ca', NULL, '{\"id\":\"fcf84c57-9e2d-4fc1-b526-413e2af004ca\",\"is_virtual\":false,\"resolution_type\":\"physical\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"name\":\"Refectory\",\"type\":\"Other\",\"capacity\":200,\"updatedAt\":\"2026-05-13T16:10:05.290Z\",\"createdAt\":\"2026-05-13T16:10:05.290Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('8883163c-a4e3-4cf7-b051-50fc33f85d49', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '12f45286-9153-44c2-83b3-2e19af672dfd', 'UPDATE', 'students', '04b43109-9ed4-45c8-8e37-fcde82ee7391', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshuti\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":null,\"blood_group\":null,\"allergies\":null,\"admission_date\":null,\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T12:27:43.000Z\",\"deletedAt\":null}', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshuti\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":null,\"blood_group\":null,\"allergies\":null,\"admission_date\":null,\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"Active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:08:54.540Z\",\"deletedAt\":null}', NULL, NULL, '2026-05-19 18:08:54'),
('888c768c-d207-4dc7-a3e6-c80779e643bf', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'roles', 'a10b2857-4a51-47ca-930f-465ca5d095a1', NULL, '{\"id\":\"a10b2857-4a51-47ca-930f-465ca5d095a1\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"name\":\"SchoolAdmin\",\"description\":\"Master administrator for the school\",\"is_system\":true,\"updatedAt\":\"2026-05-13T16:10:04.404Z\",\"createdAt\":\"2026-05-13T16:10:04.404Z\"}', NULL, NULL, '2026-05-13 16:10:04'),
('8d0264b1-1213-4927-9a94-8792bb1bc3f6', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '12f45286-9153-44c2-83b3-2e19af672dfd', 'UPDATE', 'students', '04b43109-9ed4-45c8-8e37-fcde82ee7391', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshuti\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":null,\"blood_group\":null,\"allergies\":null,\"admission_date\":null,\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:31:55.000Z\",\"deletedAt\":null}', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshutiisi\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":null,\"blood_group\":null,\"allergies\":null,\"admission_date\":\"Invalid date\",\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"Active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:45:32.719Z\",\"deletedAt\":null}', NULL, NULL, '2026-05-19 18:45:32'),
('8e001fb2-0d8f-4901-889e-5979d441c705', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'students', '04b43109-9ed4-45c8-8e37-fcde82ee7391', NULL, '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"dismissal_mode\":\"Parent Pickup\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"full_name\":\"Patrick Nshuti\",\"student_id_number\":\"REG-002\",\"dob\":\"2012-08-20\",\"gender\":\"Male\",\"status\":\"active\",\"nationality\":\"Rwandan\",\"updatedAt\":\"2026-05-19T12:27:43.584Z\",\"createdAt\":\"2026-05-19T12:27:43.584Z\"}', NULL, NULL, '2026-05-19 12:27:43'),
('912b709e-f71b-49fb-87a4-52c89e327752', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'roles', '772aa8c1-4851-4803-90d5-926d78bd207c', NULL, '{\"id\":\"772aa8c1-4851-4803-90d5-926d78bd207c\",\"is_system\":false,\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"name\":\"Teacher\",\"description\":\"Academic instructor / educator\",\"updatedAt\":\"2026-05-19T13:16:21.985Z\",\"createdAt\":\"2026-05-19T13:16:21.985Z\"}', NULL, NULL, '2026-05-19 13:16:22'),
('917f212d-74ac-481a-b1bf-ecca1983fc5b', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'locations', '38729eb2-8b26-47c5-92bb-2f061ba22d91', NULL, '{\"id\":\"38729eb2-8b26-47c5-92bb-2f061ba22d91\",\"is_virtual\":false,\"resolution_type\":\"physical\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"block_id\":\"66225e84-d406-4e5e-82eb-2d902c7f310d\",\"name\":\"Chemistry Lab\",\"type\":\"Laboratory\",\"capacity\":30,\"updatedAt\":\"2026-05-13T16:10:05.255Z\",\"createdAt\":\"2026-05-13T16:10:05.255Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('92c44648-6a24-4e74-8ab3-8fb21107206c', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '12f45286-9153-44c2-83b3-2e19af672dfd', 'UPDATE', 'students', '04b43109-9ed4-45c8-8e37-fcde82ee7391', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshutiisi\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":\"\",\"blood_group\":\"N/A\",\"allergies\":\"\",\"admission_date\":\"0000-00-00\",\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T19:03:39.000Z\",\"deletedAt\":null}', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshutiisi\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":\"\",\"blood_group\":\"N/A\",\"allergies\":\"\",\"admission_date\":\"0000-00-00\",\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"Active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T19:03:54.444Z\",\"deletedAt\":null}', NULL, NULL, '2026-05-19 19:03:54'),
('95d16df0-6310-422f-a9bd-6f64bcf9cf23', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '12f45286-9153-44c2-83b3-2e19af672dfd', 'UPDATE', 'students', '04b43109-9ed4-45c8-8e37-fcde82ee7391', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshuti\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":null,\"blood_group\":null,\"allergies\":null,\"admission_date\":null,\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:30:50.000Z\",\"deletedAt\":null}', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshuti\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":null,\"blood_group\":null,\"allergies\":null,\"admission_date\":null,\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"Active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:31:20.078Z\",\"deletedAt\":null}', NULL, NULL, '2026-05-19 18:31:20'),
('978d9702-0f56-45f3-b717-784d15964688', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'groups', 'a7af5c68-2b9f-4e74-a0a2-d791b8ba3fbf', NULL, '{\"id\":\"a7af5c68-2b9f-4e74-a0a2-d791b8ba3fbf\",\"is_active\":true,\"cache_ttl\":300,\"name\":\"P1 Students\",\"type\":\"Academic\",\"resolution_type\":\"grade_students\",\"resolution_config\":{\"grade_name\":\"P1\"},\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"updatedAt\":\"2026-05-13T16:10:05.666Z\",\"createdAt\":\"2026-05-13T16:10:05.666Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('999c9828-35df-4f31-bb9e-8bde5a2e22e9', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'staff', '819de07e-e9fc-4ca7-bde1-5d6876307af2', NULL, '{\"id\":\"819de07e-e9fc-4ca7-bde1-5d6876307af2\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"user_id\":\"0a4c9244-0136-4740-9569-70fe63c78cd1\",\"staff_number\":\"STAFF-001\",\"designation\":\"Teacher\",\"employment_type\":\"Full-time\",\"status\":\"active\",\"joining_date\":\"2025-01-01\",\"updatedAt\":\"2026-05-19T13:16:23.370Z\",\"createdAt\":\"2026-05-19T13:16:23.370Z\"}', NULL, NULL, '2026-05-19 13:16:23'),
('9c8c76bf-3bc3-426e-bbe3-9e7e24f0e5d9', NULL, NULL, 'CREATE', 'terms', 'cf06d45d-d283-406f-b58d-9ae60f28d6e7', NULL, '{\"id\":\"cf06d45d-d283-406f-b58d-9ae60f28d6e7\",\"academic_year_id\":\"50e74b49-d56d-4cf7-92df-696a9caadc48\",\"name\":\"Term 1\",\"start_date\":\"2024-01-10\",\"end_date\":\"2024-03-28\",\"is_active\":true,\"updatedAt\":\"2026-05-13T16:10:05.344Z\",\"createdAt\":\"2026-05-13T16:10:05.344Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('9ebd5ef4-1ac8-40b4-a6e2-3a073e28da5f', NULL, NULL, 'CREATE', 'routine_time_slots', '2509739f-41bd-44f5-8e91-28fcd92bafc5', NULL, '{\"id\":\"2509739f-41bd-44f5-8e91-28fcd92bafc5\",\"template_id\":\"c4dc6e49-af26-4d4c-b683-bb24e942a40f\",\"start_time\":\"08:00:00\",\"end_time\":\"08:40:00\",\"duration_minutes\":40,\"createdAt\":\"2026-05-13T16:10:05.980Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('a00ad557-36b6-43db-83fa-7d017672245e', NULL, NULL, 'CREATE', 'routine_activities', '81c616fd-81a4-43db-8fc6-0e47b02e20f8', NULL, '{\"id\":\"81c616fd-81a4-43db-8fc6-0e47b02e20f8\",\"attendance_method\":\"mass\",\"is_multi_instance\":false,\"slot_id\":\"2509739f-41bd-44f5-8e91-28fcd92bafc5\",\"name\":\"Period 1\",\"is_attendance_point\":true,\"responsible_group_id\":\"c04b8ff9-1c87-4a34-b292-42c1f33d4e9a\",\"location_id\":\"7d308506-c37d-4af2-8263-3c0112448e7c\",\"createdAt\":\"2026-05-13T16:10:06.022Z\"}', NULL, NULL, '2026-05-13 16:10:06'),
('a0bbfa51-dabe-4760-9765-deee61dfa41e', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'students', 'a5d599c1-fb21-4284-b514-414ac87880e3', NULL, '{\"id\":\"a5d599c1-fb21-4284-b514-414ac87880e3\",\"dismissal_mode\":\"Parent Pickup\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"full_name\":\"Divine Mutoni\",\"student_id_number\":\"REG-005\",\"dob\":\"2018-09-05\",\"gender\":\"Female\",\"status\":\"active\",\"nationality\":\"Rwandan\",\"updatedAt\":\"2026-05-19T12:27:44.192Z\",\"createdAt\":\"2026-05-19T12:27:44.192Z\"}', NULL, NULL, '2026-05-19 12:27:44'),
('a361b450-4f47-4c29-bfe5-0c47bf490669', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'locations', '7cbc0eda-e5ff-4651-b27f-5aa7825d012b', NULL, '{\"id\":\"7cbc0eda-e5ff-4651-b27f-5aa7825d012b\",\"is_virtual\":false,\"resolution_type\":\"physical\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"block_id\":\"59661b49-a201-4761-a92c-0a6222c3744b\",\"name\":\"Room A1\",\"type\":\"Classroom\",\"capacity\":45,\"updatedAt\":\"2026-05-13T16:10:05.156Z\",\"createdAt\":\"2026-05-13T16:10:05.156Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('aa1025a4-5894-4d60-9d7c-0b22f0595d10', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'classes', '91005b92-a002-4fd1-8b43-09f4909b05ac', NULL, '{\"id\":\"91005b92-a002-4fd1-8b43-09f4909b05ac\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"academic_group_id\":\"6884743a-8708-4ece-a52b-f7bd0a800e4d\",\"stream\":\"A\",\"custom_name\":\"S1 A\",\"capacity\":40,\"is_active\":true,\"updatedAt\":\"2026-05-19T12:21:45.248Z\",\"createdAt\":\"2026-05-19T12:21:45.248Z\"}', NULL, NULL, '2026-05-19 12:21:45'),
('ab9eeb33-c8aa-45f5-a003-2afc6ce1bcfd', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '12f45286-9153-44c2-83b3-2e19af672dfd', 'UPDATE', 'students', '04b43109-9ed4-45c8-8e37-fcde82ee7391', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshuti\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":null,\"blood_group\":null,\"allergies\":null,\"admission_date\":null,\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:15:17.000Z\",\"deletedAt\":null}', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshuti\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":null,\"blood_group\":null,\"allergies\":null,\"admission_date\":null,\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"Active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:20:57.064Z\",\"deletedAt\":null}', NULL, NULL, '2026-05-19 18:20:57'),
('ad216729-6844-4061-8d57-41fad4e1ddf4', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '12f45286-9153-44c2-83b3-2e19af672dfd', 'CREATE', 'groups', 'a06a2508-4f54-4fe6-b47a-f21f6b5d5979', NULL, '{\"id\":\"a06a2508-4f54-4fe6-b47a-f21f6b5d5979\",\"is_active\":true,\"resolution_type\":\"static\",\"cache_ttl\":300,\"name\":\"all students\",\"type\":\"Custom\",\"resolution_config\":{\"entity\":\"student\",\"rules\":[{\"label\":\"Active Students\",\"type\":\"status\",\"value\":\"active\"}],\"_display\":{\"entity\":\"student\",\"rulesCount\":1}},\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"updatedAt\":\"2026-05-19T12:54:37.108Z\",\"createdAt\":\"2026-05-19T12:54:37.108Z\"}', NULL, NULL, '2026-05-19 12:54:37'),
('ad5f932b-46ff-43de-8b84-d3b96c9092c3', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'roles', 'd9149a82-47e8-43a8-a777-1b0f9d338581', NULL, '{\"id\":\"d9149a82-47e8-43a8-a777-1b0f9d338581\",\"is_system\":false,\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"name\":\"Registrar\",\"description\":\"Student records officer\",\"updatedAt\":\"2026-05-19T13:16:22.486Z\",\"createdAt\":\"2026-05-19T13:16:22.486Z\"}', NULL, NULL, '2026-05-19 13:16:22'),
('b1d9fd52-038c-4209-8fc1-771a5a69b512', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '12f45286-9153-44c2-83b3-2e19af672dfd', 'CREATE', 'groups', '92a989bd-56bd-4766-911e-a8276c1f4403', NULL, '{\"id\":\"92a989bd-56bd-4766-911e-a8276c1f4403\",\"is_active\":true,\"resolution_type\":\"static\",\"cache_ttl\":300,\"name\":\"all staff\",\"type\":\"Custom\",\"resolution_config\":{\"entity\":\"staff\",\"rules\":[{\"label\":\"Active Staff\",\"type\":\"staff_status\",\"value\":\"active\"},{\"label\":\"By Department\",\"type\":\"units\",\"value\":\"c4421261-be09-4c38-bd10-53eaf3b50b9a\"},{\"label\":\"By Department\",\"type\":\"units\",\"value\":\"4b983c9e-5e1f-4b6e-98ee-eda18fcf0f60\"}],\"_display\":{\"entity\":\"staff\",\"rulesCount\":3}},\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"updatedAt\":\"2026-05-19T13:23:33.417Z\",\"createdAt\":\"2026-05-19T13:23:33.417Z\"}', NULL, NULL, '2026-05-19 13:23:33'),
('b2762711-786f-430b-a870-79c6c604581a', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'users', '0a4c9244-0136-4740-9569-70fe63c78cd1', NULL, '{\"id\":\"0a4c9244-0136-4740-9569-70fe63c78cd1\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"name\":\"Jean-Luc Ndayisenga\",\"email\":\"jeanluc@school.com\",\"password\":\"$2a$10$h2iKEuIb2k0AN2fLz4XOkudNr27I7FX8wKdMltxcf1YK/FszGGSqy\",\"role_id\":\"772aa8c1-4851-4803-90d5-926d78bd207c\",\"status\":\"active\",\"updatedAt\":\"2026-05-19T13:16:23.180Z\",\"createdAt\":\"2026-05-19T13:16:23.180Z\"}', NULL, NULL, '2026-05-19 13:16:23'),
('b295ba69-0480-4f89-bd58-106ca0068857', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'enrollments', '2eb72e17-2b83-4a3e-9f93-ac197bbe654e', NULL, '{\"id\":\"2eb72e17-2b83-4a3e-9f93-ac197bbe654e\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id\":\"a5d599c1-fb21-4284-b514-414ac87880e3\",\"class_id\":\"979ac4fb-4256-45ed-9abe-3e4a83d0689e\",\"academic_year_id\":\"50e74b49-d56d-4cf7-92df-696a9caadc48\",\"status\":\"Active\",\"promotion_status\":\"Pending\",\"promotion_decision\":\"Incomplete\",\"updatedAt\":\"2026-05-19T12:27:44.289Z\",\"createdAt\":\"2026-05-19T12:27:44.289Z\"}', NULL, NULL, '2026-05-19 12:27:44'),
('b2f7064b-d197-4820-b859-d85b6e10318c', NULL, NULL, 'CREATE', 'staff_assignments', 'a1111111-1111-4111-a111-111111111111', NULL, '{\"id\":\"a1111111-1111-4111-a111-111111111111\",\"user_id\":\"aa51113d-a6e2-4abd-8423-4124de35f5ed\",\"unit_id\":\"c4421261-be09-4c38-bd10-53eaf3b50b9a\",\"position_name\":\"Registrar\",\"is_primary\":true,\"createdAt\":\"2026-05-19T16:31:05.233Z\"}', NULL, NULL, '2026-05-19 16:31:05'),
('b55fe6e3-5ae9-4ca9-b7f0-e8ae15161534', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'classes', '7c3b0d15-72d9-4e3f-a4b0-c5659641fde2', NULL, '{\"id\":\"7c3b0d15-72d9-4e3f-a4b0-c5659641fde2\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"academic_group_id\":\"6884743a-8708-4ece-a52b-f7bd0a800e4d\",\"stream\":\"B\",\"custom_name\":\"S1 B\",\"capacity\":40,\"is_active\":true,\"updatedAt\":\"2026-05-19T12:21:45.481Z\",\"createdAt\":\"2026-05-19T12:21:45.481Z\"}', NULL, NULL, '2026-05-19 12:21:45'),
('b8fb0829-59ab-4b40-a909-43a0ecdbdbf2', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'enrollments', 'e8a6aaba-2f7d-4f90-ba0b-3d120a6a6009', NULL, '{\"id\":\"e8a6aaba-2f7d-4f90-ba0b-3d120a6a6009\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id\":\"6334fe6e-bc2e-40c3-b279-8bdb956b531e\",\"class_id\":\"781542d3-c628-4763-9c69-2ae5c28e32b9\",\"academic_year_id\":\"50e74b49-d56d-4cf7-92df-696a9caadc48\",\"status\":\"Active\",\"promotion_status\":\"Pending\",\"promotion_decision\":\"Incomplete\",\"updatedAt\":\"2026-05-19T12:27:44.017Z\",\"createdAt\":\"2026-05-19T12:27:44.017Z\"}', NULL, NULL, '2026-05-19 12:27:44'),
('b9aec573-9dbe-41d3-ab97-b9e808ae8cdc', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '12f45286-9153-44c2-83b3-2e19af672dfd', 'CREATE', 'parents', '9ed457ec-372a-44b9-a177-3852e7c1f069', NULL, '{\"id\":\"9ed457ec-372a-44b9-a177-3852e7c1f069\",\"full_name\":\"mukantabana\",\"phone\":\"0780332216\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"updatedAt\":\"2026-05-19T18:55:37.106Z\",\"createdAt\":\"2026-05-19T18:55:37.106Z\"}', NULL, NULL, '2026-05-19 18:55:37'),
('b9dc2035-c846-4388-84e1-037e6e955bad', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '12f45286-9153-44c2-83b3-2e19af672dfd', 'UPDATE', 'students', '04b43109-9ed4-45c8-8e37-fcde82ee7391', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshuti\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":null,\"blood_group\":null,\"allergies\":null,\"admission_date\":null,\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:23:46.000Z\",\"deletedAt\":null}', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshuti\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":null,\"blood_group\":null,\"allergies\":null,\"admission_date\":null,\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"Active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:30:50.093Z\",\"deletedAt\":null}', NULL, NULL, '2026-05-19 18:30:50'),
('bf8733a8-b898-4ed6-bafa-e97557943bc9', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'levels', '5ccc2e51-1379-4151-b461-06abd57fda92', NULL, '{\"id\":\"5ccc2e51-1379-4151-b461-06abd57fda92\",\"name\":\"A Level\",\"code\":\"ALE\",\"display_order\":3,\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"createdAt\":\"2026-05-13T16:10:05.461Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('c26e9f6d-d278-4a4f-b648-dcc1da59eb47', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'routine_templates', '1f5828cb-6f96-4d1d-b06c-ff4264e9603b', NULL, '{\"id\":\"1f5828cb-6f96-4d1d-b06c-ff4264e9603b\",\"is_active\":true,\"name\":\"Examination Mode\",\"description\":\"Strict timing for exams with no breaks\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"updatedAt\":\"2026-05-13T16:10:05.750Z\",\"createdAt\":\"2026-05-13T16:10:05.750Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('c33434bd-271c-40ae-9fd2-64e609727166', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'roles', '82cb214f-cfb1-4f56-bdef-ce33064c0629', NULL, '{\"id\":\"82cb214f-cfb1-4f56-bdef-ce33064c0629\",\"is_system\":false,\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"name\":\"Administrator\",\"description\":\"System administrator / manager\",\"updatedAt\":\"2026-05-19T13:16:22.297Z\",\"createdAt\":\"2026-05-19T13:16:22.297Z\"}', NULL, NULL, '2026-05-19 13:16:22'),
('c3b1939e-5168-4610-ae42-df0f9d46a7de', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'academic_years', '50e74b49-d56d-4cf7-92df-696a9caadc48', NULL, '{\"id\":\"50e74b49-d56d-4cf7-92df-696a9caadc48\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"name\":\"2024-2025\",\"start_date\":\"2024-01-10\",\"end_date\":\"2024-12-05\",\"status\":\"active\",\"updatedAt\":\"2026-05-13T16:10:05.317Z\",\"createdAt\":\"2026-05-13T16:10:05.317Z\"}', NULL, NULL, '2026-05-13 16:10:05');
INSERT INTO `audit_logs` (`id`, `school_id`, `user_id`, `action`, `table_name`, `record_id`, `old_values`, `new_values`, `ip_address`, `deleted_at`, `created_at`) VALUES
('ca0ed21c-baac-43ea-93a3-ea0108068941', NULL, NULL, 'CREATE', 'grades', 'd58330b4-0f25-449a-927b-0b0d62ae3aaa', NULL, '{\"id\":\"d58330b4-0f25-449a-927b-0b0d62ae3aaa\",\"level_id\":\"5ddfb1ae-422f-4362-943f-2627fd96e824\",\"name\":\"S1\",\"grade_number\":7,\"code\":\"S1\",\"createdAt\":\"2026-05-13T16:10:05.533Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('d2826daa-46ad-40ce-8a0c-900a11294b13', NULL, NULL, 'CREATE', 'terms', '77d8a6c4-0673-41e3-995a-053e3c4e1bf1', NULL, '{\"id\":\"77d8a6c4-0673-41e3-995a-053e3c4e1bf1\",\"academic_year_id\":\"50e74b49-d56d-4cf7-92df-696a9caadc48\",\"name\":\"Term 2\",\"start_date\":\"2024-04-08\",\"end_date\":\"2024-07-25\",\"is_active\":false,\"updatedAt\":\"2026-05-13T16:10:05.364Z\",\"createdAt\":\"2026-05-13T16:10:05.364Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('d34b0d2c-f8b4-4268-a5cf-a0585bd4e03a', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'organization_units', '4b983c9e-5e1f-4b6e-98ee-eda18fcf0f60', NULL, '{\"id\":\"4b983c9e-5e1f-4b6e-98ee-eda18fcf0f60\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"name\":\"Academic Department\",\"type\":\"Academic\",\"updatedAt\":\"2026-05-19T13:16:22.693Z\",\"createdAt\":\"2026-05-19T13:16:22.693Z\"}', NULL, NULL, '2026-05-19 13:16:22'),
('d3caa288-1e40-42d1-9925-46dbf9318b28', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'groups', 'f5d9bd32-b609-4167-9604-d2544b3eabf1', NULL, '{\"id\":\"f5d9bd32-b609-4167-9604-d2544b3eabf1\",\"is_active\":true,\"cache_ttl\":300,\"name\":\"Football Club\",\"type\":\"Extracurricular\",\"resolution_type\":\"static\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"updatedAt\":\"2026-05-13T16:10:05.685Z\",\"createdAt\":\"2026-05-13T16:10:05.685Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('d6f88054-e603-4423-b371-73583a912f18', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '12f45286-9153-44c2-83b3-2e19af672dfd', 'UPDATE', 'students', '04b43109-9ed4-45c8-8e37-fcde82ee7391', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshuti\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":null,\"blood_group\":null,\"allergies\":null,\"admission_date\":null,\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:08:54.000Z\",\"deletedAt\":null}', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshuti\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":null,\"blood_group\":null,\"allergies\":null,\"admission_date\":null,\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"Active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:15:17.888Z\",\"deletedAt\":null}', NULL, NULL, '2026-05-19 18:15:17'),
('e0e32f7c-d126-4f6e-8b33-101c9b33d9a3', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'groups', '99bdeed8-dbea-4c93-b12c-c84da5f5c7bc', NULL, '{\"id\":\"99bdeed8-dbea-4c93-b12c-c84da5f5c7bc\",\"is_active\":true,\"cache_ttl\":300,\"name\":\"Principal Office\",\"type\":\"Administrative\",\"resolution_type\":\"users_with_role\",\"resolution_config\":{\"role\":\"Principal\"},\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"updatedAt\":\"2026-05-13T16:10:05.644Z\",\"createdAt\":\"2026-05-13T16:10:05.644Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('e4bb0544-9511-4be0-b6e0-8fca41d91fb1', NULL, NULL, 'CREATE', 'staff_assignments', 'a3333333-3333-4333-a333-333333333333', NULL, '{\"id\":\"a3333333-3333-4333-a333-333333333333\",\"user_id\":\"0a4c9244-0136-4740-9569-70fe63c78cd1\",\"unit_id\":\"4b983c9e-5e1f-4b6e-98ee-eda18fcf0f60\",\"position_name\":\"Teacher\",\"is_primary\":true,\"createdAt\":\"2026-05-19T16:31:05.289Z\"}', NULL, NULL, '2026-05-19 16:31:05'),
('eb41b4b1-08bd-45f7-8dab-76378eb0092a', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '12f45286-9153-44c2-83b3-2e19af672dfd', 'UPDATE', 'students', '04b43109-9ed4-45c8-8e37-fcde82ee7391', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshutiisi\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":\"\",\"blood_group\":\"N/A\",\"allergies\":\"\",\"admission_date\":\"0000-00-00\",\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T19:03:54.000Z\",\"deletedAt\":null}', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshutiisi\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":\"\",\"blood_group\":\"N/A\",\"allergies\":\"\",\"admission_date\":\"0000-00-00\",\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"Active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-20T06:19:36.586Z\",\"deletedAt\":null}', NULL, NULL, '2026-05-20 06:19:36'),
('eb77f617-5d1c-4309-a1ac-6eb3d0b25e52', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'locations', '905376d5-7b45-4661-a721-b38a5c7535b4', NULL, '{\"id\":\"905376d5-7b45-4661-a721-b38a5c7535b4\",\"is_virtual\":false,\"resolution_type\":\"physical\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"block_id\":\"59661b49-a201-4761-a92c-0a6222c3744b\",\"name\":\"Room A2\",\"type\":\"Classroom\",\"capacity\":45,\"updatedAt\":\"2026-05-13T16:10:05.188Z\",\"createdAt\":\"2026-05-13T16:10:05.188Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('edcbca6e-bc07-48e3-887f-af10093e0322', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '12f45286-9153-44c2-83b3-2e19af672dfd', 'UPDATE', 'students', '04b43109-9ed4-45c8-8e37-fcde82ee7391', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshuti\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":null,\"blood_group\":null,\"allergies\":null,\"admission_date\":null,\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:31:20.000Z\",\"deletedAt\":null}', '{\"id\":\"04b43109-9ed4-45c8-8e37-fcde82ee7391\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"student_id_number\":\"REG-002\",\"full_name\":\"Patrick Nshuti\",\"gender\":\"Male\",\"dob\":\"2012-08-20\",\"nationality\":\"Rwandan\",\"residence\":null,\"blood_group\":null,\"allergies\":null,\"admission_date\":null,\"dismissal_mode\":\"Parent Pickup\",\"transport_route_id\":null,\"status\":\"Active\",\"photo_url\":null,\"createdAt\":\"2026-05-19T12:27:43.000Z\",\"updatedAt\":\"2026-05-19T18:31:55.276Z\",\"deletedAt\":null}', NULL, NULL, '2026-05-19 18:31:55'),
('ee809e58-0421-4828-8f4c-10c82a7abdb9', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '12f45286-9153-44c2-83b3-2e19af672dfd', 'CREATE', 'locations', 'e1c39f30-1965-4d3f-bb15-a003b66b0953', NULL, '{\"id\":\"e1c39f30-1965-4d3f-bb15-a003b66b0953\",\"is_virtual\":false,\"resolution_type\":\"physical\",\"name\":\"basket ball field\",\"type\":\"Sport Ground\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"updatedAt\":\"2026-05-19T08:48:39.325Z\",\"createdAt\":\"2026-05-19T08:48:39.325Z\"}', NULL, NULL, '2026-05-19 08:48:39'),
('f165085d-3fe3-4697-807f-ab59ba4c59d8', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'classes', '781542d3-c628-4763-9c69-2ae5c28e32b9', NULL, '{\"id\":\"781542d3-c628-4763-9c69-2ae5c28e32b9\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"academic_group_id\":\"053806a5-fb47-44b1-9a3c-bc0e52f95744\",\"stream\":\"A\",\"custom_name\":\"P2 A\",\"capacity\":40,\"is_active\":true,\"updatedAt\":\"2026-05-19T12:21:45.001Z\",\"createdAt\":\"2026-05-19T12:21:45.001Z\"}', NULL, NULL, '2026-05-19 12:21:45'),
('f209c9c9-bc7d-45b2-85d1-19799b974549', NULL, NULL, 'CREATE', 'grades', 'dfa19284-4ba0-433f-8e48-7661535661fb', NULL, '{\"id\":\"dfa19284-4ba0-433f-8e48-7661535661fb\",\"level_id\":\"ff495efe-f967-47c3-915a-7dcf73ee7013\",\"name\":\"P2\",\"grade_number\":2,\"code\":\"P2\",\"createdAt\":\"2026-05-13T16:10:05.505Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('f53817e5-adb3-4c24-b56c-a47ff3ea0dd8', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'staff', '53fe5560-fa8b-48c5-90e0-1a86e31f2edd', NULL, '{\"id\":\"53fe5560-fa8b-48c5-90e0-1a86e31f2edd\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"user_id\":\"51d0b2d1-2264-4b14-9084-610e906e9efb\",\"staff_number\":\"STAFF-004\",\"designation\":\"Administrator\",\"employment_type\":\"Full-time\",\"status\":\"active\",\"joining_date\":\"2025-01-01\",\"updatedAt\":\"2026-05-19T13:16:25.337Z\",\"createdAt\":\"2026-05-19T13:16:25.337Z\"}', NULL, NULL, '2026-05-19 13:16:25'),
('f6f13820-4e09-412c-ad83-7600269bb0b4', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'routine_templates', '0619019f-7f3e-4c4b-845b-f97f1b1fb5dc', NULL, '{\"id\":\"0619019f-7f3e-4c4b-845b-f97f1b1fb5dc\",\"is_active\":true,\"name\":\"Half Day (Friday)\",\"description\":\"Shortened day for Friday prayers/activities\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"updatedAt\":\"2026-05-13T16:10:05.723Z\",\"createdAt\":\"2026-05-13T16:10:05.723Z\"}', NULL, NULL, '2026-05-13 16:10:05'),
('fa455211-6b54-4b30-bbdd-0d5b02ba4c45', NULL, NULL, 'CREATE', 'routine_activities', 'df72c451-16b4-432e-9359-ec635873fce7', NULL, '{\"id\":\"df72c451-16b4-432e-9359-ec635873fce7\",\"attendance_method\":\"mass\",\"is_multi_instance\":false,\"slot_id\":\"b9dd1ac1-03c2-4fdf-908e-94f591a1d97b\",\"name\":\"Period 2\",\"is_attendance_point\":true,\"responsible_group_id\":\"c04b8ff9-1c87-4a34-b292-42c1f33d4e9a\",\"location_id\":\"7d308506-c37d-4af2-8263-3c0112448e7c\",\"createdAt\":\"2026-05-13T16:10:06.061Z\"}', NULL, NULL, '2026-05-13 16:10:06'),
('ff132109-7400-46f2-9837-af611c9cc545', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'CREATE', 'users', 'aa51113d-a6e2-4abd-8423-4124de35f5ed', NULL, '{\"id\":\"aa51113d-a6e2-4abd-8423-4124de35f5ed\",\"school_id\":\"a84ebdb0-e6a9-45d9-93f5-25e436d37255\",\"name\":\"Marie-Claire Uwineza\",\"email\":\"marieclaire@school.com\",\"password\":\"$2a$10$OCuSMQhqHA.drEOu7AVW3eHmJMtf6LqOKScRhGgJC7E.LPVYMK3a2\",\"role_id\":\"d9149a82-47e8-43a8-a777-1b0f9d338581\",\"status\":\"active\",\"updatedAt\":\"2026-05-19T13:16:23.711Z\",\"createdAt\":\"2026-05-19T13:16:23.711Z\"}', NULL, NULL, '2026-05-19 13:16:24');

-- --------------------------------------------------------

--
-- Table structure for table `blocks`
--

CREATE TABLE `blocks` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blocks`
--

INSERT INTO `blocks` (`id`, `school_id`, `name`, `code`, `description`, `deleted_at`, `created_at`, `updated_at`) VALUES
('59661b49-a201-4761-a92c-0a6222c3744b', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'Academic Block A', 'BLKA', 'Primary & O-Level Classrooms', NULL, '2026-05-13 16:10:04', '2026-05-13 16:10:04'),
('66225e84-d406-4e5e-82eb-2d902c7f310d', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'Science Center', 'SCI', 'Laboratories & Research', NULL, '2026-05-13 16:10:05', '2026-05-13 16:10:05');

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` char(36) NOT NULL,
  `room_id` char(36) NOT NULL,
  `sender_id` char(36) NOT NULL,
  `content` text DEFAULT NULL,
  `message_type` enum('Text','Image','File','Audio','Video','Location') DEFAULT 'Text',
  `attachment_url` varchar(255) DEFAULT NULL,
  `is_broadcast` tinyint(1) DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_participants`
--

CREATE TABLE `chat_participants` (
  `id` char(36) NOT NULL,
  `room_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `role` enum('Admin','Member') DEFAULT 'Member',
  `last_read_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_rooms`
--

CREATE TABLE `chat_rooms` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `type` enum('Individual','Group','Broadcast','System') DEFAULT 'Individual',
  `target_group_id` char(36) DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `academic_group_id` char(36) NOT NULL,
  `stream` varchar(50) DEFAULT NULL,
  `custom_name` varchar(255) DEFAULT NULL,
  `location_id` char(36) DEFAULT NULL,
  `capacity` int(11) DEFAULT 40,
  `class_teacher_id` char(36) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id`, `school_id`, `academic_group_id`, `stream`, `custom_name`, `location_id`, `capacity`, `class_teacher_id`, `is_active`, `deleted_at`, `created_at`, `updated_at`) VALUES
('781542d3-c628-4763-9c69-2ae5c28e32b9', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '053806a5-fb47-44b1-9a3c-bc0e52f95744', 'A', 'P2 A', NULL, 40, NULL, 1, NULL, '2026-05-19 12:21:45', '2026-05-19 12:21:45'),
('785bdf3a-128f-4e24-b08e-b35a9d2bdd9d', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '23f9994a-bafe-4ca0-8a33-2364ccb0fb4d', 'A', 'P1 A', NULL, 40, NULL, 1, NULL, '2026-05-19 12:21:44', '2026-05-19 12:21:44'),
('7c3b0d15-72d9-4e3f-a4b0-c5659641fde2', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '6884743a-8708-4ece-a52b-f7bd0a800e4d', 'B', 'S1 B', NULL, 40, NULL, 1, NULL, '2026-05-19 12:21:45', '2026-05-19 12:21:45'),
('91005b92-a002-4fd1-8b43-09f4909b05ac', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '6884743a-8708-4ece-a52b-f7bd0a800e4d', 'A', 'S1 A', NULL, 40, NULL, 1, NULL, '2026-05-19 12:21:45', '2026-05-19 12:21:45'),
('979ac4fb-4256-45ed-9abe-3e4a83d0689e', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '23f9994a-bafe-4ca0-8a33-2364ccb0fb4d', 'B', 'P1 B', NULL, 40, NULL, 1, NULL, '2026-05-19 12:21:44', '2026-05-19 12:21:44');

-- --------------------------------------------------------

--
-- Table structure for table `combinations`
--

CREATE TABLE `combinations` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `level_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deal_installments`
--

CREATE TABLE `deal_installments` (
  `id` char(36) NOT NULL,
  `order_id` char(36) NOT NULL,
  `payroll_run_id` char(36) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` enum('Pending','Paid','Skipped') DEFAULT 'Pending',
  `scheduled_date` date DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deal_orders`
--

CREATE TABLE `deal_orders` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `buyer_user_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `total_amount` decimal(15,2) NOT NULL,
  `payment_mode` enum('Immediate','Payroll_Deduction','Wallet','Proxy') DEFAULT 'Immediate',
  `repayment_months` int(11) DEFAULT 1,
  `status` enum('Pending','Approved','Dispatched','AtAgentStation','Delivered','Cancelled','Fully_Paid') DEFAULT 'Pending',
  `delivery_method` enum('AgentPickup','SchoolDelivery','HomeDelivery') DEFAULT 'AgentPickup',
  `delivery_address` text DEFAULT NULL,
  `assigned_agent_id` char(36) DEFAULT NULL,
  `partner_reference` varchar(255) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deal_products`
--

CREATE TABLE `deal_products` (
  `id` char(36) NOT NULL,
  `partner_id` char(36) DEFAULT NULL,
  `type` enum('TichaDeal','ShuleKit','General') DEFAULT 'TichaDeal',
  `bundle_contents` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`bundle_contents`)),
  `brand_name` varchar(100) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `specifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specifications`)),
  `original_price` decimal(15,2) NOT NULL,
  `deal_price` decimal(15,2) NOT NULL,
  `stock_quantity` int(11) DEFAULT -1,
  `category` varchar(100) DEFAULT NULL,
  `main_image_url` varchar(255) DEFAULT NULL,
  `gallery_images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gallery_images`)),
  `is_active` tinyint(1) DEFAULT 1,
  `is_featured` tinyint(1) DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deal_product_variants`
--

CREATE TABLE `deal_product_variants` (
  `id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `variant_name` varchar(255) NOT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `additional_price` decimal(15,2) DEFAULT 0.00,
  `stock_quantity` int(11) DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `discipline_policies`
--

CREATE TABLE `discipline_policies` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `reference_type` enum('RoutineActivity','TimetableEntry','General') DEFAULT 'General',
  `reference_id` char(36) DEFAULT NULL,
  `violation_type` enum('Absent','Late','Misconduct','Uniform','Other') NOT NULL,
  `marks_to_deduct` decimal(5,2) NOT NULL DEFAULT 0.00,
  `is_automatic` tinyint(1) DEFAULT 1,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `discipline_records`
--

CREATE TABLE `discipline_records` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `student_id` char(36) NOT NULL,
  `recorded_by_staff_id` char(36) DEFAULT NULL,
  `points` decimal(5,2) NOT NULL,
  `category` varchar(100) NOT NULL,
  `reason` text DEFAULT NULL,
  `attendance_record_id` char(36) DEFAULT NULL,
  `policy_id` char(36) DEFAULT NULL,
  `occurred_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `document_type_id` char(36) NOT NULL,
  `owner_type` enum('Staff','Student','School','Parent','FeePayment','FeeInvoice') NOT NULL,
  `owner_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `status` enum('Active','Expired','Revoked','Pending_Review') DEFAULT 'Active',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `document_types`
--

CREATE TABLE `document_types` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` enum('Identity','Academic','Employment','Legal','Medical','Other') DEFAULT 'Other',
  `is_required` tinyint(1) DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `student_id` char(36) NOT NULL,
  `class_id` char(36) NOT NULL,
  `academic_year_id` char(36) NOT NULL,
  `status` enum('Active','Withdrawn','Transferred','Suspended','Completed') DEFAULT 'Active',
  `promotion_status` enum('Pending','Promoted','Repeated','Graduated') DEFAULT 'Pending',
  `promotion_decision` enum('Pass','Fail','Incomplete') DEFAULT 'Incomplete',
  `notes` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`id`, `school_id`, `student_id`, `class_id`, `academic_year_id`, `status`, `promotion_status`, `promotion_decision`, `notes`, `deleted_at`, `created_at`, `updated_at`) VALUES
('2eb72e17-2b83-4a3e-9f93-ac197bbe654e', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'a5d599c1-fb21-4284-b514-414ac87880e3', '979ac4fb-4256-45ed-9abe-3e4a83d0689e', '50e74b49-d56d-4cf7-92df-696a9caadc48', 'Active', 'Pending', 'Incomplete', NULL, NULL, '2026-05-19 12:27:44', '2026-05-19 12:27:44'),
('af7c6528-6284-4b70-9396-fd480fef87dd', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'c14f6bee-b33b-455f-8009-db4b17ffd9ca', '91005b92-a002-4fd1-8b43-09f4909b05ac', '50e74b49-d56d-4cf7-92df-696a9caadc48', 'Active', 'Pending', 'Incomplete', NULL, NULL, '2026-05-19 12:27:43', '2026-05-19 12:27:43'),
('c3cf7bcb-1f3c-4682-9c92-5e7fb0426555', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '04b43109-9ed4-45c8-8e37-fcde82ee7391', '91005b92-a002-4fd1-8b43-09f4909b05ac', '50e74b49-d56d-4cf7-92df-696a9caadc48', 'Active', 'Pending', 'Incomplete', NULL, NULL, '2026-05-19 12:27:43', '2026-05-20 06:24:37'),
('dca57bd9-47c4-48da-a9f9-88312314add4', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '9603f74b-89a9-4660-9969-8721e3b997c2', '785bdf3a-128f-4e24-b08e-b35a9d2bdd9d', '50e74b49-d56d-4cf7-92df-696a9caadc48', 'Active', 'Pending', 'Incomplete', NULL, NULL, '2026-05-19 12:27:43', '2026-05-19 12:27:43'),
('e8a6aaba-2f7d-4f90-ba0b-3d120a6a6009', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '6334fe6e-bc2e-40c3-b279-8bdb956b531e', '781542d3-c628-4763-9c69-2ae5c28e32b9', '50e74b49-d56d-4cf7-92df-696a9caadc48', 'Active', 'Pending', 'Incomplete', NULL, NULL, '2026-05-19 12:27:44', '2026-05-19 12:27:44');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `requisition_id` char(36) DEFAULT NULL,
  `category` varchar(100) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `payment_method` enum('Cash','Bank','Mobile Money','Cheque') DEFAULT 'Cash',
  `paid_to` varchar(255) DEFAULT NULL,
  `date_paid` date NOT NULL,
  `recorded_by_staff_id` char(36) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fee_categories`
--

CREATE TABLE `fee_categories` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fee_invoices`
--

CREATE TABLE `fee_invoices` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `student_id` char(36) NOT NULL,
  `fee_structure_id` char(36) DEFAULT NULL,
  `academic_year_id` char(36) NOT NULL,
  `term_id` char(36) DEFAULT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `paid_amount` decimal(15,2) DEFAULT 0.00,
  `due_date` date DEFAULT NULL,
  `status` enum('Unpaid','Partial','Paid','Void','Refunded') DEFAULT 'Unpaid',
  `notes` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fee_payments`
--

CREATE TABLE `fee_payments` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `invoice_id` char(36) DEFAULT NULL,
  `student_id` char(36) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_method` enum('Bank','Mobile Money','Cash','Cheque','Scholarship','Waiver') NOT NULL,
  `reference_number` varchar(255) DEFAULT NULL,
  `collected_by_staff_id` char(36) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fee_structures`
--

CREATE TABLE `fee_structures` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `academic_year_id` char(36) NOT NULL,
  `term_id` char(36) DEFAULT NULL,
  `target_group_id` char(36) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `total_amount` decimal(15,2) DEFAULT 0.00,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fee_structure_items`
--

CREATE TABLE `fee_structure_items` (
  `id` char(36) NOT NULL,
  `fee_structure_id` char(36) NOT NULL,
  `fee_category_id` char(36) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `is_optional` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `grades`
--

CREATE TABLE `grades` (
  `id` char(36) NOT NULL,
  `level_id` char(36) NOT NULL,
  `grade_number` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(20) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `grades`
--

INSERT INTO `grades` (`id`, `level_id`, `grade_number`, `name`, `code`, `deleted_at`, `created_at`) VALUES
('d58330b4-0f25-449a-927b-0b0d62ae3aaa', '5ddfb1ae-422f-4362-943f-2627fd96e824', 7, 'S1', 'S1', NULL, '2026-05-13 16:10:05'),
('dfa19284-4ba0-433f-8e48-7661535661fb', 'ff495efe-f967-47c3-915a-7dcf73ee7013', 2, 'P2', 'P2', NULL, '2026-05-13 16:10:05'),
('e2fdce88-03fb-4023-921d-0c63e8360b4b', 'ff495efe-f967-47c3-915a-7dcf73ee7013', 1, 'P1', 'P1', NULL, '2026-05-13 16:10:05');

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `parent_id` char(36) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('System','Academic','Extracurricular','Administrative','Residential','Custom') DEFAULT 'Custom',
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `resolution_type` varchar(50) DEFAULT 'static',
  `resolution_config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`resolution_config`)),
  `cache_ttl` int(11) DEFAULT 300,
  `last_resolved_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `school_id`, `parent_id`, `name`, `type`, `description`, `is_active`, `resolution_type`, `resolution_config`, `cache_ttl`, `last_resolved_at`, `deleted_at`, `created_at`, `updated_at`) VALUES
('92a989bd-56bd-4766-911e-a8276c1f4403', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'all staff', 'Custom', NULL, 1, 'static', '{\"entity\":\"staff\",\"rules\":[{\"label\":\"Active Staff\",\"type\":\"staff_status\",\"value\":\"active\"},{\"label\":\"By Department\",\"type\":\"units\",\"value\":\"c4421261-be09-4c38-bd10-53eaf3b50b9a\"},{\"label\":\"By Department\",\"type\":\"units\",\"value\":\"4b983c9e-5e1f-4b6e-98ee-eda18fcf0f60\"}],\"_display\":{\"entity\":\"staff\",\"rulesCount\":3}}', 300, NULL, NULL, '2026-05-19 13:23:33', '2026-05-19 13:23:33'),
('99bdeed8-dbea-4c93-b12c-c84da5f5c7bc', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'Principal Office', 'Administrative', NULL, 1, 'users_with_role', '{\"role\":\"Principal\"}', 300, NULL, NULL, '2026-05-13 16:10:05', '2026-05-13 16:10:05'),
('a06a2508-4f54-4fe6-b47a-f21f6b5d5979', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'all students', 'Custom', NULL, 1, 'static', '{\"entity\":\"student\",\"rules\":[{\"label\":\"Active Students\",\"type\":\"status\",\"value\":\"active\"}],\"_display\":{\"entity\":\"student\",\"rulesCount\":1}}', 300, NULL, NULL, '2026-05-19 12:54:37', '2026-05-19 12:54:37'),
('a7af5c68-2b9f-4e74-a0a2-d791b8ba3fbf', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'P1 Students', 'Academic', NULL, 1, 'grade_students', '{\"grade_name\":\"P1\"}', 300, NULL, NULL, '2026-05-13 16:10:05', '2026-05-13 16:10:05'),
('c04b8ff9-1c87-4a34-b292-42c1f33d4e9a', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'All Teachers', 'System', NULL, 1, 'users_with_role', '{\"role\":\"Teacher\"}', 300, NULL, NULL, '2026-05-13 16:10:05', '2026-05-13 16:10:05'),
('f5d9bd32-b609-4167-9604-d2544b3eabf1', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'Football Club', 'Extracurricular', NULL, 1, 'static', NULL, 300, NULL, NULL, '2026-05-13 16:10:05', '2026-05-13 16:10:05');

-- --------------------------------------------------------

--
-- Table structure for table `group_memberships`
--

CREATE TABLE `group_memberships` (
  `id` char(36) NOT NULL,
  `group_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `group_role_id` char(36) DEFAULT NULL,
  `status` enum('active','inactive','left') DEFAULT 'active',
  `joined_at` date DEFAULT NULL,
  `left_at` date DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `group_roles`
--

CREATE TABLE `group_roles` (
  `id` char(36) NOT NULL,
  `group_id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory_items`
--

CREATE TABLE `inventory_items` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` enum('Stationary','Kitchen','Cleaning','Medical','Maintenance','Other') DEFAULT 'Other',
  `unit` varchar(50) NOT NULL,
  `stock_quantity` decimal(15,2) DEFAULT 0.00,
  `reorder_level` decimal(15,2) DEFAULT 0.00,
  `unit_price` decimal(15,2) DEFAULT 0.00,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory_transactions`
--

CREATE TABLE `inventory_transactions` (
  `id` char(36) NOT NULL,
  `inventory_item_id` char(36) NOT NULL,
  `type` enum('In','Out','Adjustment') NOT NULL,
  `quantity` decimal(15,2) NOT NULL,
  `staff_id` char(36) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `reference_type` enum('Purchase','Requisition','Adjustment','Loss') DEFAULT 'Requisition',
  `reference_id` char(36) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leave_requests`
--

CREATE TABLE `leave_requests` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `leave_type` enum('Sick','Medical','Personal','Emergency','Official','Other') DEFAULT 'Personal',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected','Cancelled') DEFAULT 'Pending',
  `approved_by_staff_id` char(36) DEFAULT NULL,
  `approval_notes` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `levels`
--

CREATE TABLE `levels` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(20) NOT NULL,
  `display_order` int(11) DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `levels`
--

INSERT INTO `levels` (`id`, `school_id`, `name`, `code`, `display_order`, `deleted_at`, `created_at`) VALUES
('5ccc2e51-1379-4151-b461-06abd57fda92', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'A Level', 'ALE', 3, NULL, '2026-05-13 16:10:05'),
('5ddfb1ae-422f-4362-943f-2627fd96e824', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'O Level', 'OLE', 2, NULL, '2026-05-13 16:10:05'),
('ff495efe-f967-47c3-915a-7dcf73ee7013', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'Primary', 'PRI', 1, NULL, '2026-05-13 16:10:05');

-- --------------------------------------------------------

--
-- Table structure for table `library_books`
--

CREATE TABLE `library_books` (
  `id` char(36) NOT NULL,
  `inventory_item_id` char(36) NOT NULL,
  `isbn` varchar(50) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  `edition` varchar(50) DEFAULT NULL,
  `shelf_location` varchar(100) DEFAULT NULL,
  `status` enum('Available','Borrowed','Lost','Damaged','Reserved') DEFAULT 'Available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `library_fines`
--

CREATE TABLE `library_fines` (
  `id` char(36) NOT NULL,
  `loan_id` char(36) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` enum('Unpaid','Paid','Waived') DEFAULT 'Unpaid',
  `discipline_record_id` char(36) DEFAULT NULL,
  `fee_invoice_id` char(36) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `library_loans`
--

CREATE TABLE `library_loans` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `book_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `smart_card_log_id` char(36) DEFAULT NULL,
  `loan_date` date NOT NULL,
  `due_date` date NOT NULL,
  `return_date` date DEFAULT NULL,
  `status` enum('Active','Returned','Overdue','Lost') DEFAULT 'Active',
  `notes` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `block_id` char(36) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('Classroom','Laboratory','Hall','Field','Office','Other') DEFAULT 'Classroom',
  `capacity` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_virtual` tinyint(1) DEFAULT 0,
  `resolution_type` varchar(100) DEFAULT 'physical',
  `resolution_config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`resolution_config`)),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `school_id`, `block_id`, `name`, `type`, `capacity`, `description`, `is_virtual`, `resolution_type`, `resolution_config`, `deleted_at`, `created_at`, `updated_at`) VALUES
('38729eb2-8b26-47c5-92bb-2f061ba22d91', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '66225e84-d406-4e5e-82eb-2d902c7f310d', 'Chemistry Lab', 'Laboratory', 30, NULL, 0, 'physical', NULL, NULL, '2026-05-13 16:10:05', '2026-05-13 16:10:05'),
('7cbc0eda-e5ff-4651-b27f-5aa7825d012b', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '59661b49-a201-4761-a92c-0a6222c3744b', 'Room A1', 'Classroom', 45, NULL, 0, 'physical', NULL, NULL, '2026-05-13 16:10:05', '2026-05-13 16:10:05'),
('7d308506-c37d-4af2-8263-3c0112448e7c', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'Home Classroom', 'Classroom', NULL, NULL, 1, 'target_group_homeroom', NULL, NULL, '2026-05-13 16:10:05', '2026-05-13 16:10:05'),
('905376d5-7b45-4661-a721-b38a5c7535b4', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '59661b49-a201-4761-a92c-0a6222c3744b', 'Room A2', 'Classroom', 45, NULL, 0, 'physical', NULL, NULL, '2026-05-13 16:10:05', '2026-05-13 16:10:05'),
('9cfda7ea-23b5-40eb-83a5-b941ab181df6', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '66225e84-d406-4e5e-82eb-2d902c7f310d', 'Physics Lab', 'Laboratory', 30, NULL, 0, 'physical', NULL, NULL, '2026-05-13 16:10:05', '2026-05-13 16:10:05'),
('e1c39f30-1965-4d3f-bb15-a003b66b0953', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'basket ball field', '', NULL, NULL, 0, 'physical', NULL, NULL, '2026-05-19 08:48:39', '2026-05-19 08:48:39'),
('fcf84c57-9e2d-4fc1-b526-413e2af004ca', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'Refectory', 'Other', 200, NULL, 0, 'physical', NULL, NULL, '2026-05-13 16:10:05', '2026-05-13 16:10:05');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `channel_used` enum('App','WhatsApp','SMS','Email') NOT NULL,
  `status` enum('Queued','Sent','Delivered','Read','Failed') DEFAULT 'Queued',
  `reference_type` varchar(100) DEFAULT NULL,
  `reference_id` char(36) DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification_policies`
--

CREATE TABLE `notification_policies` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `event_type` enum('Attendance','Purchase','Discipline','FeePayment','LibraryOverdue','Requisition','StaffAdvance','StaffRoster','Announcement') NOT NULL,
  `trigger_condition` varchar(100) DEFAULT NULL,
  `is_enabled` tinyint(1) DEFAULT 1,
  `default_channels` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`default_channels`)),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organization_units`
--

CREATE TABLE `organization_units` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `parent_id` char(36) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) DEFAULT 'Department',
  `description` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `organization_units`
--

INSERT INTO `organization_units` (`id`, `school_id`, `parent_id`, `name`, `type`, `description`, `deleted_at`, `created_at`, `updated_at`) VALUES
('4b983c9e-5e1f-4b6e-98ee-eda18fcf0f60', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'Academic Department', 'Academic', NULL, NULL, '2026-05-19 13:16:22', '2026-05-19 13:16:22'),
('c4421261-be09-4c38-bd10-53eaf3b50b9a', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'Administrative Department', 'Administrative', NULL, NULL, '2026-05-19 13:16:22', '2026-05-19 13:16:22'),
('d49deec1-981e-4ff4-81c2-96ac348c7c26', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'Operations Department', 'Operations', NULL, NULL, '2026-05-19 13:16:23', '2026-05-19 13:16:23');

-- --------------------------------------------------------

--
-- Table structure for table `parents`
--

CREATE TABLE `parents` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) NOT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `parents`
--

INSERT INTO `parents` (`id`, `school_id`, `user_id`, `full_name`, `email`, `phone`, `occupation`, `address`, `deleted_at`, `created_at`, `updated_at`) VALUES
('9ed457ec-372a-44b9-a177-3852e7c1f069', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', NULL, 'mukantabana', NULL, '0780332216', NULL, NULL, NULL, '2026-05-19 18:55:37', '2026-05-19 18:55:37');

-- --------------------------------------------------------

--
-- Table structure for table `partners`
--

CREATE TABLE `partners` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('Fintech','Vendor','Insurance','Bank','Other') DEFAULT 'Vendor',
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(50) DEFAULT NULL,
  `api_credentials` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`api_credentials`)),
  `status` enum('Active','Inactive','Suspended') DEFAULT 'Active',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payroll_runs`
--

CREATE TABLE `payroll_runs` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `payroll_month` int(11) NOT NULL,
  `payroll_year` int(11) NOT NULL,
  `status` enum('Draft','Processing','Approved','Paid','Cancelled') DEFAULT 'Draft',
  `processed_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `processed_by_user_id` char(36) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payslips`
--

CREATE TABLE `payslips` (
  `id` char(36) NOT NULL,
  `payroll_run_id` char(36) NOT NULL,
  `staff_id` char(36) NOT NULL,
  `base_salary` decimal(15,2) NOT NULL,
  `total_allowances` decimal(15,2) DEFAULT 0.00,
  `total_deductions` decimal(15,2) DEFAULT 0.00,
  `net_salary` decimal(15,2) NOT NULL,
  `status` enum('Generated','Pending_Approval','Paid','Failed') DEFAULT 'Generated',
  `payment_reference` varchar(255) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payslip_items`
--

CREATE TABLE `payslip_items` (
  `id` char(36) NOT NULL,
  `payslip_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('Allowance','Deduction') NOT NULL,
  `amount` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pay_grades`
--

CREATE TABLE `pay_grades` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `base_salary` decimal(15,2) NOT NULL,
  `description` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `module` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `requisitions`
--

CREATE TABLE `requisitions` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `staff_id` char(36) NOT NULL,
  `type` enum('Material','Cash','Service') DEFAULT 'Material',
  `title` varchar(255) NOT NULL,
  `reason` text DEFAULT NULL,
  `total_estimated_cost` decimal(15,2) DEFAULT 0.00,
  `status` enum('Draft','Pending_Approval','Approved_By_HOD','Approved_By_Admin','Disbursed','Rejected','Cancelled') DEFAULT 'Pending_Approval',
  `current_workflow_step_id` char(36) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `requisition_items`
--

CREATE TABLE `requisition_items` (
  `id` char(36) NOT NULL,
  `requisition_id` char(36) NOT NULL,
  `inventory_item_id` char(36) DEFAULT NULL,
  `item_description` varchar(255) DEFAULT NULL,
  `quantity_requested` decimal(15,2) NOT NULL,
  `quantity_approved` decimal(15,2) DEFAULT 0.00,
  `estimated_unit_cost` decimal(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_system` tinyint(1) DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `school_id`, `name`, `description`, `is_system`, `deleted_at`, `created_at`, `updated_at`) VALUES
('52641026-033f-41e3-bfbb-abe13c6503ac', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'Accountant', 'Financial operations manager', 0, NULL, '2026-05-19 13:16:22', '2026-05-19 13:16:22'),
('772aa8c1-4851-4803-90d5-926d78bd207c', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'Teacher', 'Academic instructor / educator', 0, NULL, '2026-05-19 13:16:21', '2026-05-19 13:16:21'),
('82cb214f-cfb1-4f56-bdef-ce33064c0629', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'Administrator', 'System administrator / manager', 0, NULL, '2026-05-19 13:16:22', '2026-05-19 13:16:22'),
('a10b2857-4a51-47ca-930f-465ca5d095a1', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'SchoolAdmin', 'Master administrator for the school', 1, NULL, '2026-05-13 16:10:04', '2026-05-13 16:10:04'),
('d9149a82-47e8-43a8-a777-1b0f9d338581', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'Registrar', 'Student records officer', 0, NULL, '2026-05-19 13:16:22', '2026-05-19 13:16:22');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` char(36) NOT NULL,
  `permission_id` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `routine_activities`
--

CREATE TABLE `routine_activities` (
  `id` char(36) NOT NULL,
  `slot_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location_id` char(36) DEFAULT NULL,
  `is_attendance_point` tinyint(1) DEFAULT 0,
  `attendance_method` enum('mass','per_class','per_student') DEFAULT 'mass',
  `responsible_group_id` char(36) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_multi_instance` tinyint(1) DEFAULT 0,
  `transport_route_id` char(36) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `routine_activities`
--

INSERT INTO `routine_activities` (`id`, `slot_id`, `name`, `location_id`, `is_attendance_point`, `attendance_method`, `responsible_group_id`, `description`, `is_multi_instance`, `transport_route_id`, `deleted_at`, `created_at`) VALUES
('81c616fd-81a4-43db-8fc6-0e47b02e20f8', '2509739f-41bd-44f5-8e91-28fcd92bafc5', 'Period 1', '7d308506-c37d-4af2-8263-3c0112448e7c', 1, 'mass', 'c04b8ff9-1c87-4a34-b292-42c1f33d4e9a', NULL, 0, NULL, NULL, '2026-05-13 16:10:06'),
('af3dccca-a8ef-4940-b10f-f535988f0ba7', '26b2220a-6b11-4e2a-aca1-19f260bc5daf', 'Morning Assembly', 'fcf84c57-9e2d-4fc1-b526-413e2af004ca', 1, 'mass', '99bdeed8-dbea-4c93-b12c-c84da5f5c7bc', NULL, 0, NULL, NULL, '2026-05-13 16:10:05'),
('df72c451-16b4-432e-9359-ec635873fce7', 'b9dd1ac1-03c2-4fdf-908e-94f591a1d97b', 'Period 2', '7d308506-c37d-4af2-8263-3c0112448e7c', 1, 'mass', 'c04b8ff9-1c87-4a34-b292-42c1f33d4e9a', NULL, 0, NULL, NULL, '2026-05-13 16:10:06');

-- --------------------------------------------------------

--
-- Table structure for table `routine_activity_target_groups`
--

CREATE TABLE `routine_activity_target_groups` (
  `activity_id` char(36) NOT NULL,
  `group_id` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `routine_templates`
--

CREATE TABLE `routine_templates` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `routine_templates`
--

INSERT INTO `routine_templates` (`id`, `school_id`, `name`, `description`, `is_active`, `deleted_at`, `created_at`, `updated_at`) VALUES
('0619019f-7f3e-4c4b-845b-f97f1b1fb5dc', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'Half Day (Friday)', 'Shortened day for Friday prayers/activities', 1, NULL, '2026-05-13 16:10:05', '2026-05-13 16:10:05'),
('1f5828cb-6f96-4d1d-b06c-ff4264e9603b', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'Examination Mode', 'Strict timing for exams with no breaks', 1, NULL, '2026-05-13 16:10:05', '2026-05-13 16:10:05'),
('c4dc6e49-af26-4d4c-b683-bb24e942a40f', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'Standard Full Day', 'Regular academic day with periods and breaks', 1, NULL, '2026-05-13 16:10:05', '2026-05-13 16:10:05'),
('fe1aed75-5f38-4a6e-b0d5-f0b9eb9c0aa2', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'Staff Only / Training', 'Non-student day for staff development', 1, NULL, '2026-05-13 16:10:05', '2026-05-13 16:10:05');

-- --------------------------------------------------------

--
-- Table structure for table `routine_time_slots`
--

CREATE TABLE `routine_time_slots` (
  `id` char(36) NOT NULL,
  `template_id` char(36) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `duration_minutes` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `routine_time_slots`
--

INSERT INTO `routine_time_slots` (`id`, `template_id`, `start_time`, `end_time`, `duration_minutes`, `deleted_at`, `created_at`) VALUES
('2509739f-41bd-44f5-8e91-28fcd92bafc5', 'c4dc6e49-af26-4d4c-b683-bb24e942a40f', '08:00:00', '08:40:00', 40, NULL, '2026-05-13 16:10:05'),
('26b2220a-6b11-4e2a-aca1-19f260bc5daf', 'c4dc6e49-af26-4d4c-b683-bb24e942a40f', '07:30:00', '08:00:00', 30, NULL, '2026-05-13 16:10:05'),
('b9dd1ac1-03c2-4fdf-908e-94f591a1d97b', 'c4dc6e49-af26-4d4c-b683-bb24e942a40f', '08:40:00', '09:20:00', 40, NULL, '2026-05-13 16:10:06');

-- --------------------------------------------------------

--
-- Table structure for table `salary_components`
--

CREATE TABLE `salary_components` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('Allowance','Deduction') NOT NULL,
  `calculation_type` enum('Fixed','Percentage') DEFAULT 'Fixed',
  `value` decimal(15,2) NOT NULL,
  `is_statutory` tinyint(1) DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `schools`
--

CREATE TABLE `schools` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `organization_type` enum('School','Corporate') DEFAULT 'School',
  `code` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `motto` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `founded` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `subscription_tier` enum('basic','pro','enterprise') DEFAULT 'basic',
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`settings`)),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `schools`
--

INSERT INTO `schools` (`id`, `name`, `organization_type`, `code`, `email`, `phone`, `motto`, `website`, `founded`, `address`, `logo_url`, `status`, `subscription_tier`, `settings`, `deleted_at`, `created_at`, `updated_at`) VALUES
('a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'Babyeyi System', 'School', 'BABYEYI-001', 'admin@babyeyi.local', NULL, NULL, NULL, NULL, 'Kigali, Rwanda', NULL, 'active', 'basic', NULL, NULL, '2026-05-13 16:10:04', '2026-05-13 16:10:04');

-- --------------------------------------------------------

--
-- Table structure for table `school_calendar`
--

CREATE TABLE `school_calendar` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `date` date NOT NULL,
  `routine_template_id` char(36) NOT NULL,
  `event_name` varchar(255) DEFAULT NULL,
  `is_academic_day` tinyint(1) DEFAULT 1,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `school_deal_availability`
--

CREATE TABLE `school_deal_availability` (
  `school_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `smart_cards`
--

CREATE TABLE `smart_cards` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `card_number` varchar(100) NOT NULL,
  `status` enum('Active','Inactive','Lost','Blocked') DEFAULT 'Active',
  `issued_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` date DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `smart_card_logs`
--

CREATE TABLE `smart_card_logs` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `card_id` char(36) NOT NULL,
  `reader_id` char(36) NOT NULL,
  `tap_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `action_type` enum('CheckIn','CheckOut','Attendance','Payment','Verify') DEFAULT 'Attendance',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `attendance_record_id` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `smart_card_readers`
--

CREATE TABLE `smart_card_readers` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `reader_serial` varchar(255) NOT NULL,
  `location_name` varchar(255) NOT NULL,
  `reader_type` enum('Gate','Classroom','Bus','Library','Canteen','Generic') DEFAULT 'Generic',
  `is_active` tinyint(1) DEFAULT 1,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `staff_number` varchar(50) NOT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `employment_type` enum('Full-time','Part-time','Contract','Intern') DEFAULT 'Full-time',
  `joining_date` date DEFAULT NULL,
  `qualifications` text DEFAULT NULL,
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`skills`)),
  `base_salary` decimal(15,2) DEFAULT NULL,
  `status` enum('active','on_leave','suspended','terminated') DEFAULT 'active',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reporting_to_id` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `user_id`, `school_id`, `staff_number`, `designation`, `employment_type`, `joining_date`, `qualifications`, `skills`, `base_salary`, `status`, `deleted_at`, `created_at`, `updated_at`, `reporting_to_id`) VALUES
('257a28e2-c741-4dfa-9eba-4bffa2c926c6', 'aa51113d-a6e2-4abd-8423-4124de35f5ed', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'STAFF-002', 'Registrar', 'Full-time', '2025-01-01', NULL, NULL, NULL, 'active', NULL, '2026-05-19 13:16:24', '2026-05-19 16:35:45', '51d0b2d1-2264-4b14-9084-610e906e9efb'),
('53fe5560-fa8b-48c5-90e0-1a86e31f2edd', '51d0b2d1-2264-4b14-9084-610e906e9efb', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'STAFF-004', 'Administrator', 'Full-time', '2025-01-01', NULL, NULL, NULL, 'active', NULL, '2026-05-19 13:16:25', '2026-05-19 13:16:25', NULL),
('819de07e-e9fc-4ca7-bde1-5d6876307af2', '0a4c9244-0136-4740-9569-70fe63c78cd1', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'STAFF-001', 'Teacher', 'Full-time', '2025-01-01', NULL, NULL, NULL, 'active', NULL, '2026-05-19 13:16:23', '2026-05-19 16:35:45', '51d0b2d1-2264-4b14-9084-610e906e9efb'),
('e08ae54b-f83d-43ad-9ee6-f4856e28b3f5', 'da7fd392-40c3-451b-b9a6-2820d24499b5', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'STAFF-003', 'Teacher', 'Contract', '2025-01-01', NULL, NULL, NULL, 'active', NULL, '2026-05-19 13:16:24', '2026-05-19 16:35:45', '51d0b2d1-2264-4b14-9084-610e906e9efb');

-- --------------------------------------------------------

--
-- Table structure for table `staff_assignments`
--

CREATE TABLE `staff_assignments` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `unit_id` char(36) NOT NULL,
  `position_name` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 1,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `staff_assignments`
--

INSERT INTO `staff_assignments` (`id`, `user_id`, `unit_id`, `position_name`, `is_primary`, `deleted_at`, `created_at`) VALUES
('a1111111-1111-4111-a111-111111111111', 'aa51113d-a6e2-4abd-8423-4124de35f5ed', 'c4421261-be09-4c38-bd10-53eaf3b50b9a', 'Registrar', 1, NULL, '2026-05-19 16:31:05'),
('a2222222-2222-4222-a222-222222222222', '51d0b2d1-2264-4b14-9084-610e906e9efb', 'c4421261-be09-4c38-bd10-53eaf3b50b9a', 'Administrator', 1, NULL, '2026-05-19 16:31:05'),
('a3333333-3333-4333-a333-333333333333', '0a4c9244-0136-4740-9569-70fe63c78cd1', '4b983c9e-5e1f-4b6e-98ee-eda18fcf0f60', 'Teacher', 1, NULL, '2026-05-19 16:31:05'),
('a4444444-4444-4444-a444-444444444444', 'da7fd392-40c3-451b-b9a6-2820d24499b5', '4b983c9e-5e1f-4b6e-98ee-eda18fcf0f60', 'Teacher', 1, NULL, '2026-05-19 16:31:05');

-- --------------------------------------------------------

--
-- Table structure for table `staff_contracts`
--

CREATE TABLE `staff_contracts` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `staff_id` char(36) NOT NULL,
  `contract_type` enum('Permanent','Fixed-Term','Contractor','Intern','Volunteer') DEFAULT 'Permanent',
  `pay_frequency` enum('Daily','Weekly','Bi-Weekly','Monthly','Termly') DEFAULT 'Monthly',
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `probation_end_date` date DEFAULT NULL,
  `status` enum('Draft','Active','Expired','Terminated','Resigned') DEFAULT 'Draft',
  `terms_and_conditions` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff_salary_component_mappings`
--

CREATE TABLE `staff_salary_component_mappings` (
  `staff_id` char(36) NOT NULL,
  `component_id` char(36) NOT NULL,
  `custom_value` decimal(15,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff_salary_configurations`
--

CREATE TABLE `staff_salary_configurations` (
  `id` char(36) NOT NULL,
  `staff_id` char(36) NOT NULL,
  `pay_grade_id` char(36) DEFAULT NULL,
  `custom_base_salary` decimal(15,2) DEFAULT NULL,
  `payment_method` enum('Bank','Mobile Money','Cash','Cheque') DEFAULT 'Bank',
  `bank_name` varchar(255) DEFAULT NULL,
  `account_number` varchar(100) DEFAULT NULL,
  `mobile_money_number` varchar(50) DEFAULT NULL,
  `tax_id_number` varchar(100) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `student_id_number` varchar(50) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `dob` date NOT NULL,
  `nationality` varchar(100) DEFAULT 'Rwandan',
  `residence` text DEFAULT NULL,
  `blood_group` varchar(5) DEFAULT NULL,
  `allergies` text DEFAULT NULL,
  `admission_date` date DEFAULT NULL,
  `dismissal_mode` enum('Bus','Parent Pickup','Self','Other') DEFAULT 'Parent Pickup',
  `transport_route_id` char(36) DEFAULT NULL,
  `status` enum('applicant','pending_approval','active','inactive','graduated','transferred','dropped') DEFAULT 'applicant',
  `photo_url` varchar(255) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `school_id`, `student_id_number`, `full_name`, `gender`, `dob`, `nationality`, `residence`, `blood_group`, `allergies`, `admission_date`, `dismissal_mode`, `transport_route_id`, `status`, `photo_url`, `deleted_at`, `created_at`, `updated_at`) VALUES
('04b43109-9ed4-45c8-8e37-fcde82ee7391', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'REG-002', 'Patrick Nshutiisi', 'Male', '2012-08-20', 'Rwandan', '', 'AB-', '', '0000-00-00', 'Parent Pickup', NULL, 'active', NULL, NULL, '2026-05-19 12:27:43', '2026-05-20 06:24:37'),
('6334fe6e-bc2e-40c3-b279-8bdb956b531e', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'REG-004', 'Clairis Gasana', 'Female', '2017-02-28', 'Rwandan', NULL, NULL, NULL, NULL, 'Parent Pickup', NULL, 'active', NULL, NULL, '2026-05-19 12:27:43', '2026-05-19 12:27:43'),
('9603f74b-89a9-4660-9969-8721e3b997c2', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'REG-001', 'Kevine Irakoze', 'Female', '2018-05-15', 'Rwandan', NULL, NULL, NULL, NULL, 'Parent Pickup', NULL, 'active', NULL, NULL, '2026-05-19 12:27:43', '2026-05-19 12:27:43'),
('a5d599c1-fb21-4284-b514-414ac87880e3', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'REG-005', 'Divine Mutoni', 'Female', '2018-09-05', 'Rwandan', NULL, NULL, NULL, NULL, 'Parent Pickup', NULL, 'active', NULL, NULL, '2026-05-19 12:27:44', '2026-05-19 12:27:44'),
('c14f6bee-b33b-455f-8009-db4b17ffd9ca', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'REG-003', 'Fiona Umuhoza', 'Female', '2012-11-10', 'Rwandan', NULL, NULL, NULL, NULL, 'Parent Pickup', NULL, 'active', NULL, NULL, '2026-05-19 12:27:43', '2026-05-19 12:27:43');

-- --------------------------------------------------------

--
-- Table structure for table `student_parents`
--

CREATE TABLE `student_parents` (
  `student_id` char(36) NOT NULL,
  `parent_id` char(36) NOT NULL,
  `relationship` varchar(50) DEFAULT 'Parent',
  `is_emergency_contact` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `level_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `terms`
--

CREATE TABLE `terms` (
  `id` char(36) NOT NULL,
  `academic_year_id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_active` tinyint(1) DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `terms`
--

INSERT INTO `terms` (`id`, `academic_year_id`, `name`, `start_date`, `end_date`, `is_active`, `deleted_at`, `created_at`, `updated_at`) VALUES
('77d8a6c4-0673-41e3-995a-053e3c4e1bf1', '50e74b49-d56d-4cf7-92df-696a9caadc48', 'Term 2', '2024-04-08', '2024-07-25', 0, NULL, '2026-05-13 16:10:05', '2026-05-13 16:10:05'),
('a84a2650-a4e8-4c5e-967e-c62a7d26cf94', '50e74b49-d56d-4cf7-92df-696a9caadc48', 'Term 3', '2024-08-05', '2024-12-05', 0, NULL, '2026-05-13 16:10:05', '2026-05-13 16:10:05'),
('cf06d45d-d283-406f-b58d-9ae60f28d6e7', '50e74b49-d56d-4cf7-92df-696a9caadc48', 'Term 1', '2024-01-10', '2024-03-28', 1, NULL, '2026-05-13 16:10:05', '2026-05-13 16:10:05');

-- --------------------------------------------------------

--
-- Table structure for table `term_phases`
--

CREATE TABLE `term_phases` (
  `id` char(36) NOT NULL,
  `term_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'e.g. Orientation Week, Teaching Weeks, Examination Period',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `display_order` int(11) DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `timetables`
--

CREATE TABLE `timetables` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `academic_year_id` char(36) NOT NULL,
  `term_id` char(36) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('Academic','Extracurricular','Exam','Other') DEFAULT 'Academic',
  `is_active` tinyint(1) DEFAULT 1,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `timetable_entries`
--

CREATE TABLE `timetable_entries` (
  `id` char(36) NOT NULL,
  `timetable_id` char(36) NOT NULL,
  `day_of_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `slot_id` char(36) NOT NULL,
  `staff_id` char(36) DEFAULT NULL,
  `group_id` char(36) DEFAULT NULL,
  `subject_id` char(36) DEFAULT NULL,
  `location_id` char(36) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transport_assignments`
--

CREATE TABLE `transport_assignments` (
  `id` char(36) NOT NULL,
  `route_id` char(36) NOT NULL,
  `vehicle_id` char(36) NOT NULL,
  `driver_id` char(36) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transport_routes`
--

CREATE TABLE `transport_routes` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `fee` decimal(15,2) DEFAULT 0.00,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transport_vehicles`
--

CREATE TABLE `transport_vehicles` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `plate_number` varchar(50) NOT NULL,
  `model` varchar(255) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `status` enum('active','maintenance','retired') DEFAULT 'active',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `school_id` char(36) DEFAULT NULL,
  `role_id` char(36) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `school_id`, `role_id`, `name`, `email`, `phone`, `password`, `last_login`, `status`, `deleted_at`, `created_at`, `updated_at`) VALUES
('0a4c9244-0136-4740-9569-70fe63c78cd1', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '772aa8c1-4851-4803-90d5-926d78bd207c', 'Jean-Luc Ndayisenga', 'jeanluc@school.com', NULL, '$2a$10$h2iKEuIb2k0AN2fLz4XOkudNr27I7FX8wKdMltxcf1YK/FszGGSqy', NULL, 'active', NULL, '2026-05-19 13:16:23', '2026-05-19 13:16:23'),
('12f45286-9153-44c2-83b3-2e19af672dfd', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'a10b2857-4a51-47ca-930f-465ca5d095a1', 'Super Admin', 'admin@babyeyi.local', '+250780000000', '$2a$10$BpOhXYt7JSZxs3nTks1WtO8HVtiqiwhJwqbxk0kUUP1dfXO64Wsnm', NULL, 'active', NULL, '2026-05-13 16:10:04', '2026-05-13 16:10:04'),
('51d0b2d1-2264-4b14-9084-610e906e9efb', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '82cb214f-cfb1-4f56-bdef-ce33064c0629', 'Alice Umutoni', 'alice@school.com', NULL, '$2a$10$84ngt2sJJfNH1LMuJi8RtuYi6IUL.hsnsOagzKHgiYI.RSh5oEDay', NULL, 'active', NULL, '2026-05-19 13:16:25', '2026-05-19 13:16:25'),
('aa51113d-a6e2-4abd-8423-4124de35f5ed', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', 'd9149a82-47e8-43a8-a777-1b0f9d338581', 'Marie-Claire Uwineza', 'marieclaire@school.com', NULL, '$2a$10$OCuSMQhqHA.drEOu7AVW3eHmJMtf6LqOKScRhGgJC7E.LPVYMK3a2', NULL, 'active', NULL, '2026-05-19 13:16:23', '2026-05-19 13:16:23'),
('da7fd392-40c3-451b-b9a6-2820d24499b5', 'a84ebdb0-e6a9-45d9-93f5-25e436d37255', '772aa8c1-4851-4803-90d5-926d78bd207c', 'Eric Mutabazi', 'eric@school.com', NULL, '$2a$10$.PWito6h0/Kf.dDYBci6hOl.1GDD6HYRt/H17WJ.VOgH.YmMrI.76', NULL, 'active', NULL, '2026-05-19 13:16:24', '2026-05-19 13:16:24');

-- --------------------------------------------------------

--
-- Table structure for table `user_notification_preferences`
--

CREATE TABLE `user_notification_preferences` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `channel_priority` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`channel_priority`)),
  `is_muted` tinyint(1) DEFAULT 0,
  `quiet_hours_start` time DEFAULT NULL,
  `quiet_hours_end` time DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wallets`
--

CREATE TABLE `wallets` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `owner_type` enum('Student','Staff','Vendor','System') NOT NULL,
  `owner_id` char(36) NOT NULL,
  `balance` decimal(15,2) DEFAULT 0.00,
  `status` enum('Active','Frozen','Closed') DEFAULT 'Active',
  `pin_hash` varchar(255) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wallet_transactions`
--

CREATE TABLE `wallet_transactions` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `wallet_id` char(36) NOT NULL,
  `type` enum('Credit','Debit') NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `transaction_type` enum('TopUp','Purchase','Withdrawal','Transfer','CashOut','Refund') NOT NULL,
  `reference_type` varchar(100) DEFAULT NULL,
  `reference_id` char(36) DEFAULT NULL,
  `status` enum('Pending','Completed','Failed','Cancelled') DEFAULT 'Completed',
  `notes` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `workflow_policies`
--

CREATE TABLE `workflow_policies` (
  `id` char(36) NOT NULL,
  `school_id` char(36) NOT NULL,
  `action_key` varchar(100) NOT NULL,
  `trigger_role_id` char(36) DEFAULT NULL,
  `approval_required` tinyint(1) DEFAULT 1,
  `approver_unit_id` char(36) DEFAULT NULL,
  `approver_role_id` char(36) DEFAULT NULL,
  `min_approvals` int(11) DEFAULT 1,
  `sequence_order` int(11) DEFAULT 1,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academic_groups`
--
ALTER TABLE `academic_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_group` (`academic_year_id`,`grade_id`,`combination_id`),
  ADD UNIQUE KEY `academic_groups_academic_year_id_grade_id_combination_id` (`academic_year_id`,`grade_id`,`combination_id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `grade_id` (`grade_id`),
  ADD KEY `combination_id` (`combination_id`);

--
-- Indexes for table `academic_years`
--
ALTER TABLE `academic_years`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`);

--
-- Indexes for table `admission_applications`
--
ALTER TABLE `admission_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `admission_workflow_logs`
--
ALTER TABLE `admission_workflow_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `application_id` (`application_id`),
  ADD KEY `processed_by_user_id` (`processed_by_user_id`);

--
-- Indexes for table `advance_installments`
--
ALTER TABLE `advance_installments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `advance_id` (`advance_id`),
  ADD KEY `payroll_run_id` (`payroll_run_id`);

--
-- Indexes for table `advance_requests`
--
ALTER TABLE `advance_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `staff_id` (`staff_id`),
  ADD KEY `contract_id` (`contract_id`),
  ADD KEY `partner_id` (`partner_id`),
  ADD KEY `approved_by_staff_id` (`approved_by_staff_id`),
  ADD KEY `target_student_id` (`target_student_id`),
  ADD KEY `target_invoice_id` (`target_invoice_id`);

--
-- Indexes for table `agents`
--
ALTER TABLE `agents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `station_id` (`station_id`);

--
-- Indexes for table `agent_stations`
--
ALTER TABLE `agent_stations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `agent_transactions`
--
ALTER TABLE `agent_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `agent_id` (`agent_id`);

--
-- Indexes for table `attendance_authorizations`
--
ALTER TABLE `attendance_authorizations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `staff_id` (`staff_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `attendance_records`
--
ALTER TABLE `attendance_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `attendance_sessions`
--
ALTER TABLE `attendance_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `taken_by_staff_id` (`taken_by_staff_id`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blocks`
--
ALTER TABLE `blocks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_block_per_school` (`school_id`,`name`),
  ADD UNIQUE KEY `blocks_school_id_name` (`school_id`,`name`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indexes for table `chat_participants`
--
ALTER TABLE `chat_participants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `room_id` (`room_id`,`user_id`),
  ADD UNIQUE KEY `chat_participants_room_id_user_id` (`room_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `target_group_id` (`target_group_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_stream` (`academic_group_id`,`stream`),
  ADD UNIQUE KEY `classes_academic_group_id_stream` (`academic_group_id`,`stream`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `combinations`
--
ALTER TABLE `combinations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_comb_per_school` (`school_id`,`name`),
  ADD UNIQUE KEY `combinations_school_id_name` (`school_id`,`name`),
  ADD KEY `level_id` (`level_id`);

--
-- Indexes for table `deal_installments`
--
ALTER TABLE `deal_installments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `payroll_run_id` (`payroll_run_id`);

--
-- Indexes for table `deal_orders`
--
ALTER TABLE `deal_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `buyer_user_id` (`buyer_user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `deal_products`
--
ALTER TABLE `deal_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `partner_id` (`partner_id`);

--
-- Indexes for table `deal_product_variants`
--
ALTER TABLE `deal_product_variants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `discipline_policies`
--
ALTER TABLE `discipline_policies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`);

--
-- Indexes for table `discipline_records`
--
ALTER TABLE `discipline_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `recorded_by_staff_id` (`recorded_by_staff_id`),
  ADD KEY `attendance_record_id` (`attendance_record_id`),
  ADD KEY `policy_id` (`policy_id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `document_type_id` (`document_type_id`);

--
-- Indexes for table `document_types`
--
ALTER TABLE `document_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_doc_type` (`school_id`,`name`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_student_enrollment` (`student_id`,`academic_year_id`),
  ADD UNIQUE KEY `enrollments_student_id_academic_year_id` (`student_id`,`academic_year_id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `academic_year_id` (`academic_year_id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `requisition_id` (`requisition_id`),
  ADD KEY `recorded_by_staff_id` (`recorded_by_staff_id`);

--
-- Indexes for table `fee_categories`
--
ALTER TABLE `fee_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_fee_cat` (`school_id`,`name`);

--
-- Indexes for table `fee_invoices`
--
ALTER TABLE `fee_invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `fee_structure_id` (`fee_structure_id`),
  ADD KEY `academic_year_id` (`academic_year_id`),
  ADD KEY `term_id` (`term_id`);

--
-- Indexes for table `fee_payments`
--
ALTER TABLE `fee_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `invoice_id` (`invoice_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `collected_by_staff_id` (`collected_by_staff_id`);

--
-- Indexes for table `fee_structures`
--
ALTER TABLE `fee_structures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `academic_year_id` (`academic_year_id`),
  ADD KEY `term_id` (`term_id`),
  ADD KEY `target_group_id` (`target_group_id`);

--
-- Indexes for table `fee_structure_items`
--
ALTER TABLE `fee_structure_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fee_structure_id` (`fee_structure_id`),
  ADD KEY `fee_category_id` (`fee_category_id`);

--
-- Indexes for table `grades`
--
ALTER TABLE `grades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_grade_per_level` (`level_id`,`name`),
  ADD UNIQUE KEY `grades_level_id_name` (`level_id`,`name`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_id` (`parent_id`),
  ADD KEY `idx_groups_resolution` (`school_id`,`resolution_type`,`is_active`);

--
-- Indexes for table `group_memberships`
--
ALTER TABLE `group_memberships`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `group_role_id` (`group_role_id`),
  ADD KEY `idx_group_memberships_lookup` (`group_id`,`status`,`user_id`);

--
-- Indexes for table `group_roles`
--
ALTER TABLE `group_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_role_per_group` (`group_id`,`name`),
  ADD UNIQUE KEY `group_roles_group_id_name` (`group_id`,`name`);

--
-- Indexes for table `inventory_items`
--
ALTER TABLE `inventory_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`);

--
-- Indexes for table `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inventory_item_id` (`inventory_item_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `approved_by_staff_id` (`approved_by_staff_id`);

--
-- Indexes for table `levels`
--
ALTER TABLE `levels`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_level_per_school` (`school_id`,`name`),
  ADD UNIQUE KEY `levels_school_id_name` (`school_id`,`name`);

--
-- Indexes for table `library_books`
--
ALTER TABLE `library_books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inventory_item_id` (`inventory_item_id`);

--
-- Indexes for table `library_fines`
--
ALTER TABLE `library_fines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `loan_id` (`loan_id`),
  ADD KEY `discipline_record_id` (`discipline_record_id`),
  ADD KEY `fee_invoice_id` (`fee_invoice_id`);

--
-- Indexes for table `library_loans`
--
ALTER TABLE `library_loans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `book_id` (`book_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `smart_card_log_id` (`smart_card_log_id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_location_per_school` (`school_id`,`name`),
  ADD UNIQUE KEY `locations_school_id_name` (`school_id`,`name`),
  ADD KEY `block_id` (`block_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `notification_policies`
--
ALTER TABLE `notification_policies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `school_id` (`school_id`,`event_type`,`trigger_condition`),
  ADD UNIQUE KEY `notification_policies_school_id_event_type_trigger_condition` (`school_id`,`event_type`,`trigger_condition`);

--
-- Indexes for table `organization_units`
--
ALTER TABLE `organization_units`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `parents`
--
ALTER TABLE `parents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `partners`
--
ALTER TABLE `partners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payroll_runs`
--
ALTER TABLE `payroll_runs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `processed_by_user_id` (`processed_by_user_id`);

--
-- Indexes for table `payslips`
--
ALTER TABLE `payslips`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payroll_run_id` (`payroll_run_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `payslip_items`
--
ALTER TABLE `payslip_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payslip_id` (`payslip_id`);

--
-- Indexes for table `pay_grades`
--
ALTER TABLE `pay_grades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `requisitions`
--
ALTER TABLE `requisitions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `requisition_items`
--
ALTER TABLE `requisition_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `requisition_id` (`requisition_id`),
  ADD KEY `inventory_item_id` (`inventory_item_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_role_per_school` (`school_id`,`name`),
  ADD UNIQUE KEY `roles_school_id_name` (`school_id`,`name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `routine_activities`
--
ALTER TABLE `routine_activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `slot_id` (`slot_id`),
  ADD KEY `responsible_group_id` (`responsible_group_id`),
  ADD KEY `location_id` (`location_id`),
  ADD KEY `transport_route_id` (`transport_route_id`);

--
-- Indexes for table `routine_activity_target_groups`
--
ALTER TABLE `routine_activity_target_groups`
  ADD PRIMARY KEY (`activity_id`,`group_id`),
  ADD KEY `group_id` (`group_id`);

--
-- Indexes for table `routine_templates`
--
ALTER TABLE `routine_templates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`);

--
-- Indexes for table `routine_time_slots`
--
ALTER TABLE `routine_time_slots`
  ADD PRIMARY KEY (`id`),
  ADD KEY `template_id` (`template_id`);

--
-- Indexes for table `salary_components`
--
ALTER TABLE `salary_components`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`);

--
-- Indexes for table `schools`
--
ALTER TABLE `schools`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `school_calendar`
--
ALTER TABLE `school_calendar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_date_per_school` (`school_id`,`date`),
  ADD KEY `routine_template_id` (`routine_template_id`);

--
-- Indexes for table `school_deal_availability`
--
ALTER TABLE `school_deal_availability`
  ADD PRIMARY KEY (`school_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `smart_cards`
--
ALTER TABLE `smart_cards`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `card_number` (`card_number`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `smart_card_logs`
--
ALTER TABLE `smart_card_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `card_id` (`card_id`),
  ADD KEY `reader_id` (`reader_id`),
  ADD KEY `attendance_record_id` (`attendance_record_id`);

--
-- Indexes for table `smart_card_readers`
--
ALTER TABLE `smart_card_readers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reader_serial` (`reader_serial`),
  ADD KEY `school_id` (`school_id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `unique_staff_per_school` (`school_id`,`staff_number`),
  ADD UNIQUE KEY `staff_school_id_staff_number` (`school_id`,`staff_number`),
  ADD KEY `fk_staff_reporting_to` (`reporting_to_id`);

--
-- Indexes for table `staff_assignments`
--
ALTER TABLE `staff_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `unit_id` (`unit_id`);

--
-- Indexes for table `staff_contracts`
--
ALTER TABLE `staff_contracts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `staff_salary_component_mappings`
--
ALTER TABLE `staff_salary_component_mappings`
  ADD PRIMARY KEY (`staff_id`,`component_id`),
  ADD KEY `component_id` (`component_id`);

--
-- Indexes for table `staff_salary_configurations`
--
ALTER TABLE `staff_salary_configurations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `staff_id` (`staff_id`),
  ADD KEY `pay_grade_id` (`pay_grade_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_student_per_school` (`school_id`,`student_id_number`),
  ADD UNIQUE KEY `students_school_id_student_id_number` (`school_id`,`student_id_number`),
  ADD KEY `transport_route_id` (`transport_route_id`);

--
-- Indexes for table `student_parents`
--
ALTER TABLE `student_parents`
  ADD PRIMARY KEY (`student_id`,`parent_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_subject_per_level` (`level_id`,`name`),
  ADD KEY `school_id` (`school_id`);

--
-- Indexes for table `terms`
--
ALTER TABLE `terms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `academic_year_id` (`academic_year_id`);

--
-- Indexes for table `term_phases`
--
ALTER TABLE `term_phases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `term_id` (`term_id`);

--
-- Indexes for table `timetables`
--
ALTER TABLE `timetables`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `academic_year_id` (`academic_year_id`),
  ADD KEY `term_id` (`term_id`);

--
-- Indexes for table `timetable_entries`
--
ALTER TABLE `timetable_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `timetable_id` (`timetable_id`),
  ADD KEY `slot_id` (`slot_id`),
  ADD KEY `staff_id` (`staff_id`),
  ADD KEY `group_id` (`group_id`),
  ADD KEY `subject_id` (`subject_id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `transport_assignments`
--
ALTER TABLE `transport_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `route_id` (`route_id`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `driver_id` (`driver_id`);

--
-- Indexes for table `transport_routes`
--
ALTER TABLE `transport_routes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`);

--
-- Indexes for table `transport_vehicles`
--
ALTER TABLE `transport_vehicles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `plate_number` (`plate_number`),
  ADD KEY `school_id` (`school_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `user_notification_preferences`
--
ALTER TABLE `user_notification_preferences`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `owner_type` (`owner_type`,`owner_id`),
  ADD UNIQUE KEY `wallets_owner_type_owner_id` (`owner_type`,`owner_id`),
  ADD KEY `school_id` (`school_id`);

--
-- Indexes for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `wallet_id` (`wallet_id`);

--
-- Indexes for table `workflow_policies`
--
ALTER TABLE `workflow_policies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `trigger_role_id` (`trigger_role_id`),
  ADD KEY `approver_unit_id` (`approver_unit_id`),
  ADD KEY `approver_role_id` (`approver_role_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `academic_groups`
--
ALTER TABLE `academic_groups`
  ADD CONSTRAINT `academic_groups_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `academic_groups_ibfk_2` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `academic_groups_ibfk_3` FOREIGN KEY (`grade_id`) REFERENCES `grades` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `academic_groups_ibfk_4` FOREIGN KEY (`combination_id`) REFERENCES `combinations` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `academic_years`
--
ALTER TABLE `academic_years`
  ADD CONSTRAINT `academic_years_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `admission_applications`
--
ALTER TABLE `admission_applications`
  ADD CONSTRAINT `admission_applications_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `admission_applications_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `admission_workflow_logs`
--
ALTER TABLE `admission_workflow_logs`
  ADD CONSTRAINT `admission_workflow_logs_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `admission_applications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `admission_workflow_logs_ibfk_2` FOREIGN KEY (`processed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `advance_installments`
--
ALTER TABLE `advance_installments`
  ADD CONSTRAINT `advance_installments_ibfk_1` FOREIGN KEY (`advance_id`) REFERENCES `advance_requests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `advance_installments_ibfk_2` FOREIGN KEY (`payroll_run_id`) REFERENCES `payroll_runs` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `advance_requests`
--
ALTER TABLE `advance_requests`
  ADD CONSTRAINT `advance_requests_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `advance_requests_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `advance_requests_ibfk_3` FOREIGN KEY (`contract_id`) REFERENCES `staff_contracts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `advance_requests_ibfk_4` FOREIGN KEY (`partner_id`) REFERENCES `partners` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `advance_requests_ibfk_5` FOREIGN KEY (`approved_by_staff_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `advance_requests_ibfk_6` FOREIGN KEY (`target_student_id`) REFERENCES `students` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `advance_requests_ibfk_7` FOREIGN KEY (`target_invoice_id`) REFERENCES `fee_invoices` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `agents`
--
ALTER TABLE `agents`
  ADD CONSTRAINT `agents_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `agents_ibfk_2` FOREIGN KEY (`station_id`) REFERENCES `agent_stations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `agent_transactions`
--
ALTER TABLE `agent_transactions`
  ADD CONSTRAINT `agent_transactions_ibfk_1` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `attendance_authorizations`
--
ALTER TABLE `attendance_authorizations`
  ADD CONSTRAINT `attendance_authorizations_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_authorizations_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `attendance_authorizations_ibfk_3` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `attendance_records`
--
ALTER TABLE `attendance_records`
  ADD CONSTRAINT `attendance_records_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `attendance_sessions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_records_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `attendance_sessions`
--
ALTER TABLE `attendance_sessions`
  ADD CONSTRAINT `attendance_sessions_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_sessions_ibfk_2` FOREIGN KEY (`taken_by_staff_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `blocks`
--
ALTER TABLE `blocks`
  ADD CONSTRAINT `blocks_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_participants`
--
ALTER TABLE `chat_participants`
  ADD CONSTRAINT `chat_participants_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  ADD CONSTRAINT `chat_rooms_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_rooms_ibfk_2` FOREIGN KEY (`target_group_id`) REFERENCES `groups` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `chat_rooms_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `classes_ibfk_2` FOREIGN KEY (`academic_group_id`) REFERENCES `academic_groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `classes_ibfk_3` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `combinations`
--
ALTER TABLE `combinations`
  ADD CONSTRAINT `combinations_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `combinations_ibfk_2` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `deal_installments`
--
ALTER TABLE `deal_installments`
  ADD CONSTRAINT `deal_installments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `deal_orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `deal_installments_ibfk_2` FOREIGN KEY (`payroll_run_id`) REFERENCES `payroll_runs` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `deal_orders`
--
ALTER TABLE `deal_orders`
  ADD CONSTRAINT `deal_orders_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `deal_orders_ibfk_2` FOREIGN KEY (`buyer_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `deal_orders_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `deal_products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `deal_products`
--
ALTER TABLE `deal_products`
  ADD CONSTRAINT `deal_products_ibfk_1` FOREIGN KEY (`partner_id`) REFERENCES `partners` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `deal_product_variants`
--
ALTER TABLE `deal_product_variants`
  ADD CONSTRAINT `deal_product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `deal_products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `discipline_policies`
--
ALTER TABLE `discipline_policies`
  ADD CONSTRAINT `discipline_policies_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `discipline_records`
--
ALTER TABLE `discipline_records`
  ADD CONSTRAINT `discipline_records_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `discipline_records_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `discipline_records_ibfk_3` FOREIGN KEY (`recorded_by_staff_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `discipline_records_ibfk_4` FOREIGN KEY (`attendance_record_id`) REFERENCES `attendance_records` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `discipline_records_ibfk_5` FOREIGN KEY (`policy_id`) REFERENCES `discipline_policies` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `documents_ibfk_2` FOREIGN KEY (`document_type_id`) REFERENCES `document_types` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `document_types`
--
ALTER TABLE `document_types`
  ADD CONSTRAINT `document_types_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_3` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_4` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `expenses_ibfk_2` FOREIGN KEY (`requisition_id`) REFERENCES `requisitions` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `expenses_ibfk_3` FOREIGN KEY (`recorded_by_staff_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `fee_categories`
--
ALTER TABLE `fee_categories`
  ADD CONSTRAINT `fee_categories_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `fee_invoices`
--
ALTER TABLE `fee_invoices`
  ADD CONSTRAINT `fee_invoices_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fee_invoices_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fee_invoices_ibfk_3` FOREIGN KEY (`fee_structure_id`) REFERENCES `fee_structures` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fee_invoices_ibfk_4` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fee_invoices_ibfk_5` FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `fee_payments`
--
ALTER TABLE `fee_payments`
  ADD CONSTRAINT `fee_payments_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fee_payments_ibfk_2` FOREIGN KEY (`invoice_id`) REFERENCES `fee_invoices` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fee_payments_ibfk_3` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fee_payments_ibfk_4` FOREIGN KEY (`collected_by_staff_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `fee_structures`
--
ALTER TABLE `fee_structures`
  ADD CONSTRAINT `fee_structures_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fee_structures_ibfk_2` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fee_structures_ibfk_3` FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fee_structures_ibfk_4` FOREIGN KEY (`target_group_id`) REFERENCES `groups` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `fee_structure_items`
--
ALTER TABLE `fee_structure_items`
  ADD CONSTRAINT `fee_structure_items_ibfk_1` FOREIGN KEY (`fee_structure_id`) REFERENCES `fee_structures` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fee_structure_items_ibfk_2` FOREIGN KEY (`fee_category_id`) REFERENCES `fee_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `grades`
--
ALTER TABLE `grades`
  ADD CONSTRAINT `grades_ibfk_1` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `groups_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `groups` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `group_memberships`
--
ALTER TABLE `group_memberships`
  ADD CONSTRAINT `group_memberships_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `group_memberships_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `group_memberships_ibfk_3` FOREIGN KEY (`group_role_id`) REFERENCES `group_roles` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `group_roles`
--
ALTER TABLE `group_roles`
  ADD CONSTRAINT `group_roles_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inventory_items`
--
ALTER TABLE `inventory_items`
  ADD CONSTRAINT `inventory_items_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  ADD CONSTRAINT `inventory_transactions_ibfk_1` FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inventory_transactions_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `leave_requests_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `leave_requests_ibfk_3` FOREIGN KEY (`approved_by_staff_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `levels`
--
ALTER TABLE `levels`
  ADD CONSTRAINT `levels_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `library_books`
--
ALTER TABLE `library_books`
  ADD CONSTRAINT `library_books_ibfk_1` FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `library_fines`
--
ALTER TABLE `library_fines`
  ADD CONSTRAINT `library_fines_ibfk_1` FOREIGN KEY (`loan_id`) REFERENCES `library_loans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `library_fines_ibfk_2` FOREIGN KEY (`discipline_record_id`) REFERENCES `discipline_records` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `library_fines_ibfk_3` FOREIGN KEY (`fee_invoice_id`) REFERENCES `fee_invoices` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `library_loans`
--
ALTER TABLE `library_loans`
  ADD CONSTRAINT `library_loans_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `library_loans_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `library_books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `library_loans_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `library_loans_ibfk_4` FOREIGN KEY (`smart_card_log_id`) REFERENCES `smart_card_logs` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `locations`
--
ALTER TABLE `locations`
  ADD CONSTRAINT `locations_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `locations_ibfk_2` FOREIGN KEY (`block_id`) REFERENCES `blocks` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notification_policies`
--
ALTER TABLE `notification_policies`
  ADD CONSTRAINT `notification_policies_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `organization_units`
--
ALTER TABLE `organization_units`
  ADD CONSTRAINT `organization_units_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `organization_units_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `organization_units` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `parents`
--
ALTER TABLE `parents`
  ADD CONSTRAINT `parents_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `parents_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payroll_runs`
--
ALTER TABLE `payroll_runs`
  ADD CONSTRAINT `payroll_runs_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payroll_runs_ibfk_2` FOREIGN KEY (`processed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payslips`
--
ALTER TABLE `payslips`
  ADD CONSTRAINT `payslips_ibfk_1` FOREIGN KEY (`payroll_run_id`) REFERENCES `payroll_runs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payslips_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payslip_items`
--
ALTER TABLE `payslip_items`
  ADD CONSTRAINT `payslip_items_ibfk_1` FOREIGN KEY (`payslip_id`) REFERENCES `payslips` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pay_grades`
--
ALTER TABLE `pay_grades`
  ADD CONSTRAINT `pay_grades_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `requisitions`
--
ALTER TABLE `requisitions`
  ADD CONSTRAINT `requisitions_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `requisitions_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `requisition_items`
--
ALTER TABLE `requisition_items`
  ADD CONSTRAINT `requisition_items_ibfk_1` FOREIGN KEY (`requisition_id`) REFERENCES `requisitions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `requisition_items_ibfk_2` FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `roles`
--
ALTER TABLE `roles`
  ADD CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `routine_activities`
--
ALTER TABLE `routine_activities`
  ADD CONSTRAINT `routine_activities_ibfk_1` FOREIGN KEY (`slot_id`) REFERENCES `routine_time_slots` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `routine_activities_ibfk_2` FOREIGN KEY (`responsible_group_id`) REFERENCES `groups` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `routine_activities_ibfk_3` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `routine_activities_ibfk_4` FOREIGN KEY (`transport_route_id`) REFERENCES `transport_routes` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `routine_activity_target_groups`
--
ALTER TABLE `routine_activity_target_groups`
  ADD CONSTRAINT `routine_activity_target_groups_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `routine_activities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `routine_activity_target_groups_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `routine_templates`
--
ALTER TABLE `routine_templates`
  ADD CONSTRAINT `routine_templates_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `routine_time_slots`
--
ALTER TABLE `routine_time_slots`
  ADD CONSTRAINT `routine_time_slots_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `routine_templates` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `salary_components`
--
ALTER TABLE `salary_components`
  ADD CONSTRAINT `salary_components_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `school_calendar`
--
ALTER TABLE `school_calendar`
  ADD CONSTRAINT `school_calendar_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `school_calendar_ibfk_2` FOREIGN KEY (`routine_template_id`) REFERENCES `routine_templates` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `school_deal_availability`
--
ALTER TABLE `school_deal_availability`
  ADD CONSTRAINT `school_deal_availability_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `school_deal_availability_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `deal_products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `smart_cards`
--
ALTER TABLE `smart_cards`
  ADD CONSTRAINT `smart_cards_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `smart_cards_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `smart_card_logs`
--
ALTER TABLE `smart_card_logs`
  ADD CONSTRAINT `smart_card_logs_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `smart_card_logs_ibfk_2` FOREIGN KEY (`card_id`) REFERENCES `smart_cards` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `smart_card_logs_ibfk_3` FOREIGN KEY (`reader_id`) REFERENCES `smart_card_readers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `smart_card_logs_ibfk_4` FOREIGN KEY (`attendance_record_id`) REFERENCES `attendance_records` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `smart_card_readers`
--
ALTER TABLE `smart_card_readers`
  ADD CONSTRAINT `smart_card_readers_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `fk_staff_reporting_to` FOREIGN KEY (`reporting_to_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `staff_ibfk_2` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `staff_assignments`
--
ALTER TABLE `staff_assignments`
  ADD CONSTRAINT `staff_assignments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `staff_assignments_ibfk_2` FOREIGN KEY (`unit_id`) REFERENCES `organization_units` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `staff_contracts`
--
ALTER TABLE `staff_contracts`
  ADD CONSTRAINT `staff_contracts_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `staff_contracts_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `staff_salary_component_mappings`
--
ALTER TABLE `staff_salary_component_mappings`
  ADD CONSTRAINT `staff_salary_component_mappings_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `staff_salary_component_mappings_ibfk_2` FOREIGN KEY (`component_id`) REFERENCES `salary_components` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `staff_salary_configurations`
--
ALTER TABLE `staff_salary_configurations`
  ADD CONSTRAINT `staff_salary_configurations_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `staff_salary_configurations_ibfk_2` FOREIGN KEY (`pay_grade_id`) REFERENCES `pay_grades` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `students_ibfk_2` FOREIGN KEY (`transport_route_id`) REFERENCES `transport_routes` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `student_parents`
--
ALTER TABLE `student_parents`
  ADD CONSTRAINT `student_parents_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_parents_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `subjects_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_2` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `terms`
--
ALTER TABLE `terms`
  ADD CONSTRAINT `terms_ibfk_1` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `term_phases`
--
ALTER TABLE `term_phases`
  ADD CONSTRAINT `term_phases_ibfk_1` FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `timetables`
--
ALTER TABLE `timetables`
  ADD CONSTRAINT `timetables_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `timetables_ibfk_2` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `timetables_ibfk_3` FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `timetable_entries`
--
ALTER TABLE `timetable_entries`
  ADD CONSTRAINT `timetable_entries_ibfk_1` FOREIGN KEY (`timetable_id`) REFERENCES `timetables` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `timetable_entries_ibfk_2` FOREIGN KEY (`slot_id`) REFERENCES `routine_time_slots` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `timetable_entries_ibfk_3` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `timetable_entries_ibfk_4` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `timetable_entries_ibfk_5` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `timetable_entries_ibfk_6` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `transport_assignments`
--
ALTER TABLE `transport_assignments`
  ADD CONSTRAINT `transport_assignments_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `transport_routes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transport_assignments_ibfk_2` FOREIGN KEY (`vehicle_id`) REFERENCES `transport_vehicles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transport_assignments_ibfk_3` FOREIGN KEY (`driver_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `transport_routes`
--
ALTER TABLE `transport_routes`
  ADD CONSTRAINT `transport_routes_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transport_vehicles`
--
ALTER TABLE `transport_vehicles`
  ADD CONSTRAINT `transport_vehicles_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_notification_preferences`
--
ALTER TABLE `user_notification_preferences`
  ADD CONSTRAINT `user_notification_preferences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wallets`
--
ALTER TABLE `wallets`
  ADD CONSTRAINT `wallets_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD CONSTRAINT `wallet_transactions_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wallet_transactions_ibfk_2` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `workflow_policies`
--
ALTER TABLE `workflow_policies`
  ADD CONSTRAINT `workflow_policies_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `workflow_policies_ibfk_2` FOREIGN KEY (`trigger_role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `workflow_policies_ibfk_3` FOREIGN KEY (`approver_unit_id`) REFERENCES `organization_units` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `workflow_policies_ibfk_4` FOREIGN KEY (`approver_role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
