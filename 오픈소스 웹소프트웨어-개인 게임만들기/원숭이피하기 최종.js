const canvas = document.getElementById("game-canvas"); // 캔버스 요소를 가져옵니다.
const context = canvas.getContext("2d"); // 캔버스 컨텍스트를 가져옵니다.
const minutes = document.querySelector('.minutes'); // 분을 표시하는 요소를 가져옵니다.
const seconds = document.querySelector('.seconds'); // 초를 표시하는 요소를 가져옵니다.
const score = document.querySelector('.score'); // 점수를 표시하는 요소를 가져옵니다.

let gameover = false; // 게임 오버 상태를 나타내는 변수입니다.
const restartButton = document.getElementById('restartButton'); // 게임 재시작 버튼 요소를 가져옵니다.

const player = {
  x: canvas.width / 2, // 플레이어의 초기 x 좌표를 설정합니다.
  y: canvas.height / 2, // 플레이어의 초기 y 좌표를 설정합니다.
  size: 50, // 플레이어의 크기를 설정합니다.
  speed: 3, // 플레이어의 이동 속도를 설정합니다.
};

let item = {
  x: 0, // 아이템의 초기 x 좌표를 설정합니다.
  y: 0, // 아이템의 초기 y 좌표를 설정합니다.
  size: 20, // 아이템의 크기를 설정합니다.
  active: false, // 아이템의 활성 상태를 나타내는 변수입니다.
};

let startTime; // 게임 시작 시간을 저장하는 변수입니다.
let currentScore = 0; // 현재 점수를 저장하는 변수입니다.
let interval; // 게임 타이머를 제어하기 위한 인터벌 ID를 저장하는 변수입니다.
let obstacles = []; // 장애물을 저장하는 배열입니다.

// 이미지를 로드합니다.
const image = new Image();
image.src = '정글.png'; // 이미지의 경로를 설정합니다.
const playerImage = new Image();
playerImage.src = 'monkey.png'; // 플레이어 이미지의 경로를 설정합니다.

const obstacleImage = new Image();
obstacleImage.src = 'banana.png'; // 장애물 이미지의 경로를 설정합니다.

// 이미지 로드 후 게임 시작
image.onload = function() {
  // 이미지를 캔버스에 그립니다.
  context.drawImage(image, 0, 0);

  // 게임 루프 시작
  startGame();
};

// 이미지 로드 후 게임 시작하는 함수
function startGame() {
  // 게임 루프를 시작하기 전에 타이머를 시작합니다.
  startTimer();

  // 게임 루프를 시작합니다.
  gameLoop();
}

// 재시작 버튼 클릭 시 게임을 재시작하는 함수
function restartGame() {
  gameover = false; // 게임 오버 상태를 초기화합니다.
  item.active = false; // 아이템의 활성 상태를 초기.
  restartButton.style.display = 'none'; // 재시작 버튼 숨김
  // 게임 상태를 초기화하고 게임 루프를 다시 시작합니다.
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
  obstacles = [];
  stopTimer(); // 타이머 중지
  clearInterval(interval); // 스코어 업데이트 중지
  startTimer();
  gameLoop();
} 
  


// 플레이어 그리기 함수
function drawPlayer() {
  context.drawImage(playerImage, player.x, player.y, player.size, player.size);
}

// 장애물 그리기 함수
function drawObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];
    context.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.size, obstacle.size);
  }


}

// 플레이어 업데이트 함수
function updatePlayer() {
  let dx = 0;
  let dy = 0;

  if (keys["ArrowUp"]) {
    dy = -player.speed; // 위쪽 화살표 키가 눌렸을 때 플레이어의 y 좌표를 감소시킵니다.
  } else if (keys["ArrowDown"]) {
    dy = player.speed; // 아래쪽 화살표 키가 눌렸을 때 플레이어의 y 좌표를 증가시킵니다.
  }

  if (keys["ArrowLeft"]) {
    dx = -player.speed; // 왼쪽 화살표 키가 눌렸을 때 플레이어의 x 좌표를 감소시킵니다.
  } else if (keys["ArrowRight"]) {
    dx = player.speed; // 오른쪽 화살표 키가 눌렸을 때 플레이어의 x 좌표를 증가시킵니다.
  }

  player.x += dx; // 플레이어의 x 좌표를 업데이트합니다.
  player.y += dy; // 플레이어의 y 좌표를 업데이트합니다.

  // 플레이어의 위치가 캔버스 경계를 벗어나지 않도록 처리합니다.
if (player.x < player.size / 2) {
  // 만약 플레이어의 위치가 왼쪽 경계보다 작으면
  player.x = player.size / 2; // 플레이어의 x 좌표를 플레이어 크기의 절반으로 설정하여 경계를 벗어나지 않게 합니다.
} else if (player.x > canvas.width - player.size / 2) {
  // 반대로, 플레이어의 위치가 오른쪽 경계보다 크면
  player.x = canvas.width - player.size / 2; // 플레이어의 x 좌표를 캔버스의 너비에서 플레이어 크기의 절반을 뺀 값으로 설정하여 경계를 벗어나지 않게 합니다.
}
if (player.y < player.size / 2) {
  player.y = player.size / 2; // 플레이어의 y 좌표를 플레이어 크기의 절반으로 설정하여 경계를 벗어나지 않게 합니다.
} else if (player.y > canvas.height - player.size / 2) {
  player.y = canvas.height - player.size / 2; // 플레이어의 y 좌표를 캔버스의 높이에서 플레이어 크기의 절반을 뺀 값으로 설정하여 경계를 벗어나지 않게 합니다.
}
}
// 장애물 업데이트
function updateObstacles() {
 
  // 장애물 업데이트
  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];

    if (collision(player, obstacle)) {
      // 플레이어와 장애물이 충돌하면
      gameover = true; // 게임 오버 상태로 변경
      return;
    }
    
    // 장애물의 이동 범위를 제한하여 경계선에 도달하면 무작위로 튕기도록 합니다.
    if (obstacle.x < 0) {
      obstacle.x = 0;
      obstacle.direction = Math.random() * Math.PI * 2; // 무작위 방향으로 변경
    } else if (obstacle.x + obstacle.size > canvas.width) {
      obstacle.x = canvas.width - obstacle.size;
      obstacle.direction = Math.random() * Math.PI * 2; // 무작위 방향으로 변경
    }
    
    if (obstacle.y < 0) {
      obstacle.y = 0;
      obstacle.direction = Math.random() * Math.PI * 2; // 무작위 방향으로 변경
    } else if (obstacle.y + obstacle.size > canvas.height) {
      obstacle.y = canvas.height - obstacle.size;
      obstacle.direction = Math.random() * Math.PI * 2; // 무작위 방향으로 변경
    }

    obstacle.x += Math.cos(obstacle.direction) * obstacle.speed;
    obstacle.y += Math.sin(obstacle.direction) * obstacle.speed;

    if (
      obstacle.x < 0 - obstacle.size ||
      obstacle.x > canvas.width + obstacle.size ||
      obstacle.y < 0 - obstacle.size ||
      obstacle.y > canvas.height + obstacle.size
    )
    {
      obstacles.splice(i, 1);
      i--;
    }
  }


  if (Math.random() < 0.01) {
    // 일정 확률로 장애물을 생성합니다.
    const obstacle = {
      x: 0,
      y: 0,
      size: 30 + Math.random() * 50, // 장애물 크기를 30에서 80 사이의 랜덤 값으로 설정합니다.
      speed: 0.5 + Math.random() * 1.5, // 장애물 속도를 0.5에서 2 사이의 랜덤 값으로 설정합니다.
    };
  
    const direction = Math.floor(Math.random() * 4); // 0에서 3까지의 랜덤 정수를 생성합니다.
    switch (direction) {
      case 0:
        // 위쪽에서 장애물이 등장하도록 설정합니다.
        obstacle.x = Math.random() * canvas.width; // x 좌표를 캔버스의 너비 범위에서 랜덤하게 설정합니다.
        obstacle.y = -obstacle.size / 2; // y 좌표를 -장애물 크기의 절반으로 설정하여 화면 위쪽에서 등장하도록 합니다.
        break;
      case 1:
        // 아래쪽에서 장애물이 등장하도록 설정합니다.
        obstacle.x = Math.random() * canvas.width; // x 좌표를 캔버스의 너비 범위에서 랜덤하게 설정합니다.
        obstacle.y = canvas.height + obstacle.size / 2; // y 좌표를 캔버스의 높이 + 장애물 크기의 절반으로 설정하여 화면 아래쪽에서 등장하도록 합니다.
        break;
      case 2:
        // 왼쪽에서 장애물이 등장하도록 설정합니다.
        obstacle.x = -obstacle.size / 2; // x 좌표를 -장애물 크기의 절반으로 설정하여 화면 왼쪽에서 등장하도록 합니다.
        obstacle.y = Math.random() * canvas.height; // y 좌표를 캔버스의 높이 범위에서 랜덤하게 설정합니다.
        break;
      case 3:
        // 오른쪽에서 장애물이 등장하도록 설정합니다.
        obstacle.x = canvas.width + obstacle.size / 2; // x 좌표를 캔버스의 너비 + 장애물 크기의 절반으로 설정하여 화면 오른쪽에서 등장하도록 합니다.
        obstacle.y = Math.random() * canvas.height; // y 좌표를 캔버스의 높이 범위에서 랜덤하게 설정합니다.
        break;
    }
  
    obstacles.push(obstacle); // 생성한 장애물을 장애물 배열에 추가합니다.
  }
}


function collision(a, b) {
  // 캐릭터와 장애물의 충돌 감지
  if (b !== item && Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)) < (a.size + b.size) / 3) {
    // 캐릭터와 장애물 사이의 거리를 계산하고, 캐릭터와 장애물의 크기 합의 1/2보다 작은 경우 충돌로 간주합니다.
    return true;
  }

  

  return false;
}


// 게임 그리기 함수
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0); // 배경 이미지를 그리기 전에 캔버스를 초기화하고 다시 그립니다
  drawPlayer(); // 플레이어를 그립니다
  drawObstacles(); // 장애물을 그립니다

  if (gameover) {
    stopTimer(); // 게임 오버 상태이므로 타이머를 정지합니다
    context.fillStyle = "#f00"; // 글자 색상을 빨간색으로 설정합니다
    context.font = "55px Arial"; // 글꼴을 설정합니다
    context.textAlign = "center"; // 텍스트를 가운데 정렬합니다
    context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2); // "GAME OVER"를 그립니다
    restartButton.style.display = 'block'; // 재시작 버튼을 보여줍니다
    return;
  }

  updatePlayer(); // 플레이어를 업데이트합니다
  updateObstacles(); // 장애물을 업데이트합니다
  requestAnimationFrame(draw); // 다음 프레임을 그리기 위해 애니메이션 프레임 요청합니다
}

// 게임 재시작 함수
function restartGame() {
  gameover = false; // 게임 오버 상태를 false로 설정하여 게임을 다시 시작한다.
  item.active = false; // 아이템을 비활성화한다.
  restartButton.style.display = 'none'; // 재시작 버튼을 화면에서 숨긴다.
  player.x = canvas.width / 2; // 플레이어의 x 좌표를 캔버스 가로 중앙으로 설정한다.
  player.y = canvas.height / 2; // 플레이어의 y 좌표를 캔버스 세로 중앙으로 설정한다.
  obstacles = []; // 장애물 배열을 초기화하여 새로운 게임을 위해 비워둔다.
  startTimer(); // 타이머를 다시 시작한다.
  draw(); // 게임 화면을 다시 그린다.
  }

// 키 입력 이벤트 처리
let keys = {};

// 키 다운 이벤트 처리
document.addEventListener("keydown", (event) => {
  keys[event.code] = true; // 눌러진 키를 true로 설정하여 키 상태를 저장합니다
});

// 키 업 이벤트 처리
document.addEventListener("keyup", (event) => {
  keys[event.code] = false; // 떼어진 키를 false로 설정하여 키 상태를 저장합니다
});

// 게임 시작
draw(); // 게임을 그립니다

// 게임 타이머 함수
function stopTimer() {
  clearInterval(interval); // 타이머를 멈춥니다
}

function startTimer() {
  startTime = Date.now(); // 게임 시작 시간을 저장합니다
  interval = setInterval(() => {
    const elapsedTime = Date.now() - startTime; // 경과 시간을 계산합니다
    currentScore = Math.floor(elapsedTime / 100) * 10; // 현재 스코어를 계산합니다
    const numOfMinutes = Math.floor(elapsedTime / 60000); // 분 단위로 변환합니다
    const numOfSeconds = Math.floor((elapsedTime % 60000) / 1000); // 초 단위로 변환합니다
    minutes.innerText = numOfMinutes.toString().padStart(2, '0'); // 분을 텍스트로 표시하고 앞에 0을 채웁니다
    seconds.innerText = numOfSeconds.toString().padStart(2, '0'); // 초를 텍스트로 표시하고 앞에 0을 채웁니다
    score.innerText = currentScore.toString(); // 스코어를 텍스트로 표시합니다
  }, 100); // 0.1초마다 업데이트합니다
}
