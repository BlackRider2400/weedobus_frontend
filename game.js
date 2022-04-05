$(document).ready(function(){
  var config = {
      type: Phaser.AUTO,
      width: 1280,
      height: 720,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {y: 0},
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.FIT
      },
      scene: {
          preload: preload,
          create: create,
          update: update
      },
      backgroundColor: '#BBFF00',
      parent: 'phaser-example'
  };
  var nickname;
  var up = false;
  if (getUrlParameter('nickname') != 'undefined') {
    nickname = getUrlParameter('nickname');
    $('[input_nickname]').val(nickname);
  }

  $('[play]').on('click', function(){
    if($('[input_nickname]').val() == ''){
      alert('input nickname');
    }
    else{
      nickname = $('[input_nickname]').val();
      $('[game]').css('display', 'block');
      var game = new Phaser.Game(config);
      $('[play]').css('display', 'none');
    }

  });

  $('[restart]').on('click', function() {
    window.open("http://www.mylovelyserver.fun/weedobus/?nickname=" + nickname, '_self');
  });

  var apiRoot = "https://www.mylovelyserver.fun:8443/weedbus_server/";
  var datatableRowTemplate = $('[data-datatable-row-template]').children()[0];
  var itemsContainer = $('[data-items-container]');
  var start = false;
  var player;
  var background1;
  var background2;
  var background3;
  var background4;
  var cars = [];
  var resCars = ['car1', 'car2', 'car3', 'car4', 'car5', 'car6', 'car7', 'car8', 'car9'];
  var pos = [225, 325, 465, 575];
  var score = 0;
  var scoreText;
  var fuel = 5;
  var fuel_sprite;
  var fuel_bar = [];
  var infoText;
  var game_over = false;
  var coins = [];
  var firstCall = 1;
  var updated = false;
  var level = 0.5;
  var busLevel = 1;

  getAllScores();

  function preload ()
  {
    this.load.image('background', 'res/double_road.jpg');
    this.load.image('bus', 'res/unknown.png');
    this.load.image('ground', 'res/platform.png');
    this.load.image('car1', 'res/car1.png');
    this.load.image('car2', 'res/car2.png');
    this.load.image('car3', 'res/car3.png');
    this.load.image('car4', 'res/car4.png');
    this.load.image('car5', 'res/car5.png');
    this.load.image('car6', 'res/car6.png');
    this.load.image('car7', 'res/car7.png');
    this.load.image('car8', 'res/car8.png');
    this.load.image('car9', 'res/car9.png');
    this.load.image('fuel_icon', 'res/fuel.png');
    this.load.image('weed_coin', 'res/weed_coin.png');
    this.load.image('empty_fuel', 'res/empty_fuel.png');
  }

  function create ()
  {
    this.input.on('pointerdown', function(){
      if (up == false) {
        up = true;
        $('[movement]').text('DOWN');
      }else{
        up = false;
        $('[movement]').text('UP');
      }
      start = true;
    }, this);
    background1 = this.physics.add.sprite(1200, 400, 'background').setScale(2.5);
    background2 = this.physics.add.sprite(200, 400, 'background').setScale(2.5);
    background3 = this.physics.add.sprite(675, 400, 'background').setScale(2.5);
    background4 = this.physics.add.sprite(1675, 400, 'background').setScale(2.5);
    fuel_sprite = this.physics.add.sprite(1675, pos[Math.floor(Math.random() * 4)], 'fuel_icon').setScale(0.15);
    scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000', fontFamily: "RetroFont"});

    backgroundMovement();
    player = this.physics.add.sprite(200, pos[3], 'bus').setScale(0.15);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setGravityY(0);

    var theCar;
    theCar = this.physics.add.sprite( 1400,
    pos[Math.floor(Math.random() * 4)], resCars[Math.floor(Math.random() * 9)]).setScale(1.5).setSize(20, 25);
    theCar.flipX = true;
    this.physics.add.overlap(player, theCar, function() {
      $('[input_nickname]').val("YOU CRASHED");
      gameOver();
    });
    cars.push(theCar);

    for(var i = 1; i < 5; i++){
      var car;
      car = this.physics.add.sprite( cars[i -1].x + (Math.floor(Math.random() * 200) + 20) + 400,
      pos[Math.floor(Math.random() * 4)], resCars[Math.floor(Math.random() * 9)]).setScale(1.5).setSize(20, 25);
      car.flipX = true;
      this.physics.add.overlap(player, car, function() {
        //player.disableBody(true, true);
        $('[input_nickname]').val("YOU CRASHED");
        gameOver();
      });
      cars.push(car);
    }

    var coin1 = this.physics.add.sprite(1400 + 400 * Math.floor(Math.random() *4),
    pos[Math.floor(Math.random() * 4)], 'weed_coin').setScale(0.9);
    this.physics.add.overlap( player, coin1, function() {
      coin1.setVisible(false);
      score += 10;
      coin1.y -= 200;
      scoreText.setText('score: ' + score);
    });
    coins.push(coin1);
    var coin2 = this.physics.add.sprite(1400 + 400 * Math.floor(Math.random() *4),
    pos[Math.floor(Math.random() * 4)], 'weed_coin').setScale(0.9);
    this.physics.add.overlap( player, coin2, function() {
      coin2.setVisible(false);
      score += 10;
      coin2.y -= 200;
      scoreText.setText('score: ' + score);
    });
    coins.push(coin2);
    var coin3 = this.physics.add.sprite(1400 + 400 * Math.floor(Math.random() *4),
    pos[Math.floor(Math.random() * 4)], 'weed_coin').setScale(0.9);
    this.physics.add.overlap( player, coin3, function() {
      coin3.setVisible(false);
      score += 10;
      coin3.y -= 200;
      scoreText.setText('score: ' + score);
    });
    coins.push(coin3);


    fuel_bar.push(this.physics.add.sprite(50, 100, 'fuel_icon').setScale(0.1));
    fuel_bar.push(this.physics.add.sprite(100, 100, 'fuel_icon').setScale(0.1));
    fuel_bar.push(this.physics.add.sprite(150, 100, 'fuel_icon').setScale(0.1));
    fuel_bar.push(this.physics.add.sprite(200, 100, 'fuel_icon').setScale(0.1));
    fuel_bar.push(this.physics.add.sprite(250, 100, 'fuel_icon').setScale(0.1));

    this.physics.add.overlap(fuel_sprite, player, function(){
      fuel += 2;
      if(5 < fuel){
        fuel = 5;
      }
      fuel_sprite.setVisible(false);
      fuel_sprite.y -= 200;
    });
  }

  function update ()
  {
    cursors = this.input.keyboard.createCursorKeys();
    changeSpeedOfGame();

    if (cursors.up.isDown && player.y > 200)
    {
        up = true;
        start = true;
    }else if(cursors.down.isDown&& player.y < 600){
        up = false;
        start = true;
    }
    moveBus()

    backgroundMovement();

    for(var i = 0; i < cars.length; i++){
      cars[i].setVelocityX(-600 * level);
      if(cars[i].x < -200){
        var maxX = cars[0].x;
        var maxY;
        for (var j = 1; j < cars.length; j++) {
          if (cars[j].x > maxX) {
            maxX = cars[j].x;
            maxY = cars[j].y;
          }
        }
        if(maxX < 1400){
          cars[i].x = 1400 + Math.floor(Math.random() * 200) + 400;
        }
        else{
          cars[i].x = 2000;
        }
        do{
          cars[i].y = pos[Math.floor(Math.random() * 4)];
        }while(cars[i].y == maxY);
        cars[i].setTexture(resCars[Math.floor(Math.random() * 9)]);
        break;
      }

    }

    for(var i = 0; i < coins.length; i++){
      coins[i].setVelocityX(-400 * level);
      if(coins[i].x < -250){
        coins[i].x = 1400 + Math.floor(Math.random() * 1000);
        coins[i].setVisible(true);
        coins[i].y = pos[Math.floor(Math.random() * 4)];
      }
    }

    switch (fuel) {
      case 4:
        fuel_bar[4].setTexture('empty_fuel');
        fuel_bar[3].setTexture('fuel_icon');
        fuel_bar[2].setTexture('fuel_icon');
        fuel_bar[1].setTexture('fuel_icon');
        fuel_bar[0].setTexture('fuel_icon');
        break;
      case 3:
        fuel_bar[4].setTexture('empty_fuel');
        fuel_bar[3].setTexture('empty_fuel');
        fuel_bar[2].setTexture('fuel_icon');
        fuel_bar[1].setTexture('fuel_icon');
        fuel_bar[0].setTexture('fuel_icon');
        break;
      case 2:
        fuel_bar[4].setTexture('empty_fuel');
        fuel_bar[3].setTexture('empty_fuel');
        fuel_bar[2].setTexture('empty_fuel');
        fuel_bar[1].setTexture('fuel_icon');
        fuel_bar[0].setTexture('fuel_icon');
        break;
      case 1:
        fuel_bar[4].setTexture('empty_fuel');
        fuel_bar[3].setTexture('empty_fuel');
        fuel_bar[2].setTexture('empty_fuel');
        fuel_bar[1].setTexture('empty_fuel');
        fuel_bar[0].setTexture('fuel_icon');
        break;
      case 0:
      fuel_bar[4].setTexture('empty_fuel');
      fuel_bar[3].setTexture('empty_fuel');
      fuel_bar[2].setTexture('empty_fuel');
      fuel_bar[1].setTexture('empty_fuel');
      fuel_bar[0].setTexture('empty_fuel');
        break;
      default:
        fuel_bar[4].setTexture('fuel_icon');
        fuel_bar[3].setTexture('fuel_icon');
        fuel_bar[2].setTexture('fuel_icon');
        fuel_bar[1].setTexture('fuel_icon');
        fuel_bar[0].setTexture('fuel_icon');
    }

    fuel_sprite.setVelocityX(-400 * level);
    if(fuel_sprite.x < -250){
      fuel_sprite.x = 2000;
      fuel_sprite.setVisible(true);
      fuel_sprite.y = pos[Math.floor(Math.random() * 4)];
    }

    if(fuel <= 0){
      //this.sys.game.destroy(true); this is destroying whole game
      $('[input_nickname]').val("OUT OF FUEL");
      gameOver();
    }
    if(game_over){
      gameOver();
    }
  }
  function getAllScores() {
    var requestUrl = apiRoot;
          $.ajax({
             url: requestUrl,
             method: 'GET',
             success: handleDatatableRender
          });

  }
  function createElement(data) {
    var element = $(datatableRowTemplate).clone();

    element.attr('data-item-id', data.id);
    element.find('[data-score-section] [data-score-paragraph]').text(data.score);
    element.find('[data-nickname-section] [data-nickname-paragraph]').text(data.nickname);
    element.find('[data-date-section] [data-date-paragraph]').text(data.date);
    if(firstCall == 1){
      element.find('[data-score-section]').css('background-color', 'gold');
      element.find('[data-nickname-section]').css('background-color', 'gold');
      element.find('[data-date-section] ').css('background-color', 'gold');
      firstCall++;
    }
    else if(firstCall == 2){
      element.find('[data-score-section]').css('background-color', 'silver');
      element.find('[data-nickname-section]').css('background-color', 'silver');
      element.find('[data-date-section]').css('background-color', 'silver');
      firstCall++;
    }
    else if(firstCall == 3){
      element.find('[data-score-section]').css('background-color', 'sienna');
      element.find('[data-nickname-section]').css('background-color', 'sienna');
      element.find('[data-date-section]').css('background-color', 'sienna');
      firstCall++;
    }

    return element;
  }
  function handleDatatableRender(data) {
     itemsContainer.empty();
     data.forEach(function(item) {
        createElement(item).appendTo(itemsContainer);
     });
   }
  function getUrlParameter(sParam) {
     var sPageURL = window.location.search.substring(1),
         sURLVariables = sPageURL.split('&'),
         sParameterName,
         i;

     for (i = 0; i < sURLVariables.length; i++) {
         sParameterName = sURLVariables[i].split('=');

         if (sParameterName[0] === sParam) {
             return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
         }
     }
   };
  function moveBus() {
    if (up && player.y > 200 && start)
    {
        player.setVelocityY(-300 * busLevel);
    }else if(!up && player.y < 600 && start){
        player.setVelocityY(300 * busLevel);
    }else{
        if(player.y < 200 || player.y > 600){
          player.setVelocityY(0);
        }
        player.setVelocityX(0);
    }
  }
  function backgroundMovement() {
    if(background1.x > -250){
      background1.setVelocityX(-400 * level);
    }
    else{
      background1.x = 1675;
    }
    if(background2.x > -250){
      background2.setVelocityX(-400 * level);
    }
    else{
      background2.x = 1675;
    }
    if(background3.x > -250){
      background3.setVelocityX(-400 * level);
    }
    else{
      background3.x = 1675;
    }
    if(background4.x > -250){
      background4.setVelocityX(-400 * level);
    }
    else{
      background4.x = 1675;
      fuel -= 1;
    }
  }
  function changeSpeedOfGame(){
    if (score < 30) {
      level = 0.5;
    }else if(score < 100){
      level = 0.7;
    }else if(score < 200){
      level = 0.85;
    }else if(score < 300){
      level = 0.9;
    }else if(score < 500){
      level = 1;
    }else if(score < 750){
      level = 1.25;
    }else if(score < 1000){
      level = 1.5;
    }else if(score < 2000){
      level = 1.75;
    }else{
      level = score % 1000;
    }
  }
  function gameOver(){
    background1.setVelocityX(0);
    background1.setVelocityY(0);
    background2.setVelocityX(0);
    background2.setVelocityY(0);
    background3.setVelocityX(0);
    background3.setVelocityY(0);
    background4.setVelocityX(0);
    background4.setVelocityY(0);
    for(var i = 0; i < cars.length;i++){
      cars[i].setVelocityX(0);
      cars[i].setVelocityY(0);
    }
    for(var i = 0; i < coins.length;i++){
      coins[i].setVelocityX(0);
      coins[i].setVelocityY(0);
    }
    player.setVelocityY(0);
    player.setVelocityX(0);
    fuel_sprite.setVelocityX(0);
    fuel_sprite.setVelocityY(0);
    $('[restart]').css('display', 'inline-block');
    if (!updated) {
      $.ajax({
         url: apiRoot,
         method: 'POST',
         processData: false,
         contentType: "application/json; charset=utf-8",
         dataType: 'json',
         data: JSON.stringify({
            score: score,
            nickname: nickname,
            date: null
         }),
         complete: function(data) {
           firstCall = 1;
           getAllScores();
         }
      });
      updated = true;
    }
    game_over = true;
  }
});
