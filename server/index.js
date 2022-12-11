const express = require('express');
const app = express();
const cors = require('cors');
const pool = require("./db");

//const funcs = await pool.query("SELECT routine_name FROM information_schema.routines WHERE routine_type = 'FUNCTION' AND routine_schema = 'public';");

// middleware
app.use(cors());
app.use(express.json()); // gives access to request.body to get json data



function convertQueryToSQL(query) {
    let sql = 'SELECT * FROM (SELECT name as bookname, isbn, publisherid, authorid, price, stock FROM ((book natural join bookauthors))) AS x, author, publisher WHERE x.publisherid = publisher.publisherid AND author.authorid = x.authorid';
  
    // Check if there are any search criteria in the query
    if (Object.keys(query).length > 0) {
      // Add the WHERE clause to the SQL statement
      sql += ' AND';
  
      // Loop through each search criterion in the query
      Object.keys(query).forEach((key, index) => {
        // Add the field name and value to the WHERE clause
        sql += ` ${key} = '${query[key]}'`;
  
        // If this is not the last criterion, add the AND keyword
        if (index < Object.keys(query).length - 1) {
          sql += ' AND';
        }
      });
    }
  
    // Return the generated SQL statement
    return sql;
  }

/*
    FUNCTION NAME: parseJSON(j)
    ARGUMENTS: j, which is a list of json objects that contain ids.
    RETURNS: j, which has been augmented with new stuff
    PURPOSE: anywhere that there is an id, insert the relevant values for that id, unless the parent object is of the id's type.

 EXAMPLE USE:
 a = 
 [
    {
        "userid":0
    }
]
 parseJSON(a) == 
 [
    {
        "userid":0,
        "user": 
        {
            "userid": 0,
            "fname": "Test",
            "lname": "User 1",
            "address": "123 Example Street",
            "email": "user1@gmail.com",
            "phonenumber": "(123)-456-7890"
        }
    }
]
*/
async function parseJSON(j){
    
    for (let i in j){
        
        if((typeof j[i].userid !=="undefined")&&(typeof j[i].fname=="undefined")){
            const user = await pool.query("SELECT * FROM StoreUser_GetByID($1)",[j[i].userid]);
            j[i].user = user.rows[0]
        }
        if ((typeof j[i].authorid !== "undefined") && (typeof j[i].fname == "undefined")) {
            const author = await pool.query("SELECT * FROM Author_GetByID($1)", [j[i].authorid]);
            j[i].author = author.rows[0]
        }
        
        if((typeof j[i].isbn !=="undefined")&&(typeof j[i].name=="undefined")){
            const book = await pool.query("SELECT * FROM Book_GetByID($1)",[j[i].isbn]);
            j[i].book = book.rows[0]
        }
        if (typeof j[i].publisherid !== "undefined") {
            const publisher = await pool.query("SELECT * FROM Publisher_GetByID($1)", [j[i].publisherid]);
            j[i].publisher = publisher.rows[0]
        }
        if (typeof j[i].orderid !== "undefined") {
            const order = await pool.query("SELECT * FROM StoreOrder_GetByID($1)", [j[i].orderid]);
            j[i].order = order.rows[0]
        }
        
    }

    return j;

}

//ROUTES

//register a user
app.post('/users', async (req, res) => {
    try {
        //should include fName,lName,address,email,phoneNumber
        const { fName, lName, address, email, phoneNumber } = req.body;
        const newUser = await pool.query("SELECT * FROM StoreUser_Register($1,$2,$3,$4,$5)", [fName, lName, address, email, phoneNumber]);
        res.json(parseJSON(newUser.rows));
    } catch (err) {
        console.error(err.message);
    }
}
);

//get all users
app.get("/users", async (req, res) => {
    try {
        const allUsers = await pool.query("SELECT * FROM STOREUSER_GetALL()");
        res.json(allUsers.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//get a user with id
app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await pool.query("SELECT * FROM StoreUser_GetByID($1)", [id]);
        output = parseJSON(user.rows)
        res.json(output);
    } catch (err) {
        console.error(err.message);
    }
}
);

//delete a user
app.delete('/users/:id', async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;
        const user = await pool.query("SELECT * FROM StoreUser_Delete($1)", [id]);
        output = await parseJSON(user.rows)
        res.json(output);
    } catch (err) {
        console.error(err.message);
    }
}
);

//register a card to a user
app.post('/usercards', async(req,res)=>{
    try {
        //should include userID,cardHolderName,cardNumber,expiryDate,securityCode
        const {userID,cardHolderName,cardNumber,expiryDate,securityCode}=req.body;
        console.log(req.body);
        const newCard = await pool.query("SELECT * FROM UserCards_Register($1,$2,$3,$4,$5)",[userID,cardHolderName,cardNumber,expiryDate,securityCode]);
        console.log(newCard.rows)
        
        res.json(parseJSON(newCard.rows));
    } catch (err) {
        console.error(err.message);
    }
}
);

//get a cards of a user
app.get('/usercards/:id', async(req,res)=>{
    try {
        console.log(req.params);
        const {id}=req.params;
        const card = await pool.query("SELECT * FROM UserCards_GetByID($1)",[id]);
        res.json(card.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);



/*register a book
exampleBookPost=
{
    "name": "Book Book",
    "numberofpages": 123,
    "price": "12.99",
    "commission": "0.35",
    "stock": 100,
    "genres": ["Books","Non-Fiction"],
    "publisherID": 0,
    "authors": [0]
}
*/
app.post('/books', async (req, res) => {
    try {
        //should include name, numberOfPages, price, commission, stock, publisherID
        const { name, numberofpages, price, commission, stock, publisherid, genres, authors } = req.body;
        
        const newBook = await pool.query("SELECT * FROM Book_Register($1,$2,$3,$4,$5,$6)", [name, numberofpages, price, commission, stock, publisherid]);
        let newBookGenre = [];
        let newBookAuthor = [];
        for (let i = 0; i < genres.length; i++) {
            newgenre = await pool.query("SELECT * FROM bookgenres_addgenre($1,$2)", [newBook.rows[0].isbn, genres[i]]);
            newBookGenre[i] = newgenre.rows[0].genre
        }
        for (let i = 0; i < authors.length; i++) {
            newauthor = await pool.query("SELECT * FROM BookAuthors_AddAuthor($1,$2)", [newBook.rows[0].isbn, authors[i]]);
            newBookAuthor[i] = newauthor.rows[0]
        }

        book = await parseJSON(newBook.rows)
        author = await parseJSON(newBookAuthor)
        output = { "book": book, "authors": author, "genres": newBookGenre }
        res.json(output);
    } catch (err) {
        console.error(err.message);
    }


}
);




//get all books
app.get("/books?", async (req, res) => {
    const query = req.query;
    console.log("HERE", query);

    try {
        let output = []  
        let myQuery = Object.keys(req.query).length === 0 ? "SELECT * FROM Book_GetALL()" : convertQueryToSQL(req.query);
        let allBooks = await pool.query(myQuery);

        console.log("QUERY IS: ", myQuery);
        for (let i in allBooks.rows) {
            book = await parseJSON([allBooks.rows[i]])
            genres = await pool.query("SELECT genre FROM BookGenres_GetByBook($1)", [allBooks.rows[i].isbn]);
            authors = await pool.query("SELECT authorID,fName,lName from BookAuthors NATURAL JOIN Author where isbn=$1", [allBooks.rows[i].isbn])
            output.push({ "book": book, "genres": genres.rows, "authors": authors.rows })
        }
        res.json((output));
    } catch (err) {
        console.error(err.message);
    }
});


  

//get a book by isbn
app.get('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await pool.query("SELECT * FROM Book_GetByID($1)", [id]);
        parsedbook = await parseJSON(book.rows)
        genres = await pool.query("SELECT genre FROM BookGenres_GetByBook($1)", [book.rows[0].isbn]);
        authors = await pool.query("SELECT authorID,fName,lName from BookAuthors NATURAL JOIN Author where isbn=$1", [book.rows[0].isbn])
        output = { "book": parsedbook, "genres": genres.rows, "authors": authors.rows }
        res.json(output);
    } catch (err) {
        console.error(err.message);
    }
}
);

//remove a book by id
app.delete('/books/:id', async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;
        const book = await pool.query("SELECT * FROM Book_Remove($1)", [id]);
        res.json(book.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//admin orders a book, by updating the stock corresonding to isbn
app.put('/books/:id', async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;
        const { stock } = req.body;
        const book = await pool.query("SELECT * FROM Book_UpdateStock($1,$2)", [id, stock]);
        let output = await parseJSON(book.rows);
        res.json(output);
    } catch (err) {
        console.error(err.message);
    }
});

//update a whole bunch of books using a map from isbn to quantity
app.put('/books/', async (req, res) => {
    try {
        const data = req.body;
        let books = []
        for (let [key, value] of Object.entries(data)) {

            let book = await pool.query("SELECT * FROM Book_UpdateStock($1,$2)", [key, value]);
            console.log(key, value)
            console.log("book rows: ", book.rows)
            books.push(book.rows)
        }
        let output = await parseJSON(books);
        res.json(output);
    } catch (err) {
        console.error(err.message);
    }
});


//get all publishers
app.get('/publishers', async (req, res) => {
    try {
        const allPublishers = await pool.query("SELECT * FROM publisher");
        res.json(allPublishers.rows);
    } catch (err) {
        console.error(err.message);
    }
});



//register a publisher
app.post('/publishers', async (req, res) => {
    try {
        //should include name, address, email, phoneNumber
        const {name,address,email,phonenumber,bankaccountnumber}=req.body;
        const newPublisher = await pool.query("SELECT * FROM Publisher_Register($1,$2,$3,$4,$5)",[name,address,email,phonenumber,bankaccountnumber]);
        console.log(newPublisher.rows);
        res.json(newPublisher.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
}
);


//get a publisher by id
app.get('/publishers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const publisher = await pool.query("SELECT * FROM Publisher_GetByID($1)", [id]);
        res.json(publisher.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);


//register an author
app.post('/authors/', async (req, res) => {
    try {
        const { fName, lName } = req.body;
        const author = await pool.query("SELECT * FROM Author_Register($1,$2)", [fName, lName]);
        res.json(author.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//get all authors
app.get('/authors/', async (req, res) => {
    try {
        const author = await pool.query("SELECT * FROM Author");
        res.json(author.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//get an author
app.get('/authors/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const author = await pool.query("SELECT * FROM Author_GetByID($1)", [id]);
        res.json(author.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);


//pair an author with a book
app.post('/bookauthors/', async (req, res) => {
    try {
        const { authorID, isbn } = req.body;
        const bookauthors = await pool.query("SELECT * FROM BookAuthors_AddAuthor($1,$2)", [authorID, isbn]);
        output = await parseJSON(bookauthors.rows)
        res.json(output);
    } catch (err) {
        console.error(err.message);
    }
}
);


//find book(s) by an author
app.get('/bookauthors/author/:id', async (req, res) => {
    try {
        const { authorID } = req.body;
        const bookauthors = await pool.query("SELECT * FROM BookAuthors_GetByAuthor($1)", [authorID]);
        let output = await parseJSON(bookauthors.rows);
        res.json(output);
    } catch (err) {
        console.error(err.message);
    }
}
);

//find author(s) of a book
app.get('/bookauthors/book/:id', async (req, res) => {
    try {
        const { isbn } = req.body;
        const bookauthors = await pool.query("SELECT * FROM BookAuthors_GetByBook($1)", [isbn]);
        let output = await parseJSON(bookauthors.rows);
        res.json(output);
    } catch (err) {
        console.error(err.message);
    }
}
);

/*add to book selections
exampleSelectionsPost=
{
    "userID": 2,
    "isbn": 0,
    "quantity": 1
}
*/
app.post('/selections/', async (req, res) => {
    try {
        const { userID, isbn, quantity } = req.body;
        let selection = await pool.query("SELECT * FROM UserBookSelections_AddQuantity($1,$2,$3)", [userID, isbn, quantity]);
        if (selection.rows.length == 0) {
            selection = await pool.query("SELECT * FROM UserBookSelections_AddBook($1,$2,$3)", [userID, isbn, quantity]);
        }
        output = await parseJSON(selection.rows)
        res.json(output);
    } catch (err) {
        console.error(err.message);
    }
}
);

//get book selections by id
app.get('/selections/:id', async (req, res) => {
    try {
        const userID = req.params.id;
        const selection = await pool.query("SELECT * FROM UserBookSelections_GetById($1)", [userID]);
        let books = await parseJSON(selection.rows);
        res.json(books);
    } catch (err) {
        console.error(err.message);
    }
}
);


//get book selections
app.get('/selections/', async (req, res) => {
    try {
        const selection = await pool.query("SELECT * FROM UserBookSelections_GetAll()");
        let output = await parseJSON(selection.rows);
        res.json(output);
    } catch (err) {
        console.error(err.message);
    }
}
);

//delete book selections
app.delete('/selections/:id/:isbn', async (req, res) => {
    try {
        const userID = req.params.id;
        const isbn = req.params.isbn;
        const selection = await pool.query("SELECT * FROM UserBookSelections_Delete($1,$2)", [userID, isbn]);
        let output = await parseJSON(selection.rows);
        res.json(output);
    } catch (err) {
        console.error(err.message);
    }
}
);


//orderNumber,shippingAddress,courier,deliveryStatus,locationInTransit,dtime,userID,cardnumber

//create order
app.post('/storeorders/', async (req, res) => {
    try {
        console.log(req.body);
        const { shippingaddress,userid,cardnumber} = req.body;
        const d = new Date();
        let dtime = d.toDateString();
        const order = await pool.query("SELECT * FROM StoreOrder_Register($1,$2,$3,$4)",[shippingaddress,dtime,userid,cardnumber]);
        output = await parseJSON(order.rows)
        res.json(output);
    } catch (err) {
        console.error(err.message);
    }
}
);

//get storeorders
app.get('/storeorders/', async (req, res) => {
    try {
        const orders = await pool.query("SELECT * FROM storeorder_GetALL()");
        output = await parseJSON(orders.rows)
        res.json(output);
    } catch (err) {
        console.error(err.message);
    }
}
);

//get an order by user id
app.get('/storeorders/user/:id', async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;
        const user = await pool.query("SELECT * FROM storeorder_GetByUser($1)", [id]);
        res.json(user.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//get an order by order number
app.get('/storeorders/:id', async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;
        const user = await pool.query("SELECT * FROM storeorder_GetByID($1)", [id]);
        res.json(user.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//delete order
app.delete('/storeorders/:id', async (req, res) => {
    try {
        console.log(req.params);
        const { orderID } = req.params;
        const order = await pool.query("SELECT * FROM StoreOrder_Delete($1)", [orderID]);
        res.json(order.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//deprecated
//add book to order
app.post('/bookorders/', async (req, res) => {
    try {
        const { orderId, isbn, quantity } = req.body;
        const bookorder = await pool.query("SELECT * FROM BookOrder_Post($1,$2,$3)", [orderId, isbn, quantity]);
        book = await pool.query("SELECT * FROM Book_UpdateStock($1,$2)"[isbn,-quantity]);
        console.log(book.rows)
        res.json(bookorder.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//get all orders
app.get('/bookorders/', async (req, res) => {
    try {
        const bookorders = await pool.query("SELECT * FROM BookOrders_GetAll()");
        res.json(bookorders.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//get books from bookorders by order id
app.get('/bookorders/:id', async (req, res) => {
    try {
        console.log(req.params);
        const { orderID } = req.params;
        const order = await pool.query("SELECT * FROM BookOrder_GetByOrder($1)", [orderID]);
        res.json(order.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//find books that can be removed (they are not part of an order, or in a user's selection)
app.get('/books/removable', async (req, res) => {
    try {
        const removeable = await pool.query("SELECT * FROM Book_GetRemovable()");
        res.json(removeable.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

app.get('/reports/', async (req, res) => {
    try {
        // go through orders -> find all books that have been sold -> prices and commissions and publishers, calculate how much commission is going to publisher, total sales
        // generate some 
        let output = []

        // join orders with books
        const booksOrdered = await pool.query("SELECT * FROM book, bookorders WHERE bookorders.isbn = book.isbn");
        console.log(booksOrdered);

        let sales = 0;
        let expenditures = 0; // note we should include bank accout number to all publishers
        let salesPerPublisher = {};
        let salesPerGenre = {};
        let salesPerAuthor = {};
        for (let book of booksOrdered.rows) {
            sales += book.price * book.quantity;
            expenditures += book.price * book.quantity * book.commission;

            // get genres for this book
            const currGenres = await pool.query("SELECT genre FROM bookgenres WHERE isbn = " + book.isbn);

            // for each genre, add to sales per genre
            for (let genreEntry of currGenres.rows) {
                let genre = genreEntry.genre;
                console.log(genre);

                salesPerGenre[genre] = salesPerGenre[genre] ? salesPerGenre[genre] + book.price * book.quantity : book.price * book.quantity;
            }

            const currAuthors = await pool.query("SELECT authorid FROM bookauthors WHERE isbn = " + book.isbn);
            for (let authorEntry of currAuthors.rows) {
                let author = authorEntry.authorid;
                console.log(author);

                salesPerAuthor[author] = salesPerAuthor[author] ? salesPerAuthor[author] + book.price * book.quantity : book.price * book.quantity;
            }

            console.log("SALES", salesPerPublisher);

            salesPerPublisher[book.publisherid] = salesPerPublisher[book.publisherid] ? salesPerPublisher[book.publisherid] + book.price * book.quantity * book.commission : book.price * book.quantity * book.commission;

        }

        // round values
        sales = sales.toFixed(2);
        expenditures = expenditures.toFixed(2);


        let finalSalesPerAuthor = [];
        // attach author info and publisher info to objects
        for (const [key, value] of Object.entries(salesPerAuthor)) {
            const currAuthor = await pool.query("SELECT * FROM author WHERE authorid = " + key);
            let author = currAuthor.rows[0];
            finalSalesPerAuthor.push({
                author,
                sales: value
            })
        }

        let finalSalesPerPublisher = [];
        for (const [key, value] of Object.entries(salesPerPublisher)) {
            const currPublisher = await pool.query("SELECT * FROM publisher WHERE publisherid = " + key);
            let publisher = currPublisher.rows[0];
            finalSalesPerPublisher.push({
                publisher,
                sales: value.toFixed(2)
            });
        }

        let finalSalesPerGenre = [];
        for (const [key, value] of Object.entries(salesPerGenre)) {
            finalSalesPerGenre.push({
                genre: key,
                sales: value
            });
        }


        res.json({
            sales: sales,
            expenditures: expenditures,
            salesPerGenre: finalSalesPerGenre,
            salesPerAuthor: finalSalesPerAuthor,
            salesPerPublisher: finalSalesPerPublisher
        });

    } catch (err) {
        console.error(err.message);
    }
}
);

app.listen(5000, () => {
    console.log("server has started on port 5000")
});

