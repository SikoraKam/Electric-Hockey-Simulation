export default class  ElectricCharge {
    constructor(sign, width, height, x, y, type, src) {
        this.type = type;
        if(type === "image"){
            this.image = new Image();
            this.image.src = src;
        }
        this.sign = sign; //bool
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }
}