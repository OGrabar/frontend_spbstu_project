import Scales from "./model/Scales.js";
import Weight from "./model/Weight.js";
import Table from "./model/Table.js";

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.font = "20px serif";
ctx.canvas.width = 2000;
ctx.canvas.height = 1440;

const canvasCoefficient = {
    horizontal: 1,
    vertical: 1,
    update() {
        this.horizontal = window.innerWidth / 2560;
        this.vertical = window.innerHeight / 1440;
    }
}

const body = document.getElementById('body');
body.onload = () => { start(); }

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
pauseTimer.onclick = function () {
    timeDiff = Date.now() - startTime;
    clearInterval(timerIdHolder.timerId);
    isPaused = true;
}

const resumeTimer = document.getElementById('resume_timer');
resumeTimer.onclick = function () {
    startTime = Date.now() - timeDiff;
    isPaused = false;
    extracted();
}



const onceAgainButton = document.getElementById("once_again");
onceAgainButton.onclick = function() {
    startTime = null;
    start();
};

const audio = document.getElementById('audio');
const range = document.getElementById('range');
range.onchange = function(){
    if (this.value === this.min){
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

window.onkeyup = function (e) {
    if (isPaused) { return; }
    if (e.code === "Space") {
        fallingWeight = new Weight();
    }
}

window.onmousemove = function (e) {
    if (!isPaused) { return; }

    mouse.x = e.pageX - scrollX;
    mouse.y = e.pageY - scrollY;
};


window.onmousedown = function (e) {
    if (isPaused) { return; }

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
    if (isPaused) { return; }
    mouse.down = false;

    if (fallingWeight.isSelected) {
        if (fallingWeight.x >= scales.leftScaleX * 0.9 && fallingWeight.x <= scales.leftScaleX + scales.scaleImgWidth &&
            fallingWeight.y <= scales.baseImgY * 1.5 && fallingWeight.y >= scales.baseImgY * 0.5) {
            scales.leftWeight.push(fallingWeight);
            fallingWeight = new Weight();
            return;
        }

        if (fallingWeight.x >= scales.rightScaleX * 0.9 && fallingWeight.x <= scales.rightScaleX + scales.scaleImgWidth &&
            fallingWeight.y <= scales.baseImgY * 1.5 && fallingWeight.y >= scales.baseImgY * 0.5) {
            scales.rightWeight.push(fallingWeight);
            fallingWeight = new Weight();
            return;
        }

        if (fallingWeight.x >= table.x * 0.9 && fallingWeight.x <= (table.x + table.width) * 1.1 &&
            fallingWeight.y <= table.y * 1.5 && fallingWeight.y >= table.y * 0.5) {
            table.addWeight(fallingWeight);
            fallingWeight = new Weight();
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
            weightFromTable = new Weight();
            return;
        }

        if (weightFromTable.x >= scales.rightScaleX * 0.9 && weightFromTable.x <= scales.rightScaleX + scales.scaleImgWidth &&
            weightFromTable.y <= scales.baseImgY * 1.5 && weightFromTable.y >= scales.baseImgY * 0.5) {
            scales.rightWeight.push(weightFromTable);
            weightFromTable = new Weight();
            return;
        }

        if (weightFromTable.x >= table.x && weightFromTable.x <= (table.x + table.width) &&
            weightFromTable.y <= table.y * 1.5 && weightFromTable.y >= table.y * 0.5) {
            table.addWeight(weightFromTable);
            weightFromTable = new Weight();
            return;
        }

        if (weightFromTable.x <= scales.leftScaleX || weightFromTable.x > table.x + table.width * 1.1) {
            weightFromTable = new Weight();
            return;
        }
    }

}

function scaleCanvas() {
    canvasCoefficient.update();
    ctx.canvas.width = 2000 * canvasCoefficient.horizontal;
    ctx.canvas.height = 1440 * canvasCoefficient.vertical;
    fallingWeight.x = fallingWeight.x * canvasCoefficient.horizontal;
}

window.onresize = function () {
    scaleCanvas();
    game();
}

let fallingWeight;
let weightFromTable;
let table;
let scales;

let win = false;
let loose = false;

function init() {
    fallingWeight = new Weight();
    weightFromTable = new Weight();
    table = new Table();
    scales = new Scales();
    scaleCanvas(ctx);
}

let timerIdHolder = {
    timerId: null
}

function game() {
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
        fallingWeight = new Weight();
    }

    table.draw(ctx, canvasCoefficient)


    if (scales.weightDifference === 0 && scales.leftWeight.length > 0 && scales.rightWeight.length > 0) {
        if (level === maxLevel) {
            //TODO go to result
            console.log()
        } else {
            level++;
            startTime = null;
            start();
        }
    }

    if (scales.leftWeight.length > 3 || scales.rightWeight.length > 3) {
        clearInterval(timerIdHolder.timerId);
    }
}

function extracted() {
    timerIdHolder.timerId = setInterval(
        () => {
            timer.innerText = formatTime(maxTime - (Date.now() - startTime));
            game();

            if (Date.now() - startTime >= maxTime) {
                clearInterval(timerIdHolder.timerId);
                timer.innerHTML = "<strong>Время вышло";
            }

            levelElement.innerText = level.toString();

        }, 50 / level);
}

function start() {
    init();
    clearInterval(timerIdHolder.timerId);

    startTime = Date.now();
    extracted();
}