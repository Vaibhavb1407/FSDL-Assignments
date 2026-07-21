const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require('method-override')

const { v4 : uuidv4 } = require("uuid");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

let posts = [
    {
        id: uuidv4(),
        username: "VaibhavBargal",
        content: "I Just finished building my first CRUD app using Express and EJS. Feels great to see everything working together!",
    },
    {
        id: uuidv4(),
        username: "AdityaSharma",
        content:  "Can someone explain REST APIs in simple terms? I understand the theory but want a practical perspective.",
    },
    {
        id: uuidv4(),
        username: "RahulKumar",
        content: "How do you stay consistent while learning programming alongside college work?",
    },
    {
        id: uuidv4(),
        username: "curious_mind",
        content: "Debugging teaches more patience than coding itself",
    },
    {
        id: uuidv4(),
        username: "tech_siddharth",
        content: "Is it better to focus on frontend first or backend first as a beginner in web development?",
    },

];

app.get("/posts", (req, res) => {
    res.render("index.ejs",{ posts });
})

app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
})

app.post("/posts", (req, res) => {
    let { username, content } = req.body;
    let id = uuidv4();
    posts.push({ id, username, content });
    res.redirect("/posts");
})

app.get("/posts/:id", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("show.ejs", { post });

})

app.patch("/posts/:id", (req, res) => {
    let { id } = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => id === p.id);
    post.content = newContent;
    console.log(post);
    res.redirect("/posts");
})

app.get("/posts/:id/edit", (req,res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit.ejs", { post });
})

app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts")
})


app.listen(port, () => {
    console.log(`Listening on port : ${port}`);
})