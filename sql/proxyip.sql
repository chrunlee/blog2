/*
Navicat MySQL Data Transfer

Source Server         : lixun
Source Server Version : 50096
Source Host           : localhost:3306
Source Database       : sitefortool

Target Server Type    : MYSQL
Target Server Version : 50096
File Encoding         : 65001

Date: 2016-12-08 13:17:36
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for proxyip
-- ----------------------------
DROP TABLE IF EXISTS `proxyip`;
CREATE TABLE `proxyip` (
  `id` int(11) NOT NULL auto_increment,
  `ip` varchar(255) default NULL,
  `port` varchar(255) default NULL,
  `flag` int(11) default '0' COMMENT '0 未验证，1 验证失败，2验证通过',
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20901 DEFAULT CHARSET=utf8;
