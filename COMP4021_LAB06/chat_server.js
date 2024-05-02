const express = require("express");
const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");

// Create the Express app
const app = express();

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

// Use the session middleware to maintain sessions
const chatSession = session({
    secret: "game",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 300000 }
});
app.use(chatSession);


// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
    return /^\w+$/.test(text);
}

// Handle the /register endpoint
app.post("/register", (req, res) => {
    // Get the JSON data from the body
    const { username, avatar, name, password } = req.body;

    //
    // D. Reading the users.json file
    const users = JSON.parse(fs.readFileSync("data/users.json"));
    //

    //
    // E. Checking for the user data correctness
    if (!username || !avatar || !name || !password) {
        res.json({
            status: "error", 
            error: "Please fill in all the fields." 
        });
        return;
    }

    if (!containWordCharsOnly(username)) {
        res.json({
            status: "error",
            error: "The username should only contain underscores, letters, and numbers."
        });
        return;
    }

    if (username in users) {
        res.json({
            status: "error",
            error: "The username is already taken."
        });
        return;
    }
    //

    //
    // G. Adding the new user account
    const hash = bcrypt.hashSync(password, 10);
    users[username] = { avatar: avatar, name: name, password: hash };
    //

    //
    // H. Saving the users.json file
    fs.writeFileSync("data/users.json", JSON.stringify(users, null, " "));
    //

    //
    // I. Sending a success response to the browser
    res.json({ status: "success" });
    //

    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /signin endpoint
app.post("/signin", (req, res) => {
    // Get the JSON data from the body
    const { username, password } = req.body;
    //
    // D. Reading the users.json file
    const users = JSON.parse(fs.readFileSync("data/users.json"));
    // E. Checking for username/password
    if (username in users) {
        const user = users[username];
        if (!bcrypt.compareSync(password, user.password)) {
            res.json({
                status: "error",
                error: "Invalid password."
            });
            return;
        }
        else {
        // G. Sending a success response with the user account
            req.session.user = {username, avatar: user.avatar, name: user.name };
            res.json({ 
                status: "success",
                user: {username, avatar: user.avatar, name: user.name}
            });
            return;
        }
    }
    else {
        res.json({
            status: "error",
            error: "This username does not exist."
        });
        return;
    }
    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {
    //
    // B. Getting req.session.user
    if (!req.session.user) {
        res.json({ status: "error", error: "You are not signed in." });
        return;
    }
    //

    //
    // D. Sending a success response with the user account
    res.json({ 
        status: "success", 
        user: req.session.user 
    });
    //
 
    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented." });
});
// Handle the /signout endpoint

app.get("/signout", (req, res) => {
    //
    // Deleting req.session.user
    if (req.session.user) {
        delete req.session.user;
    }
    req.session.user = null;

    // Sending a success response
    res.json({ status: "success" });
    //
    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented." });
});


//
// ***** Please insert your Lab 6 code here *****
//
const{createServer} = require("http");
const{Server} = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer);

const onlineUsers = {};

io.on("connection", (socket) => {
    if (socket.request.session.user) {
        const {username, avatar, name} = socket.request.session.user;
        onlineUsers[username] = {avatar, name};
        console.log(onlineUsers)

        io.emit("add user", JSON.stringify({username, avatar, name}));
    }

    socket.on("disconnect", () => {
        if (socket.request.session.user) {
            const {username} = socket.request.session.user;
            if (onlineUsers[username]) {
                delete onlineUsers[username];
            }
            console.log(onlineUsers);
        }
    });

    socket.on("get users", () => {      
        socket.emit("users", JSON.stringify(onlineUsers));
    });

    socket.on("get messages", () => {
        const chatroom = JSON.parse(fs.readFileSync("data/chatroom.json"));
        socket.emit("messages", JSON.stringify(chatroom));
    });

    socket.on("post message", (content) => {
        const message = {
            user: socket.request.session.user,
            datetime: new Date(),
            content: content
        }
        const chatroom = JSON.parse(fs.readFileSync("data/chatroom.json"));
        chatroom.push(message);
        fs.writeFileSync("data/chatroom.json", JSON.stringify(chatroom, null, " "));
        io.emit("add message", JSON.stringify(message));
    });

    socket.on('typing', (data)=>{
        if(data.typing==true)
           io.emit('display', data)
        else
            data.typing = false;
           io.emit('display', data)
      })
});

// Use a web server to listen at port 8000
httpServer.listen(8000, () => {
    console.log("The chat server has started...");
});

io.use((socket, next) => {
    chatSession(socket.request, {}, next);
});