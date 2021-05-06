(function(){
	//console.log(Phaser); //testando a conexão
	var game = new Phaser.Game(800,600, Phaser.AUTO, null, { //(width, height, tecnologia "Canvas ou WebGL", id)
		preload:preload, //carrega os recursos
		create:create, //cria os elementos
		update:update //atualiza o estado do jogo
	});
	
	var platforms,player,keys,stars,bombas,txtScore,txtGameOver,score=0,explosion,pping; 
	
	function preload(){
		game.load.image('sky-img','img/sky.png'); 
		game.load.image('plataforma-img','img/plataforma.png');
		game.load.image('star-img','img/star.png');
		game.load.image("bomba-img", "img/bomba.png");
		game.load.image("fumaca-img", "img/fumaca.png");
                
		game.load.spritesheet('dude-img','img/dude.png',32,48);//(id,caminho,dimens�o de cada personagem)
		
		game.load.audio('explosion-audio', 'audio/explosion.mp3');
		game.load.audio('p-ping-audio', 'audio/p-ping.mp3');
	}
	
	function create(){
            
		keys = game.input.keyboard.createCursorKeys(); //eventos do teclado 
		game.physics.startSystem(Phaser.Physics.ARCADE); //Iniciar sistema de f�sica
		game.add.sprite(0,0,'sky-img'); //(x,y,'id')
		
		platforms = game.add.group();//grupo de plataforma
		platforms.enableBody = true; //corpo s�lido para a plataforma
		
		//Plataformas
		var platform = platforms.create(0,game.world.height - 64,'plataforma-img');
			platform.scale.setTo(2,2); //multiplicar a escala(width, height)
			platform.body.immovable = true; //o objeto ser� im�vel
		
			platform = platforms.create(450,400,'plataforma-img');
			platform.body.immovable = true;
		
			platform = platforms.create(-150,250,'plataforma-img');
			platform.body.immovable = true;
		
		//Estrelas
		stars = game.add.group();
		stars.enableBody = true;
		
		for(var i=0; i<12; i++){
			var star = stars.create(i*70,0,'star-img'); //'70' espa�amento entre as estrelas
				star.body.gravity.y = 300
				star.body.bounce.y = 0.7+(Math.random()*0.2);
		}
		
		//Bomba
		bombas = game.add.group();
		bombas.enableBody = true;
		
		for(var i=0; i<6; i++){
			var bomba = bombas.create(i*+(Math.random()*350),0,'bomba-img');
				bomba.body.gravity.y = 300
				bomba.body.bounce.y = 0.7+(Math.random()*0.2);
		}
		
		//Player
		player = game.add.sprite(50,game.world.height-150,'dude-img');
		game.physics.arcade.enable(player); //habilita a f�sica ao player
		player.body.gravity.y = 300; //intensidade da gravidade no eixo y
		player.body.bounce.y = 0.2; //de 0 at� 1 para quicar no ch�o
		player.body.collideWorldBounds = true; //colide com a fronteira do jogo
		player.animations.add('left',[0,1,2,3],5,true); //(id,frame do sprite,velocidade da anima��o,loop)
		player.animations.add('right',[5,6,7,8],5,true);
		
		txtScore = game.add.text(16,16,'SCORE: 0',{fontSize:'32px',fill:'#fff'}); //(x,y,texto,{tamanho,cor})
		
		//Som
		explosion = game.add.audio('explosion-audio');
		pping = game.add.audio('p-ping-audio');
	}
	
	function update(){
			game.physics.arcade.collide(player,platforms); //colide os objetos
			game.physics.arcade.collide(stars,platforms);
			game.physics.arcade.collide(bombas,platforms);
			game.physics.arcade.overlap(player,stars,collectStar);
			game.physics.arcade.overlap(player,bombas,playerKill);
			
			player.body.velocity.x = 0; //velocidade padr�o
			if(keys.left.isDown){ //evento do teclado
				player.body.velocity.x = -300;
				player.animations.play('left');
			}else if(keys.right.isDown){
				player.body.velocity.x = 300;
				player.animations.play('right');
			}else{
				player.animations.stop(); //para a anima��o
				player.frame = 4; //frame do sprite ao parar a anima��o
			}
			
			if(keys.up.isDown && player.body.touching.down){
				player.body.velocity.y = -350;
				
			}
	}
	
	function collectStar(player,star){
		star.kill();//elimina o sprite do jogo
		pping.play();
		score += 10;
		txtScore.text = 'SCORE: ' + score;
	}
	
	function playerKill(player,bomba){
		txtScore.text = '';
		explosion.play();
		player.kill();//elimina o player do jogo
		//player  = game.add.sprite(50,game.world.height-150,'fumaca-img');
		txtGameOver = game.add.text(game.world.width - 600,game.world.height - 300,'',{fontSize:'32px',fill:'#FFFF00'}); //(x,y,texto,{tamanho,cor})
		txtGameOver.text = 'GAME OVER *** SCORE: ' + score + ' ***';
	}
	
}());