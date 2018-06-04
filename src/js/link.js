class Link {
    constructor(e) {
        this.position;
        this.element;
        this.dist = 0;
        this.t = 0;
        this.l = 0;
        this.b = 0;
        this.r = 0;
        this.x = 0;
        this.y = 0;
        if (e instanceof HTMLElement) {
            // const t = e.offsetTop;
            // const l = e.offsetLeft;
            // const w = e.offsetWidth;
            // const h = e.offsetHeight;
            // this.position = {
            //     top: t,
            //     bottom: t + h,
            //     left: l,
            //     right: l + w,
            // };
            this.position = e.getBoundingClientRect();
            this.element = e;
            this.l = this.position.left;
            this.t = this.position.top;
            this.b = this.position.bottom;
            this.r = this.position.right;
            this.x = parseInt((this.position.right + this.position.left) * 0.5, 10);
            this.y = parseInt((this.position.bottom + this.position.top) * 0.5, 10);
        }
    }
}
export default Link;