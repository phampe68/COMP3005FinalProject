DROP TABLE IF EXISTS Publisher CASCADE;
DROP TABLE IF EXISTS StoreUser CASCADE;
DROP TABLE IF EXISTS Author CASCADE;
DROP TABLE IF EXISTS Book CASCADE;
DROP TABLE IF EXISTS BookAuthors CASCADE;
DROP TABLE IF EXISTS BookOrders CASCADE;
DROP TABLE IF EXISTS UserBookSelections CASCADE;

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
    userID SERIAL,
    cardHolderName VARCHAR (255),
    cardNumber VARCHAR (255),
    expiryDate VARCHAR (255),
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
    publisherID SERIAL,
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
    userID SERIAL,
    PRIMARY KEY (orderNumber),
    FOREIGN KEY (userID) references StoreUser (userID)
);

CREATE TABLE BookAuthors(
    authorID SERIAL,
    isbn SERIAL,
    FOREIGN KEY (authorID) references Author (authorID),
    FOREIGN KEY (isbn) references Book (isbn)
);

CREATE TABLE BookGenres(
    genre varchar(255),
    isbn SERIAL,
    FOREIGN KEY (isbn) references Book (isbn)
);

CREATE TABLE BookOrders(
    orderNumber SERIAL,
    isbn SERIAL,
    quantity int,
    FOREIGN KEY (orderNumber) references StoreOrder (orderNumber),
    FOREIGN KEY (isbn) references Book (isbn)
);


CREATE TABLE UserBookSelections(
    userID SERIAL,
    isbn SERIAL,
    quantity int,
    FOREIGN KEY (userID) references StoreUser (userID),
    FOREIGN KEY (isbn) references Book (isbn)
);

--  FUNCTIONS
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

CREATE OR REPLACE FUNCTION Publisher_Register(varchar,varchar,varchar,varchar)
returns setof Publisher
language 'sql'
AS
$$
    INSERT INTO Publisher (name,address,email,phoneNumber) VALUES ($1,$2,$3,$4) RETURNING *;
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

CREATE OR REPLACE FUNCTION Book_Remove(int)
returns Boolean
language 'sql'
AS
$$
BEGIN
    SELECT ISBN FROM Book_GetRemovable()
    where isbn=$1;
    if found then
        delete from BookAuthors where isbn=$1;
        delete from BookGenres where isbn=$1;
        delete from book where isbn=$1;
        Return true;
    end if;
    return false; 
END; $$;


CREATE OR REPLACE FUNCTION Book_UpdateStock(int,int)
returns setof Book
language 'sql'
AS
$$
    UPDATE Book SET stock=$2 where isbn=$1 RETURNING *;
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

CREATE OR REPLACE FUNCTION StoreOrder_Register(varchar,varchar,boolean,varchar,timestamp,int)
returns setof StoreOrder
language 'sql'
AS
$$
    INSERT INTO StoreOrder (shippingaddress,courier,deliverystatus,locationintransit,dtime,userid) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;
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

CREATE OR REPLACE FUNCTION UserBookSelections_Delete(int)
returns setof UserBookSelections
language 'sql'
AS
$$
    DELETE FROM UserBookSelections where userID=$1 RETURNING *;
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

CREATE OR REPLACE FUNCTION Book_GetRemovable()
returns setof Book
language 'sql'
AS 
$$
    SELECT * FROM Book WHERE Book.isbn not in (select isbn from BookOrders) and Book.isbn not in (select isbn from UserBookSelections)
$$;

