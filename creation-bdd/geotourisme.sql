-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : mar. 22 mars 2022 à 15:43
-- Version du serveur :  10.3.29-MariaDB-0+deb10u1
-- Version de PHP : 7.3.27-1~deb10u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `geotourisme`
--

-- --------------------------------------------------------

--
-- Structure de la table `Lieux`
--

CREATE TABLE `Lieux` (
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `nom` varchar(256) NOT NULL,
  `adresse` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `Notation`
--

CREATE TABLE `Notation` (
  `id` int(11) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `note` enum('1','2','3','4','5') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `Visite`
--

CREATE TABLE `Visite` (
  `id` int(11) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `heure` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Lieux`
--
ALTER TABLE `Lieux`
  ADD PRIMARY KEY (`latitude`,`longitude`);

--
-- Index pour la table `Notation`
--
ALTER TABLE `Notation`
  ADD PRIMARY KEY (`id`,`latitude`,`longitude`),
  ADD KEY `fk_coord` (`latitude`,`longitude`);

--
-- Index pour la table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Visite`
--
ALTER TABLE `Visite`
  ADD PRIMARY KEY (`id`,`latitude`,`longitude`),
  ADD KEY `fk_coord2` (`latitude`,`longitude`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Notation`
--
ALTER TABLE `Notation`
  ADD CONSTRAINT `fk_coord` FOREIGN KEY (`latitude`,`longitude`) REFERENCES `Lieux` (`latitude`, `longitude`),
  ADD CONSTRAINT `fk_id` FOREIGN KEY (`id`) REFERENCES `Users` (`id`),
  ADD CONSTRAINT `fk_lat` FOREIGN KEY (`latitude`) REFERENCES `Lieux` (`latitude`);

--
-- Contraintes pour la table `Visite`
--
ALTER TABLE `Visite`
  ADD CONSTRAINT `fk_coord2` FOREIGN KEY (`latitude`,`longitude`) REFERENCES `Lieux` (`latitude`, `longitude`),
  ADD CONSTRAINT `fk_id2` FOREIGN KEY (`id`) REFERENCES `Users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
