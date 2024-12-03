const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelectorAll(".enemy"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    lifes: document.querySelector("#lifes"),
    reset: document.querySelector("#reiniciar")
  },

  values: {
    gameVelocity: 1000,
    hitPosition: 0,
    result: 0,
    currentTime: 5,
    lifeNumber: 3,
  },
  actions: {
    timerId: null,
    contDownTimerId: null,
  }
}

function reset() {
  state.view.reset.addEventListener("mousedown", () => {
  clearInterval(state.actions.timerId);
  clearInterval(state.actions.contDownTimerId);

  state.values.currentTime = 60; 
  state.values.lifeNumber = 3;   
  state.values.result = 0;      
  state.values.gameVelocity = 1000;

  state.view.score.textContent = state.values.result;
  state.view.timeLeft.textContent = state.values.currentTime;
  state.view.lifes.textContent = state.values.lifeNumber;

  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;
  initialize();
  });
}

function decreaseLife() {
  if (state.values.lifeNumber <= 0) {
    alert("Você perdeu todas as suas vidas! Fim de jogo!");
  }
}

function countDown() {
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;
  state.view.lifes.textContent = state.values.lifeNumber;
  if (state.values.currentTime <= 0) {
    state.values.lifeNumber--;
    state.view.lifes.textContent = state.values.lifeNumber;
    clearInterval(state.actions.contDownTimerId);
    clearInterval(state.actions.timerId);
    alert("Game Over! O seu resultado foi " + state.values.result);
  }
}

function playSound(audioName) {
  let audio = new Audio(`./src/audios/${audioName}.m4a`);
  audio.volume = 0.2;
  audio.play();
}

function randomSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy");
  });

  let randomNumber = Math.floor(Math.random() * 9);
  let randomSquare = state.view.squares[randomNumber];
  randomSquare.classList.add("enemy");
  state.values.hitPosition = randomSquare.id;
}

function moveEnemy() {
  state.values.timerId = setInterval(randomSquare, state.values.gameVelocity);
}

function addListenerHitbox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if(square.id === state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playSound("hit");
      }
    })
  });
}

function increaseDifficulty() {
  if(state.values.gameVelocity > 200) {
    state.values.gameVelocity -= 200;
    clearInterval(state.actions.timerId);
    moveEnemy();
  }
}

setInterval(increaseDifficulty, 5000);

function initialize(){
  moveEnemy();
  addListenerHitbox();
  decreaseLife();
  state.actions.contDownTimerId = setInterval(countDown, 1000);
};

reset();
initialize();