export default class Weight {
    constructor() {
        this.weight = Math.floor(Math.random() * (5 - 1)) + 1;

        this.img = new Image();
        this.img.src = "assets/img/bob.png";

        this.x = this.getRandomX();
        this.y = 0;

        this.width = 0;
        this.height = 0;

        this.isSelected = false;
    }

    draw(ctx, canvasCoefficient) {
        this.updateWidthAndHeight(canvasCoefficient);
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.fillText(this.weight.toString(), this.x + (this.width / 2 - 5), this.y + (this.height - 10));
    }

    updateWidthAndHeight(canvasCoefficient) {
        this.width = canvasCoefficient.horizontal * (this.img.width + this.img.width * this.weight * 0.1) / 2;
        this.height = canvasCoefficient.vertical * (this.img.height + this.img.height * this.weight * 0.1) / 2;
    }

    getRandomX(canvasCoefficient) {
        if (!canvasCoefficient) {
            canvasCoefficient = { horizontal: 1 }
        }
        return Math.floor(Math.random() * 300 * canvasCoefficient.horizontal)

    }
}