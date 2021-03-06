var bulletTime1 = 0;

var bullet_player1_material = new THREE.MeshLambertMaterial(
    {
        color: 0x00ff00,
        transparent: false
    });

function shoot() {
    if (keyboard.pressed("space") && bulletTime1 + 0.8 < clock.getElapsedTime()) {
        bullet = new THREE.Mesh(
            new THREE.SphereGeometry(2),
            bullet_player1_material);
        scene.add(bullet);
        bullet.position.x = player1.graphic.position.x + 7.5 * Math.cos(player1.direction);
        bullet.position.y = player1.graphic.position.y + 7.5 * Math.sin(player1.direction);
        bullet.angle = player1.direction;
        player1.bullets.push(bullet);
        bulletTime1 = clock.getElapsedTime();
    }

    // move bullets
    var moveDistance = 5;

    for (var i = 0; i < player1.bullets.length; i++) {
        player1.bullets[i].position.x += moveDistance * Math.cos(player1.bullets[i].angle);
        player1.bullets[i].position.y += moveDistance * Math.sin(player1.bullets[i].angle);
    }

}

function collisions() {
    bullet_collision();
    player_collision();
    enemy_collision();
    player_falling();
}

function bullet_collision() {
    // the accuracy of the bullets

    var nb_tile = 10;
    var sizeOfTileX = WIDTH / nb_tile;
    var sizeOfTileY = HEIGHT / nb_tile;

    for (var i = 0; i < player1.bullets.length; i++) {

        //collision between bullet and walls
        if (Math.abs(player1.bullets[i].position.x) >= WIDTH / 2 ||
            Math.abs(player1.bullets[i].position.y) >= HEIGHT / 2) {
            scene.remove(player1.bullets[i]);
            player1.bullets.splice(i, 1);
            i--;
        }

        // Colission between bullets and ennemy
        else if (Math.abs(player1.bullets[i].position.x) <= enemy.position.x - sizeOfTileX
            && Math.abs(player1.bullets[i].position.x) >= enemy.position.x + sizeOfTileX
            && Math.abs(player1.bullets[i].position.y) <= enemy.position.y - sizeOfTileY
            && Math.abs(player1.bullets[i].position.y) >= enemy.position.y + sizeOfTileY) {
            player2.dead();
            scene.remove(player2.graphic)
            scene.remove(player1.bullets[i]);
            player1.bullets.splice(i, 1);
            i--;
        }
    }

}

function player_collision() {
    //collision between player and walls
    var x = player1.graphic.position.x + WIDTH / 2;
    var y = player1.graphic.position.y + HEIGHT / 2;

    if (x > WIDTH)
        player1.graphic.position.x -= x - WIDTH;
    if (x < 0)
        player1.graphic.position.x -= x;
    if (y < 0)
        player1.graphic.position.y -= y;
    if (y > HEIGHT)
        player1.graphic.position.y -= y - HEIGHT;

}

function enemy_collision() {
    //collision between enemy and walls
    var x = enemy.graphic.position.x + WIDTH / 2;
    var y = enemy.graphic.position.y + HEIGHT / 2;

    if (x > WIDTH)
        enemy.graphic.position.x -= x - WIDTH;
    if (x < 0)
        enemy.graphic.position.x -= x;
    if (y < 0)
        enemy.graphic.position.y -= y;
    if (y > HEIGHT)
        enemy.graphic.position.y -= y - HEIGHT;

}

function player_falling() {
    var nb_tile = 10;
    var sizeOfTileX = WIDTH / nb_tile;
    var sizeOfTileY = HEIGHT / nb_tile;
    var x = player1.graphic.position.x | 0;
    var y = player1.graphic.position.y | 0;
    var length = noGround.length;
    var element = null;
    var lifeModified = false

    for (var i = 0; i < length; i++) {
        element = noGround[i];

        if (element == null) {
            continue;
        }

        var tileX = (element[0]) | 0;
        var tileY = (element[1]) | 0;
        var mtileX = (element[0] + sizeOfTileX) | 0;
        var mtileY = (element[1] + sizeOfTileY) | 0;

        if ((x > tileX)
            && (x < mtileX)
            && (y > tileY)
            && (y < mtileY)) {

            if (!lifeModified && player1.life - 1 === 0) {
                player1.dead();
            }

            player1.life--;
            player1.displayInfo()
            lifeModified = true;

            var newPosition = ground[Math.floor(Math.random()*ground.length)];
            player1.position.x = newPosition[0];
            player1.position.y = newPosition[1];


            break;
        }
    }

}
