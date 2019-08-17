-- MySQL dump 10.16  Distrib 10.1.26-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: albo
-- ------------------------------------------------------
-- Server version	10.1.26-MariaDB-0+deb9u1

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
-- Current Database: `albo`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `albo` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `albo`;

--
-- Table structure for table `AccessoAzienda`
--

DROP TABLE IF EXISTS `AccessoAzienda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AccessoAzienda` (
  `Mail` varchar(50) NOT NULL,
  `Passwd` varchar(50) NOT NULL,
  `ID` int(11) NOT NULL,
  `Token` varchar(30) DEFAULT NULL,
  `Ruolo` enum('Banditore','Supervisore') NOT NULL DEFAULT 'Banditore',
  PRIMARY KEY (`Mail`),
  KEY `ID` (`ID`),
  CONSTRAINT `AccessoAzienda_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `Azienda` (`IdAzienda`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AccessoAzienda`
--

LOCK TABLES `AccessoAzienda` WRITE;
/*!40000 ALTER TABLE `AccessoAzienda` DISABLE KEYS */;
INSERT INTO `AccessoAzienda` VALUES ('admin','admin',99,NULL,'Supervisore'),('admin@lucegas.it','Prova123',1,NULL,'Banditore'),('BanditoreAndrea@mail.it','BanditoreAndrea',2,NULL,'Banditore'),('BanditoreVitto@mail.it','BanditoreVitto',3,NULL,'Banditore'),('esu710@gmail.com','BanditoreEsu',4,NULL,'Banditore'),('Provaadmin@mail.it','ProvaAdmin',104,NULL,'Banditore');
/*!40000 ALTER TABLE `AccessoAzienda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AccessoForn`
--

DROP TABLE IF EXISTS `AccessoForn`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AccessoForn` (
  `Mail` varchar(50) NOT NULL,
  `Passwd` varchar(50) NOT NULL,
  `ID` int(11) NOT NULL,
  `Token` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`Mail`),
  KEY `ID` (`ID`),
  CONSTRAINT `AccessoForn_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `Fornitore` (`IdForn`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AccessoForn`
--

LOCK TABLES `AccessoForn` WRITE;
/*!40000 ALTER TABLE `AccessoForn` DISABLE KEYS */;
INSERT INTO `AccessoForn` VALUES ('FornitoreAndrea@mail.it','FornitoreAndrea',1,NULL),('FornitoreEsu@mail.it','FornitoreEsu',3,NULL),('FornitoreVitto@mail.it','FornitoreVitto',2,NULL),('franco.rossi@rossiristorazione.it','PasswordRossi',4,NULL);
/*!40000 ALTER TABLE `AccessoForn` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Analisi`
--

DROP TABLE IF EXISTS `Analisi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Analisi` (
  `IdDoc` varchar(40) NOT NULL,
  `RefBando` int(11) NOT NULL,
  PRIMARY KEY (`IdDoc`,`RefBando`),
  KEY `RefBando` (`RefBando`),
  CONSTRAINT `Analisi_ibfk_1` FOREIGN KEY (`IdDoc`) REFERENCES `Documento` (`Codice`) ON DELETE CASCADE,
  CONSTRAINT `Analisi_ibfk_2` FOREIGN KEY (`RefBando`) REFERENCES `Bando` (`IdBando`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Analisi`
--

LOCK TABLES `Analisi` WRITE;
/*!40000 ALTER TABLE `Analisi` DISABLE KEYS */;
INSERT INTO `Analisi` VALUES ('AX123456',1);
/*!40000 ALTER TABLE `Analisi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Azienda`
--

DROP TABLE IF EXISTS `Azienda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Azienda` (
  `IdAzienda` int(11) NOT NULL AUTO_INCREMENT,
  `NomeAzienda` varchar(70) NOT NULL,
  `MailBando` varchar(50) NOT NULL,
  `Telefono` varchar(10) NOT NULL,
  PRIMARY KEY (`IdAzienda`),
  UNIQUE KEY `NomeAzienda` (`NomeAzienda`),
  UNIQUE KEY `MailBando` (`MailBando`),
  UNIQUE KEY `Telefono` (`Telefono`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Azienda`
--

LOCK TABLES `Azienda` WRITE;
/*!40000 ALTER TABLE `Azienda` DISABLE KEYS */;
INSERT INTO `Azienda` VALUES (1,'LuceGas S.p.A','bando2019@lucegas.it','0311234567'),(2,'Banditore Andrea','BanditoreAndrea@bando.it','234534545'),(3,'Banditore Vitto','BanditoreVitto@bando.it','123434545'),(4,'Banditore Esu','BanditoreEsu@bando.it','1234098765'),(99,'Admin','admin@admin.it','0712345543'),(100,'undefined','undefined','undefined'),(104,'ProvaAdmin','Provaadmin@mail.it','3333333123');
/*!40000 ALTER TABLE `Azienda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Bando`
--

DROP TABLE IF EXISTS `Bando`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Bando` (
  `IdBando` int(11) NOT NULL AUTO_INCREMENT,
  `NomeBando` varchar(100) NOT NULL,
  `Categoria` int(3) NOT NULL,
  `DataCreazione` date NOT NULL,
  `DataApertura` date NOT NULL,
  `DataChiusura` date NOT NULL,
  `SogliaMax` float NOT NULL,
  `Stato` enum('Aperto','Chiuso','Nascosto') DEFAULT 'Nascosto',
  `AreaServizio` varchar(50) NOT NULL,
  `SubAreaServizio` varchar(50) DEFAULT NULL,
  `Descr` varchar(2000) DEFAULT NULL,
  `MinRating` int(3) DEFAULT '0',
  PRIMARY KEY (`IdBando`),
  KEY `Categoria` (`Categoria`),
  CONSTRAINT `Bando_ibfk_1` FOREIGN KEY (`Categoria`) REFERENCES `Categoria` (`IdCat`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Bando`
--

LOCK TABLES `Bando` WRITE;
/*!40000 ALTER TABLE `Bando` DISABLE KEYS */;
INSERT INTO `Bando` VALUES (1,'Appalto Mensa interna 2019',3,'2018-09-01','2018-09-18','2018-09-30',10000,'Chiuso','Lazio','Latina',NULL,0),(2,'Appalto Smaltimento rifiuti',17,'2018-11-01','2018-11-18','2018-11-30',30000,'Chiuso','Lazio','Roma',NULL,0),(3,'Gara prova documenti',1,'2019-01-30','2019-01-30','2019-01-30',12,'Chiuso','',NULL,'dgdgddgdgdg',12),(4,'Gara di Prova',3,'2019-02-06','2019-02-06','2019-02-07',15000,'Aperto','',NULL,'Prova Prova Prova Prova',25),(5,'Gara Lancio Centro',12,'2019-02-06','2019-02-16','2019-02-23',0,'Aperto','',NULL,'bacbucbòsakchbaòskhbaòkhvb',80),(6,'Gara Lancio Centro',12,'2019-02-06','2019-02-16','2019-02-23',0,'Aperto','',NULL,'bacbucbòsakchbaòskhbaòkhvb',80),(7,'Gara Lancio Centro',12,'2019-02-06','2019-02-16','2019-02-23',0,'Aperto','',NULL,'bacbucbòsakchbaòskhbaòkhvb',80),(8,'Gara Lancio Centro',12,'2019-02-06','2019-02-16','2019-02-23',0,'Aperto','',NULL,'bacbucbòsakchbaòskhbaòkhvb',80),(9,'Gara Lancio Centro',12,'2019-02-06','2019-02-16','2019-02-23',0,'Aperto','',NULL,'bacbucbòsakchbaòskhbaòkhvb',80),(10,'Gara Lancio Centro',12,'2019-02-06','2019-02-16','2019-02-23',0,'Aperto','',NULL,'bacbucbòsakchbaòskhbaòkhvb',80),(11,'Gara Lancio Centro',12,'2019-02-06','2019-02-16','2019-02-23',0,'Aperto','',NULL,'bacbucbòsakchbaòskhbaòkhvb',80),(12,'Gara Lancio Centro',12,'2019-02-06','2019-02-16','2019-02-23',0,'Aperto','',NULL,'bacbucbòsakchbaòskhbaòkhvb',80),(13,'Gara Lancio Centro',12,'2019-02-06','2019-02-16','2019-02-23',0,'Aperto','',NULL,'bacbucbòsakchbaòskhbaòkhvb',80),(14,'Gara Lancio Centro',12,'2019-02-06','2019-02-16','2019-02-23',0,'Aperto','',NULL,'bacbucbòsakchbaòskhbaòkhvb',80),(15,'Gara Lancio Centro',12,'2019-02-06','2019-02-16','2019-02-23',0,'Aperto','',NULL,'bacbucbòsakchbaòskhbaòkhvb',80),(16,'Gara Lancio Centro',12,'2019-02-06','2019-02-16','2019-02-23',0,'Aperto','',NULL,'bacbucbòsakchbaòskhbaòkhvb',80),(18,'Nessun Titolo Disponibile',1,'2019-02-06','2019-02-06','2019-02-06',0,'Nascosto','',NULL,'Nessuna Descrizione Disponibile',0);
/*!40000 ALTER TABLE `Bando` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Categoria`
--

DROP TABLE IF EXISTS `Categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Categoria` (
  `IdCat` int(3) NOT NULL AUTO_INCREMENT,
  `NomeCat` varchar(40) NOT NULL,
  PRIMARY KEY (`IdCat`),
  UNIQUE KEY `NomeCat` (`NomeCat`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categoria`
--

LOCK TABLES `Categoria` WRITE;
/*!40000 ALTER TABLE `Categoria` DISABLE KEYS */;
INSERT INTO `Categoria` VALUES (1,'Canone di noleggio apparecchi bagni'),(2,'Disinfestazione e derattizzazione'),(3,'Fornitura di Beni'),(4,'Impianti Antincendio'),(8,'Impianti di Sicurezza'),(5,'Impianti Elettrici e Speciali'),(6,'Impianti Idrici e Fognari'),(7,'Impianti Meccanici'),(9,'Insegne'),(10,'Lavori Edili'),(11,'Manutenzione verde'),(12,'Marketing'),(13,'Materiale di consumo bagni'),(14,'Materiale di consumo pulizie'),(15,'Noleggio Compattatori'),(16,'Porte Automatiche'),(17,'Recupero e smaltimento rifiuti'),(18,'Scale mobili e Ascensori'),(19,'Segnaletica'),(20,'Servizi (generico)'),(21,'Servizi Autospurgo'),(22,'Servizi di Pulizie'),(23,'Servizi di Vigilanza e Portierato');
/*!40000 ALTER TABLE `Categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Descrizione`
--

DROP TABLE IF EXISTS `Descrizione`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Descrizione` (
  `IdDocB` varchar(40) NOT NULL,
  `RefBando` int(11) NOT NULL,
  PRIMARY KEY (`IdDocB`,`RefBando`),
  KEY `RefBando` (`RefBando`),
  CONSTRAINT `Descrizione_ibfk_1` FOREIGN KEY (`IdDocB`) REFERENCES `DocBando` (`Codice`) ON DELETE CASCADE,
  CONSTRAINT `Descrizione_ibfk_2` FOREIGN KEY (`RefBando`) REFERENCES `Bando` (`IdBando`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Descrizione`
--

LOCK TABLES `Descrizione` WRITE;
/*!40000 ALTER TABLE `Descrizione` DISABLE KEYS */;
INSERT INTO `Descrizione` VALUES ('ALBO FORNITORI _ Allegato Tecnico (1).do',4),('DSC_0060.JPGGara prova documenti',3);
/*!40000 ALTER TABLE `Descrizione` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DocBando`
--

DROP TABLE IF EXISTS `DocBando`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DocBando` (
  `Codice` varchar(40) NOT NULL,
  `Titolo` varchar(50) NOT NULL,
  `DataUp` date NOT NULL,
  PRIMARY KEY (`Codice`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DocBando`
--

LOCK TABLES `DocBando` WRITE;
/*!40000 ALTER TABLE `DocBando` DISABLE KEYS */;
INSERT INTO `DocBando` VALUES ('ALBO FORNITORI _ Allegato Tecnico (1).do','ALBO FORNITORI _ Allegato Tecnico (1).docx','2019-02-06'),('DSC_0060.JPGGara prova documenti','DSC_0060.JPG','2019-01-30');
/*!40000 ALTER TABLE `DocBando` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Documento`
--

DROP TABLE IF EXISTS `Documento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Documento` (
  `Codice` varchar(40) NOT NULL,
  `Tipo` varchar(30) NOT NULL,
  `Data` date NOT NULL,
  `Scadenza` date NOT NULL,
  PRIMARY KEY (`Codice`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Documento`
--

LOCK TABLES `Documento` WRITE;
/*!40000 ALTER TABLE `Documento` DISABLE KEYS */;
INSERT INTO `Documento` VALUES ('12344556565645656','Certificazione','2007-05-15','2027-02-24'),('ABCDEF1234567890','Codice fiscale','2010-10-01','2022-03-04'),('AX123456','Carta di identità','2015-12-03','2025-11-04'),('B104567645','Patente tipo B','1997-03-18','2027-03-07'),('O56127645','Certificazione','2000-03-18','2099-03-07');
/*!40000 ALTER TABLE `Documento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Fornitore`
--

DROP TABLE IF EXISTS `Fornitore`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Fornitore` (
  `IdForn` int(11) NOT NULL AUTO_INCREMENT,
  `NomeForn` varchar(50) NOT NULL,
  `IVAForn` char(11) NOT NULL,
  `FGiurid` varchar(30) NOT NULL,
  `ATECO` char(8) NOT NULL,
  `AnnoCCIAA` char(4) NOT NULL,
  `ProvinciaCCIAA` enum('AG','AL','AN','AO','AP','AQ','AR','AT','AV','BG','BI','BL','BN','BR','BS','BT','BZ','CB','CE','CH','CL','CN','CO','CR','CS','CZ','EN','FC','FE','FG','FM','FR','GO','GR','IM','IS','KR','LC','LE','LI','LO','LT','LU','MB','MC','MI','MN','MO','MS','MT','NO','NU','OR','PC','PD','PE','PG','PI','PN','PO','PR','PT','PU','PV','PZ','RA','RE','RG','RI','RN','RO','SA','SI','SO','SP','SR','SS','SU','SV','TA','TN','TP','TR','TS','TV','UD','VA','VB','VC','VI','VR','VT','VV') NOT NULL,
  `NumeroREA` char(4) NOT NULL,
  `SitoWeb` varchar(50) NOT NULL,
  `PEC` varchar(70) NOT NULL,
  `AreaServizio` varchar(30) NOT NULL,
  `SubAreaServizio` varchar(30) DEFAULT NULL,
  `SLStato` varchar(20) NOT NULL,
  `SLRegione` varchar(20) NOT NULL,
  `SLProvincia` enum('AG','AL','AN','AO','AP','AQ','AR','AT','AV','BG','BI','BL','BN','BR','BS','BT','BZ','CB','CE','CH','CL','CN','CO','CR','CS','CZ','EN','FC','FE','FG','FM','FR','GO','GR','IM','IS','KR','LC','LE','LI','LO','LT','LU','MB','MC','MI','MN','MO','MS','MT','NO','NU','OR','PC','PD','PE','PG','PI','PN','PO','PR','PT','PU','PV','PZ','RA','RE','RG','RI','RN','RO','SA','SI','SO','SP','SR','SS','SU','SV','TA','TN','TP','TR','TS','TV','UD','VA','VB','VC','VI','VR','VT','VV') NOT NULL,
  `SLCitta` varchar(100) DEFAULT NULL,
  `SLCAP` char(5) NOT NULL,
  `SLIndirizzo` varchar(50) NOT NULL,
  `SLTel` varchar(10) NOT NULL,
  `SLFAX` varchar(10) DEFAULT NULL,
  `SLEmail` varchar(50) NOT NULL,
  `SAmmStato` varchar(20) NOT NULL,
  `SAmmRegione` varchar(20) NOT NULL,
  `SAmmProvincia` enum('AG','AL','AN','AO','AP','AQ','AR','AT','AV','BG','BI','BL','BN','BR','BS','BT','BZ','CB','CE','CH','CL','CN','CO','CR','CS','CZ','EN','FC','FE','FG','FM','FR','GO','GR','IM','IS','KR','LC','LE','LI','LO','LT','LU','MB','MC','MI','MN','MO','MS','MT','NO','NU','OR','PC','PD','PE','PG','PI','PN','PO','PR','PT','PU','PV','PZ','RA','RE','RG','RI','RN','RO','SA','SI','SO','SP','SR','SS','SU','SV','TA','TN','TP','TR','TS','TV','UD','VA','VB','VC','VI','VR','VT','VV') NOT NULL,
  `SAmmCitta` varchar(100) DEFAULT NULL,
  `SAmmCAP` char(5) NOT NULL,
  `SAmmIndirizzo` varchar(50) NOT NULL,
  `SAmmTel` varchar(10) NOT NULL,
  `SAmmFAX` varchar(10) DEFAULT NULL,
  `SAmmEmail` varchar(50) NOT NULL,
  `Categoria1` int(3) NOT NULL,
  `Categoria2` int(3) DEFAULT NULL,
  `Categoria3` int(3) DEFAULT NULL,
  `Categoria4` int(3) DEFAULT NULL,
  `Categoria5` int(3) DEFAULT NULL,
  `Descrizione` varchar(300) DEFAULT NULL,
  `FattAnnuo1` int(11) NOT NULL,
  `FattAnnuo2` int(11) NOT NULL,
  `FattAnnuo3` int(11) NOT NULL,
  `OrgMedio1` int(11) NOT NULL,
  `OrgMedio2` int(11) NOT NULL,
  `OrgMedio3` int(11) NOT NULL,
  `TipoCCNL` varchar(20) NOT NULL,
  `PosINPS` varchar(20) NOT NULL,
  `PosINAIL` varchar(20) NOT NULL,
  `CapSociale` int(11) NOT NULL,
  `NDipendenti` int(11) NOT NULL,
  `NStabilimenti` int(5) NOT NULL,
  `Nome` varchar(30) NOT NULL,
  `Cognome` varchar(30) NOT NULL,
  `Ruolo` varchar(30) NOT NULL,
  `Lingua` varchar(30) NOT NULL,
  `Telefono` varchar(10) NOT NULL,
  `Rating` int(3) DEFAULT NULL,
  `GenCert` varchar(300) DEFAULT NULL,
  `Storico` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`IdForn`),
  UNIQUE KEY `IVAForn` (`IVAForn`),
  UNIQUE KEY `Telefono` (`Telefono`),
  KEY `Categoria1` (`Categoria1`),
  KEY `Categoria2` (`Categoria2`),
  KEY `Categoria3` (`Categoria3`),
  KEY `Categoria4` (`Categoria4`),
  KEY `Categoria5` (`Categoria5`),
  CONSTRAINT `Fornitore_ibfk_1` FOREIGN KEY (`Categoria1`) REFERENCES `Categoria` (`IdCat`),
  CONSTRAINT `Fornitore_ibfk_2` FOREIGN KEY (`Categoria2`) REFERENCES `Categoria` (`IdCat`),
  CONSTRAINT `Fornitore_ibfk_3` FOREIGN KEY (`Categoria3`) REFERENCES `Categoria` (`IdCat`),
  CONSTRAINT `Fornitore_ibfk_4` FOREIGN KEY (`Categoria4`) REFERENCES `Categoria` (`IdCat`),
  CONSTRAINT `Fornitore_ibfk_5` FOREIGN KEY (`Categoria5`) REFERENCES `Categoria` (`IdCat`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Fornitore`
--

LOCK TABLES `Fornitore` WRITE;
/*!40000 ALTER TABLE `Fornitore` DISABLE KEYS */;
INSERT INTO `Fornitore` VALUES (1,'Fornitore Andrea','04958673954','SNC','11.34.56','2015','CO','ABC1','www.andrea.it','pec@andrea.it','Lazio','RO','Italia','Lombardia','CO',NULL,'22100','Via Roma, 1','0264567832','0264567891','slegale@andrea.it','Italia','Lazio','RO',NULL,'00118','Via Alessandria, 10','067890546','067890547','samm@andrea.it',3,NULL,NULL,NULL,NULL,NULL,10000,12300,13000,4000,3400,3700,'ProvaTipoCCNL','ProvaINPS123','ProvaINAIL123',70000,52,3,'Franco','Rossi','Titolare','Italiana','3339879097',NULL,NULL,0),(2,'Fornitore Vitto','04958666952','SNC','12.33.56','2016','CO','1B21','www.vitto.it','pec@vitto.it','Lombardia','CO','Italia','Lombardia','CO',NULL,'22100','Via Roma, 1','0264567891','0264567891','slegale@vitto.it','Italia','Lazio','RO',NULL,'00118','Via Alessandria, 10','067890547','067890547','samm@vitto.it',17,NULL,NULL,NULL,NULL,NULL,10000,12300,13000,4000,3400,3700,'ProvaTipoCCNL','ProvaINPS123','ProvaINAIL123',70000,52,3,'Franco','Rossi','Titolare','Italiana','3309652301',53,NULL,0),(3,'Fornitore Esu','84616669521','SNC','12.33.67','2014','CO','A907','www.esu.it','pec@esu.it','Marche','MC','Italia','Lombardia','CO',NULL,'22100','Via Roma, 1','0264567568','0264567568','slegale@esu.it','Italia','Lazio','RO',NULL,'00118','Via Alessandria, 10','067890546','067890547','samm@esu.it',3,NULL,NULL,NULL,NULL,NULL,10000,12300,13000,4000,3400,3700,'ProvaTipoCCNL','ProvaINPS123','ProvaINAIL123',70000,52,3,'Franco','Rossi','Titolare','Italiana','3345652366',NULL,NULL,0),(4,'Rossi Ristorazione','12345678901','SNC','12.34.56','2018','CO','AB21','www.rossiristorazione.it','pec@rossiristorazione.it','Lazio, Lombardia','CO,RO','Italia','Lombardia','CO',NULL,'22100','Via Roma, 1','0314567890','0314567890','box@rossiristorazione.it','Italia','Lazio','RO',NULL,'00118','Via Alessandria, 10','067890547','067890547','mensa@rossiristorazione.it',3,1,2,5,8,'Azienda di ristorazione',10000,12300,13000,4000,3400,3700,'ProvaTipoCCNL','ProvaINPS123','ProvaINAIL123',70000,52,3,'Franco','Rossi','Titolare','Italiana','3381234567',NULL,NULL,0);
/*!40000 ALTER TABLE `Fornitore` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Gestione`
--

DROP TABLE IF EXISTS `Gestione`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Gestione` (
  `RefBando` int(11) NOT NULL,
  `RefAzienda` int(11) NOT NULL,
  PRIMARY KEY (`RefBando`,`RefAzienda`),
  KEY `RefAzienda` (`RefAzienda`),
  CONSTRAINT `Gestione_ibfk_1` FOREIGN KEY (`RefBando`) REFERENCES `Bando` (`IdBando`) ON DELETE CASCADE,
  CONSTRAINT `Gestione_ibfk_2` FOREIGN KEY (`RefAzienda`) REFERENCES `Azienda` (`IdAzienda`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Gestione`
--

LOCK TABLES `Gestione` WRITE;
/*!40000 ALTER TABLE `Gestione` DISABLE KEYS */;
INSERT INTO `Gestione` VALUES (1,1),(2,1),(3,1),(4,2),(5,1),(18,1);
/*!40000 ALTER TABLE `Gestione` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Partecipazione`
--

DROP TABLE IF EXISTS `Partecipazione`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Partecipazione` (
  `RefBando` int(11) NOT NULL,
  `RefForn` int(11) NOT NULL,
  `DataIscr` date NOT NULL,
  `Candidatura` enum('In attesa','Rifiutata','Approvata') NOT NULL DEFAULT 'In attesa',
  `Vincitore` tinyint(1) NOT NULL DEFAULT '0',
  `Val1` int(2) DEFAULT NULL,
  `Val2` int(2) DEFAULT NULL,
  `Val3` int(2) DEFAULT NULL,
  `Val4` int(2) DEFAULT NULL,
  `Val5` int(2) DEFAULT NULL,
  `DataVal` date DEFAULT NULL,
  `Titolo` varchar(50) DEFAULT NULL,
  `Descrizione` varchar(2000) NOT NULL,
  `Offerta` int(11) DEFAULT NULL,
  `Valutatore` varchar(40) DEFAULT NULL,
  `NoteValutatore` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`RefBando`,`RefForn`),
  KEY `RefForn` (`RefForn`),
  CONSTRAINT `Partecipazione_ibfk_1` FOREIGN KEY (`RefBando`) REFERENCES `Bando` (`IdBando`) ON DELETE CASCADE,
  CONSTRAINT `Partecipazione_ibfk_2` FOREIGN KEY (`RefForn`) REFERENCES `Fornitore` (`IdForn`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Partecipazione`
--

LOCK TABLES `Partecipazione` WRITE;
/*!40000 ALTER TABLE `Partecipazione` DISABLE KEYS */;
INSERT INTO `Partecipazione` VALUES (2,2,'2019-01-30','In attesa',0,1,2,3,4,5,NULL,'Candidatura per bando','Prova',1000,'yh hh','yhyh  hyh');
/*!40000 ALTER TABLE `Partecipazione` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ReqDoc`
--

DROP TABLE IF EXISTS `ReqDoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ReqDoc` (
  `RefForn` int(11) NOT NULL,
  `IdDoc` varchar(40) NOT NULL,
  PRIMARY KEY (`RefForn`,`IdDoc`),
  KEY `IdDoc` (`IdDoc`),
  CONSTRAINT `ReqDoc_ibfk_1` FOREIGN KEY (`RefForn`) REFERENCES `Fornitore` (`IdForn`) ON DELETE CASCADE,
  CONSTRAINT `ReqDoc_ibfk_2` FOREIGN KEY (`IdDoc`) REFERENCES `Documento` (`Codice`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ReqDoc`
--

LOCK TABLES `ReqDoc` WRITE;
/*!40000 ALTER TABLE `ReqDoc` DISABLE KEYS */;
/*!40000 ALTER TABLE `ReqDoc` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-05-03 19:15:53
