DROP TABLE IF EXISTS Publisher CASCADE;
DROP TABLE IF EXISTS StoreUser CASCADE;
DROP TABLE IF EXISTS UserCards CASCADE;
DROP TABLE IF EXISTS Author CASCADE;
DROP TABLE IF EXISTS Book CASCADE;
DROP TABLE IF EXISTS BookAuthors CASCADE;
DROP TABLE IF EXISTS BookOrders CASCADE;
DROP TABLE IF EXISTS UserBookSelections CASCADE;
DROP TABLE IF EXISTS StoreOrder CASCADE;
DROP TABLE IF EXISTS BookGenres CASCADE;
DROP SEQUENCE IF EXISTS author_authorid_seq;
DROP SEQUENCE IF EXISTS book_isbn_seq;
DROP SEQUENCE IF EXISTS publisher_publisherid_seq;
DROP SEQUENCE IF EXISTS storeorder_ordernumber_seq;
DROP SEQUENCE IF EXISTS storeuser_userid_seq;

CREATE TABLE Publisher(
    publisherID SERIAL,
    name VARCHAR (255) NOT NULL,
    address VARCHAR (255) NOT NULL,
    email VARCHAR (255) UNIQUE NOT NULL,
    phoneNumber VARCHAR (255) UNIQUE NOT NULL,
    bankAccountNumber VARCHAR (255) UNIQUE NOT NULL,
    PRIMARY KEY (publisherID)
);

CREATE TABLE StoreUser(
    userID SERIAL,
    fName VARCHAR (255) NOT NULL,
    lName VARCHAR (255) NOT NULL,
    address VARCHAR (255) NOT NULL,
    email VARCHAR (255) UNIQUE NOT NULL,
    phoneNumber VARCHAR (255) NOT NULL,
    PRIMARY KEY (userID)
);

CREATE TABLE Author(
    authorID SERIAL,
    fName VARCHAR (255) NOT NULL,
    lName VARCHAR (255) NOT NULL,
    PRIMARY KEY (authorID)
);

CREATE TABLE UserCards(
    userID int NOT NULL,
    cardHolderName VARCHAR (255) NOT NULL,
    cardNumber VARCHAR (255) NOT NULL,
    expiryDate timestamp NOT NULL,
    securityCode INT NOT NULL,
    PRIMARY KEY (cardNumber),
    FOREIGN KEY (userID) references StoreUser (userID)
);

CREATE TABLE Book(
    isbn SERIAL,
    name VARCHAR (255) NOT NULL,
    numberOfPages INT NOT NULL,
    price numeric(6,2) NOT NULL,
    commission numeric(3,2) NOT NULL,
    stock INT NOT NULL,
    publisherID int NOT NULL,
    PRIMARY KEY (isbn),
    FOREIGN KEY (publisherID) references Publisher (publisherID)
);

CREATE TABLE StoreOrder(
    orderNumber SERIAL,
    shippingAddress VARCHAR (255) NOT NULL,
    courier VARCHAR (255) NOT NULL,
    deliveryStatus BOOLEAN NOT NULL,
    locationInTransit VARCHAR (255) NOT NULL,
    dtime timestamp NOT NULL,
    userID int NOT NULL,
    cardNumber VARCHAR NOT NULL,
    PRIMARY KEY (orderNumber),
    FOREIGN KEY (userID) references StoreUser (userID),
    FOREIGN KEY (cardNumber) references UserCards (cardNumber)
);

CREATE TABLE BookAuthors(
    authorID int,
    isbn int,
    PRIMARY KEY (authorID,isbn),
    FOREIGN KEY (authorID) references Author (authorID),
    FOREIGN KEY (isbn) references Book (isbn)
);

CREATE TABLE BookGenres(
    genre varchar(255),
    isbn int,
    PRIMARY KEY (isbn,genre),
    FOREIGN KEY (isbn) references Book (isbn)
);

CREATE TABLE BookOrders(
    orderNumber int,
    isbn int,
    quantity int NOT NULL,
    PRIMARY KEY (orderNumber,isbn),
    FOREIGN KEY (orderNumber) references StoreOrder (orderNumber),
    FOREIGN KEY (isbn) references Book (isbn)
);


CREATE TABLE UserBookSelections(
    userID int,
    isbn int,
    quantity int NOT NULL,
    PRIMARY KEY (userID,isbn),
    FOREIGN KEY (userID) references StoreUser (userID),
    FOREIGN KEY (isbn) references Book (isbn)
);


-- 
CREATE OR REPLACE FUNCTION StoreUser_GetByID(int)
returns setof StoreUser
language 'sql'
AS 
$$
    SELECT * FROM StoreUser WHERE UserID = $1
$$;

CREATE OR REPLACE FUNCTION StoreUser_GetAll()
returns setof StoreUser
language 'sql'
AS 
$$
    SELECT * FROM StoreUser;
$$;

CREATE OR REPLACE FUNCTION StoreUser_Register(varchar,varchar,varchar,varchar,varchar)
returns setof StoreUser
language 'sql'
AS
$$
    INSERT INTO STOREUSER (fName,lName,address,email,phoneNumber) VALUES ($1,$2,$3,$4,$5) RETURNING *;
$$;

CREATE OR REPLACE FUNCTION StoreUser_Delete(int)
returns setof StoreUser
language 'sql'
AS
$$
    DELETE FROM StoreUser where userID=$1 RETURNING *;
$$;

CREATE OR REPLACE FUNCTION UserCards_Register(int,varchar,varchar,timestamp,int)
returns setof UserCards
language 'sql'
AS
$$
    INSERT INTO UserCards (userID,cardHolderName,cardNumber,expiryDate,securityCode) VALUES ($1,$2,$3,$4,$5) RETURNING *;
$$;

CREATE OR REPLACE FUNCTION UserCards_GetByNumber(varchar)
returns setof UserCards
language 'sql'
AS 
$$
    SELECT * FROM UserCards WHERE cardNumber = $1
$$;

CREATE OR REPLACE FUNCTION UserCards_GetByID(int)
returns setof UserCards
language 'sql'
AS 
$$
    SELECT * FROM UserCards WHERE userID = $1
$$;

CREATE OR REPLACE FUNCTION Publisher_GetByID(int)
returns setof Publisher
language 'sql'
AS 
$$
    SELECT * FROM Publisher WHERE PublisherID = $1
$$;

CREATE OR REPLACE FUNCTION Publisher_GetAll()
returns setof Publisher
language 'sql'
AS 
$$
    SELECT * FROM Publisher;
$$;

CREATE OR REPLACE FUNCTION Publisher_Register(varchar,varchar,varchar,varchar,varchar)
returns setof Publisher
language 'sql'
AS
$$
    INSERT INTO Publisher (name,address,email,phoneNumber,bankAccountNumber) VALUES ($1,$2,$3,$4,$5) RETURNING *;
$$;

CREATE OR REPLACE FUNCTION Author_Register(varchar,varchar)
returns setof Author
language 'sql'
AS
$$
    INSERT INTO Author (fName,lName) VALUES ($1,$2) RETURNING *;
$$;

CREATE OR REPLACE FUNCTION Author_GetAll()
returns setof Author
language 'sql'
AS 
$$
    SELECT * FROM Author;
$$;

CREATE OR REPLACE FUNCTION Author_GetByID(int)
returns setof Author
language 'sql'
AS 
$$
    SELECT * FROM Author WHERE authorID = $1
$$;

CREATE OR REPLACE FUNCTION Book_GetByID(int)
returns setof Book
language 'sql'
AS 
$$
    SELECT * FROM Book WHERE ISBN = $1
$$;

CREATE OR REPLACE FUNCTION Book_GetAll()
returns setof Book
language 'sql'
AS 
$$
    SELECT * FROM Book;
$$;

CREATE OR REPLACE FUNCTION Book_Register(varchar,int,numeric,numeric,int,int)
returns setof Book
language 'sql'
AS
$$
    INSERT INTO Book (name, numberOfPages, price, commission, stock, publisherID) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;
$$;

CREATE OR REPLACE FUNCTION Book_GetRemovable()
returns setof Book
language 'sql'
AS 
$$
    SELECT * FROM Book WHERE Book.isbn not in (select isbn from BookOrders) and Book.isbn not in (select isbn from UserBookSelections)
$$;

CREATE OR REPLACE FUNCTION Book_Remove(int)
returns Boolean
language 'sql'
AS
$$
    DELETE FROM BookGenres where isbn=$1 and isbn in (select isbn from Book_GetRemovable());
    DELETE FROM BookAuthors where isbn=$1 and isbn in (select isbn from Book_GetRemovable());
    DELETE FROM Book where isbn=$1 and isbn in (select isbn from Book_GetRemovable());
    SELECT NOT EXISTS (SELECT isbn from book where isbn=$1);
$$;


CREATE OR REPLACE FUNCTION Book_UpdateStock(int,int)
returns setof Book
language 'sql'
AS
$$
    UPDATE Book SET stock=stock+$2 where isbn=$1 RETURNING *;
$$;

CREATE OR REPLACE FUNCTION BookAuthors_AddAuthor(int,int)
returns setof BookAuthors
language 'sql'
AS
$$
    INSERT INTO BookAuthors (isbn, authorID) VALUES ($1,$2) RETURNING *;
$$;

CREATE OR REPLACE FUNCTION BookAuthors_GetByAuthor(int)
returns setof BookAuthors
language 'sql'
AS 
$$
    SELECT * FROM BookAuthors WHERE authorID = $1
$$;

CREATE OR REPLACE FUNCTION BookAuthors_GetByBook(int)
returns setof BookAuthors
language 'sql'
AS 
$$
    SELECT * FROM BookAuthors WHERE ISBN = $1
$$;

CREATE OR REPLACE FUNCTION BookGenres_AddGenre(int,varchar)
returns setof BookGenres
language 'sql'
AS
$$
    INSERT INTO BookGenres (isbn, genre) VALUES ($1,$2) RETURNING *;
$$;

CREATE OR REPLACE FUNCTION BookGenres_GetByBook(int)
returns setof BookGenres
language 'sql'
AS 
$$
    SELECT * FROM BookGenres WHERE ISBN = $1
$$;

CREATE OR REPLACE FUNCTION BookGenres_GetByGenre(varchar)
returns setof BookGenres
language 'sql'
AS 
$$
    SELECT * FROM BookGenres WHERE GENRE = $1
$$;

CREATE OR REPLACE FUNCTION StoreOrder_Register(varchar,timestamp,int,varchar)
returns setof StoreOrder
language 'sql'
AS
$$
    INSERT INTO StoreOrder (shippingaddress,courier,deliverystatus,locationintransit,dtime,userid,cardnumber) VALUES ($1,'Random Courier Company',False,'123 Warehouse Street',$2,$3,$4) RETURNING *;
$$;

CREATE OR REPLACE FUNCTION StoreOrder_GetAll()
returns setof StoreOrder
language 'sql'
AS 
$$
    SELECT * FROM StoreOrder
$$;

CREATE OR REPLACE FUNCTION StoreOrder_GetByID(int)
returns setof StoreOrder
language 'sql'
AS 
$$
    SELECT * FROM StoreOrder WHERE orderNumber = $1
$$;

CREATE OR REPLACE FUNCTION StoreOrder_GetByUser(int)
returns setof StoreOrder
language 'sql'
AS 
$$
    SELECT * FROM StoreOrder WHERE userID = $1
$$;


CREATE OR REPLACE FUNCTION BookOrders_Register(int,int,int)
returns setof BookOrders
language 'sql'
AS
$$
    INSERT INTO BookOrders (orderNumber,isbn,quantity) VALUES ($1,$2,$3) RETURNING *;
$$;

CREATE OR REPLACE FUNCTION BookOrders_Remove(int)
returns setof BookOrders
language 'sql'
AS
$$
    DELETE FROM BookOrders where orderNumber=$1 RETURNING *;
$$;

CREATE OR REPLACE FUNCTION BookOrders_GetAll()
returns setof BookOrders
language 'sql'
AS 
$$
    SELECT * FROM BookOrders
$$;

CREATE OR REPLACE FUNCTION BookOrders_GetByBook(int)
returns setof BookOrders
language 'sql'
AS 
$$
    SELECT * FROM BookOrders WHERE isbn = $1
$$;

CREATE OR REPLACE FUNCTION BookOrders_GetByOrder(int)
returns setof BookOrders
language 'sql'
AS 
$$
    SELECT * FROM BookOrders WHERE orderNumber = $1
$$;

CREATE OR REPLACE FUNCTION UserBookSelections_AddBook(int,int,int)
returns setof UserBookSelections
language 'sql'
AS
$$
    INSERT INTO UserBookSelections (userID, ISBN, quantity) VALUES ($1,$2,$3) RETURNING *;
$$;

CREATE OR REPLACE FUNCTION UserBookSelections_AddQuantity(int,int,int)
returns setof UserBookSelections
language 'sql'
AS
$$
    Update UserBookSelections set quantity=quantity+$3 where userID=$1 and isbn=$2 RETURNING *;
$$;

CREATE OR REPLACE FUNCTION UserBookSelections_SubQuantity(int,int,int)
returns setof UserBookSelections
language 'sql'
AS
$$
    Update UserBookSelections set quantity=quantity-$3 where userID=$1 and isbn=$2 RETURNING *;
$$;

CREATE OR REPLACE FUNCTION UserBookSelections_Delete(int, int)
returns setof UserBookSelections
language 'sql'
AS
$$
    DELETE FROM UserBookSelections where userID=$1 and isbn=$2 RETURNING *;
$$;

CREATE OR REPLACE FUNCTION UserBookSelections_GetByID(int)
returns setof UserBookSelections
language 'sql'
AS 
$$
    SELECT * FROM UserBookSelections WHERE userID = $1
$$;

CREATE OR REPLACE FUNCTION UserBookSelections_GetAll()
returns setof UserBookSelections
language 'sql'
AS 
$$
    SELECT * FROM UserBookSelections
$$;

CREATE OR REPLACE FUNCTION UserBookSelections_GetByISBN(int)
returns setof UserBookSelections
language 'sql'
AS 
$$
    SELECT * FROM UserBookSelections WHERE isbn = $1
$$;


CREATE OR REPLACE FUNCTION Book_StockUpdate() 
    RETURNS TRIGGER 
    LANGUAGE PLPGSQL
AS $$
BEGIN
    UPDATE Book set stock = stock - New.quantity where isbn = new.isbn;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION Selections_Remove() 
    RETURNS TRIGGER 
    LANGUAGE PLPGSQL
AS $$
BEGIN
    DELETE FROM UserBookSelections WHERE userid in (SELECT userid FROM BookOrders NATURAL JOIN storeorder where isbn=new.isbn and orderNumber=new.orderNumber);
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION BookOrders_Transfer() 
    RETURNS TRIGGER 
    LANGUAGE PLPGSQL
AS $$
BEGIN
    INSERT INTO BookOrders (orderNumber,quantity,isbn) SELECT new.ordernumber,quantity,isbn from userbookselections where userid=new.userid;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION Book_OrderNew() 
    RETURNS TRIGGER 
    LANGUAGE PLPGSQL
AS $$
BEGIN
    UPDATE Book SET stock=stock+(select sum(x.quantity) FROM (SELECT quantity FROM storeorder natural join bookorders WHERE isbn=new.isbn and dtime >= current_date - interval '1 month') as x) where isbn=new.isbn and stock<10;
    RETURN NEW;
END;
$$;

CREATE TRIGGER Orders_Trigger 
    AFTER INSERT
    ON StoreOrder
    FOR EACH ROW
       EXECUTE PROCEDURE BookOrders_Transfer();

CREATE TRIGGER BookOrders_Trigger1 
    AFTER INSERT
    ON BookOrders
    FOR EACH ROW
       EXECUTE PROCEDURE Book_StockUpdate();

CREATE TRIGGER BookOrders_Trigger2 
    AFTER INSERT
    ON BookOrders
    FOR EACH ROW
       EXECUTE PROCEDURE Selections_Remove();

CREATE TRIGGER Stock_Trigger
    AFTER UPDATE
    ON Book
    FOR EACH ROW
        WHEN (pg_trigger_depth()<3)
        EXECUTE PROCEDURE Book_OrderNew();
    
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
(1,'Test','User 2','124 Example Street','user2@gmail.com','(123)-456-7891');

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

--userbookselections
INSERT INTO userbookselections (userID,isbn,quantity) values (1,0,3);

--storeorder
INSERT INTO storeorder (orderNumber,shippingAddress,courier,deliveryStatus,locationInTransit,dtime,userID,cardNumber) values (0,'321 Avenue Street','Courier Courier Services',false,'Warehouse','2022-12-9',0,'1234567890');

--userbookselections
INSERT INTO userbookselections (userID,isbn,quantity) values (0,0,3);

INSERT INTO storeorder (orderNumber,shippingAddress,courier,deliveryStatus,locationInTransit,dtime,userID,cardNumber) values (1,'321 Avenue Street','Courier Courier Services',false,'Warehouse','2022-12-9',0,'1234567890');



