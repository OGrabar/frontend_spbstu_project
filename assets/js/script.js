const canvasCoefficient = {
    horizontal: 1,
    vertical: 1,
    update(ctx) {
        this.horizontal = window.innerWidth / 2560;
        this.vertical = window.innerHeight / 1440 ;
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

        this.weightOffset = 100;

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
            weight.x = this.leftScaleX + index * this.weightOffset * canvasCoefficient.horizontal;
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
            weight.x = this.rightScaleX + index * this.weightOffset * canvasCoefficient.horizontal;
            weight.y = this.rightScaleY - weight.height - 10;
            weight.draw(ctx);
        });
    }

    updateScales(ctx) {
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

        this.x = this.getRandomX();
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
        this.width = canvasCoefficient.horizontal * (this.img.width + this.img.width * this.weight * 0.1) / 2;
        this.height = canvasCoefficient.vertical * (this.img.height + this.img.height * this.weight * 0.1) / 2;
    }

    getRandomX() {
        return Math.floor(Math.random() * 500 * canvasCoefficient.horizontal);
    }
}

class Table {
    constructor() {
        this.weightsOnTable = [];
        this.maxWeightsOnTableSize = 3;
        this.maxWeightHeight = 0;

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.lineWitdth = 10;
        this.color = '#e4b04a';
    }

    draw(ctx) {
        this.x = ctx.canvas.width * 0.7
        this.width = ctx.canvas.width * (0.05 * this.maxWeightsOnTableSize);
        this.y = ctx.canvas.height - 300 * canvasCoefficient.vertical;

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineWidth = this.lineWitdth;
        ctx.strokeStyle = this.color;
        ctx.stroke();

        this.weightsOnTable.forEach((weight, index) => {
            weight.x = this.x + this.getWeightOffset(index);
            weight.y = this.y - weight.height;
            weight.draw(ctx)
        });
    }

    getWeightOffset(index) {
        return index * this.width / this.maxWeightsOnTableSize;
    }

    addWeight(weight) {
        if (weight.height > this.maxWeightHeight) {
            this.maxWeightHeight = weight.height
        }

        if (this.weightsOnTable.length < this.maxWeightsOnTableSize) {
            this.weightsOnTable.push(weight)
        } else {
            let weightIndex;
            for (let i = 0; i < this.weightsOnTable.length; i++) {
                if (weight.x >= this.x + this.getWeightOffset(i) * 0.85 && weight.x <= this.x + this.getWeightOffset(i + 1) * 1.15) {
                    weightIndex = i;
                }
            }
            this.weightsOnTable.splice(weightIndex, 1, weight);
        }
    }

    removeWeight(index) {
        this.weightsOnTable.splice(index, 1);
    }
}

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.font = "20px serif";
ctx.canvas.width = 2000;
ctx.canvas.height = 1440;

let fallingWeight = new Weight();
let weightFromTable = new Weight();
const table = new Table();
const scales = new Scales();

let win = false;
let loose = false;


const mouse = {
    x: 0,
    y: 0,
    down: false
}


window.onmousemove = function (e) {
    mouse.x = e.pageX - scrollX;
    mouse.y = e.pageY - scrollY;
};


window.onmousedown = function (e) {
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

        if (weightFromTable.x >= table.x && weightFromTable.x <= (table.x + table.width)  &&
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


function game() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    canvasCoefficient.update(ctx);
    ctx.canvas.width = 2000 * canvasCoefficient.horizontal;
    ctx.canvas.height = 1440 * canvasCoefficient.vertical;
    console.log(canvas.clientWidth);
    scales.updateScales(ctx);

    if (scales.weightDifference === 0 && scales.leftWeight.length > 0 && scales.rightWeight.length > 0) {
        alert("win")
    }

    if (fallingWeight.isSelected) {
        fallingWeight.x = mouse.x - fallingWeight.width / 2;
        fallingWeight.y = mouse.y - fallingWeight.height / 2;
    } else {
        fallingWeight.y = fallingWeight.y + 1;
    }
    fallingWeight.draw(ctx);

    if (weightFromTable.isSelected) {
        weightFromTable.x = mouse.x - weightFromTable.width / 2;
        weightFromTable.y = mouse.y - weightFromTable.height / 2;
        weightFromTable.draw(ctx);
    }

    if (fallingWeight.y >= ctx.canvas.height - fallingWeight.height / 2) {
        fallingWeight = new Weight();
    }

    table.draw(ctx)

}

function start() {
    setInterval(
        () => {game()}, 5
    )
}