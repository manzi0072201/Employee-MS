-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 11, 2026 at 11:08 AM
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
-- Database: `epms`
--

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `Departmentcode` varchar(10) NOT NULL,
  `DepartmentName` varchar(50) DEFAULT NULL,
  `GroSalary` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `empNumber` int(11) NOT NULL,
  `fname` varchar(20) DEFAULT NULL,
  `lname` varchar(10) DEFAULT NULL,
  `address` varchar(10) DEFAULT NULL,
  `gender` enum('Female, Male') DEFAULT NULL,
  `postion` varchar(20) DEFAULT NULL,
  `Departmentcode` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`empNumber`, `fname`, `lname`, `address`, `gender`, `postion`, `Departmentcode`) VALUES
(1, 'John', 'Doe', 'Kigali', '', 'Manager', NULL),
(3, 'Kwizera', 'Boss', 'Masaka', '', 'Head Master', NULL),
(4, 'Gilbert', 'Tonto', 'Kacyiru', '', 'Student', NULL),
(5, 'John', 'Doe', 'Elle', '', 'Teacher', NULL),
(6, 'Josue', 'Meee', 'Muhanga', '', 'HeadGirl', NULL);

--
-- Dumping data for table `salary`
--

INSERT INTO `salary` (`tdeduction`, `monthPymnt`, `gsalary`, `netSalary`, `empNumber`) VALUES
('100', 'January', '2000000', '1999900', 1),
('150', 'January', '1500000', '1499850', 3),
('75', 'January', '1200000', '1199925', 4),
('200', 'January', '2500000', '2499800', 5),
('50', 'January', '1800000', '1799950', 6);

-- --------------------------------------------------------

--
-- Table structure for table `salary`
--

CREATE TABLE `salary` (
  `salaryId` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `tdeduction` varchar(20) DEFAULT NULL,
  `monthPymnt` varchar(20) DEFAULT NULL,
  `gsalary` varchar(20) DEFAULT NULL,
  `netSalary` varchar(20) DEFAULT NULL,
  `empNumber` int(11) NOT NULL,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_salary_employee` FOREIGN KEY (`empNumber`) REFERENCES `employee` (`empNumber`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`Departmentcode`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`empNumber`),
  ADD KEY `fk_employee_department` (`Departmentcode`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`Departmentcode`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `empNumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `employee`
--
ALTER TABLE `employee`
  ADD CONSTRAINT `fk_employee_department` FOREIGN KEY (`Departmentcode`) REFERENCES `department` (`Departmentcode`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
