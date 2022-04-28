-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 20, 2022 at 11:49 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cheemsarena`
--

-- --------------------------------------------------------

--
-- Table structure for table `mint_list`
--

CREATE TABLE `mint_list` (
  `id` int(11) NOT NULL,
  `mint` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mint_list`
--

INSERT INTO `mint_list` (`id`, `mint`) VALUES
(1, 'GCwvj1BNFMQpNJD4iKrDT2tLVmsjzYirNTPSX8qotJio'),
(2, 'DTFPNFNJupq4yXJNMEYzK9BnFc9zWuFoxV1PvMC1gfB9'),
(3, '2gZW4FzsqmotKHK33bd7bMmJ6DxnZYEdxSBw1DvxcRP1'),
(4, '6hqmSUYnnLbJdcwwpZQd2Jsd32wU7g4syxJP5UqbH57B'),
(5, '2UHKLN7JSVXgYSvYGFWSDchEr7eagfwr7bKd17Vcynr6'),
(6, 'FfhKV5XCCrxbXzn4MF81y74Qgb5oQzoWwrdCFJMKuJES'),
(7, 'GxRjjfwmKcMK9yPHGUT5Zbz3rJXDBdaWpwxorMBTScvV'),
(8, 'toSTzu81mtng2ssTTQiJXor3DGVyVnpFrQP5UXBqYMM'),
(9, 'GzuEoSVcJBp7edEGif6zojDhGn6AuExuqWL4P23gHUz2'),
(10, 'GAr2zW3t5BWGeTZg93URaqyWw1RocG1MjkQi8N5FdKCF'),
(11, '6jJN1uxehgYpRuaH3U5rCd4e5rDDCVzFXyzaHpBzmSuh'),
(12, 'Bofhfri8WBdWDhd4XdKTfgJyyNWunCEDgkMN354jFZ56'),
(13, '1mTbdsd6obUHiyk9pAbbS4C2RZ1qxkJZLuF23qk4phC'),
(14, 'C32Dd39i2Mpj9cuhTwiZLC6jFQKG3syYreJ8japt2DaU'),
(15, 'Eq7he3SDiK9edFbcBwmamsxN2dn3YmNDAv6Po2QiUAPq'),
(16, 'J1mAZjtcspqMwyPvYWxsqjtbEMopQB8nxs7Ya1hh9rNG'),
(17, 'G6wR8qXzzM8Jvy9TDQwin9feXbQaQfHUGqLYh3rWvtRc'),
(18, 'F9uhT8oFTbi3SaCr24CRV9pvaM7egK16VPPQhbTsWXQE'),
(19, 'DH58k2CH4Hg7aG6MApLKgZBE5Hd29TpohMzcnaHhYz3r'),
(20, '8DUUzYDZGw26czZN7TX3NwbKmxgYYApTqG8hgMcbtGHV'),
(21, '37c4FiKVnWBoYoKeECmRqpnZrrc8gdu7GVtqLvRyQdv1'),
(22, '53xJzGyubXpPwyU5ChAno3FWzUFBXBVMTW9gmvtaV5Ee'),
(23, 'raYVFKUXMdHmcUgWFeisRRTVdUqks7kqBWfbebDN975'),
(24, '9RN8YKMyFV1xx1fGYMnGeTh7hdAKZDAotRSSYXWrMbFe'),
(25, 'FBjfMu97MPJQ82y5wLzCXNZiw81roWtr7juoEeaxVDfG'),
(26, '78RuvHJBvGwzWV26UmQUQHoedV1mw3yMyxJQL6esvNfm'),
(27, 'BXnrzYmTxHXAd38WdJej6pnLoiNtXsoKbhUUy23nX9N1'),
(28, 'DRqBiRy6BZN4Vt1XSZBceY8LKH9TEPwkLmHYik4wzAAd'),
(29, '6Qcv72HR7QSWZUZH1GR6um8jzkhu9DbsyfhwQtHueK6u'),
(30, 'G1hBSbiAtHU7KWSbiEsy2VysiXAwayAXLG4NK4V8QsrW'),
(31, 'Gi4h3ZBtvA91NLQ5fNfMwCrCXpQ4aJkadeeuJKdSnLkZ'),
(32, '32pnPdQm39xKLseo7vDCJtZWPv7KYdezkK9iMDtDFpzd'),
(33, 'E55GSPV611B9tusAzAPn5RmBrfmJvwTS1t6Kwno1rrzp'),
(34, 'FpvgXVyNEFUV2pR1HKQLyk1UEeZ1FhNGZqy6aa5P9WVV'),
(35, '3M33SbynPZDXk1qNQtyykatv213W9FDGcBnAqYRkutpY'),
(36, '3mY5uF1KafCUzVzLDLgfQ3KEPKUFj8bBhbT1m9boxXDr'),
(37, '61UcBsrGyc71mZxfrJDGJeHgwdcdoZjBpicqy271JJD5'),
(38, '9XxgkGmrYkjCGCybQ6BXRtftRLvq4ypPirDw4KfH81yB'),
(39, 'EmhPdqMmNYLQSmJtoe52SowPU7phecqbBnfW1Tpvvmx1'),
(40, 'gyoEoWuhe4daLq2jvBBaX8xUggdCxZYuf9DhGLjJPA3'),
(41, 'A7EZND31r8MJgXYB3BR4qKtXb7oMEMQ2YjYtSYLo9u4a');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `walletAddress` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `walletAddress`) VALUES
(10, 'talhajaami', 'talhajaami@gmail.com', '$2a$10$bu8OafD0p1Izl2Frx3OnXudKVw8w3SMMi9QcEDqwgJEqa5dhJ.Zye', '21YGCvp4zDkkZEvyzkEjW7dCWiJazwsB1tRXNT7VM9Ke'),
(12, 'tjaami', 'talhajaami005@gmail.com', '$2a$10$rBPw05idd1pOgE2IkjhVEel4l6lA4VBW.vXsIv1bwKtTgL2oXE4wK', 'ERZzVB4KuGprBLgfLq5r6YutektMp7xZQTC952BmGhXy'),
(13, 'zohaib', 'zohaib@gmail.com', '$2a$10$uumYGfyv7SfFT6p9M7VNGODOwk1yyQHu8neLccSxKxkbDG5irIeUi', 'A1dtvVaRo1YzijAi49ie81rrzL5SiVnANTYpJ17MD11M');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mint_list`
--
ALTER TABLE `mint_list`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mint_list`
--
ALTER TABLE `mint_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
