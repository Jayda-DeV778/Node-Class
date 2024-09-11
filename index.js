const express = require("express");
const app = express();
const ejs = require('ejs')
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }));

let userarray = []
let todoarray = []
let errormessage = ""


app.get("/", (request, response) => {
    response.render('signup', { errormessage })
})

app.get("/login", (request, response) => {
    response.render('login', { errormessage })
})

app.get("/dashboard", (request, response) => {
    response.render('dashboard')
})

app.get("/todo", (request, response) => {
    response.render("todo", {todoarray})
})

app.get("/edit/:index",(request, response)=>{
    console.log(request.params);
    const{ index } = request.params
    console.log(index);
    let editTodo = todoarray[index]
    response.render("edit", {editTodo , index})
})

app.post("/register", (request, response) => {
    console.log(request.body);
    let body = request.body
    let existuser = userarray.find((user) => user.email === request.body.email)
    if (existuser) {
        errormessage = "user already exists"
        response.redirect("/dashboard")
    } else {
        errormessage = ''
        userarray.push(body)
        console.log(userarray);
        response.redirect("/login")
    }

})

app.post("/login", (request, response) => {
    let confirmUser = userarray.find((user) => user.email === request.body.email && user.password === request.body.password)
    if (confirmUser) {
        response.redirect("/dashboard")
        errormessage = ''
    } else {
        errormessage = "Invalid email or password";
        response.redirect('/login');
    }
})

app.post("/addtodo", (request, response) => {
    console.log(request.body);
    todoarray.push(request.body)
    console.log(todoarray);
    response.redirect("/todo")
})

app.post("/delete",(request, response)=>{
    console.log(request.params);
    let index = reques.params.index
    console.log(index);
    todoarray.splice(index,1)
    console.log(request.params);
    response.redirect("/todo")
})

app.post("/editted/:index",(request , response)=>{
    console.log(request.body);
    const { index } = request.params
    let change = request.body
    todoarray[index] = change
    response.redirect("/todo")
    
})



const port = 8005

app.listen(port, () => {
    console.log(`app started on port ${port} `);

})