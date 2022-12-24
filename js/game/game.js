import Scales from "./model/Scales.js";
import Weight from "./model/Weight.js";
import Table from "./model/Table.js";
import {showModal, toggleModal} from "../util/modalUtils.js";
import {getAuthUserName} from "../util/authUtils.js";
import {goToLogin, goToResults} from "../util/redirectUtils.js";

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.font = "20px serif";
const canvasBaseWidth = 2000;
const canvasBaseHeight = 1440;
ctx.canvas.width = canvasBaseWidth;
ctx.canvas.height = canvasBaseHeight;

const windowBaseHeight = 1440;
const windowBaseWidth = 2560;
const canvasCoefficient = {
    horizontal: 1,
    vertical: 1,
    update() {
        this.horizontal = window.innerWidth / windowBaseWidth;
        this.vertical = window.innerHeight / windowBaseHeight;
    }
}

const user = document.getElementById('user');
const userName = getAuthUserName();
const userData = localStorage.getItem(userName);
const userParsedData = JSON.parse(userData);

window.onload = () => {
    if (!userName) {
        goToLogin();
    }
    start();
}

const timer = document.getElementById('timer');
const maxTime = 30 * 1000;
let startTime = null;
const formatTime = (time) => {
    let minutes = Math.floor(time / 1000 / 60);
    let seconds = Math.floor(time / 1000 % 60);
    return minutes + ':' + seconds;
}

const pauseTimer = document.getElementById('pause_timer');
let timeDiff
let isPaused = false;

function pauseGame() {
    if (isPaused) {
        return;
    }
    timeDiff = Date.now() - startTime;
    clearInterval(timerIdHolder.timerId);
    isPaused = true;
}

pauseTimer.onclick = function () {
    pauseGame();
}

const resumeTimer = document.getElementById('resume_timer');

function resumeGame() {
    if (!isPaused) {
        return;
    }
    startTime = Date.now() - timeDiff;
    isPaused = false;
    game();
}

resumeTimer.onclick = function () {
    resumeGame();
}

const openRulesButton = document.getElementById('open_rules_button');
openRulesButton.onclick = function () {
    pauseGame();
}

const closeRulesButton = document.getElementById('close_rules_button');
closeRulesButton.onclick = function () {
    resumeGame();
}

const gameOverButton = document.getElementById('game_over_button');
gameOverButton.onclick = function () {
    goToLogin();
}

function playLevelOnceAgain() {
    startTime = null;
    isPaused = false;
    loose = false;
    win = false;
    attemptsOnCurrentLevel++;
    start();
}

function newGame() {
    loose = false;
    win = false;
    level = 1;
    currentScore = 0;
    attemptsOnCurrentLevel = 0;
    startTime = null;
    isPaused = false;
    start();
}

const onceAgainButton = document.getElementById("once_again");
onceAgainButton.onclick = function () {
    playLevelOnceAgain();
};

const looseModalId = '#loose_modal';
const onceAgainButtonLooseModal = document.getElementById('once_again_button_loose_modal')
onceAgainButtonLooseModal.onclick = function () {
    toggleModal(looseModalId);
    playLevelOnceAgain();
}

const newGameButtonLooseModal = document.getElementById("new_game_button_loose_modal");
newGameButtonLooseModal.onclick = function () {
    toggleModal(looseModalId);
    newGame();
}

const gameOverButtonLoseModal = document.getElementById('game_over_button_loose_modal');
gameOverButtonLoseModal.onclick = function () {
    toggleModal(looseModalId);
    goToLogin();
}

const winModalId = '#win_modal';
const gameOverButtonWinModal = document.getElementById('game_over_button_win_modal')
gameOverButtonWinModal.onclick = function () {
    toggleModal(winModalId);
    goToLogin();
}

const newGameButtonWinModal = document.getElementById("new_game_button_win_modal");
newGameButtonWinModal.onclick = function () {
    toggleModal(winModalId);
    newGame();
}

const resultsButtonWinModal = document.getElementById("results_button_win_modal")
resultsButtonWinModal.onclick = function () {
    toggleModal(winModalId);
    goToResults(userName);
}

const winModalResult = document.getElementById('win-modal-body');

function setResultToModalBody() {
    winModalResult.innerText = `Ваш результат: ${currentScore}`;
}

const audio = document.getElementById('audio');
const audioRange = document.getElementById('audioRange');
audioRange.onchange = function () {
    if (this.value === this.min) {
        audio.volume = 0;
        audio.pause();
    } else {
        audio.play();
        audio.volume = this.value / 100;
    }
}

const maxLevel = 3;
let level = 1;
let levelElement = document.getElementById('level');

const mouse = {
    x: 0,
    y: 0,
    down: false
}

let currentScore = 0;
let attemptsOnCurrentLevel = 1;
const score = document.getElementById('scores')

window.onkeyup = function (e) {
    if (isPaused) {
        return;
    }
    if (e.code === "Space") {
        fallingWeight = new Weight(level);
    }
}

window.onmousemove = function (e) {
    if (isPaused) {
        return;
    }

    mouse.x = e.pageX - scrollX;
    mouse.y = e.pageY - scrollY;
};


window.onmousedown = function (e) {
    if (isPaused) {
        return;
    }

    mouse.down = true;

    //click on the falling weight
    if (mouse.x >= fallingWeight.x && mouse.x <= (fallingWeight.x + fallingWeight.width) && mouse.y >= fallingWeight.y && mouse.y <= (fallingWeight.y + fallingWeight.height)) {
        fallingWeight.isSelected = true;
    }

    //click on the table
    if (mouse.x >= table.x && mouse.x <= table.x + table.width && mouse.y <= table.y && mouse.y >= table.y - table.maxWeightHeight) {
        let weightIndex;
        for (let i = 0; i < table.weightsOnTable.length; i++) {
            if (mouse.x >= table.x + table.getWeightOffset(i) * 0.85 && mouse.x <= table.x + table.getWeightOffset(i + 1) * 1.15) {
                weightIndex = i;
            }
        }
        weightFromTable = table.weightsOnTable[weightIndex];
        table.weightsOnTable.splice(weightIndex, 1);
        weightFromTable.isSelected = true;
    }
};

window.onmouseup = function (e) {
    if (isPaused) {
        return;
    }
    mouse.down = false;

    if (fallingWeight.isSelected) {
        if (fallingWeight.x >= scales.leftScaleX * 0.9 && fallingWeight.x <= scales.leftScaleX + scales.scaleImgWidth &&
            fallingWeight.y <= scales.baseImgY * 1.5 && fallingWeight.y >= scales.baseImgY * 0.5) {
            scales.leftWeight.push(fallingWeight);
            fallingWeight = new Weight(level);
            return;
        }

        if (fallingWeight.x >= scales.rightScaleX * 0.9 && fallingWeight.x <= scales.rightScaleX + scales.scaleImgWidth &&
            fallingWeight.y <= scales.baseImgY * 1.5 && fallingWeight.y >= scales.baseImgY * 0.5) {
            scales.rightWeight.push(fallingWeight);
            fallingWeight = new Weight(level);
            return;
        }

        if (fallingWeight.x >= table.x * 0.9 && fallingWeight.x <= (table.x + table.width) * 1.1 &&
            fallingWeight.y <= table.y * 1.5 && fallingWeight.y >= table.y * 0.5) {
            table.addWeight(fallingWeight);
            fallingWeight = new Weight(level);
            return;
        }

        fallingWeight.x = fallingWeight.getRandomX();
        fallingWeight.isSelected = false;

        return;
    }

    if (weightFromTable.isSelected) {
        if (weightFromTable.x >= scales.leftScaleX * 0.9 && weightFromTable.x <= scales.leftScaleX + scales.scaleImgWidth &&
            weightFromTable.y <= scales.baseImgY * 1.5 && weightFromTable.y >= scales.baseImgY * 0.5) {
            scales.leftWeight.push(weightFromTable);
            weightFromTable = new Weight(level);
            return;
        }

        if (weightFromTable.x >= scales.rightScaleX * 0.9 && weightFromTable.x <= scales.rightScaleX + scales.scaleImgWidth &&
            weightFromTable.y <= scales.baseImgY * 1.5 && weightFromTable.y >= scales.baseImgY * 0.5) {
            scales.rightWeight.push(weightFromTable);
            weightFromTable = new Weight(level);
            return;
        }

        if (weightFromTable.x >= table.x && weightFromTable.x <= (table.x + table.width) &&
            weightFromTable.y <= table.y * 1.5 && weightFromTable.y >= table.y * 0.5) {
            table.addWeight(weightFromTable);
            weightFromTable = new Weight(level);
            return;
        }

        if (weightFromTable.x <= scales.leftScaleX || weightFromTable.x > table.x + table.width * 1.1) {
            weightFromTable = new Weight(level);
            return;
        }
    }

}

function scaleCanvas() {
    canvasCoefficient.update();
    ctx.canvas.width = canvasBaseWidth * canvasCoefficient.horizontal;
    ctx.canvas.height = canvasBaseHeight * canvasCoefficient.vertical;
    if (fallingWeight) {
        fallingWeight.x = fallingWeight.x * canvasCoefficient.horizontal;
    }
}

window.onresize = function () {
    scaleCanvas();
    updateFrame();
}

let fallingWeight;
let weightFromTable;
let table;
let scales;

let win = false;
let loose = false;

const userTemplate = '<strong>Игрок: ';
const levelTemplate = '<strong>Уровень: ';
const timerTemplate = '<strong>Таймер: ';
const scoreTemplate = '<strong>Очки: ';

function init() {
    fallingWeight = new Weight(level);
    weightFromTable = new Weight(level);
    table = new Table();
    scales = new Scales(level);
    scaleCanvas(ctx);
    user.innerHTML = userTemplate + userName;
    score.innerHTML = scoreTemplate + currentScore
    levelElement.innerHTML = levelTemplate + level;
}

let timerIdHolder = {
    timerId: null
}

function updateFrame() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    scales.updateScales(ctx, canvasCoefficient);

    if (fallingWeight.isSelected) {
        fallingWeight.x = mouse.x - fallingWeight.width / 2;
        fallingWeight.y = mouse.y - fallingWeight.height / 2;
    } else {
        fallingWeight.y = fallingWeight.y + 1;
    }
    fallingWeight.draw(ctx, canvasCoefficient);

    if (weightFromTable.isSelected) {
        weightFromTable.x = mouse.x - weightFromTable.width / 2;
        weightFromTable.y = mouse.y - weightFromTable.height / 2;
        weightFromTable.draw(ctx, canvasCoefficient);
    }

    if (fallingWeight.y >= ctx.canvas.height - fallingWeight.height / 2) {
        fallingWeight = new Weight(level);
    }

    table.draw(ctx, canvasCoefficient)


    if (scales.weightDifference === 0 && scales.leftWeight.length > 0 && scales.rightWeight.length > 0) {
        currentScore += (maxTime - (Date.now() - startTime)) / attemptsOnCurrentLevel;
        if (level === maxLevel) {
            win = true;
            return;
        } else {
            level++;
            startTime = null;
            start();
        }
    }

    if (scales.leftWeight.length > scales.maxWeightsOnScale || scales.rightWeight.length > scales.maxWeightsOnScale
        || ((scales.leftWeight.length === scales.maxWeightsOnScale || scales.rightWeight.length === scales.maxWeightsOnScale) && scales.weightDifference !== 0)) {
        clearInterval(timerIdHolder.timerId);
        loose = true;
    }
}

function game() {
    timerIdHolder.timerId = setInterval(
        () => {
            timer.innerHTML = timerTemplate + formatTime(maxTime - (Date.now() - startTime));
            updateFrame();

            if (Date.now() - startTime >= maxTime) {
                clearInterval(timerIdHolder.timerId);
                timer.innerHTML = timerTemplate + "Время вышло";
                loose = true;
            }

            if (loose) {
                showModal(looseModalId);
            }

            if (win) {
                pauseGame();
                if (!userParsedData.maxScore || userParsedData.maxScore < currentScore) {
                    userParsedData.maxScore = currentScore;
                }
                userParsedData.lastScore = currentScore;
                localStorage.setItem(userName, JSON.stringify(userParsedData));
                setResultToModalBody();
                showModal(winModalId)
            }
        }, 30 / level);
}

function start() {
    init();
    clearInterval(timerIdHolder.timerId);
    startTime = Date.now();
    game();
}