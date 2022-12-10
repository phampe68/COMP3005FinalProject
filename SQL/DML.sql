DELETE FROM USERCARDS;
DELETE FROM BOOKAUTHORS;
DELETE FROM BOOKORDERS;
DELETE FROM BOOKGENRES;
DELETE FROM AUTHOR;
DELETE FROM BOOK;
DELETE FROM PUBLISHER;
DELETE FROM USERBOOKSELECTIONS;
DELETE FROM STOREORDER;
DELETE FROM STOREUSER;

ALTER SEQUENCE author_authorid_seq START WITH 10000;
ALTER SEQUENCE book_isbn_seq START WITH 10000;
ALTER SEQUENCE publisher_publisherid_seq START WITH 10000;
ALTER SEQUENCE storeorder_ordernumber_seq START WITH 10000;
ALTER SEQUENCE storeuser_userid_seq START WITH 10000;
ALTER SEQUENCE author_authorid_seq RESTART;
ALTER SEQUENCE book_isbn_seq RESTART;
ALTER SEQUENCE publisher_publisherid_seq RESTART;
ALTER SEQUENCE storeorder_ordernumber_seq RESTART;
ALTER SEQUENCE storeuser_userid_seq RESTART;

--storeuser
INSERT INTO STOREUSER (userID,fName,lName,address,email,phoneNumber) values (0,'Test','User 1','123 Example Street','user1@gmail.com','(123)-456-7890'), 
(2,'Test','User 2','124 Example Street','user2@gmail.com','(123)-456-7891');

--usercard
INSERT INTO UserCards (userID,cardHolderName,cardNumber,expiryDate,securityCode) values (0,'Test User 1','1234567890','2024-11-10',123);

--author
INSERT INTO AUTHOR (authorID,fName,lName) values (0,'Jolkien Rolkien Rolkien','Tolkien');

--publisher
INSERT INTO Publisher (publisherID,name,address,email,phoneNumber,bankAccountNumber) values (0,'Random Book Publishing Co.','734 Random Street','contact@rbps.com','0118 999 881 999 119 725 3','210394490238942');

--book
INSERT INTO Book (isbn,name, numberOfPages, price, commission, stock, publisherID) values (0,'Lord of the Hobbit of the Return of the Rings',87934,149.99,0.05,10,0);

--bookauthor
INSERT INTO bookauthors (authorID,isbn) values (0,0);

--bookgenres
INSERT INTO bookgenres (genre,isbn) values ('Fantastical',0);

--userbookselections
INSERT INTO userbookselections (userID,isbn,quantity) values (0,0,3);

--storeorder
INSERT INTO storeorder (orderNumber,shippingAddress,courier,deliveryStatus,locationInTransit,dtime,userID,cardNumber) values (0,'321 Avenue Street','Courier Courier Services',false,'Warehouse','2022-12-12',0,'1234567890');

--bookorder
INSERT INTO bookorders (orderNumber,isbn,quantity) values (0,0,2);