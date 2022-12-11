
-- PURPOSE:         Get all information of a single user
-- ARGUMENTS:       userid
-- RETURN VALUES:   a table containing all attributes of single user
CREATE OR REPLACE FUNCTION StoreUser_GetByID(int)
returns setof StoreUser
language 'sql'
AS 
$$
    SELECT * FROM StoreUser WHERE UserID = $1
$$;

-- PURPOSE:         Get all information of all users
-- ARGUMENTS:       none
-- RETURN VALUES:   a table containing all attributes of all users
CREATE OR REPLACE FUNCTION StoreUser_GetAll()
returns setof StoreUser
language 'sql'
AS 
$$
    SELECT * FROM StoreUser;
$$;

-- PURPOSE:         Insert a user into the database
-- ARGUMENTS:       fName,lName,address,email,phoneNumber
-- RETURN VALUES:   a table containing all attributes of newly inserted user
CREATE OR REPLACE FUNCTION StoreUser_Register(varchar,varchar,varchar,varchar,varchar)
returns setof StoreUser
language 'sql'
AS
$$
    INSERT INTO STOREUSER (fName,lName,address,email,phoneNumber) VALUES ($1,$2,$3,$4,$5) RETURNING *;
$$;

-- PURPOSE:         deprecated, delete a user from the database
-- ARGUMENTS:       userid
-- RETURN VALUES:   a table containing all attributes of the deleted user
CREATE OR REPLACE FUNCTION StoreUser_Delete(int)
returns setof StoreUser
language 'sql'
AS
$$
    DELETE FROM StoreUser where userID=$1 RETURNING *;
$$;

-- PURPOSE:         Insert a card into the database
-- ARGUMENTS:       userid, cardnumber, expirydate, securitycode
-- RETURN VALUES:   a table containing all attributes of the new card
CREATE OR REPLACE FUNCTION UserCards_Register(int,varchar,varchar,timestamp,int)
returns setof UserCards
language 'sql'
AS
$$
    INSERT INTO UserCards (userID,cardHolderName,cardNumber,expiryDate,securityCode) VALUES ($1,$2,$3,$4,$5) RETURNING *;
$$;

-- PURPOSE:         get a card by its cardnumber
-- ARGUMENTS:       cardnumber
-- RETURN VALUES:   a table containing the card with corresponding cardnumber
CREATE OR REPLACE FUNCTION UserCards_GetByNumber(varchar)
returns setof UserCards
language 'sql'
AS 
$$
    SELECT * FROM UserCards WHERE cardNumber = $1
$$;

-- PURPOSE:         get cards by userid
-- ARGUMENTS:       userid
-- RETURN VALUES:   a table containing all the cards and their info of a user
CREATE OR REPLACE FUNCTION UserCards_GetByID(int)
returns setof UserCards
language 'sql'
AS 
$$
    SELECT * FROM UserCards WHERE userID = $1
$$;

-- PURPOSE:         gets a publisher by publisherid
-- ARGUMENTS:       publisherid
-- RETURN VALUES:   a table containing a single publisher
CREATE OR REPLACE FUNCTION Publisher_GetByID(int)
returns setof Publisher
language 'sql'
AS 
$$
    SELECT * FROM Publisher WHERE PublisherID = $1
$$;

-- PURPOSE:         gets all publishers
-- ARGUMENTS:       none
-- RETURN VALUES:   a table containing all publishers
CREATE OR REPLACE FUNCTION Publisher_GetAll()
returns setof Publisher
language 'sql'
AS 
$$
    SELECT * FROM Publisher;
$$;

-- PURPOSE:         Insert a user into the database
-- ARGUMENTS:       name,address,email,phoneNumber,bankAccountNumber
-- RETURN VALUES:   a table containing the newly inserted publisher
CREATE OR REPLACE FUNCTION Publisher_Register(varchar,varchar,varchar,varchar,varchar)
returns setof Publisher
language 'sql'
AS
$$
    INSERT INTO Publisher (name,address,email,phoneNumber,bankAccountNumber) VALUES ($1,$2,$3,$4,$5) RETURNING *;
$$;

-- PURPOSE:         Insert a user into the database
-- ARGUMENTS:       fName,lName
-- RETURN VALUES:   a table containing the newly inserted author
CREATE OR REPLACE FUNCTION Author_Register(varchar,varchar)
returns setof Author
language 'sql'
AS
$$
    INSERT INTO Author (fName,lName) VALUES ($1,$2) RETURNING *;
$$;

-- PURPOSE:         Gets all authors
-- ARGUMENTS:       none
-- RETURN VALUES:   a table containing all authors
CREATE OR REPLACE FUNCTION Author_GetAll()
returns setof Author
language 'sql'
AS 
$$
    SELECT * FROM Author;
$$;

-- PURPOSE:         Gets an author by an authorid
-- ARGUMENTS:       authorid
-- RETURN VALUES:   a table containing the found author
CREATE OR REPLACE FUNCTION Author_GetByID(int)
returns setof Author
language 'sql'
AS 
$$
    SELECT * FROM Author WHERE authorID = $1
$$;

-- PURPOSE:         Gets books by ISBN
-- ARGUMENTS:       isbn
-- RETURN VALUES:   a table containing the found book 
CREATE OR REPLACE FUNCTION Book_GetByID(int)
returns setof Book
language 'sql'
AS 
$$
    SELECT * FROM Book WHERE ISBN = $1
$$;

-- PURPOSE:         Gets all books
-- ARGUMENTS:       none
-- RETURN VALUES:   a table containing all books
CREATE OR REPLACE FUNCTION Book_GetAll()
returns setof Book
language 'sql'
AS 
$$
    SELECT * FROM Book;
$$;

-- PURPOSE:         Insert a book into the database
-- ARGUMENTS:       name, numberOfPages, price, commission, stock, publisherID
-- RETURN VALUES:   a table containing the newly inserted book
CREATE OR REPLACE FUNCTION Book_Register(varchar,int,numeric,numeric,int,int)
returns setof Book
language 'sql'
AS
$$
    INSERT INTO Book (name, numberOfPages, price, commission, stock, publisherID) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;
$$;

-- PURPOSE:         Gets all books that can be removed (books not currently selected or being ordered
-- ARGUMENTS:       none
-- RETURN VALUES:   a table containing books eligible for removal
CREATE OR REPLACE FUNCTION Book_GetRemovable()
returns setof Book
language 'sql'
AS 
$$
    SELECT * FROM Book WHERE Book.isbn not in (select isbn from BookOrders) and Book.isbn not in (select isbn from UserBookSelections)
$$;

-- PURPOSE:         Removes a book by ISBN
-- ARGUMENTS:       isbn
-- RETURN VALUES:   a table containing the removed book
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

-- PURPOSE:         update the stock of a book
-- ARGUMENTS:       isbn, stock
-- RETURN VALUES:   a table containing the updated book
CREATE OR REPLACE FUNCTION Book_UpdateStock(int,int)
returns setof Book
language 'sql'
AS
$$
    UPDATE Book SET stock=stock+$2 where isbn=$1 RETURNING *;
$$;

-- PURPOSE:         pair an author with a book 
-- ARGUMENTS:       isbn,authorid
-- RETURN VALUES:   a table containing the newly inserted bookauthor pair
CREATE OR REPLACE FUNCTION BookAuthors_AddAuthor(int,int)
returns setof BookAuthors
language 'sql'
AS
$$
    INSERT INTO BookAuthors (isbn, authorID) VALUES ($1,$2) RETURNING *;
$$;

-- PURPOSE:         get books written by an author
-- ARGUMENTS:       authorid
-- RETURN VALUES:   a table containing all bookauthor rows with the given authorid 
CREATE OR REPLACE FUNCTION BookAuthors_GetByAuthor(int)
returns setof BookAuthors
language 'sql'
AS 
$$
    SELECT * FROM BookAuthors WHERE authorID = $1
$$;

-- PURPOSE:         get authors of a book
-- ARGUMENTS:       isbn
-- RETURN VALUES:   a table containing all bookauthor rows with the isbn
CREATE OR REPLACE FUNCTION BookAuthors_GetByBook(int)
returns setof BookAuthors
language 'sql'
AS 
$$
    SELECT * FROM BookAuthors WHERE ISBN = $1
$$;

-- PURPOSE:         add a genre to a book
-- ARGUMENTS:       isbn,genre
-- RETURN VALUES:   a table containing the newly added book genre 
CREATE OR REPLACE FUNCTION BookGenres_AddGenre(int,varchar)
returns setof BookGenres
language 'sql'
AS
$$
    INSERT INTO BookGenres (isbn, genre) VALUES ($1,$2) RETURNING *;
$$;

-- PURPOSE:         get genres of a book
-- ARGUMENTS:       isbn
-- RETURN VALUES:   a table containing all isbn genre pairs with the same isbn
CREATE OR REPLACE FUNCTION BookGenres_GetByBook(int)
returns setof BookGenres
language 'sql'
AS 
$$
    SELECT * FROM BookGenres WHERE ISBN = $1
$$;

-- PURPOSE:         get books of a genre
-- ARGUMENTS:       genre
-- RETURN VALUES:   a table containing all isbn genre pairs with the same genre
CREATE OR REPLACE FUNCTION BookGenres_GetByGenre(varchar)
returns setof BookGenres
language 'sql'
AS 
$$
    SELECT * FROM BookGenres WHERE GENRE = $1
$$;

-- PURPOSE:         Insert an order into the database
-- ARGUMENTS:       shippingAddress,dtime,userid,cardnumber
-- RETURN VALUES:   a table containing all attributes of the new order
CREATE OR REPLACE FUNCTION StoreOrder_Register(varchar,timestamp,int,varchar)
returns setof StoreOrder
language 'sql'
AS
$$
    INSERT INTO StoreOrder (shippingaddress,courier,deliverystatus,locationintransit,dtime,userid,cardnumber) VALUES ($1,'Random Courier Company',False,'123 Warehouse Street',$2,$3,$4) RETURNING *;
$$;

-- PURPOSE:         get all orders
-- ARGUMENTS:       none
-- RETURN VALUES:   a table containing all columns of all orders
CREATE OR REPLACE FUNCTION StoreOrder_GetAll()
returns setof StoreOrder
language 'sql'
AS 
$$
    SELECT * FROM StoreOrder
$$;

-- PURPOSE:         get an order by ordernumber
-- ARGUMENTS:       ordernumber
-- RETURN VALUES:   a table containing all columns associated with ordernumber
CREATE OR REPLACE FUNCTION StoreOrder_GetByID(int)
returns setof StoreOrder
language 'sql'
AS 
$$
    SELECT * FROM StoreOrder WHERE orderNumber = $1
$$;

-- PURPOSE:         get all orders placed by a user
-- ARGUMENTS:       userid
-- RETURN VALUES:   a table containing all columns of orders corresponding to user
CREATE OR REPLACE FUNCTION StoreOrder_GetByUser(int)
returns setof StoreOrder
language 'sql'
AS 
$$
    SELECT * FROM StoreOrder WHERE userID = $1
$$;

-- PURPOSE:         pair an order with a book along with the quantity in the order
-- ARGUMENTS:       ordernumber,isbn,quantity
-- RETURN VALUES:   a table containing all columns of the new bookorder
CREATE OR REPLACE FUNCTION BookOrders_Register(int,int,int)
returns setof BookOrders
language 'sql'
AS
$$
    INSERT INTO BookOrders (orderNumber,isbn,quantity) VALUES ($1,$2,$3) RETURNING *;
$$;

-- PURPOSE:         deprecated, remove an order from the database
-- ARGUMENTS:       ordernumber
-- RETURN VALUES:   a table containing deleted bookorders
CREATE OR REPLACE FUNCTION BookOrders_Remove(int)
returns setof BookOrders
language 'sql'
AS
$$
    DELETE FROM BookOrders where orderNumber=$1 RETURNING *;
$$;

-- PURPOSE:         get all ordernumbers and isbns with their quantity
-- ARGUMENTS:       none
-- RETURN VALUES:   a table containing all columns corresponding to matching isbn that have been ordered
CREATE OR REPLACE FUNCTION BookOrders_GetAll()
returns setof BookOrders
language 'sql'
AS 
$$
    SELECT * FROM BookOrders
$$;

-- PURPOSE:         get all orders containing isbn
-- ARGUMENTS:       isbn
-- RETURN VALUES:   a table containing all columns associated with the isbn
CREATE OR REPLACE FUNCTION BookOrders_GetByBook(int)
returns setof BookOrders
language 'sql'
AS 
$$
    SELECT * FROM BookOrders WHERE isbn = $1
$$;

-- PURPOSE:         get order corresponding to ordernumber
-- ARGUMENTS:       ordernumber
-- RETURN VALUES:   a table containing the columns of the order with ordernumber
CREATE OR REPLACE FUNCTION BookOrders_GetByOrder(int)
returns setof BookOrders
language 'sql'
AS 
$$
    SELECT * FROM BookOrders WHERE orderNumber = $1
$$;

-- PURPOSE:         Add a book with quantity to user's cart. 
-- ARGUMENTS:       userid,isbn,quantity
-- RETURN VALUES:   a table containing the columns of the new cart item
CREATE OR REPLACE FUNCTION UserBookSelections_AddBook(int,int,int)
returns setof UserBookSelections
language 'sql'
AS
$$
    INSERT INTO UserBookSelections (userID, ISBN, quantity) VALUES ($1,$2,$3) RETURNING *;
$$;

-- PURPOSE:         Adds addQuantity to the quantity associated with userid,isbn 
-- ARGUMENTS:       userid,isbn,addquantity
-- RETURN VALUES:   a table containing the columns of the updated cart item
CREATE OR REPLACE FUNCTION UserBookSelections_AddQuantity(int,int,int)
returns setof UserBookSelections
language 'sql'
AS
$$
    Update UserBookSelections set quantity=quantity+$3 where userID=$1 and isbn=$2 RETURNING *;
$$;

-- PURPOSE:         deprecated, subtracts subQuantity from quantity corresponding to userid,isbn
-- ARGUMENTS:       userid,isbn,subQuantity
-- RETURN VALUES:   a table containing the columns of the updated cart item
CREATE OR REPLACE FUNCTION UserBookSelections_SubQuantity(int,int,int)
returns setof UserBookSelections
language 'sql'
AS
$$
    Update UserBookSelections set quantity=quantity-$3 where userID=$1 and isbn=$2 RETURNING *;
$$;

-- PURPOSE:         delete item from a user's cart
-- ARGUMENTS:       userid,isbn
-- RETURN VALUES:   a table containing all columns of ids of the deleted cart item
CREATE OR REPLACE FUNCTION UserBookSelections_Delete(int, int)
returns setof UserBookSelections
language 'sql'
AS
$$
    DELETE FROM UserBookSelections where userID=$1 and isbn=$2 RETURNING *;
$$;

-- PURPOSE:         get the cart associated with a user
-- ARGUMENTS:       userid
-- RETURN VALUES:   a table containing all columns of ids in cart associated with the user
CREATE OR REPLACE FUNCTION UserBookSelections_GetByID(int)
returns setof UserBookSelections
language 'sql'
AS 
$$
    SELECT * FROM UserBookSelections WHERE userID = $1
$$;

-- PURPOSE:         get all carts of all users
-- ARGUMENTS:       none
-- RETURN VALUES:   a table containing all columns of all carts
CREATE OR REPLACE FUNCTION UserBookSelections_GetAll()
returns setof UserBookSelections
language 'sql'
AS 
$$
    SELECT * FROM UserBookSelections
$$;

-- PURPOSE:         Get all carts containing the book with isbn
-- ARGUMENTS:       isbn
-- RETURN VALUES:   a table containing all columns of the carts with isbn
CREATE OR REPLACE FUNCTION UserBookSelections_GetByISBN(int)
returns setof UserBookSelections
language 'sql'
AS 
$$
    SELECT * FROM UserBookSelections WHERE isbn = $1
$$;


