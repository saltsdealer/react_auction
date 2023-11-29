-- dropping all triggers
DROP TRIGGER IF EXISTS after_manager_insert;
DROP TRIGGER IF EXISTS after_user_insert;
DROP TRIGGER IF EXISTS after_order_insert;
DROP TRIGGER IF EXISTS after_order_creation_insert;

-- all views
DROP VIEW IF EXISTS ProductsNotSold;
DROP VIEW IF EXISTS order_view;
DROP VIEW IF EXISTS UsersWithBids;

-- all functions
DROP FUNCTION IF EXISTS GetAgeGroupId;
DROP FUNCTION IF EXISTS ConcateID;
DROP FUNCTION IF EXISTS GetHighestBidForSession;
DROP FUNCTION IF EXISTS RandomNumberLetter;

-- all tables
DROP TABLE IF EXISTS order_comments;
DROP TABLE IF EXISTS message_user;
DROP TABLE IF EXISTS message_admin;
DROP TABLE IF EXISTS shipping;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS `order`;
DROP TABLE IF EXISTS order_creation;
DROP TABLE IF EXISTS BidProduct;
DROP TABLE IF EXISTS `Bids`;
DROP TABLE IF EXISTS `Product`;
DROP TABLE IF EXISTS `Bidder`;
DROP TABLE IF EXISTS BidSession;
DROP TABLE IF EXISTS `Session`;
DROP TABLE IF EXISTS `User`;
DROP TABLE IF EXISTS Manager;
DROP TABLE IF EXISTS Admins;
DROP TABLE IF EXISTS ProductCategories;
DROP TABLE IF EXISTS AuthTypes;
DROP TABLE IF EXISTS AgeGroups;
DROP TABLE IF EXISTS NUID;
DROP TABLE IF EXISTS ADDRESS_STATES;


