const express = require('express');
const app = express();
const cors =require('cors');
const pool = require("./db");


// middleware
app.use(cors());
app.use(express.json()); // gives access to request.body to get json data

//ROUTES

//register a user
app.post('/users', async(req,res)=>{
    try {
        //should include fName,lName,address,email,phoneNumber
        
        const {fName,lName,address,email,phoneNumber}=req.body;
        console.log(req.body);
        const newUser = await pool.query("SELECT * FROM StoreUser_Register($1,$2,$3,$4,$5)",[fName,lName,address,email,phoneNumber]);
        console.log(newUser.rows)
        res.json(newUser.rows[0]);
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

//get a user
app.get('/users/:id', async(req,res)=>{
    try {
        console.log(req.params);
        const {id}=req.params;
        const user = await pool.query("SELECT * FROM StoreUser_GetByID($1)",[id]);
        res.json(user.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//get a user
app.delete('/users/:id', async(req,res)=>{
    try {
        console.log(req.params);
        const {id}=req.params;
        const user = await pool.query("SELECT * FROM StoreUser_Delete($1)",[id]);
        res.json(user.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//register a book
app.post('/books', async(req,res)=>{
    try {
        //should include name, numberOfPages, price, commission, stock, publisherID
          
        const {name, numberOfPages, price, commission, stock, publisherID,genres,authors}=req.body;
        console.log(req.body);
        const newBook = await pool.query("SELECT * FROM Book_Register($1,$2,$3,$4,$5,$6)",[name, numberOfPages, price, commission, stock, publisherID]);
        let newBookGenre;
        let newBookAuthor;
        for(let i=0;i<genres.length;i++){
            newBookGenre[i] = await pool.query("SELECT * FROM BookGenres_Register($1,$2)",[newBook.isbn,genres[i]]);
        }
        for(let i=0;i<authors.length;i++){
            newBookAuthor = await pool.query("SELECT * FROM BookAuthors_Register($1,$2)",[newBook.isbn,authors[i]]);
        }
        console.log(newBook.rows);
        console.log(newBookAuthor.rows);
        console.log(newBookGenre.rows);
        res.json(newBook.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
}
);

//get all books
app.get("/books", async (req, res) => {
    try {
        const allBooks = await pool.query("SELECT * FROM Book_GetALL()");
        res.json(allBooks.rows);
    } catch (err) {
        console.error(err.message);
    }
  });

//get a book
app.get('/books/:id', async(req,res)=>{
    try {
        console.log(req.params);
        const {id}=req.params;
        const book = await pool.query("SELECT * FROM Book_GetByID($1)",[id]);
        res.json(book.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//remove a book
app.delete('/books/:id', async(req,res)=>{
    try {
        console.log(req.params);
        const {id}=req.params;
        const book = await pool.query("SELECT * FROM Book_Remove($1)",[id]);
        res.json(book.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//order a book
app.put('/books/:id', async(req,res)=>{
    try {
        console.log(req.params);
        const {id}=req.params;
        const {stock}=req.body;
        const book = await pool.query("SELECT * FROM Book_UdateStock($1,$2)",[id,stock]);
        res.json(book.rows);
    } catch (err) {
        console.error(err.message);
    }
}

);

//register a publisher
app.post('/publishers', async(req,res)=>{
    try {
        //should include name, address, email, phoneNumber
        const {name,address,email,phoneNumber}=req.body;
        console.log(req.body);
        const newPublisher = await pool.query("SELECT * FROM Publisher_Register($1,$2,$3,$4)",[name,address,email,phoneNumber]);
        console.log(newPublisher.rows);
        res.json(newPublisher.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
}
);

//get a publisher
app.get('/publishers/:id', async(req,res)=>{
    try {
        console.log(req.params);
        const {id}=req.params;
        const publisher = await pool.query("SELECT * FROM Publisher_GetByID($1)",[id]);
        res.json(publisher.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);


//register an author
app.post('/authors/', async(req,res)=>{
    try {
        console.log(req.body);
        const {fName,lName}=req.body;
        const author = await pool.query("SELECT * FROM Author_Register($1,$2)",[fName,lName]);
        res.json(author.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//get an author
app.get('/authors/:id', async(req,res)=>{
    try {
        console.log(req.params);
        const {id}=req.params;
        const author = await pool.query("SELECT * FROM Author_GetByID($1)",[id]);
        res.json(author.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);


//pair an author with a book
app.post('/bookauthors/', async(req,res)=>{
    try {
        console.log(req.body);
        const {authorID,isbn}=req.body;
        const selection = await pool.query("SELECT * FROM BookAuthors_AddAuthor($1,$2)",[authorID,isbn]);
        res.json(selection.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//find author(s) of a book
app.get('/bookauthors/author/id', async(req,res)=>{
    try {
        console.log(req.body);
        const {authorID,isbn}=req.body;
        const selection = await pool.query("SELECT * FROM BookAuthors_GetByAuthor($1)",[authorID,isbn]);
        res.json(selection.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//select book selections
app.post('/selections/', async(req,res)=>{
    try {
        console.log(req.body);
        const {userID,isbn,quantity}=req.body;
        const selection = await pool.query("SELECT * FROM UserBookSelections_AddBook($1,$2,$3)",[userID,isbn,quantity]);
        res.json(selection.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//checkout book selections
app.post('/selections/', async(req,res)=>{
    try {
        console.log(req.body);
        const {userid,bookid,quantity}=req.body;
        const selection = await pool.query("SELECT * FROM UserBookSelections_AddBook($1,$2,$3)",[userid,isbn,quantity]);
        res.json(selection.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//delete book selections
app.delete('/selections/:id/:isbn', async(req,res)=>{
    try {
        console.log(req.params);
        const {userid,isbn}=req.params;
        const selection = await pool.query("SELECT * FROM UserBookSelections_Delete($1)",[userid,isbn]);
        res.json(selection.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//create order
app.post('/orders/', async(req,res)=>{
    try {
        console.log(req.body);
        const {}=req.body;
        const order = await pool.query("SELECT * FROM StoreOrder_Post($1,$2,$3)",[]);
        res.json(order.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//delete order
app.delete('/orders/:id', async(req,res)=>{
    try {
        console.log(req.params);
        const {orderID}=req.params;
        const order = await pool.query("SELECT * FROM StoreOrder_Delete($1)",[orderID]);
        res.json(order.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//add book to order
app.post('/bookorders/', async(req,res)=>{
    try {
        console.log(req.body);
        const {orderId,isbn,quantity}=req.body;
        const bookorder = await pool.query("SELECT * FROM BookOrder_Post($1,$2,$3)",[orderId,isbn,quantity]);
        res.json(bookorder.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//remove order from bookorders
app.delete('/bookorders/:id', async(req,res)=>{
    try {
        console.log(req.params);
        const {orderID}=req.params;
        const order = await pool.query("SELECT * FROM BookOrder_Delete($1)",[orderID]);
        res.json(order.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

//find books that can be removed (they are not part of an order, or in a user's selection)
app.get('/books/removeable', async(req,res)=>{
    try {
        const removeable = await pool.query("SELECT * FROM Book_GetRemoveable()");
        res.json(removeable.rows);
    } catch (err) {
        console.error(err.message);
    }
}
);

app.get('/reports/', async(req,res)=>{

}
);

app.listen(5000, () => {
    console.log("server has started on port 5000")
});

