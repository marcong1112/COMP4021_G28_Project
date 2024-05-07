const Bomb = function(ctx, x, y,player) {

    const sequences = {
        normal:  { x: 0, y:  48, width: 16, height: 16, count: 2, timing: 100, loop: true },
        explode: { x: 112, y:  176, width: 16, height: 16, count: 4, timing: 100, loop: false },

        explodeUp: { x: 112, y:  160, width: 16, height: 16, count: 4, timing: 100, loop: false },
        explodeDown: { x: 112, y:  192, width: 16, height: 16, count: 4, timing: 100, loop: false },
        explodeLeft: { x: 96, y:  176, width: 16, height: 16, count: 4, timing: 100, loop: false },
        explodeRight: { x: 128, y:  176, width: 16, height: 16, count: 4, timing: 100, loop: false },
        explodeCentre: { x: 112, y:  176, width: 16, height: 16, count: 4, timing: 100, loop: false },


        //a transparent sprite for the bomb
        clear: { x: 0, y:  0, width: 0, height: 0, count: 1, timing: 100, loop: false },
    };
    const playerNum=player;

    // This is the sprite object of the gem created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    const areaBomb=[Sprite(ctx, x, y-32)
        ,Sprite(ctx, x, y+32)
        ,Sprite(ctx, x-32, y)
        ,Sprite(ctx, x+32, y)]

    for(i=0;i<4;i++){
        areaBomb[i].setSequence(sequences.explode)
            .setScale(2)
            .setShadowScale({ x: 0, y: 0 })
            .useSheet("bombspritesheet.png");
    }
    areaBomb[0].setSequence(sequences.explodeUp);
    areaBomb[1].setSequence(sequences.explodeDown);
    areaBomb[2].setSequence(sequences.explodeLeft);
    areaBomb[3].setSequence(sequences.explodeRight);

    // The sprite object is configured for the gem sprite here.
    sprite.setSequence(sequences.normal)
          .setScale(2)
          .setShadowScale({ x: 0.75, y: 0.2 })
          .useSheet("bombspritesheet.png");

    // This is the birth time of the gem for finding its age.
    let birthTime = performance.now();

    //**TODO**/
    const explode = function(explodeCode) {

        switch(explodeCode){
            case 1:
                sprite.setSequence(sequences.explodeCentre);
                break;
            case 2:
                sprite.setSequence(sequences.explodeUp);
                //console.log("explode up");
                break;
            case 3:
                sprite.setSequence(sequences.explodeDown);
                //console.log("explode down");
                break;
            case 4:
                sprite.setSequence(sequences.explodeLeft);
                //console.log("explode left");
                break;
            case 5:
                sprite.setSequence(sequences.explodeRight);
                //console.log("explode right");
                break;
        }
    };

    //clear the bomb sprite
    const clear = function(){
        sprite.setSequence(sequences.clear);
    }

    //**TODO**/

    //this function places the bomb at the given position
    const place = function(x, y) {
        //console.log("Bomb placed at x: " + x + " y: " + y);
        sprite.setXY(x, y);
    };

    // This function gets the age (in millisecond) of the gem.
    // - `now` - The current timestamp
    const getAge = function(now) {
        return now - birthTime;
    };

    const PassAreaBomb = function(num){
        return areaBomb[num];
    }
    const getOwnPlayer = function(){
        return playerNum;
    }

    const detectCollision = function(obstacles) {
        // Get the bounding box of the bomb
        const bombBox = sprite.getBoundingBox();
    
        for (let obstacle of obstacles) {
            // Get the bounding box of the current obstacle
            const obstacleBox = obstacle.getBoundingBox();
    
            // Check if the bounding boxes intersect
            if (bombBox.intersect(obstacleBox)) {
                // If they do, destroy the obstacle
                obstacle.destroy();
                return true;
            }
    
            // Check for collision with areaBomb
            for(let i = 0; i < areaBomb.length; i++) {
                const areaBombBox = areaBomb[i].getSmallBox(4);
                if (areaBombBox.intersect(obstacleBox)) {
                    // If they do, destroy the obstacle
                    obstacle.destroy();
                    return true;
                }
            }
        }
    
        return false;
    };
        //detect collision with player
        const detectCollisionWithPlayer = function(player) {
            // Get the bounding box of the bomb
            const bombBox = sprite.getBoundingBox();
        
            // Get the bounding box of the player
            const playerBox = player.getBoundingBox();
        
            // Check if the bounding boxes intersect
            if (bombBox.intersect(playerBox)) {
                // If they do, destroy the player
                return true;
            }else{
                return false;
            }
        };
  
    



    // The methods are returned as an object here.
    return {
        detectCollisionWithPlayer: detectCollisionWithPlayer,
        detectCollision: detectCollision,
        PassAreaBomb: PassAreaBomb,
        getOwnPlayer: getOwnPlayer,
        clear: clear,
        setSequence: sprite.setSequence,
        explode: explode,
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getAge: getAge,
        place, place,
        getBoundingBox: sprite.getBoundingBox,
        getSmallBox: sprite.getSmallBox,
        draw: sprite.draw,
        update: sprite.update
    };
};