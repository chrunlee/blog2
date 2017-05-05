/*
Navicat MySQL Data Transfer

Source Server         : lixun
Source Server Version : 50096
Source Host           : localhost:3306
Source Database       : sitefortool

Target Server Type    : MYSQL
Target Server Version : 50096
File Encoding         : 65001

Date: 2016-10-13 12:00:45
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for xiaoshuo
-- ----------------------------
DROP TABLE IF EXISTS `xiaoshuo`;
CREATE TABLE `xiaoshuo` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) default NULL,
  `author` varchar(255) default NULL,
  `updatetime` datetime default NULL,
  `isdone` varchar(11) default '0' COMMENT '1 连载中，0 已完本',
  `imagepath` varchar(255) default NULL,
  `bookno` varchar(255) default NULL,
  `description` varchar(4000) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xiaoshuo
-- ----------------------------
INSERT INTO `xiaoshuo` VALUES ('64287fb6b7644d1fa8ee61c386a1f83d', '妖孽保镖', '青狐妖', '2015-11-03 15:27:48', '完成', '/img/64287fb6b7644d1fa8ee61c386a1f83d.jpg', '13211', '\r\n                                &nbsp;&nbsp;&nbsp;&nbsp;这货工作之余揽私活儿，一个人承接多位美女的保护任务；他敢于狂吃窝边草，当然还有窝外的草，以及其他草、所有草……一个妖孽如谜的男人，一群形形色色的女人，演绎了万花丛中的一段段离奇韵事。纯洁的作者，纯洁的笔触，纯洁的故事，纯洁的心情，纯洁的你一定要抱\r\n                            ');
INSERT INTO `xiaoshuo` VALUES ('732a6a6b64fa4026a9db961ef1c4fce3', '重生之全能高手', '连青锋', '2015-05-24 13:37:31', '完成', '/img/732a6a6b64fa4026a9db961ef1c4fce3.jpg', '16206', '\r\n                                &nbsp;&nbsp;&nbsp;&nbsp;b重生之全能高手的简介：/b医卜星相无所不会！<br>&nbsp;&nbsp;&nbsp;&nbsp;琴棋书画无所不精！<br>&nbsp;&nbsp;&nbsp;&nbsp;国术武功宗师高手！<br>&nbsp;&nbsp;&\r\n                            ');
INSERT INTO `xiaoshuo` VALUES ('f7d0aedaa19d4ee9a26d658de60590a7', '武破九霄', '苍笑天', '2015-05-24 23:46:21', '连载', '/img/f7d0aedaa19d4ee9a26d658de60590a7.jpg', '18202', '\r\n                                &nbsp;&nbsp;&nbsp;&nbsp;&amp;nbsp&amp;nbsp静坐江湖风又起，千古王侯再争雄。<br>&nbsp;&nbsp;&nbsp;&nbsp;&amp;nbsp&amp;nbsp这是一个乱世，一个诸侯并起的时代<br>&nbsp;&nbsp;&nbsp\r\n                            ');
