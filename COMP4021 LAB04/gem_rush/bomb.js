const Bomb = function(ctx, x, y) {

    const sequences = {
        normal:  { x: 0, y:  48, width: 16, height: 16, count: 2, timing: 100, loop: true },
        explode: { x: 32, y:  96, width: 16, height: 16, count: 4, timing: 100, loop: false },

        explodeUp: { x: 32, y:  64, width: 16, height: 16, count: 4, timing: 100, loop: false },
        explodeDown: { x: 32, y:  128, width: 16, height: 16, count: 4, timing: 100, loop: false },
        explodeLeft: { x: 0, y:  96, width: 16, height: 16, count: 4, timing: 100, loop: false },
        explodeRight: { x: 64, y:  96, width: 16, height: 16, count: 4, timing: 100, loop: false },
        explodeCentre: { x: 32, y:  96, width: 16, height: 16, count: 4, timing: 100, loop: false },


        //a transparent sprite for the bomb
        clear: { x: 0, y:  0, width: 0, height: 0, count: 1, timing: 100, loop: false },
    };

    // This is the sprite object of the gem created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the gem sprite here.
    sprite.setSequence(sequences.normal)
          .setScale(2)
          .setShadowScale({ x: 0.75, y: 0.2 })
          .useSheet("bombspritesheet.png");

    // This is the birth time of the gem for finding its age.
    let birthTime = performance.now();

    //**TODO**/
    const explode = function(explodeCode) {
        console.log("Bomb exploded");
        //sprite.setSequence(sequences.explode);
        //show the explosion animation by explodeCode, 1:centre 2:up 3:down 4:left 5:right

        console.log("explodeCode: " + explodeCode);

        //set enum for explodeCode
        
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

    // The methods are returned as an object here.
    return {
        clear: clear,
        setSequence: sprite.setSequence,
        explode: explode,
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getAge: getAge,
        place, place,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update
    };
};