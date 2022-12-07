--storeuser
INSERT INTO STOREUSER (fName,lName,address,email,phoneNumber) values ('Test','User 1','123 Example Street','user1@gmail.com','(123)-456-7890'), 
('Test','User 2','124 Example Street','user2@gmail.com','(123)-456-7891'),
('Test','User 3','125 Example Street','user3@gmail.com','(123)-456-7892'),
('Test','User 4','126 Example Street','user4@gmail.com','(123)-456-7893');

--usercard
INSERT INTO AUTHOR (fName,lName) values ('Jolkien Rolkien Rolkien','Tolkien');

--author
INSERT INTO AUTHOR (fName,lName) values ('Jolkien Rolkien Rolkien','Tolkien');

--publisher
INSERT INTO Publisher (name,address,email,phoneNumber) values ('Random Book Publishing Co.','734 Random Street','contact@rbps.com','0118 999 881 999 119 725 3');

--book
INSERT INTO Book (name, numberOfPages, price, commission, stock, publisherID) values ('Lord of the Hobbit of the Return of the Rings',87934,149.99,0.05,10,1);

--bookauthor
INSERT INTO bookauthor (authorID,isbn) values (1,1);

--userbookselections
INSERT INTO userbookselections (userID,isbn,quantity) values (1,1,3);

--storeorder
INSERT INTO storeorder (fName,lName) values ('Jolkien Rolkien Rolkien','Tolkien');

--bookorder
INSERT INTO bookorder (fName,lName) values ('Jolkien Rolkien Rolkien','Tolkien');