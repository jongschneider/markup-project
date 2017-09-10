CREATE DATABASE  IF NOT EXISTS `html_parser` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `html_parser`;
-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: localhost    Database: html_parser
-- ------------------------------------------------------
-- Server version	5.7.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `html_filenames`
--

DROP TABLE IF EXISTS `html_filenames`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `html_filenames` (
  `html_filename` varchar(40) NOT NULL COMMENT 'Primary Key Individual html filenames.',
  `html_filename_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'TImestamp for when the html file was created.',
  `html_keys_html_keyname` varchar(20) NOT NULL COMMENT 'html keyname associated with the html file.',
  PRIMARY KEY (`html_filename`,`html_keys_html_keyname`),
  UNIQUE KEY `html_filename_UNIQUE` (`html_filename`),
  KEY `fk_html_filenames_html_keys1_idx` (`html_keys_html_keyname`),
  CONSTRAINT `fk_html_filenames_html_keys1` FOREIGN KEY (`html_keys_html_keyname`) REFERENCES `html_keys` (`html_keyname`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `html_filenames`
--

LOCK TABLES `html_filenames` WRITE;
/*!40000 ALTER TABLE `html_filenames` DISABLE KEYS */;
INSERT INTO `html_filenames` VALUES ('aaa_2013_01_05.HtMl','2017-08-31 15:10:28','aaa'),('bob_2013_02_10.html','2017-08-30 10:20:01','bob'),('bob_2013_02_15.html','2017-08-30 10:32:16','bob'),('bob_2013_03_01.html','2017-08-30 10:32:16','bob'),('cari_2013_02_15.html','2017-08-30 10:32:16','cari'),('cari_2013_02_16.html','2017-08-30 10:32:16','cari'),('cari_2013_03_05.html','2017-08-30 10:32:16','cari'),('john_2013_01_05.html','2017-08-30 10:32:16','john'),('john_2013_02_13.html','2017-08-30 10:32:16','john'),('john_2013_03_13.html','2017-08-30 10:32:16','john'),('xxx_02_2015.html','2017-08-31 00:39:42','xxx'),('yyy_2013_04_05.html','2017-08-31 09:44:25','yyy'),('zzz_2013_01_05.html','2017-08-31 09:45:56','zzz');
/*!40000 ALTER TABLE `html_filenames` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `html_keys`
--

DROP TABLE IF EXISTS `html_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `html_keys` (
  `html_keyname` varchar(20) NOT NULL COMMENT 'The keyname of the html file being parsed.',
  PRIMARY KEY (`html_keyname`),
  UNIQUE KEY `key_id_UNIQUE` (`html_keyname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `html_keys`
--

LOCK TABLES `html_keys` WRITE;
/*!40000 ALTER TABLE `html_keys` DISABLE KEYS */;
INSERT INTO `html_keys` VALUES ('aaa'),('bob'),('cari'),('john'),('xxx'),('yyy'),('zzz');
/*!40000 ALTER TABLE `html_keys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scores`
--

DROP TABLE IF EXISTS `scores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `scores` (
  `score_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary Key to identify score instance.',
  `score_runtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'TImestamp for score instance.',
  `score` int(11) NOT NULL,
  `html_filenames_html_filename` varchar(40) NOT NULL COMMENT 'html filename associated with the score instance.',
  `html_filenames_html_keys_html_keyname` varchar(20) NOT NULL COMMENT 'html keyname associated with the filename associated with the score instance.',
  PRIMARY KEY (`score_id`,`html_filenames_html_filename`,`html_filenames_html_keys_html_keyname`),
  KEY `fk_scores_html_filenames1_idx` (`html_filenames_html_filename`,`html_filenames_html_keys_html_keyname`),
  KEY `idx_runtime` (`score_runtime`),
  CONSTRAINT `fk_scores_html_filenames1` FOREIGN KEY (`html_filenames_html_filename`, `html_filenames_html_keys_html_keyname`) REFERENCES `html_filenames` (`html_filename`, `html_keys_html_keyname`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scores`
--

LOCK TABLES `scores` WRITE;
/*!40000 ALTER TABLE `scores` DISABLE KEYS */;
INSERT INTO `scores` VALUES (114,'2017-08-31 09:41:38',-15,'bob_2013_02_10.html','bob'),(115,'2017-08-31 09:41:40',-1,'bob_2013_02_15.html','bob'),(116,'2017-08-31 09:41:44',12,'john_2013_03_13.html','john'),(117,'2017-08-31 09:41:47',12,'xxx_02_2015.html','xxx'),(118,'2017-08-31 09:41:50',3,'cari_2013_02_15.html','cari'),(119,'2017-08-31 09:41:53',39,'john_2013_02_13.html','john'),(120,'2017-08-31 09:41:56',3,'cari_2013_02_15.html','cari'),(121,'2017-08-31 09:41:59',-1,'bob_2013_02_15.html','bob'),(122,'2017-08-31 09:42:02',39,'john_2013_02_13.html','john'),(123,'2017-08-31 09:42:07',39,'john_2013_02_13.html','john'),(124,'2017-08-31 09:42:10',12,'john_2013_03_13.html','john'),(125,'2017-08-31 09:42:13',12,'xxx_02_2015.html','xxx'),(126,'2017-08-31 09:42:16',-15,'bob_2013_02_10.html','bob'),(127,'2017-08-31 09:42:19',39,'john_2013_02_13.html','john'),(128,'2017-08-31 09:42:22',19,'cari_2013_03_05.html','cari'),(129,'2017-08-31 09:42:27',3,'cari_2013_02_16.html','cari'),(130,'2017-08-31 09:42:30',3,'cari_2013_02_15.html','cari'),(131,'2017-08-31 09:44:20',31,'bob_2013_03_01.html','bob'),(132,'2017-08-31 09:44:25',31,'yyy_2013_04_05.html','yyy'),(133,'2017-08-31 09:45:40',12,'john_2013_03_13.html','john'),(134,'2017-08-31 09:45:52',-15,'bob_2013_02_10.html','bob'),(135,'2017-08-31 09:45:56',19,'zzz_2013_01_05.html','zzz'),(136,'2017-08-31 09:47:37',-1,'bob_2013_02_15.html','bob'),(137,'2017-08-31 09:47:55',19,'zzz_2013_01_05.html','zzz'),(138,'2017-08-31 09:49:03',31,'yyy_2013_04_05.html','yyy'),(139,'2017-08-31 09:49:16',12,'xxx_02_2015.html','xxx'),(140,'2017-08-31 09:49:27',3,'cari_2013_02_15.html','cari'),(141,'2017-08-31 12:46:57',3,'cari_2013_02_16.html','cari'),(142,'2017-08-31 14:12:37',39,'john_2013_02_13.html','john'),(143,'2017-08-31 15:10:28',19,'aaa_2013_01_05.HtMl','aaa'),(144,'2017-08-31 15:19:41',12,'xxx_02_2015.html','xxx'),(145,'2017-08-31 18:36:35',19,'john_2013_01_05.html','john'),(146,'2017-08-31 22:25:03',39,'john_2013_02_13.html','john'),(147,'2017-08-31 23:14:10',19,'aaa_2013_01_05.HtMl','aaa'),(148,'2017-09-01 08:29:00',31,'bob_2013_03_01.html','bob'),(149,'2017-09-01 09:09:31',3,'cari_2013_02_16.html','cari'),(150,'2017-09-01 09:13:46',3,'cari_2013_02_16.html','cari'),(151,'2017-09-01 09:16:14',3,'cari_2013_02_16.html','cari'),(152,'2017-09-01 09:18:21',3,'cari_2013_02_16.html','cari'),(153,'2017-09-01 09:18:33',3,'cari_2013_02_16.html','cari'),(154,'2017-09-01 09:18:50',3,'cari_2013_02_16.html','cari'),(155,'2017-09-01 09:20:54',3,'cari_2013_02_16.html','cari'),(156,'2017-09-01 09:21:51',3,'cari_2013_02_16.html','cari'),(157,'2017-09-01 09:22:26',3,'cari_2013_02_16.html','cari'),(158,'2017-09-01 09:22:46',3,'cari_2013_02_16.html','cari'),(159,'2017-09-01 09:23:15',3,'cari_2013_02_16.html','cari'),(160,'2017-09-01 09:23:47',3,'cari_2013_02_16.html','cari'),(161,'2017-09-01 09:25:21',3,'cari_2013_02_16.html','cari'),(162,'2017-09-01 09:25:37',3,'cari_2013_02_16.html','cari'),(163,'2017-09-01 09:25:56',3,'cari_2013_02_16.html','cari'),(164,'2017-09-01 09:26:31',3,'cari_2013_02_16.html','cari'),(165,'2017-09-01 09:26:49',3,'cari_2013_02_16.html','cari'),(166,'2017-09-01 09:27:00',3,'cari_2013_02_16.html','cari'),(167,'2017-09-01 09:27:09',3,'cari_2013_02_16.html','cari'),(168,'2017-09-01 09:27:13',3,'cari_2013_02_15.html','cari'),(169,'2017-09-01 09:27:30',3,'cari_2013_02_15.html','cari'),(170,'2017-09-01 09:28:18',3,'cari_2013_02_15.html','cari'),(171,'2017-09-01 09:29:39',12,'john_2013_03_13.html','john'),(172,'2017-09-01 09:42:53',-15,'bob_2013_02_10.html','bob'),(173,'2017-09-01 09:45:44',31,'yyy_2013_04_05.html','yyy'),(174,'2017-09-01 09:53:44',31,'bob_2013_03_01.html','bob'),(175,'2017-09-01 10:11:13',31,'bob_2013_03_01.html','bob'),(176,'2017-09-01 10:11:39',31,'bob_2013_03_01.html','bob');
/*!40000 ALTER TABLE `scores` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-09-01 11:15:29
