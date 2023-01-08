export default class Weight {
    constructor(level) {
        this.weight = Math.floor(Math.random() * (5 + level - 1)) + 1;

        this.img = new Image();
        this.img.src = "../assets/img/bob.png";

        this.x = this.getRandomX();
        this.y = 0;

        this.width = 0;
        this.height = 0;

        this.isSelected = false;

        this.shouldBeRemoved = false;
        this.opacity = 1;
    }

    draw(ctx, canvasCoefficient) {
        this.updateWidthAndHeight(canvasCoefficient);
        if (this.shouldBeRemoved) {
            this.opacity -= 0.05;
            this.opacity = Math.max(this.opacity, 0);
            ctx.globalAlpha = this.opacity;
        }
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.fillText(this.weight.toString(), this.x + (this.width / 2 - 5), this.y + (this.height - 10));
        ctx.globalAlpha = 1;
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