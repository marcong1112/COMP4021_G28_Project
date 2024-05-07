const Socket = (function() {
    // This stores the current Socket.IO socket
    let socket = null;
    let player = null;

    // This function gets the socket from the module
    const getSocket = function() {
        return socket;
    };

    // This function connects the server and initializes the socket
    const connect = function() {
        socket = io();

        // Wait for the socket to connect successfully
        socket.on("connect", () => {
            console.log("Socket connected");
            console.log(socket.id);
            console.log(socket.connected);
        });

        socket.on("getPos", (users) => {
            console.log("getPos received!", users);
          });

        socket.on("clicked", () => {
            $("#game-start").click();
            $("#game-start").hide();
          }); 
      
        socket.on("startgame", (users) => {
            console.log("game start received!");
            console.log("user", users);
            $("#signin-overlay").hide();
            $("#waiting-room").hide();
            $("#game-start").click();
            $("#game-container").show();          
          });

        socket.on("playerStatus", (users)=>{
            console.log("User request for Playerstatus",users);
            users=JSON.parse(users);
            if(users.status=="success"){
                player=users.player;
                console.log("Your Player Status",player);
            }else{
                console.log(users.reason);
            }
        
        });

          socket.on("bomb", (data) => {
            console.log("receive bomb!", data);
            data = JSON.parse(data);   
            PlayerSet.setBomb(data.player);            
          });

          socket.on("move", (movement) => {
            movement = JSON.parse(movement);
            if (player == 1) {
              PlayerSet.setp2Dir(movement.keyCode);
              
            } else {
               PlayerSet.setp1Dir(movement.keyCode);
             
            }
          });

          socket.on("stopping", (data) => {
            data = JSON.parse(data);
            console.log("stopping received.", data);
            if (player == 1) {
              PlayerSet.setp2stop(data.keyCode, data.coordinates.x, data.coordinates.y);
            } else {
               PlayerSet.setp1stop(data.keyCode, data.coordinates.x, data.coordinates.y);
            }
          });
        

        // Set up the users event
        socket.on("users", (onlineUsers) => {
            onlineUsers = JSON.parse(onlineUsers);

            // Show the online users
            OnlineUsersPanel.update(onlineUsers);
        });

        // Set up the add user event
        socket.on("add user", (user) => {
            user = JSON.parse(user);

            // Add the online user
            OnlineUsersPanel.addUser(user);
        });

        // Set up the remove user event
        socket.on("remove user", (user) => {
            user = JSON.parse(user);

            // Remove the online user
            OnlineUsersPanel.removeUser(user);
        });
    };


    // This function disconnects the socket from the server

    const online = function (content) {
        if (socket && socket.connected) {
          socket.emit("online");
          console.log("emitting online");
        }
      };

    const disconnect = function() {
        socket.disconnect();
        socket = null;
    };
    const started = function () {
        if (socket && socket.connected) {
          socket.emit("clicked");
        }
      };

    const stopping = function (data) {
        if (socket && socket.connected) {
          socket.emit("stopping", data);
          console.log("emitting stopping", data);
        }
      };

    const MoveRequest = function (data) {
        if (socket && socket.connected) {
          console.log("moveRequest", data);        
          socket.emit("move", data);
        }
      };
    const BombRequest = function (data) {
        if (socket && socket.connected) {
          console.log("BombRequest", data);        
          socket.emit("bomb", data);
        }
      };
    
      const getSessionPlayer = function () {
        return player;
      };
    


    return {getSocket, connect, disconnect,getSessionPlayer,MoveRequest,stopping,started,online,BombRequest};
})();
