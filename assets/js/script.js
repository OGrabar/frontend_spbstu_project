class Scales {
    static scalePartVerticalOffset = 50;
    static scalePartHorizontalOffset = 20;
    static weightDifferenceCoefficient = 3;

    constructor() {
        this.base = new Image();
        this.base.src = "assets/img/libra-center.png";

        this.leftScale = new Image();
        this.leftScale.src = "assets/img/libra-left.png";
        this.leftWeight = [];

        this.rightScale = new Image();
        this.rightScale.src = "assets/img/libra-right.png";
        this.rightWeight = [];

        this.weightDifference = 0;
    }

    calculateWeightDifference() {
        const sum = (aggregated, next) => aggregated + next.weight;
        this.weightDifference = this.leftWeight.reduce(sum, 0) - this.rightWeight.reduce(sum, 0);
    }

    drawBase(ctx) {
        const sx = ctx.canvas.width / 2 - this.base.width / 2;
        const sy = ctx.canvas.height - this.base.height;
        ctx.drawImage(this.base, sx, sy);
    }

    drawLeft(ctx) {
        const sx = ctx.canvas.width / 2 - this.leftScale.width - Scales.scalePartHorizontalOffset;
        const sy = ctx.canvas.height - this.base.height + Scales.scalePartVerticalOffset + Scales.weightDifferenceCoefficient * this.weightDifference;
        ctx.drawImage(this.leftScale, sx, sy);
    }

    drawRight(ctx) {
        const sx = ctx.canvas.width / 2 + Scales.scalePartHorizontalOffset;
        const sy = ctx.canvas.height - this.base.height + Scales.scalePartVerticalOffset - Scales.weightDifferenceCoefficient * this.weightDifference;
        ctx.drawImage(this.rightScale, sx, sy);
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

        this.bob = new Image();
        this.bob.src = "assets/img/bob-1.png";

        this.x = Math.floor(Math.random() * 500);
        this.y = 0;

        this.isSelected = false;
        this.isOnTable = false;
    }

    draw(ctx) {
        const sw = (this.bob.width + this.bob.width * this.weight * 0.1) / 3;
        const sh = (this.bob.height + this.bob.height * this.weight * 0.1) / 3;
        ctx.drawImage(this.bob, this.x, this.y, sw, sh);
        ctx.fillText(this.weight.toString(), this.x + sw / 2 - 5, this.y + sh - 10);
    }
}



let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = 5 * window.innerHeight / 6;
let ctx = canvas.getContext('2d');
ctx.font = "20px serif";

let fallingWeight = new Weight();

const weightsOnTable = [];


function start() {
    const scales = new Scales();
    console.log(ctx)
    console.log(scales);
    scales.updateScales(ctx);

    setInterval(function () {
        console.log(fallingWeight)
        scales.updateScales(ctx);
        fallingWeight.y = fallingWeight.y + 1;
        fallingWeight.draw(ctx);
        if (fallingWeight.y >= canvas.height) {
            fallingWeight = new Weight()
        }
        weightsOnTable.forEach((weightOnTable) => weightOnTable.draw(ctx));
    }, 10);
}