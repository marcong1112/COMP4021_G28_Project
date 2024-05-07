const express = require("express");
const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");

// Create the Express app
const app = express();

// Use the 'public' folder to serve static files
app.use(express.static("./"));

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
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });

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
    fs.writeFileSync("users.json", JSON.stringify(users, null, " "));
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

    const { username, password } = req.body;

    const users=JSON.parse(fs.readFileSync("./users.json"))

    if (username in users === false) {
        res.json({ status: "error", error: "Username does not exist" });
        return;
    }
    if (!bcrypt.compareSync(password, users[username].hash)) {
        res.json({ status: "error", error: "Password incorrect" });
        return;
    }

    const { avatar, name } = users[username];
    req.session.user = {username, avatar, name};
    res.json({ status: "success", user: req.session.user });

});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {

    if(req.session.user){

        res.json({status:"success",user:req.session.user});
    }
    else{
        res.json({status:"error",error:"User is not logged in"});
    }

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
        console.log("A user has connected: " + username);

        const UserOnlineNum=Object.keys(onlineUsers).length;
        if(UserOnlineNum==1){
            onlineUsers[username].player=1;
            socket.emit(
                "playerStatus",
                JSON.stringify({
                  player: UserOnlineNum,
                  status: "success",
                })
            );
            io.emit("startgame", JSON.stringify(onlineUsers));
        }else if (UserOnlineNum==2){
            onlineUsers[username].player=2;
            socket.emit(
                "playerStatus",
                JSON.stringify({
                  player: UserOnlineNum,
                  status: "success",
                })
            );        
    }else {
        socket.emit(
          "loginstate",
          JSON.stringify({
            player: UserOnlineNum,
            status: "error",
            reason: "Game is full",
          })
        );
      }
    }

    socket.on("clicked", () => {
        socket.broadcast.emit("clicked");
    });

    socket.on("online", () => {
        if (socket.request.session.user) {
          socket.broadcast.emit("online");
        }
      });

    socket.on("disconnect", () => {
        if (socket.request.session.user) {
            const {username} = socket.request.session.user;
            if (onlineUsers[username]) {
                delete onlineUsers[username];
            }
            console.log(onlineUsers);
        }
    });

    socket.on("stopping", (content) => {
        //console.log("stopping emitted");
        io.emit("stopping", JSON.stringify(content));
        //console.log("stopping emitted from server:", content);
      });

    socket.on("move", (pressed) => {
        socket.broadcast.emit("move", JSON.stringify(pressed));
      });
    socket.on("bomb", (pressed) => {
        socket.broadcast.emit("bomb", JSON.stringify(pressed));
    });

    socket.on("get users", () => {      
        socket.emit("users", JSON.stringify(onlineUsers));
    });

    socket.on("get messages", () => {
        const chatroom = JSON.parse(fs.readFileSync("chatroom.json"));
        socket.emit("messages", JSON.stringify(chatroom));
    });

    socket.on("post message", (content) => {
        const message = {
            user: socket.request.session.user,
            datetime: new Date(),
            content: content
        }
        const chatroom = JSON.parse(fs.readFileSync("chatroom.json"));
        chatroom.push(message);
        fs.writeFileSync("chatroom.json", JSON.stringify(chatroom, null, " "));
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