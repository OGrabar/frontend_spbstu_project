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
        this.baseImgWidth = this.baseImg.width
        this.baseImgHeight = this.baseImg.height;

        this.leftScaleImg = new Image();
        this.leftScaleImg.src = "assets/img/libra-left.png";
        this.leftWeight = [];

        this.rightScaleImg = new Image();
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

        const sx = ctx.canvas.width / 2 - this.baseImgWidth / 2;
        const sy = ctx.canvas.height - this.baseImgHeight;

        ctx.drawImage(this.baseImg, sx, ctx.canvas.height - this.baseImgHeight, this.baseImgWidth, this.baseImgHeight);
    }

    drawLeft(ctx) {
        this.scaleImgWidth = this.leftScaleImg.width * canvasCoefficient.horizontal;
        this.scaleImgHeight = this.leftScaleImg.height * canvasCoefficient.vertical;

        const sx = ctx.canvas.width / 2 - this.scaleImgWidth - Scales.scalePartHorizontalOffset * canvasCoefficient.vertical;
        const sy = ctx.canvas.height - this.baseImgHeight + Scales.scalePartVerticalOffset * canvasCoefficient.vertical
            + Scales.weightDifferenceCoefficient * this.weightDifference;

        ctx.drawImage(this.leftScaleImg, sx, sy, this.scaleImgWidth, this.scaleImgHeight);
        console.log()
    }

    drawRight(ctx) {
        this.scaleImgWidth = this.rightScaleImg.width * canvasCoefficient.horizontal;
        this.scaleImgHeight = this.rightScaleImg.height * canvasCoefficient.vertical;

        const sx = ctx.canvas.width / 2 + Scales.scalePartHorizontalOffset * canvasCoefficient.horizontal;
        const sy = ctx.canvas.height - this.baseImgHeight + Scales.scalePartVerticalOffset * canvasCoefficient.vertical
            - Scales.weightDifferenceCoefficient * this.weightDifference;

        ctx.drawImage(this.rightScaleImg, sx, sy, this.scaleImgWidth, this.scaleImgHeight);
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
        this.isOnTable = false;
    }

    draw(ctx) {
        this.updateWidthAndHeight();

        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.fillText(this.weight.toString(), this.x + (this.width / 2 - 5), this.y + (this.height - 10));
    }

    updateWidthAndHeight() {
        this.width = canvasCoefficient.horizontal * (this.img.width + this.img.width * this.weight * 0.1) / 3;
        this.height = canvasCoefficient.vertical * (this.img.height + this.img.height * this.weight * 0.1) / 3;
    }
}

class Table {
//TODO weightsOnTable move here
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

let fallingWeight = new Weight();
const table = new Table();

const mouse = {
    x: 0,
    y: 0,
    down: false
}

window.onmousemove = function(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
};

window.onmousedown = function(e) {
    mouse.down = true;
    if (Math.abs((mouse.x - fallingWeight.x)) <= fallingWeight.width * 1.1 && Math.abs((mouse.y - fallingWeight.y)) <= fallingWeight.height * 1.1) {
        fallingWeight.isSelected = true;
    }
};


function start() {
    const scales = new Scales();
    console.log(ctx)
    console.log(scales);
    scales.updateScales(ctx);

    setTimeout(() => {}, 2000)

    setInterval(function () {
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        canvasCoefficient.update(ctx);
        scales.updateScales(ctx);
        if (scales.weightDifference === 0 && scales.leftWeight.length > 0 && scales.rightWeight.length > 0) {
            //TODO win
        }

        if (!fallingWeight.selected) {
            fallingWeight.y = fallingWeight.y + 1;
        } else {
            fallingWeight.x = mouse.x;
            fallingWeight.y = mouse.y;
        }

        fallingWeight.draw(ctx);
        if (fallingWeight.y >= canvas.height) {
            fallingWeight = new Weight()
        }
        table.draw(ctx)


        //TODO change to the Table class method
        //weightsOnTable.forEach((weightOnTable) => weightOnTable.draw(ctx));
    }, 100);
}

function isGameOver() {

}

function isWin() {

}


