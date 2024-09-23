const express = require("express");
const app = express();
const ejs = require('ejs');
const mongoose = require("mongoose");

//middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

let errormessage = "";

// User schema and model
const userschema = mongoose.Schema({
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String, required: true },
    password: { type: Number, required: true },
});

const usermodel = mongoose.model("user_collection", userschema);

// Todo schema and model
const todoSchema = mongoose.Schema({
    title: { type: String, trim: true, required: true },
    content: { type: String, trim: true, required: true },
}, { timestamps: true });

const todomodel = mongoose.model("todo_collection", todoSchema);

// Routes
app.get("/", (request, response) => {
    response.render('signup', { errormessage });
});

app.get("/login", (request, response) => {
    response.render('login', { errormessage });
});

app.get("/dashboard", (request, response) => {
    response.render('dashboard');
});

app.get("/todo", async (request, response) => {
    try {
        const displayTodo = await todomodel.find();
        response.render("todo", { displayTodo });
    } catch (error) {
        console.log(error);
        response.redirect("/");
    }
});

app.get("/edit/:index", async (request, response) => {
    const { index } = request.params;
    try {
        let editTodo = await todomodel.findById(index);
        if (editTodo) {
            response.render("edit", { editTodo });
        } else {
            console.log('Todo not found');
            response.redirect("/todo");
        }
    } catch (error) {
        console.log(error);
        response.redirect("/todo");
    }
});

app.post("/register", async (request, response) => {
    try {
        const createuser = await usermodel.create(request.body);
        if (createuser) {
            console.log("User created successfully");
            response.redirect("/login");
        } else {
            console.log("Unable to create user");
            response.redirect("/");
        }
    } catch (error) {
        console.log(error);
        response.redirect("/");
    }
});

app.post("/login", async (request, response) => {
    try {
        const confirmUser = await usermodel.findOne({ email: request.body.email, password: request.body.password });
        if (confirmUser) {
            response.redirect("/dashboard");
            errormessage = '';
        } else {
            errormessage = "Invalid email or password";
            response.redirect('/login');
        }
    } catch (error) {
        console.log(error);
        errormessage = "An error occurred";
        response.redirect('/login');
    }
});

app.post("/addtodo", async (request, response) => {
    try {
        const todo = await todomodel.create(request.body);
        if (todo) {
            console.log("Task created successfully");
            response.redirect('/todo');
        } else {
            console.log("Error creating task");
            response.redirect('/todo');
        }
    } catch (error) {
        console.log(error);
        response.redirect('/todo');
    }
});

app.post("/delete/:index", async (request, response) => {
    const { index } = request.params;
    try {
        let deleteTodo = await todomodel.findByIdAndDelete(index);
        if (deleteTodo) {
            console.log('Deleted successfully');
            response.redirect("/todo");
        } else {
            console.log('Unable to delete');
            response.redirect("/todo");
        }
    } catch (error) {
        console.log(error);
        response.redirect("/todo");
    }
});

app.post("/editted/:index", async (request, response) => {
    const { index } = request.params;
    const { title, content } = request.body;
    try {
        let updatedTodo = await todomodel.findByIdAndUpdate(index, { title, content }, { new: true });
        if (updatedTodo) {
            console.log('Updated successfully');
            response.redirect("/todo");
        } else {
            console.log('Unable to update');
            response.redirect("/edit/" + index);
        }
    } catch (error) {
        console.log(error);
        response.redirect("/edit/" + index);
    }
});

// Database connection
const uri = "mongodb+srv://jaydboy824:Jomiloju1234@cluster0.6xzek.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const db_connect = async () => {
    try {
        const connection = await mongoose.connect(uri);
        if (connection) {
            console.log("Connected to database");
        }
    } catch (error) {
        console.log(error);
    }
};

db_connect();

// Start server
const port = 8005;
app.listen(port, () => {
    console.log(`App started on port ${port}`);
});
