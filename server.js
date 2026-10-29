const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require ("path");

//const items =require("./routes/api/items");

const app =express();
app.use(bodyParser.json());
//db config
const db = require("./config/keys").mongoURI;

//connect to mongo
mongoose
.connect(db, {
    userNewUrlParser:true,
    userCreateIndex:true})
.then(() => console.log("MongoDB connected..."))
.catch(err => console.log((err)));
// Use Routes
app.use("/api/items",  require("./routes/api/items"));
app.use("/api/user",  require("./routes/api/items"));
// Serve static assets if in production
if (process.env.NODE_ENV === "production"){
    // Set static folder
    app.use(express.static("client/build"));
    app.get("*",(req,res) => {
        res.sendFile(path.resolve(__dirname,"client","build","index.html"));

    }

    );

}
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
