class Scales {
    static scalePartVerticalOffset = 50;
    static scalePartHorizontalOffset = 20;
    static weightDifferenceCoefficient = 3;

    constructor() {
        this.baseImg = new Image();
        this.baseImg.src = "assets/img/libra-center.png";

        this.leftScaleImg = new Image();
        this.leftScaleImg.src = "assets/img/libra-left.png";
        this.leftWeight = [];

        this.rightScaleImg = new Image();
        this.rightScaleImg.src = "assets/img/libra-right.png";
        this.rightWeight = [];

        this.weightDifference = 0;
    }

    calculateWeightDifference() {
        const sum = (aggregated, next) => aggregated + next.weight;
        this.weightDifference = this.leftWeight.reduce(sum, 0) - this.rightWeight.reduce(sum, 0);
    }

    drawBase(ctx) {
        const sx = ctx.canvas.width / 2 - this.baseImg.width / 2;
        const sy = ctx.canvas.height - this.baseImg.height;
        ctx.drawImage(this.baseImg, sx, sy);
    }

    drawLeft(ctx) {
        const sx = ctx.canvas.width / 2 - this.leftScaleImg.width - Scales.scalePartHorizontalOffset;
        const sy = ctx.canvas.height - this.baseImg.height + Scales.scalePartVerticalOffset + Scales.weightDifferenceCoefficient * this.weightDifference;
        ctx.drawImage(this.leftScaleImg, sx, sy);
    }

    drawRight(ctx) {
        const sx = ctx.canvas.width / 2 + Scales.scalePartHorizontalOffset;
        const sy = ctx.canvas.height - this.baseImg.height + Scales.scalePartVerticalOffset - Scales.weightDifferenceCoefficient * this.weightDifference;
        ctx.drawImage(this.rightScaleImg, sx, sy);
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
        this.img.src = "assets/img/img.png";

        this.x = Math.floor(Math.random() * 500);
        this.y = 0;

        this.width = (this.img.width + this.img.width * this.weight * 0.1) / 3;
        this.height = (this.img.height + this.img.height * this.weight * 0.1) / 3;

        this.isSelected = false;
        this.isOnTable = false;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.fillText(this.weight.toString(), this.x + this.width / 2 - 5, this.y + this.height - 10);
    }
}

class Table {
//TODO weightsOnTable move here
    constructor() {
        this.img = new Image();
        this.img.src = "assets/img/table.png";

        this.weightsOnTable = [new Weight(), new Weight(), new Weight()];
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(ctx.canvas.width * 0.7, ctx.canvas.height - 300);
        ctx.lineTo(ctx.canvas.width * 0.85, ctx.canvas.height - 300);
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#e4b04a';
        ctx.stroke();
        this.weightsOnTable.forEach((weight, index) => {
            weight.x = ctx.canvas.width * 0.7 + 10 + weight.height * index*2;
            weight.y = ctx.canvas.height - 300 - weight.height;
            weight.draw(ctx)
        });
    }

}

let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = 5 * window.innerHeight / 6;
let ctx = canvas.getContext('2d');
ctx.font = "20px serif";

let fallingWeight = new Weight();


function start() {
    const scales = new Scales();
    console.log(ctx)
    console.log(scales);
    scales.updateScales(ctx);
    const table = new Table();


    setInterval(function () {
        console.log(fallingWeight)
        scales.updateScales(ctx);
        if (scales.weightDifference === 0 && scales.leftWeight.length > 0 && scales.rightWeight.length > 0) {
            //TODO win
        }

        fallingWeight.y = fallingWeight.y + 1;
        fallingWeight.draw(ctx);
        if (fallingWeight.y >= canvas.height) {
            fallingWeight = new Weight()
        }
        table.draw(ctx)

        //TODO change to the Table class method
        //weightsOnTable.forEach((weightOnTable) => weightOnTable.draw(ctx));
    }, 10);
}

function isGameOver() {

}

function isWin() {

}