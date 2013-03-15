-- MySQL dump 10.13  Distrib 5.5.9, for Win32 (x86)
--
-- Host: odysseus2    Database: cnes-fuse
-- ------------------------------------------------------
-- Server version	5.1.41-3ubuntu12.10

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
-- Table structure for table `HEADERS`
--

DROP TABLE IF EXISTS `HEADERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `HEADERS` (
  `DATASET` varchar(8) NOT NULL DEFAULT '',
  `TARGNAME` varchar(30) DEFAULT NULL,
  `RA_TARG` double DEFAULT NULL,
  `DEC_TARG` float DEFAULT NULL,
  `DATEOBS` datetime DEFAULT NULL,
  `EXPTIME` float DEFAULT NULL,
  `APERTURE` varchar(4) DEFAULT NULL,
  `MODE` varchar(4) DEFAULT NULL,
  `EXPOS_NBR` tinyint(4) DEFAULT NULL,
  `VMAG` float DEFAULT NULL,
  `SP_TYPE` varchar(4) DEFAULT NULL,
  `EBV` float DEFAULT NULL,
  `OBJCLASS` tinyint(2) DEFAULT NULL,
  `SRC_TYPE` varchar(4) DEFAULT NULL,
  `DATEARCHIV` datetime DEFAULT NULL,
  `DATEPUBLIC` datetime DEFAULT NULL,
  `REF` tinyint(4) DEFAULT NULL,
  `Z` float DEFAULT NULL,
  `STARTTIME` datetime DEFAULT NULL,
  `ENDTIME` datetime DEFAULT NULL,
  `ELAT` float DEFAULT NULL,
  `ELONG` float DEFAULT NULL,
  `GLAT` float DEFAULT NULL,
  `GLONG` float DEFAULT NULL,
  `APER_PA` float DEFAULT NULL,
  `HIGH_PROPER_MOTION` char(1) DEFAULT NULL,
  `MOVING_TARGET` char(1) DEFAULT NULL,
  `PR_INV_L` varchar(15) DEFAULT NULL,
  `PR_INV_F` varchar(15) DEFAULT NULL,
  `LOADEDatIAP` char(1) DEFAULT 'N',
  `HEALPIXID` bigint(20) DEFAULT NULL,
  `X_POS` double DEFAULT NULL,
  `Y_POS` double DEFAULT NULL,
  `Z_POS` double DEFAULT NULL,
  PRIMARY KEY (`DATASET`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2011-08-19 14:36:32
