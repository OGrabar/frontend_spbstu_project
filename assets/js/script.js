
const canvasCoefficient = {
    horizontal: window.innerWidth / 2560,
    vertical: window.innerHeight / 1440,
    update(ctx) {
        this.horizontal = ctx.canvas.width / 2560;
        this.vertical = ctx.canvas.height / 1440
    }
}

class Scales {
    static scalePartVerticalOffset = 50;
    static scalePartHorizontalOffset = 20;
    static weightDifferenceCoefficient = 3;

    constructor() {
        this.baseImg = new Image();
        this.baseImg.src = "assets/img/libra-center.png";
        this.baseImgWidth = 0;
        this.baseImgHeight = 0;
        this.baseImgX = 0;
        this.baseImgY = 0;

        this.leftScaleImg = new Image();
        this.leftScaleImg.src = "assets/img/libra-left.png";
        this.leftScaleX = 0;
        this.leftScaleY = 0;
        this.leftWeight = [];

        this.rightScaleImg = new Image();
        this.rightScaleX = 0;
        this.rightScaleY = 0;
        this.rightScaleImg.src = "assets/img/libra-right.png";
        this.rightWeight = [];

        this.scaleImgWidth = this.leftScaleImg.width;
        this.scaleImgHeight = this.leftScaleImg.height;

        this.weightDifference = 0;
    }

    calculateWeightDifference() {
        const sum = (aggregated, next) => aggregated + next.weight;
        this.weightDifference = this.leftWeight.reduce(sum, 0) - this.rightWeight.reduce(sum, 0);
    }

    drawBase(ctx) {
        this.baseImgWidth = this.baseImg.width * canvasCoefficient.horizontal;
        this.baseImgHeight = this.baseImg.height * canvasCoefficient.vertical;

        this.baseImgX = ctx.canvas.width / 2 - this.baseImgWidth / 2;
        this.baseImgY = ctx.canvas.height - this.baseImgHeight;

        ctx.drawImage(this.baseImg, this.baseImgX, this.baseImgY, this.baseImgWidth, this.baseImgHeight);
    }

    drawLeft(ctx) {
        this.scaleImgWidth = this.leftScaleImg.width * canvasCoefficient.horizontal;
        this.scaleImgHeight = this.leftScaleImg.height * canvasCoefficient.vertical;

        this.leftScaleX = ctx.canvas.width / 2 - this.scaleImgWidth - Scales.scalePartHorizontalOffset * canvasCoefficient.vertical;
        this.leftScaleY = ctx.canvas.height - this.baseImgHeight + Scales.scalePartVerticalOffset * canvasCoefficient.vertical
            + Scales.weightDifferenceCoefficient * this.weightDifference;

        ctx.drawImage(this.leftScaleImg, this.leftScaleX, this.leftScaleY, this.scaleImgWidth, this.scaleImgHeight);

        this.leftWeight.forEach((weight, index) => {
            weight.x = this.leftScaleX + index * 100 * canvasCoefficient.horizontal;
            weight.y = this.leftScaleY - weight.height - 10;
            weight.draw(ctx);
        });
    }

    drawRight(ctx) {
        this.scaleImgWidth = this.rightScaleImg.width * canvasCoefficient.horizontal;
        this.scaleImgHeight = this.rightScaleImg.height * canvasCoefficient.vertical;

        this.rightScaleX = ctx.canvas.width / 2 + Scales.scalePartHorizontalOffset * canvasCoefficient.horizontal;
        this.rightScaleY = ctx.canvas.height - this.baseImgHeight + Scales.scalePartVerticalOffset * canvasCoefficient.vertical
            - Scales.weightDifferenceCoefficient * this.weightDifference;

        ctx.drawImage(this.rightScaleImg, this.rightScaleX, this.rightScaleY, this.scaleImgWidth, this.scaleImgHeight);

        this.rightWeight.forEach((weight, index) => {
           weight.x = this.rightScaleX + index * 100 * canvasCoefficient.horizontal;
           weight.y = this.rightScaleY - weight.height - 10;
           weight.draw(ctx);
        });
    }

    updateScales(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.calculateWeightDifference();
        this.drawBase(ctx);
        this.drawLeft(ctx);
        this.drawRight(ctx);
    }
}

class Weight {
    constructor() {
        this.weight = Math.floor(Math.random() * 5) + 1;

        this.img = new Image();
        this.img.src = "assets/img/bob.png";

        this.x = Math.floor(Math.random() * 500) * canvasCoefficient.horizontal;
        this.y = 0;

        this.width = 0;
        this.height = 0;

        this.isSelected = false;
    }

    draw(ctx) {
        this.updateWidthAndHeight();
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.fillText(this.weight.toString(), this.x + (this.width / 2 - 5), this.y + (this.height - 10));
    }

    updateWidthAndHeight() {
        this.width = canvasCoefficient.horizontal * (this.img.width + this.img.width * this.weight * 0.1) / 1.7;
        this.height = canvasCoefficient.vertical * (this.img.height + this.img.height * this.weight * 0.1) / 1.7;
    }
}

class Table {
    constructor() {
        this.weightsOnTable = [new Weight(), new Weight(), new Weight()];
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(ctx.canvas.width * 0.7, ctx.canvas.height - 300);
        ctx.lineTo(ctx.canvas.width * 0.8, ctx.canvas.height - 300);
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#e4b04a';
        ctx.stroke();
        this.weightsOnTable.forEach((weight, index) => {
            weight.x = ctx.canvas.width * 0.7 + index * 100 * canvasCoefficient.horizontal;
            weight.y = ctx.canvas.height - 300 - weight.height;
            weight.draw(ctx)
        });
    }

}

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.font = "20px serif";
ctx.canvas.width = ctx.canvas.offsetWidth;
ctx.canvas.height = ctx.canvas.offsetHeight;

let fallingWeight = new Weight();
const table = new Table();
const scales = new Scales();


const mouse = {
    x: 0,
    y: 0,
    down: false
}


window.onmousemove = function (e) {
    mouse.x = e.pageX - scrollX;
    mouse.y = e.pageY - scrollY;
};

function fallingWeightClicked() {
    const clickOnFallingWeight = mouse.x >= fallingWeight.x && mouse.x <= (fallingWeight.x + fallingWeight.width) && mouse.y >= fallingWeight.y && mouse.y <= (fallingWeight.y + fallingWeight.height);
    if (clickOnFallingWeight) {
        fallingWeight.isSelected = true;
    }
}

window.onmousedown = function (e) {
    mouse.down = true;
    fallingWeightClicked();
};

window.onmouseup = function (e) {
    mouse.down = false;
    fallingWeight.x = mouse.x;
    fallingWeight.y = mouse.y;

    if (fallingWeight.x >= scales.leftScaleX * 0.9 && fallingWeight.x <= scales.leftScaleX + scales.scaleImgWidth &&
        fallingWeight.y <= scales.baseImgY * 1.5 && fallingWeight.y >= scales.baseImgY * 0.5) {
        scales.leftWeight.push(fallingWeight);
    }

    if (fallingWeight.x >= scales.rightScaleX * 0.9 && fallingWeight.x <= scales.rightScaleX + scales.scaleImgWidth &&
        fallingWeight.y <= scales.baseImgY * 1.5 && fallingWeight.y >= scales.baseImgY * 0.5) {
        scales.rightWeight.push(fallingWeight);
    }

    fallingWeight = new Weight();
}


function game() {
    canvasCoefficient.update(ctx);
    scales.updateScales(ctx);

    if (scales.weightDifference === 0 && scales.leftWeight.length > 0 && scales.rightWeight.length > 0) {
        //TODO win
    }

    if (fallingWeight.isSelected) {
        fallingWeight.x = mouse.x - fallingWeight.width / 2;
        fallingWeight.y = mouse.y - fallingWeight.height / 2;
    } else {
        fallingWeight.y = fallingWeight.y + 1;
    }

    fallingWeight.draw(ctx);
    table.draw(ctx)


    //TODO change to the Table class method
    //weightsOnTable.forEach((weightOnTable) => weightOnTable.draw(ctx));
    requestAnimationFrame(game);
}

function start() {
    console.log(ctx)
    console.log(scales);
    scales.updateScales(ctx);

    game();
}