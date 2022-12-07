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

CREATE TABLE Publisher(
    publisherID SERIAL,
    name VARCHAR (255),
    address VARCHAR (255),
    email VARCHAR (255),
    phoneNumber VARCHAR (255),
    PRIMARY KEY (publisherID)
);

CREATE TABLE StoreUser(
    userID SERIAL,
    fName VARCHAR (255),
    lName VARCHAR (255),
    address VARCHAR (255),
    email VARCHAR (255),
    phoneNumber VARCHAR (255),
    PRIMARY KEY (userID)
);

CREATE TABLE Author(
    authorID SERIAL,
    fName VARCHAR (255),
    lName VARCHAR (255),
    PRIMARY KEY (authorID)
);

CREATE TABLE UserCards(
    userID int,
    cardHolderName VARCHAR (255),
    cardNumber VARCHAR (255),
    expiryDate timestamp,
    securityCode INT,
    PRIMARY KEY (cardNumber),
    FOREIGN KEY (userID) references StoreUser (userID)
);

CREATE TABLE Book(
    isbn SERIAL,
    name VARCHAR (255),
    numberOfPages INT,
    price numeric(6,2),
    commission numeric(3,2),
    stock INT,
    publisherID int,
    PRIMARY KEY (isbn),
    FOREIGN KEY (publisherID) references Publisher (publisherID)
);

CREATE TABLE StoreOrder(
    orderNumber SERIAL,
    shippingAddress VARCHAR (255),
    courier VARCHAR (255),
    deliveryStatus BOOLEAN,
    locationInTransit VARCHAR (255),
    dtime timestamp,
    userID int,
    PRIMARY KEY (orderNumber),
    FOREIGN KEY (userID) references StoreUser (userID)
);

CREATE TABLE BookAuthors(
    authorID int,
    isbn int,
    FOREIGN KEY (authorID) references Author (authorID),
    FOREIGN KEY (isbn) references Book (isbn)
);

CREATE TABLE BookGenres(
    genre varchar(255),
    isbn int,
    FOREIGN KEY (isbn) references Book (isbn)
);

CREATE TABLE BookOrders(
    orderNumber int,
    isbn int,
    quantity int,
    FOREIGN KEY (orderNumber) references StoreOrder (orderNumber),
    FOREIGN KEY (isbn) references Book (isbn)
);


CREATE TABLE UserBookSelections(
    userID int,
    isbn int,
    quantity int,
    FOREIGN KEY (userID) references StoreUser (userID),
    FOREIGN KEY (isbn) references Book (isbn)
);

\i SQL/Functions.sql
\i SQL/DML.sql