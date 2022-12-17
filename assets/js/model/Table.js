export default class Table {
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

    draw(ctx, canvasCoefficient) {
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
            weight.draw(ctx, canvasCoefficient)
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
}