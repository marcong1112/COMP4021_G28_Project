const Obstacle = function(ctx, x, y) {

    // This is the sprite sequences of the gem of four colours
    // `green`, `red`, `yellow` and `purple`.
    const sequences = {
        normal:  { x: 33, y:  209, width: 16, height: 16, count: 8, timing: 2000, loop: true },
    };

    // This is the sprite object of the gem created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the gem sprite here.
    sprite.setSequence(sequences.normal)
          .setScale(2)
          .setShadowScale({ x: 0, y: 0 })
          .useSheet("Minefield.png");

    // This is the birth time of the gem for finding its age.
    let birthTime = performance.now();

    const setColor = function(color) {
        sprite.setSequence(sequences[color]);
        birthTime = performance.now();
    };


    // This function gets the age (in millisecond) of the gem.
    // - `now` - The current timestamp
    const getAge = function(now) {
        return now - birthTime;
    };
    const destroy = function(){
        sprite.setXY(-100,100);
    }

    // The methods are returned as an object here.
    return {
        destroy:destroy,
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        setColor: setColor,
        getAge: getAge,
        getBoundingBox: sprite.getBoundingBox,
        getSmallBox: sprite.getSmallBox,
        draw: sprite.draw,
        update: sprite.update
    };
};