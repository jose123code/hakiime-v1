-- Active: 1690897362476@@154.56.46.104@3306@hakrgujh_vote_db
-- MariaDB dump 10.19  Distrib 10.6.11-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: hakrgujh_vote_db
-- ------------------------------------------------------
-- Server version	10.6.11-MariaDB-2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `File_store`
--

DROP TABLE IF EXISTS `File_store`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `File_store` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `name` varchar(200) NOT NULL DEFAULT '',
  `path` varchar(200) NOT NULL DEFAULT '',
  `size` varchar(200) NOT NULL DEFAULT '',
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_name` (`name`),
  KEY `idx_path` (`path`),
  KEY `idx_size` (`size`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `File_store`
--

LOCK TABLES `File_store` WRITE;
/*!40000 ALTER TABLE `File_store` DISABLE KEYS */;
/*!40000 ALTER TABLE `File_store` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Login_recoards`
--

DROP TABLE IF EXISTS `Login_recoards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Login_recoards` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `user_id` bigint(20) unsigned NOT NULL,
  `ip_address` varchar(255) NOT NULL,
  `device` varchar(255) NOT NULL,
  `browser` varchar(255) NOT NULL,
  `platform` varchar(255) NOT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_Login_recoards_user` FOREIGN KEY (`user_id`) REFERENCES `users_info` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Login_recoards`
--

LOCK TABLES `Login_recoards` WRITE;
/*!40000 ALTER TABLE `Login_recoards` DISABLE KEYS */;
/*!40000 ALTER TABLE `Login_recoards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ShortenUrl`
--

DROP TABLE IF EXISTS `ShortenUrl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ShortenUrl` (
  `id` bigint(30) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `shorten_url` varchar(255) NOT NULL,
  `full_url` varchar(1000) NOT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_shorten_url` (`shorten_url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ShortenUrl`
--

LOCK TABLES `ShortenUrl` WRITE;
/*!40000 ALTER TABLE `ShortenUrl` DISABLE KEYS */;
/*!40000 ALTER TABLE `ShortenUrl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ShortenUrlType`
--

DROP TABLE IF EXISTS `ShortenUrlType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ShortenUrlType` (
  `id` bigint(30) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `shorten_url_id` bigint(30) unsigned NOT NULL,
  `type` varchar(1000) NOT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_shorten_url_id` (`shorten_url_id`),
  CONSTRAINT `fk_ShortenUrlType_shorten_url_id` FOREIGN KEY (`shorten_url_id`) REFERENCES `ShortenUrl` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ShortenUrlType`
--

LOCK TABLES `ShortenUrlType` WRITE;
/*!40000 ALTER TABLE `ShortenUrlType` DISABLE KEYS */;
/*!40000 ALTER TABLE `ShortenUrlType` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TokenStore`
--

DROP TABLE IF EXISTS `TokenStore`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TokenStore` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `user` bigint(20) unsigned NOT NULL,
  `ip` varchar(250) DEFAULT NULL,
  `token` varchar(250) NOT NULL,
  `valid` varchar(10) DEFAULT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user`),
  CONSTRAINT `fk_TokenStore_user` FOREIGN KEY (`user`) REFERENCES `users_info` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TokenStore`
--

LOCK TABLES `TokenStore` WRITE;
/*!40000 ALTER TABLE `TokenStore` DISABLE KEYS */;
/*!40000 ALTER TABLE `TokenStore` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_type`
--

DROP TABLE IF EXISTS `account_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account_type` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `user_id` bigint(20) unsigned NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `idx_user_account_type_id` (`user_id`),
  CONSTRAINT `fk_user_account_type_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_info` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_type`
--

LOCK TABLES `account_type` WRITE;
/*!40000 ALTER TABLE `account_type` DISABLE KEYS */;
INSERT INTO `account_type` VALUES (1,1,'Company','2023-07-29 08:02:59','2023-07-29 08:02:59','');
/*!40000 ALTER TABLE `account_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `award`
--

DROP TABLE IF EXISTS `award`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `award` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `name` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `edition` int(11) NOT NULL DEFAULT 0,
  `privacy` enum('0','1','2') NOT NULL DEFAULT '0',
  `on_start_email` enum('0','1') NOT NULL DEFAULT '0',
  `weekly_report` enum('0','1') NOT NULL DEFAULT '0',
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `award`
--

LOCK TABLES `award` WRITE;
/*!40000 ALTER TABLE `award` DISABLE KEYS */;
INSERT INTO `award` VALUES (1,'Award-1690411356','<p>empty description null</p>',8,'2','1','0','2023-07-26 23:32:52','2023-07-28 19:28:59',''),(2,'Award-1690413230','<p>empty</p>',0,'0','0','0','2023-07-26 23:32:52','',''),(3,'Award-1690414362','<p>then</p>',0,'0','0','0','2023-07-26 23:32:52','2023-07-26 23:32:52',''),(4,'Award-1690414852','<p>thene</p>',0,'0','0','0','2023-07-26 23:41:29','2023-07-26 23:41:29','');
/*!40000 ALTER TABLE `award` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `award_category`
--

DROP TABLE IF EXISTS `award_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `award_category` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `award_id` bigint(20) unsigned NOT NULL,
  `category_id` bigint(20) unsigned NOT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_award_id` (`award_id`),
  KEY `idx_category_id` (`category_id`),
  CONSTRAINT `fk_award_category_award` FOREIGN KEY (`award_id`) REFERENCES `award` (`id`),
  CONSTRAINT `fk_award_category_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `award_category`
--

LOCK TABLES `award_category` WRITE;
/*!40000 ALTER TABLE `award_category` DISABLE KEYS */;
INSERT INTO `award_category` VALUES (1,3,1,'2023-07-29 00:09:45','2023-07-29 01:00:13','');
/*!40000 ALTER TABLE `award_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `award_links`
--

DROP TABLE IF EXISTS `award_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `award_links` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `diplay` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_link` (`link`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `award_links`
--

LOCK TABLES `award_links` WRITE;
/*!40000 ALTER TABLE `award_links` DISABLE KEYS */;
/*!40000 ALTER TABLE `award_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `award_nominies`
--

DROP TABLE IF EXISTS `award_nominies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `award_nominies` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `award_id` bigint(20) unsigned NOT NULL,
  `categ_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_name` (`name`),
  KEY `idx_award_id` (`award_id`),
  KEY `idx_categ_id` (`categ_id`),
  KEY `idx_code` (`code`),
  CONSTRAINT `fk_award_nominie_award` FOREIGN KEY (`award_id`) REFERENCES `award` (`id`),
  CONSTRAINT `fk_award_nominie_category` FOREIGN KEY (`categ_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `award_nominies`
--

LOCK TABLES `award_nominies` WRITE;
/*!40000 ALTER TABLE `award_nominies` DISABLE KEYS */;
/*!40000 ALTER TABLE `award_nominies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `award_timeframe`
--

DROP TABLE IF EXISTS `award_timeframe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `award_timeframe` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `award_id` bigint(20) unsigned NOT NULL,
  `started_at` varchar(255) NOT NULL,
  `ended_at` varchar(255) NOT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_award_id` (`award_id`),
  KEY `idx_started_at` (`started_at`),
  KEY `idx_ended_at` (`ended_at`),
  CONSTRAINT `fk_award_timeframe_award` FOREIGN KEY (`award_id`) REFERENCES `award` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `award_timeframe`
--

LOCK TABLES `award_timeframe` WRITE;
/*!40000 ALTER TABLE `award_timeframe` DISABLE KEYS */;
INSERT INTO `award_timeframe` VALUES (1,1,'2023-07-28 00:00:00','2023-07-30 23:59:59','2023-07-28 09:55:16','2023-07-28 19:28:59','');
/*!40000 ALTER TABLE `award_timeframe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `award_vote`
--

DROP TABLE IF EXISTS `award_vote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `award_vote` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `user_id` bigint(20) unsigned NOT NULL,
  `award_id` bigint(20) unsigned NOT NULL,
  `categ_id` bigint(20) unsigned NOT NULL,
  `nominie_code` varchar(255) NOT NULL,
  `total_votes` int(11) NOT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_award_id` (`award_id`),
  KEY `idx_categ_id` (`categ_id`),
  KEY `idx_nominie_code` (`nominie_code`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_award_vote_award` FOREIGN KEY (`award_id`) REFERENCES `award` (`id`),
  CONSTRAINT `fk_award_vote_category` FOREIGN KEY (`categ_id`) REFERENCES `category` (`category_id`),
  CONSTRAINT `fk_award_vote_nominie_code` FOREIGN KEY (`nominie_code`) REFERENCES `award_nominies` (`code`),
  CONSTRAINT `fk_award_vote_user` FOREIGN KEY (`user_id`) REFERENCES `users_info` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `award_vote`
--

LOCK TABLES `award_vote` WRITE;
/*!40000 ALTER TABLE `award_vote` DISABLE KEYS */;
/*!40000 ALTER TABLE `award_vote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `category_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `name` varchar(100) DEFAULT NULL,
  `meta_title` varchar(100) DEFAULT NULL,
  `slug` varchar(100) DEFAULT NULL,
  `about` text DEFAULT NULL,
  `start` varchar(255) DEFAULT NULL,
  `end` varchar(255) DEFAULT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL,
  PRIMARY KEY (`category_id`),
  KEY `idx_name` (`name`),
  KEY `idx_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Test Categ 002','Test Categ 00006','test-categ-002','Hello Test','','','2023-07-29 00:09:45','2023-07-29 01:00:13','');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_sub`
--

DROP TABLE IF EXISTS `category_sub`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category_sub` (
  `category_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `category_parent` bigint(20) unsigned NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `meta_title` varchar(100) DEFAULT NULL,
  `slug` varchar(100) DEFAULT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL,
  PRIMARY KEY (`category_id`),
  KEY `idx_name` (`name`),
  KEY `idx_slug` (`slug`),
  KEY `fk_category_sub_category_parent` (`category_parent`),
  CONSTRAINT `fk_category_sub_category_parent` FOREIGN KEY (`category_parent`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_sub`
--

LOCK TABLES `category_sub` WRITE;
/*!40000 ALTER TABLE `category_sub` DISABLE KEYS */;
/*!40000 ALTER TABLE `category_sub` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `location` bigint(20) unsigned NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `idx_location_gen_id` (`location`),
  KEY `idx_location_gen_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,1690617779,'addressLine','','2023-07-29 08:02:59','2023-07-29 08:02:59',''),(2,1690617779,'addressLine1','ggg','2023-07-29 08:02:59','2023-07-29 08:02:59',''),(3,1690617779,'addressLine2','ggg','2023-07-29 08:02:59','2023-07-29 08:02:59',''),(4,1690617779,'location','AF','2023-07-29 08:02:59','2023-07-29 08:02:59',''),(5,1690617779,'city','g','2023-07-29 08:02:59','2023-07-29 08:02:59',''),(6,1690617779,'state','gg','2023-07-29 08:02:59','2023-07-29 08:02:59',''),(7,1690617779,'zipCode','54543','2023-07-29 08:02:59','2023-07-29 08:02:59','');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requests`
--

DROP TABLE IF EXISTS `requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `requests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `user` bigint(20) unsigned NOT NULL,
  `hash` varchar(250) DEFAULT NULL,
  `timestamp` int(10) unsigned DEFAULT NULL,
  `type` bigint(20) DEFAULT NULL,
  `token` varchar(250) NOT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user`),
  KEY `idx_token` (`token`),
  CONSTRAINT `fk_requests_user` FOREIGN KEY (`user`) REFERENCES `users_info` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requests`
--

LOCK TABLES `requests` WRITE;
/*!40000 ALTER TABLE `requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `social`
--

DROP TABLE IF EXISTS `social`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `social` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `user_id` bigint(20) unsigned NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `idx_user_social_type_id` (`user_id`),
  CONSTRAINT `fk_user_social_type_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_info` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `social`
--

LOCK TABLES `social` WRITE;
/*!40000 ALTER TABLE `social` DISABLE KEYS */;
/*!40000 ALTER TABLE `social` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag` (
  `tag_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `tag_name` varchar(100) DEFAULT NULL,
  `meta_title` varchar(100) DEFAULT NULL,
  `tag_slug` varchar(100) DEFAULT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL,
  PRIMARY KEY (`tag_id`),
  KEY `idx_tag_name` (`tag_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_location`
--

DROP TABLE IF EXISTS `user_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_location` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `user_id` bigint(20) unsigned NOT NULL,
  `location` varchar(255) NOT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `idx_location` (`location`),
  KEY `idx_user_id_78` (`user_id`),
  CONSTRAINT `fk_user_location_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_info` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_location`
--

LOCK TABLES `user_location` WRITE;
/*!40000 ALTER TABLE `user_location` DISABLE KEYS */;
INSERT INTO `user_location` VALUES (1,1,'1690617779','2023-07-29 08:02:59','2023-07-29 08:02:59','');
/*!40000 ALTER TABLE `user_location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_meta`
--

DROP TABLE IF EXISTS `user_meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_meta` (
  `meta_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `user_id` bigint(20) unsigned NOT NULL,
  `key` varchar(50) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL,
  PRIMARY KEY (`meta_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_user_meta_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_info` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_meta`
--

LOCK TABLES `user_meta` WRITE;
/*!40000 ALTER TABLE `user_meta` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_meta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_info`
--

DROP TABLE IF EXISTS `users_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_info` (
  `user_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `username` varchar(255) NOT NULL,
  `email` varchar(250) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `userFullname` varchar(250) DEFAULT NULL,
  `password` varchar(250) DEFAULT NULL,
  `phone` varchar(250) DEFAULT NULL,
  `birthDate` varchar(250) DEFAULT NULL,
  `verified` varchar(250) DEFAULT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `deleted_at` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `idx_username` (`username`),
  KEY `idx_email` (`email`),
  KEY `idx_verified` (`verified`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_info`
--

LOCK TABLES `users_info` WRITE;
/*!40000 ALTER TABLE `users_info` DISABLE KEYS */;
INSERT INTO `users_info` VALUES (1,'hakeemm','hakimushamavu@gmail.com',NULL,'hakeem shamavu',NULL,'+254714522717','','0','2023-07-29 08:02:59','2023-07-29 10:30:36','');
/*!40000 ALTER TABLE `users_info` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-31 15:39:20



-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Delete rows with IDs from 2 to 23 in the "award" table
DELETE FROM award
WHERE id BETWEEN 2 AND 23;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;


INSERT INTO `Category_info` (category_id, votes)
SELECT categ_id, COUNT(*) AS votes
FROM award_vote
GROUP BY categ_id
ON DUPLICATE KEY UPDATE votes = VALUES(votes);

INSERT INTO `award_nominies` (code, votes)
SELECT `nominie_code`, COUNT(*) AS votes
FROM award_vote
GROUP BY `nominie_code`
ON DUPLICATE KEY UPDATE votes = VALUES(votes);

INSERT INTO Category_info (category_id, name, link, award_id, members)
SELECT
    cat.category_id,
    cat.name,
    cat.slug,
    an.award_id,
    COUNT(an.categ_id) AS members
FROM
    award_nominies an
JOIN
    category cat ON an.categ_id = cat.category_id
GROUP BY
    an.categ_id
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    link = VALUES(link),
    award_id = VALUES(award_id),members = VALUES(members);