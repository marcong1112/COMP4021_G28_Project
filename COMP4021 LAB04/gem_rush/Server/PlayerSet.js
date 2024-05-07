const PlayerSet = (function () {
    player1 = null;
    player2 = null;
    p1_dir = null;
    p2_dir = null;
    p1stop = null;
    p2stop = null;
    MapObstacle1 = null;
    MapEmptyObstacle1=null;
    let bomblist1=[];
    ctx1=null;
    p1Score=0;
    p2Score=0;

    async function init() {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        Socket.online();
    }
    
    const createplayer = function (ctx, x, y, gameArea, playerNum) {
      if (playerNum == 1 && player1 == null) {
        player1 = Player(ctx, x, y, gameArea);
      } else if (player2 == null) {
        player2 = Player(ctx, x, y, gameArea);
      }
    };
    const getp1 = function () {
        return player1;
      };
      const getp2 = function () {
        return player2;
      };
  
  
    function movement() {
      data = {
        1: player1.getXY(),
        2: player2.getXY(),
      };
      Socket.getPos(data);
    }
  
    const setplayer1 = function (x, y) {
      player1.setXY(x, y);
      movement();
    };
    const setplayer2 = function (x, y) {
      player2.setXY(x, y);
      movement();
    };
    
    const setMapObstacle = function (MapObstacle,MapEmptyObstacle,ctx) {
        MapObstacle1 = MapObstacle;
        MapEmptyObstacle1 =MapEmptyObstacle;
        ctx1=ctx;
      }
    const setBomb = function (playerNum) {
        if(playerNum==1){
            let {x,y}=player1.getXY();
            bomblist1.push(Bomb(ctx1, x, y,playerNum));
        }else{
            let {x,y}=player2.getXY();
            bomblist1.push(Bomb(ctx1, x, y,playerNum));
        }
    }
    const getbomblist = function(){
        return bomblist1;
    }
    const removeBomb = function(Bomb) {
        bomblist1 = bomblist1.filter(bomb => bomb !== Bomb);
    };
    const addScore = function(playerNum,score){
        if(playerNum==1){
           console.log("p1score",p1Score);
            p1Score=p1Score+score;
        }else{
            console.log("p2score",p2Score);
            p2Score=p2Score+score;
        }
    }
    const getScore = function(playerNum){
        if(playerNum==1){
            return p1Score;
        }else{
            return p2Score;
        }
    }      

    
  
    const setp1Dir = function (direction) {
      switch (direction) {
        case 37: p1_dir = 1; break;
        case 38: p1_dir = 2; break;
        case 39: p1_dir = 3; break;
        case 40: p1_dir = 4; break;
        default: p1_dir = -10; break;
      }
      if (p1_dir>=1 && p1_dir<=4) {
        player1.move(p1_dir);
        //player1.update(now, MapObstacle1,MapEmptyObstacle1);
      }
  
    }
  
    const setp2Dir = function (direction) {
      switch (direction) {
        case 37: p2_dir = 1; break;
        case 38: p2_dir = 2; break;
        case 39: p2_dir = 3; break;
        case 40: p2_dir = 4; break;
        default: p2_dir = -10; break;
      }
      if (p2_dir>=1 && p2_dir<=4) {
        player2.move(p2_dir);
        //player2.update(now, MapObstacle1,MapEmptyObstacle1);
      }
    }
  
    const getp1Dir = function () {
      return p1_dir;
    } 
  
    const getp2Dir = function () {
      return p2_dir;
    }
  
    const setnow = function (currenttime) {
      now = currenttime;
    }
  
    const getnow = function () {
      return now;
    }
  
    const setp1stop = function (direction) {
      switch (direction) {
        case 37: p1stop = 1; break;
        case 38: p1stop = 2; break;
        case 39: p1stop = 3; break;
        case 40: p1stop = 4; break;
        default: p1stop = -10; break;
      }
      if (p1stop>=1 && p1stop<=4) {
        player1.stop(p1stop);
        console.log('p1stop');
      }
    }
  
    const setp2stop = function (direction) {
      switch (direction) {
        case 37: p2stop = 1; break;
        case 38: p2stop = 2; break;
        case 39: p2stop = 3; break;
        case 40: p2stop = 4; break;
        default: p2stop = -10; break;
      }
      if (p2stop>=1 && p2stop<=4) {
        player2.stop(p2stop);
        console.log('p2stop');
      }
    }
  
    return {
        init,
        setBomb,
        removeBomb,
      setMapObstacle,
      createplayer,
        addScore,
        getScore,
      getp1,
      getp2,
      setplayer1,
      setplayer2,
      movement,
      setp1Dir,
      setp2Dir,
      getp1Dir,
      getp2Dir,
      setnow,
      getnow,
      setp1stop,
      setp2stop,
      getbomblist
    };
  })();