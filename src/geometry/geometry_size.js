window.Size = function (width, height) {
    this.width = width;
    this.height = height;
}

window.Size.prototype.asString = function () {
    return "{" + this.width + ", " + this.height + "}";
}
