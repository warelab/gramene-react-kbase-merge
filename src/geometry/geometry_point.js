window.Point = function (x,y) {
    this.x = x;
    this.y = y;
}

window.Point.prototype.asString = function () {
    return "{" + this.x + ", " + this.y + "}";
}

window.Point.prototype.offset = function(dx, dy) {
    return new window.Point(this.x + dx, this.y + dy);
}

window.Point.prototype.rectWithPoint = function(point) {

    var ux = this.x < point.x
        ? this.x
        : point.x;
    var uy = this.y < point.y
        ? this.y
        : point.y;

    var width = Math.abs(this.x - point.x);
    var height = Math.abs(this.y - point.y);

    return new Rectangle(
        new Point(ux, uy),
        new Size (width, height)
    );
}
