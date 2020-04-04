export class Electron  {
    constructor(vx = 0, vy = 0, ax = 0, ay = 0,
                px = 100, py = 100, mass = 100) {
            this.velocityX = vx;
            this.velocityY = vy;
            this.accelerationX = ax;
            this.accelerationY = ay;
            this.positionX = px;
            this.positionY = py;
            this.mass = mass;
            this.value = 1;
    }

    changePosition(){
        let newVelocityX = this.velocityX;
        let newVelocityY = this.velocityY;

        this.positionX += newVelocityX;
        this.positionY += newVelocityY;
    }

    update(){
        this.velocityX += this.accelerationX;
        this.velocityY += this.accelerationY;
        this.changePosition();
        this.accelerationX = 0;
        this.accelerationY = 0;
    }



}