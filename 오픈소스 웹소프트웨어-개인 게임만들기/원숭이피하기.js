const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
const score = document.querySelector('.score');


// 이미지를 로드합니다.
const image = new Image();
image.src = "정글.png";

// 이미지를 캔버스에 그립니다.
image.onload = function() {
  context.drawImage(image, 0, 0);
};

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 50,
  speed: 3,
};
let item = {
  x: 0,
  y: 0,
  size: 20,
  active: false,
};
let startTime;
let currentScore = 0;
let interval;
let obstacles = [];
let gameover = false;
const restartButton = document.getElementById('restartButton');
// 이미지를 사용할 경우, 캐릭터 이미지 객체를 생성합니다.
const playerImage = new Image();
playerImage.src = 'monkey.png';
playerImage.onload = draw;

const obstacleImage = new Image();
obstacleImage.src = 'banana.png';
obstacleImage.onload = draw;

function drawPlayer() {
  // 이미지를 사용할 경우, drawImage() 함수를 사용하여 캐릭터 이미지를 그립니다.
  // x, y, width, height는 각각 이미지의 좌표와 크기를 나타냅니다.
  context.drawImage(playerImage, player.x, player.y, player.size, player.size);
  
}

function drawObstacles() {
  // 장애물 배열을 순회하며, 각 장애물에 대해 이미지를 그립니다.
  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];
    // 이미지를 사용할 경우, drawImage() 함수를 사용하여 장애물 이미지를 그립니다.
    // x, y, width, height는 각각 이미지의 좌표와 크기를 나타냅니다.
    context.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.size, obstacle.size);
  }
  if (item.active) {
    context.fillStyle = "#00f";
    context.fillRect(item.x, item.y, item.size, item.size);
  }
}

function updatePlayer() {
  let dx = 0;
  let dy = 0;
  
  if (keys["ArrowUp"]) {
    dy = -player.speed;
  } else if (keys["ArrowDown"]) {
    dy = player.speed;
  }
  
  if (keys["ArrowLeft"]) {
    dx = -player.speed;
  } else if (keys["ArrowRight"]) {
    dx = player.speed;
  }
  
  player.x += dx;
  player.y += dy;
  

  if (player.x < player.size / 2) {
    player.x = player.size / 2;
  } else if (player.x > canvas.width - player.size / 2) {
    player.x = canvas.width - player.size / 2;
  }
  if (player.y < player.size / 2) {
    player.y = player.size / 2;
  } else if (player.y > canvas.height - player.size / 2) {
    player.y = canvas.height - player.size / 2;
  }
}

function updateObstacles() {
  // 아이템 업데이트
  if (!item.active && Math.random() < 0.01 && score % 1000 === 0) {
    if (!isItemOnCanvas()) {
      item.x = Math.random() * canvas.width;
      item.y = Math.random() * canvas.height;
      item.active = true;
    }
  }

  // 장애물 업데이트
  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];

    if (collision(player, obstacle)) {
      gameover = true;
      return;
    }

    if (collision(player, item)) {
      obstacles.splice(i, 1);
      i--;
      item.active = false;
      score += 100;
      continue;
    }

    // 장애물 이동
    if (obstacle.x < player.x) {
      obstacle.x += obstacle.speed;
    } else {
      obstacle.x -= obstacle.speed;
    }

    if (obstacle.y < player.y) {
      obstacle.y += obstacle.speed;
    } else {
      obstacle.y -= obstacle.speed;
    }

    if (
      obstacle.x < 0 - obstacle.size ||
      obstacle.x > canvas.width + obstacle.size ||
      obstacle.y < 0 - obstacle.size ||
      obstacle.y > canvas.height + obstacle.size
    ) {
      obstacles.splice(i, 1);
      i--;
    }
  }

  if (Math.random() < 0.01) {
    const obstacle = {
      x: 0,
      y: 0,
      size: 30 + Math.random() * 50,
      speed: 0.5 + Math.random() * 1.5,
    };

    const direction = Math.floor(Math.random() * 4);
    switch (direction) {
      case 0:
        obstacle.x = Math.random() * canvas.width;
        obstacle.y = -obstacle.size / 2;
        break;
      case 1:
        obstacle.x = Math.random() * canvas.width;
        obstacle.y = canvas.height + obstacle.size / 2;
        break;
      case 2:
        obstacle.x = -obstacle.size / 2;
        obstacle.y = Math.random() * canvas.height;
        break;
      case 3:
        obstacle.x = canvas.width + obstacle.size / 2;
        obstacle.y = Math.random() * canvas.height;
        break;
    }

    obstacles.push(obstacle);
  }


      
  if (Math.random() < 0.01) {
    const obstacle = {
      x: 0,
      y: 0,
      size: 30 + Math.random() * 50, // 다양한 크기를 설정합니다.
      speed: 0.5 + Math.random() * 1.5,
    };
  
    // 장애물의 이동 방향을 랜덤하게 설정합니다.
    const direction = Math.floor(Math.random() * 4);
    switch (direction) {
      case 0:
        obstacle.x = Math.random() * canvas.width;
        obstacle.y = -obstacle.size / 2;
        break;
      case 1:
        obstacle.x = Math.random() * canvas.width;
        obstacle.y = canvas.height + obstacle.size / 2;
        break;
      case 2:
        obstacle.x = -obstacle.size / 2;
        obstacle.y = Math.random() * canvas.height;
        break;
      case 3:
        obstacle.x = canvas.width + obstacle.size / 2;
        obstacle.y = Math.random() * canvas.height;
        break;
    }
    obstacles.push(obstacle);
  }
}


  function collision(a, b) {
    // 캐릭터와 장애물의 충돌 감지
    if (b !== item && Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)) < (a.size + b.size) / 2) {
      return true;
    }
  
    // 캐릭터와 아이템의 충돌 감지
    if (b === item && Math.abs(a.x - b.x) < (a.size + b.size) / 2 && Math.abs(a.y - b.y) < (a.size + b.size) / 2) {
      return true;
    }
  
    return false;
  }


  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawObstacles();
    
    if (gameover) {
      stopTimer();
      context.fillStyle = "#f00";
      context.font = "55px Arial";
      context.textAlign = "center";
      context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
      restartButton.style.display = 'block'; // Show the restart button
  
      return;
    }
    
    updatePlayer();
    updateObstacles();
    requestAnimationFrame(draw);
  }

// restartButton.addEventListener('click', restartGame); 

function restartGame() {
  
  gameover = false;
  item.active = false;
  restartButton.style.display = 'none'; // Hide the restart button
  // Reset the game state and start the game loop again
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
  obstacles = [];
  startTimer();
  draw();
}

let keys = {};
document.addEventListener("keydown", (event) => {
  keys[event.code] = true;
});
document.addEventListener("keyup", (event) => {
  keys[event.code] = false;
});

draw();

function stopTimer() {
  clearInterval(interval);
}

  function startTimer() {
    startTime = Date.now();
    interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      currentScore = Math.floor(elapsedTime / 100) * 10;
      const numOfMinutes = Math.floor(elapsedTime / 60000);
      const numOfSeconds = Math.floor((elapsedTime % 60000) / 1000);
      minutes.innerText = numOfMinutes.toString().padStart(2, '0');
      seconds.innerText = numOfSeconds.toString().padStart(2, '0');
      score.innerText = currentScore.toString();
    }, 100);
  }

  
