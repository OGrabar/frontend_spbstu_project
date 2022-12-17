import Weight from "./Weight.js";

export default class Scales {
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
        this.leftWeight = [new Weight()];

        this.rightScaleImg = new Image();
        this.rightScaleX = 0;
        this.rightScaleY = 0;
        this.rightScaleImg.src = "assets/img/libra-right.png";
        let weight = new Weight();
        while (this.leftWeight[0].weight === weight.weight) {
            weight = new Weight();
        }
        this.rightWeight = [weight];

        this.scaleImgWidth = this.leftScaleImg.width;
        this.scaleImgHeight = this.leftScaleImg.height;

        this.weightOffset = 100;

        this.weightDifference = 0;
    }

    calculateWeightDifference() {
        const sum = (aggregated, next) => aggregated + next.weight;
        this.weightDifference = this.leftWeight.reduce(sum, 0) - this.rightWeight.reduce(sum, 0);
    }

    drawBase(ctx, canvasCoefficient) {
        this.baseImgWidth = this.baseImg.width * canvasCoefficient.horizontal;
        this.baseImgHeight = this.baseImg.height * canvasCoefficient.vertical;

        this.baseImgX = ctx.canvas.width / 2 - this.baseImgWidth / 2;
        this.baseImgY = ctx.canvas.height - this.baseImgHeight;

        ctx.drawImage(this.baseImg, this.baseImgX, this.baseImgY, this.baseImgWidth, this.baseImgHeight);
    }

    drawLeft(ctx, canvasCoefficient) {
        this.scaleImgWidth = this.leftScaleImg.width * canvasCoefficient.horizontal;
        this.scaleImgHeight = this.leftScaleImg.height * canvasCoefficient.vertical;

        this.leftScaleX = ctx.canvas.width / 2 - this.scaleImgWidth - Scales.scalePartHorizontalOffset * canvasCoefficient.vertical;
        this.leftScaleY = ctx.canvas.height - this.baseImgHeight + Scales.scalePartVerticalOffset * canvasCoefficient.vertical
            + Scales.weightDifferenceCoefficient * this.weightDifference;

        ctx.drawImage(this.leftScaleImg, this.leftScaleX, this.leftScaleY, this.scaleImgWidth, this.scaleImgHeight);

        this.leftWeight.forEach((weight, index) => {
            weight.x = this.leftScaleX + index * this.weightOffset * canvasCoefficient.horizontal;
            weight.y = this.leftScaleY - weight.height - 10;
            weight.draw(ctx, canvasCoefficient);
        });
    }

    drawRight(ctx, canvasCoefficient) {
        this.scaleImgWidth = this.rightScaleImg.width * canvasCoefficient.horizontal;
        this.scaleImgHeight = this.rightScaleImg.height * canvasCoefficient.vertical;

        this.rightScaleX = ctx.canvas.width / 2 + Scales.scalePartHorizontalOffset * canvasCoefficient.horizontal;
        this.rightScaleY = ctx.canvas.height - this.baseImgHeight + Scales.scalePartVerticalOffset * canvasCoefficient.vertical
            - Scales.weightDifferenceCoefficient * this.weightDifference;

        ctx.drawImage(this.rightScaleImg, this.rightScaleX, this.rightScaleY, this.scaleImgWidth, this.scaleImgHeight);

        this.rightWeight.forEach((weight, index) => {
            weight.x = this.rightScaleX + index * this.weightOffset * canvasCoefficient.horizontal;
            weight.y = this.rightScaleY - weight.height - 10;
            weight.draw(ctx, canvasCoefficient);
        });
    }

    updateScales(ctx, canvasCoefficient) {
        this.calculateWeightDifference();
        this.drawBase(ctx, canvasCoefficient);
        this.drawLeft(ctx, canvasCoefficient);
        this.drawRight(ctx, canvasCoefficient);
    }
}