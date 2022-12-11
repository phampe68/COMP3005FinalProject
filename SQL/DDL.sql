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

\i SQL/Functions.sql
\i SQL/Triggers.sql
\i SQL/DML.sql