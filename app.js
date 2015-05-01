(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function RGBColor(r,g,b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

RGBColor.prototype.asString = function () {
    return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
}

RGBColor.prototype.asStringWithAlpha = function (alpha) {
    return "rgba(" + this.r + "," + this.g + "," + this.b + ',' + alpha + ")";
}

RGBColor.prototype.invert = function() {
    return new RGBColor(255 - this.r, 255 - this.g, 255 - this.b);
}

RGBColor.prototype.darkenBy = function(amount) {
    var darker = new RGBColor(this.r,this.g,this.b);

    darker.r -= amount;
    darker.g -= amount;
    darker.b -= amount;

    if (darker.r < 0) {
        darker.r = 0;
    }

    if (darker.g < 0) {
        darker.g = 0;
    }

    if (darker.b < 0) {
        darker.b = 0;
    }

    return darker;
}

RGBColor.prototype.lightenBy = function(amount) {
    var darker = new RGBColor(this.r,this.g,this.b);

    darker.r += amount;
    darker.g += amount;
    darker.b += amount;

    if (darker.r > 255) {
        darker.r = 255;
    }

    if (darker.g > 255) {
        darker.g = 255;
    }

    if (darker.b > 255) {
        darker.b = 255;
    }

    return darker;
}

RGBColor.prototype.subtract = function(c) {
	return new RGBColor(
		this.r - c.r,
		this.g - c.g,
		this.b - c.b
	);
}

RGBColor.prototype.rgbFromString = function(string) {
    if ($) {
        var $div = $.jqElem('div').css('background-color', string);
        var rgb = $div.css('background-color');
        var m;
        if (m = rgb.match(/rgb\((\d+), (\d+), (\d+)\)/)) {
            return {
                r : +m[1],
                g : +m[2],
                b : +m[3]
            };
        }
    }
    else {
        return undefined;
    }
}


},{}],2:[function(require,module,exports){


VisContainer = React.createClass(
    {displayName: "VisContainer",

        render : function() {

            return (React.createElement("div", null));

        },

        attachJQ : function() {

            var container = this.getDOMNode().parentNode;
console.log($(container), this.props.kbVis, this.props.options);
            $(container)[this.props.kbVis](this.props.options);

        },

        shouldComponentUpdate: function(props) {
            return false;
        },

        componentDidMount: function() {

            this.attachJQ();

        },
    }
);


var containers = {
    'Barchart'          : 'kbaseBarchart',
    'Linechart'         : 'kbaseLinechart',
    'Piechart'          : 'kbasePiechart',
    'Treechart'         : 'kbaseTreechart',
    'Chordchart'        : 'kbaseChordchart',
    'CircularHeatmap'   : 'kbaseCircularHeatmap',
    'ForcedNetwork'     : 'kbaseForcedNetwork',
    'Heatmap'           : 'kbaseHeatmap',
    'Histogram'         : 'kbaseHistogram',
    'LineSerieschart'   : 'kbaseLineSerieschart',
    'Scatterplot'       : 'kbaseScatterplot',
    'Venndiagram'       : 'kbaseVenndiagram',
};

for (container in containers) {
    var kbwidget = containers[container];

    window[container] = React.createClass(
        {displayName: "container",
            kbwidget : kbwidget,

            render : function() {

                return (
                    React.createElement(VisContainer, {kbVis: this.kbwidget, options: this.props})
                );

            },

            shouldComponentUpdate: function(props) {
                return false;
            },


        }
    );


};


},{}],3:[function(require,module,exports){
require('./accordionPanel') ;

Accordion = React.createClass(
    {displayName: "Accordion",

        getInitialState : function() {

            var state = {};
            state.initialOpen = [];

            state.initialOpen = this.props.panels.map(function(panel, i) {
                return panel.initialOpen || false;
            });

            return state;

        },

        toggleOpen : function(idx) {
            console.log("TOGGLES AT ", idx, this.props.panels);

            var io = this.state.initialOpen;
            io[idx] = ! io[idx];
            this.setState({initialOpen : io});

            //this.props.panels[idx].initialOpen = ! this.props.panels[idx].initialOpen;
            //this.forceUpdate();
        },

        render : function() {

            var accordion = this;

            var style = {};//{fontWeight : 'bold'};
console.log('ACC INIT', this.props, this.state);
            var panels = this.props.panels.map( function (panel, i) {
            console.log("RENDER PANEL", panel);
                return ( React.createElement(AccordionPanel, {
                    title: panel.title, 
                    body: panel.body, 
                    initialOpen: accordion.state.initialOpen[i], 
                    accordion:  accordion, 
                    idx:  i }) );
            });

console.log("ACC", this.props.panels);
            return (
                React.createElement("div", {className: "accordion", style: style}, 
                     panels 
                )
            );
        }
    }
);


},{"./accordionPanel":4}],4:[function(require,module,exports){
AccordionPanel = React.createClass(
    {displayName: "AccordionPanel",


        handleClick : function(e) {
            e.preventDefault(); e.stopPropagation();

            /*var $me = $(e.target).closest('.panel-heading');

            var $opened = $me.closest('.panel').find('.in');
            var $target = $me.next();

            if ($opened != undefined) {
                $opened.collapse('hide');
                var $i = $opened.parent().first().find('i');
                $i.removeClass('fa fa-chevron-down');
                $i.addClass('fa fa-chevron-right');
            }

            if ($target.get(0) != $opened.get(0)) {
                $target.collapse('show');
                var $i = $me.parent().find('i');
                $i.removeClass('fa fa-chevron-right');
                $i.addClass('fa fa-chevron-down');
            }*/
console.log(this.props);
            this.props.accordion.toggleOpen(this.props.idx);
            //setState( { open : ! this.state.open } );
        },

        render : function() {

            var style = {fontWeight : 'bold'};
console.log("ACC PANIC", this.state, this.props);

            var chevronClass = 'fa pull-left ';
            chevronClass += this.props.initialOpen ? 'fa-chevron-down' : 'fa-chevron-right';

            var bodyClass = 'panel-body collapse ';
            bodyClass += this.props.initialOpen ? 'in' : '';

            return (
                React.createElement("div", {className: "panel panel-default", style: { marginBottom : '2px'}}, 
                    React.createElement("div", {className: "panel-heading", role: "tab", style: {padding : '0px'}, onClick: this.handleClick}, 
                        React.createElement("i", {className: chevronClass, 
                            style: {
                                marginRight : '5px',
                                marginLeft : '3px',
                                height : '22px',
                                lineHeight : '22px',
                                color : 'gray'
                            }}), 
                        React.createElement("a", {href: "#", 
                            title:  this.props.title, 
                            style: {
                                padding : '0px',
                                height : '22px',
                                lineHeight : '22px',
                            }}, 
                             this.props.title
                        )
                    ), 
                    React.createElement("div", {className: bodyClass}, 
                         this.props.body
                    )
                )
            );
        }
    }
);


},{}],5:[function(require,module,exports){
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


},{}],6:[function(require,module,exports){
window.window.Rectangle = function(origin,size) {
    if (origin == undefined) {
        origin = new Point(-1,-1);
    }
    if (size == undefined) {
        size = new Size(-1,-1);
    }
    this.origin = origin;
    this.size = size;
}

window.Rectangle.prototype.invert = function() {
    return new window.Rectangle(
        this.height,
        this.width
    );
}

window.Rectangle.prototype.lowerRight = function() {
    return new Point(
        this.origin.x + this.size.width,
        this.origin.y + this.size.height
    )
}

window.Rectangle.prototype.insetRect = function(dx,dy) {
    return new window.Rectangle(
        new Point(this.origin.x + dx / 2, this.origin.y + dy / 2),
        new Size(this.size.width - dx, this.size.height - dy)
    );
}

window.Rectangle.prototype.fromString = function (string) {
    var results;
    if (results = string.match(/{{(.+),\s*(.+)},\s*{(.+),\s*(.+)}}/)) {
        return new window.Rectangle(
            new Point(parseInt(results[1]), parseInt(results[2])),
            new Size(parseInt(results[3]), parseInt(results[4])));
    }
    else {
        return undefined;
    }
}

window.Rectangle.prototype.intersects = function (r2) {
    if (
        this.origin.x < r2.origin.x + r2.size.width
        && this.origin.x + this.size.width > r2.origin.x
        && this.origin.y < r2.origin.y + r2.size.height
        && this.origin.y + this.size.height > r2.origin.y
        )
        {
            return true;
    }
    else {
        return false;
    }
}

window.Rectangle.prototype.unionRect = function (r2, padding) {

    var union = new window.Rectangle();

    var myLL = this.lowerRight();
    var r2LL = r2.lowerRight();

    union.origin.x = Math.min(this.origin.x, r2.origin.x);
    union.origin.y = Math.min(this.origin.y, r2.origin.y);

    var rightX = Math.max(myLL.x, r2LL.x);
    var rightY = Math.max(myLL.y, r2LL.y);

    union.size.width = union.origin.x + rightX;
    union.size.height = union.origin.Y + rightY;

    if (padding != undefined) {
        union.origin.x -= padding;
        union.origin.y -= padding;
        union.size.width += padding * 2;
        union.size.height += padding * 2;
    }

    return union;

}

window.Rectangle.prototype.isValidRect = function() {
    if (
           isNaN(this.origin.x)
        || isNaN(this.origin.y)
        || isNaN(this.size.width)
        || isNaN(this.size.height) ) {
            return false;
    }
    else {
        return true;
    }
}

window.Rectangle.prototype.intersectRect = function(r2) {

    var intersect = new window.Rectangle();

    var myLL = this.lowerRight();
    var r2LL = r2.lowerRight();

    intersect.origin.x = Math.max(this.origin.x, r2.origin.x);
    intersect.origin.y = Math.max(this.origin.y, r2.origin.y);

    var rightX = Math.min(myLL.x, r2LL.x);
    var rightY = Math.min(myLL.y, r2LL.y);

    intersect.size.width = rightX - intersect.origin.x;
    intersect.size.height = rightY - intersect.origin.y;

    if (intersect.size.width <= 0) {
        intersect.size.width = Number.NaN;
    }

    if (intersect.size.height <= 0) {
        intersect.size.height = Number.NaN;
    }

    return intersect;

}

window.Rectangle.prototype.containsPoint = function (p) {
    var ux = this.origin.x + this.size.width;
    var uy = this.origin.y + this.size.height;
    if (p.x >= this.origin.x && p.x <= ux
        && p.y >= this.origin.y && p.y <= uy) {
            return true;
    }
    else {
        return false;
    }
}

window.Rectangle.prototype.equals = function (r2) {
    if (this == undefined || r2 == undefined) {
        return false;
    }
    else {
        return this.origin.x == r2.origin.x
            && this.origin.y == r2.origin.y
            && this.size.width == r2.size.width
            && this.size.height == r2.size.height;
    }
}

window.Rectangle.prototype.asString = function () {
    return "{" + this.origin.asString() + ", " + this.size.asString() + "}";
}



},{}],7:[function(require,module,exports){
window.Size = function (width, height) {
    this.width = width;
    this.height = height;
}

window.Size.prototype.asString = function () {
    return "{" + this.width + ", " + this.height + "}";
}


},{}],8:[function(require,module,exports){
require('./accordion')
require('./vis')
require('./VisContainer')
//require('./Barchart')
//require('./Linechart')
//require('./Piechart')
//require('./Treechart')


},{"./VisContainer":2,"./accordion":3,"./vis":9}],9:[function(require,module,exports){
require('./geometry/geometry_point.js');
require('./geometry/geometry_rectangle.js');
require('./geometry/geometry_size.js');
require('./RGBColor.js');

function uuid () {

    var result = '';
    for (var i = 0; i < 32; i++) {
        result += Math.floor(Math.random()*16).toString(16).toUpperCase();
    }

    return 'uuid-' + result;
}

Vis = React.createClass(
    {displayName: "Vis",

        getInitialState : function() {
            return {
                xDomain : [0, 100],
                yDomain : [0, 100],
                dataset : [],
                transformations : {},
                radialGradients : {},
                linearGradients: {},

                xLabel : '',
                yLabel : '',

                xScaleType      : 'linear',
                yScaleType      : 'linear',

                xIDMap : {},
                yIDMap : {},

            }
        },

        getDefaultProps : function() {

            var tickerFrom = 0;
            var ticker = function() {
                return ++tickerFrom;
            }

            return {
                xGutter     : 20,
                xPadding    : 30,
                yGutter     : 20,
                yPadding    : 30,

                useIDMapping    : false,
                bgColor : 'white',
                scaleXAxis : false,
                scaleYAxis : false,
                scaleAxes  : false,

                useUniqueID : false,

                transitionTime : 1750,
                //ulIcon         : '/root/img/labs_icon.png',
                ulIcon  : '/narrative/static/kbase/js/ui-common/root/img/labs_icon.png',

                ticker : 0,

                radialGradientStopColor : 'black',
                linearGradientStopColor : 'black',

                width  : 100,
                height : 100,

                chartID : uuid(),

                uniqueID : function(d) {
                    if (d.id == undefined) {
                        return ticker();
                    }
                    else {
                        return d.id;
                    }
                },

            }

        },

        setXLabel : function (newXLabel) {
            this.state.xLabel = newXLabel;;
            this.render('xLabel');
        },

        setYLabel : function (newYLabel) {
            this.state.yLabel = newYLabel;;
            this.render('yLabel');
        },

        setXScale : function (newXScale) {
            this.state.xScale =  newXScale;;
            this.render('xAxis');
        },

        setYScale : function (newYScale) {
            this.state.yScale =  newYScale;;
            this.render('yAxis');
        },

        setXScaleDomain : function(domain, scaleType) {
            var xScale = this.state.xScale;

            if (xScale == undefined) {
                if (scaleType == undefined) {
                    scaleType = this.state.xScaleType;
                }

                xScale = d3.scale[scaleType]();

                this.setXScaleRange([0, this.chartBounds().size.width], xScale);
                this.state.xScale = xScale;
            }

            xScale.domain(domain);

            if (this.props.useIDMapping && this.state.xIDMap == undefined) {
                this.state.xIDMap = this.createIDMapForDomain(domain);
            }

            this.render('xAxis');

            return xScale;
        },

        setXScaleRange : function(range, xScale) {
            if (xScale == undefined) {
                xScale = this.state.xScale;
            }
            xScale.range(range);

            return xScale;
        },

        setYScaleDomain : function(domain, scaleType) {
            var yScale = this.state.yScale;

            if (yScale == undefined) {
                if (scaleType == undefined) {
                    scaleType = this.state.yScaleType;
                }
                yScale = d3.scale[scaleType]();

                this.setYScaleRange([0,this.chartBounds().size.height], yScale);
                this.state.yScale = yScale;
            }

            yScale.domain(domain);

            if (this.state.useIDMapping && this.state.yIDMap == undefined) {
                this.state.yIDMap = this.createIDMapForDomain(domain);
            }

            this.render('yAxis');

            return yScale;
        },

        setYScaleRange : function(range, yScale) {
            if (yScale == undefined) {
                yScale = this.state.yScale;
            }
            yScale.range(range);

            return yScale;
        },

        shouldScaleAxis : function (axis) {
            if (this.props.scaleAxes) {
                return true;
            }
            else if (axis == 'x' && this.props.scaleXAxis) {
                return true;
            }
            else if (axis == 'y' && this.props.scaleYAxis) {
                return true;
            }
            else {
                return false;
            }
        },

        /*createIDMapForDomain : function (domain) {
            var map = {};
            $.each(
                domain,
                function (idx, val) {
                    map[idx] = val;
                }
            );
            return map;
        },*/

        region : function(region, asName) {

            var dot = '';

            if (! asName) {
                dot = '.';
            }

            return dot + region + '-' + this.props.chartID;
        },

        ULBounds : function() {
            return new Rectangle(
                new Point(0, 0),
                new Size(this.props.xPadding, this.props.yGutter)
            );
        },

        URBounds : function() {
            return new Rectangle(
                new Point(this.props.xPadding + this.chartBounds().size.width, 0),
                new Size(this.props.xGutter, this.props.yGutter)
            );
        },

        LLBounds : function() {
            return new Rectangle(
                new Point(0, this.props.yGutter + this.chartBounds().size.height),
                new Size(this.props.xPadding, this.props.yPadding)
            );
        },

        LRBounds : function() {
            return new Rectangle(
                new Point(this.props.xPadding + this.chartBounds().size.width, this.props.yGutter + this.chartBounds().size.height),
                new Size(this.props.xGutter, this.props.yPadding)
            );
        },

        xPaddingBounds : function() {
            return new Rectangle(
                new Point(0, this.props.yGutter),
                new Size(this.props.xPadding, this.chartBounds().size.height)
            );
        },

        xGutterBounds : function() {
            return new Rectangle(
                new Point(this.props.xPadding + this.chartBounds().size.width, this.props.yGutter),
                new Size(this.props.xGutter, this.chartBounds().size.height)
            );
        },

        yGutterBounds : function() {
            return new Rectangle(
                new Point(this.props.xPadding, 0),
                new Size(this.chartBounds().size.width, this.props.yGutter)
            );
        },

        yPaddingBounds : function() {
            return new Rectangle(
                new Point(this.props.xPadding, this.props.yGutter + this.chartBounds().size.height),
                new Size(this.chartBounds().size.width, this.props.yPadding)
            );
        },

        chartBounds : function() {

            var widgetWidth  = this.props.width;
            var widgetHeight = this.props.height;

            return new Rectangle(
                new Point(this.props.xPadding, this.props.yGutter),
                new Size(
                    widgetWidth  - this.props.xPadding - this.props.xGutter,
                    widgetHeight - this.props.yGutter  - this.props.yPadding
                )
            );
        },


        D3svg : function() {
            var container = this.getDOMNode();
            var svg = container.getElementsByTagName('svg');
            return(d3.select(svg[0]));
        },

        radialGradient : function(grad) {

            grad = $.extend(
                true,
                {
                    cx : 0,
                    cy : 0,
                    stopColor : this.state.radialGradientStopColor,
                    r : this.chartBounds().size.width / 2,
                },
                grad
            );

            var gradKey = [grad.cx, grad.cy, grad.r, grad.startColor, grad.stopColor].join(',');

            if (this.radialGradients()[gradKey] != undefined && grad.id == undefined) {
                grad.id = this.radialGradients()[gradKey];
            }

            if (grad.id == undefined) {
                grad.id = this.uuid();
            }


            //I'd prefer to .select('.definitions').selectAll('radialGradient') and then just let
            //d3 figure out the one that appropriately maps to my given grad value...but I couldn't
            //get that to work for some inexplicable reason.
            var gradient = this.D3svg().select('.definitions').selectAll('#' + grad.id)
                .data([grad]);

            var newGrad = false;

            gradient
                .enter()
                    .append('radialGradient')
                        .attr('id',
                            //as brilliant as this hack is, it's also godawful. I might as well put a goto here.
                            //this just returns the grad's id, as usual. BUT it also invokes a side effect to set
                            //a global flag (well, enclosing context flag) to say that this is a newly created gradient
                            //so down below we don't use any transition time to set the values. There's gotta be a better
                            //way to do this, but I couldn't figure it out.
                            function(d) {
                                newGrad = true;
                                return d.id
                            }
                        )
                        .attr('gradientUnits', 'userSpaceOnUse')
                        .attr('cx', function (d) {return d.cx})
                        .attr('cy', function (d) {return d.cy})
                        .attr('r', function (d) {return 2.5 * d.r})
                        .attr('spreadMethod', 'pad')
            ;

            var transitionTime = newGrad
                ? 0
                : this.props.transitionTime;

            var stop0 = gradient.selectAll('stop[offset="0%"]').data([grad]);
            stop0.enter()
                .append('stop')
                    .attr('offset', '0%');
            stop0.transition().duration(transitionTime)
                    .attr('stop-color', function (d) { return d.startColor});

            var stop30 = gradient.selectAll('stop[offset="30%"]').data([grad]);
            stop30.enter()
                .append('stop')
                    .attr('offset', '30%')
                    .attr('stop-opacity', 1)
            stop30.transition().duration(transitionTime)
                    .attr('stop-color', function (d) { return d.startColor});

            var stop70 = gradient.selectAll('stop[offset="70%"]').data([grad]);
            stop70.enter()
                .append('stop')
                    .attr('stop-opacity', 1)
                    .attr('offset', '70%');
            stop70.transition().duration(transitionTime)
                    .attr('stop-color', function (d) { return d.stopColor});

            return this.radialGradients()[gradKey] = grad.id;

        },

        linearGradient : function(grad) {

            var chartBounds = this.chartBounds();

            grad = $.extend(
                true,
                {
                    x1 : 0,//chartBounds.origin.x,
                    x2 : 0,//chartBounds.size.width,
                    y1 : chartBounds.size.height,//chartBounds.origin.y,
                    y2 : 0,
                    width : 0,
                    height : chartBounds.size.height,
                },
                grad
            );

            var gradKey = [grad.cx, grad.cy, grad.r, grad.startColor, grad.stopColor].join(',');

            if (this.linearGradients()[gradKey] != undefined && grad.id == undefined) {
                grad.id = this.linearGradients()[gradKey];
            }

            if (grad.id == undefined) {
                grad.id = this.uuid();
            }


            //I'd prefer to .select('.definitions').selectAll('linearGradient') and then just let
            //d3 figure out the one that appropriately maps to my given grad value...but I couldn't
            //get that to work for some inexplicable reason.
            var gradient = this.D3svg().select('.definitions').selectAll('#' + grad.id)
                .data([grad]);

            var newGrad = false;

            gradient
                .enter()
                    .append('linearGradient')
                        .attr('id',
                            //as brilliant as this hack is, it's also godawful. I might as well put a goto here.
                            //this just returns the grad's id, as usual. BUT it also invokes a side effect to set
                            //a global flag (well, enclosing context flag) to say that this is a newly created gradient
                            //so down below we don't use any transition time to set the values. There's gotta be a better
                            //way to do this, but I couldn't figure it out.
                            function(d) {
                                newGrad = true;
                                return d.id
                            }
                        )
                        .attr('gradientUnits', 'userSpaceOnUse')
                        .attr('x1', function (d) {return d.x1})
                        .attr('x2', function (d) {return d.x2})
                        .attr('y1', function (d) {return d.y1})
                        .attr('y2', function (d) {return d.y2})
                        .attr('spreadMethod', 'pad')
            ;

            var transitionTime = newGrad
                ? 0
                : this.props.transitionTime;

            var gradStops = gradient.selectAll('stop').data(grad.colors);

            gradStops
                .enter()
                .append('stop')
            ;

            gradStops
                .transition().duration(transitionTime)
                .attr('offset', function(d, i) {
                    var num = 0;
                    if (i == grad.colors.length - 1) {
                        num = 1;
                    }
                    else if (i > 0) {
                        num = i / (grad.colors.length - 1)
                    }

                 return (Math.round(10000 * num) / 100) + '%' } )
                .attr('stop-color', function (d) { return d })


            return this.linearGradients()[gradKey] = grad.id;

        },

        wrap : function(text, width, xCoord) {

            if (xCoord == undefined) {
                xCoord = function() { return 0;}
            };


            text.each(function() {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy")) || 0,
                    tspan = text
                        .text(null)
                        .append("tspan")
                        .attr("x", xCoord)
                        .attr("y", y)
                        .attr("dy", dy + "em")
                    ;

                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan")
                            .attr("x", xCoord)
                            .attr("y", y).
                            attr("dy", lineHeight + 'em')//++lineNumber * lineHeight + dy + "em")
                            .text(word)
                        ;
                    }
                }
            });
        },

        absPos : function(obj) {

            var box    = obj.getBBox();
            var matrix = obj.getScreenCTM();

            return { x : box.x + matrix.e, y : box.y + matrix.f};
        },


        endall : function (transition, callback) {
            var n = 0;
            transition
                .each(function() { ++n; })
                .each("end", function() { if (!--n) callback.apply(this, arguments); });
        },

        uniqueness : function(uniqueFunc) {
            if (uniqueFunc == undefined) {
                uniqueFunc = this.uniqueID;
            }

            return this.state.useUniqueID
                ? uniqueFunc
                : undefined;
        },

        showToolTip : function(args) {

            if (args.event == undefined) {
                args.event = d3.event;
            }

            d3.selectAll('.visToolTip')
                .style('display','block')
                .html(args.label)
                .style("left", (args.event.pageX+10) + "px")
                .style("top", (args.event.pageY-10) + "px");
        },

        hideToolTip : function(args) {
            d3.selectAll('.visToolTip').style('display', 'none');
        },



        render : function() {

console.log(this.props.ulIcon);

            return (
                React.createElement("div", null, 
                    React.createElement("style", null, 
                        ".axis path, .axis line { fill : none; stroke : black; shape-rendering : crispEdges;} .axis text" + ' ' +
                            "{font-family : sans-serif; font-size : 11px}"
                    ), 
                    React.createElement("svg", {style: {width : this.props.width + 'px', height : this.props.height + 'px'}}

                    ), 

                    React.createElement("div", {className: "visToolTip", style: 
                        {
                            position                : 'absolute',
                            'maxWidth'             : '300px',
                            height                  : 'auto',
                            padding                 : '10px',
                            'backgroundColor'      : 'white',
                            'WebkitBorderRadius' : '10px',
                            'MozBorderRadius'    : '10px',
                            'borderRadius'         : '10px',
                            'WebkitBoxShadow'    : '4px 4px 10px rgba(0, 0, 0, 0.4)',
                            'MozBoxShadow'       : '4px 4px 10px rgba(0, 0, 0, 0.4)',
                            'boxShadow'            : '4px 4px 10px rgba(0, 0, 0, 0.4)',
                            'pointerEvents'        : 'none',
                            'display'               : 'none',
                            'fontFamily'           : 'sans-serif',
                            'fontSize'             : '12px',
                            'lineHeight'           : '20px',
                            'display'               : 'none',
                        }
                    }

                    ), 

                    React.createElement("div", null, "I like it!")
                )
            );
        },

        renderVis : function(field) {

            if (field == undefined || field == 'chart') {
                this.renderChart();
            }

            if (field == undefined || field == 'xAxis') {
                this.renderXAxis();
            }

            if (field == undefined || field == 'yAxis') {
                this.renderYAxis();
            }

            if (field == undefined || field == 'xLabel') {
                this.renderXLabel();
            }

            if (field == undefined || field == 'yLabel') {
                this.renderYLabel();
            }

            if (field == undefined || field == 'ulCorner') {
                this.renderULCorner();
            }

        },

        renderULCorner : function() {

            var ulBounds = this.ULBounds();

            var imgSize = new Size(
                ulBounds.size.width,
                ulBounds.size.height
            );

            var inset = 5;

            imgSize.width  -= inset;
            imgSize.height -= inset;

            if (imgSize.width > imgSize.height) {
                imgSize.width = imgSize.height;
            }
            else if (imgSize.height > imgSize.width) {
                imgSize.height = imgSize.width;
            }

            if (imgSize.width < 25) {
                return;
            }

            var ulDataset = [this.state.ulIcon];

            if (this.state.ulIcon) {
                var ulLabel = this.D3svg().select( this.region('UL') ).selectAll('.ULLabel');

                ulLabel
                    .data(ulDataset)
                    .enter()
                        .append('image')
                            .attr('x', inset / 2)
                            .attr('y', inset / 2)
                            .attr('width', imgSize.width)
                            .attr('height', imgSize.height)
                            .attr('xlink:href', function(d) { return d})
            }
        },

        renderXLabel : function() {
            var yGutterBounds = this.yGutterBounds();

            var xLabeldataset = [this.state.xLabel];

            var xLabel = this.D3svg().select( this.region('yGutter') ).selectAll('.xLabel');
            xLabel
                .data(xLabeldataset)
                    .text( this.state.xLabel )
                .enter()
                    .append('text')
                        .attr('class', 'xLabel')
                        .attr('x', yGutterBounds.size.width / 2)
                        .attr('y', yGutterBounds.size.height / 2 + 3)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', '11px')
                        .attr('font-family', 'sans-serif')
                        .attr('fill', 'black')
                        .text(this.state.xLabel);
            ;

        },

        renderYLabel : function() {

            var xGutterBounds = this.xGutterBounds();

            var yLabeldataset = [this.state.yLabel];

            var xLabel = this.D3svg().select( this.region('xGutter') ).selectAll('.yLabel');
            xLabel
                .data(yLabeldataset)
                    .text( this.state.yLabel )
                .enter()
                    .append('text')
                        .attr('class', 'yLabel')
                        .attr('x', xGutterBounds.size.width / 2)
                        .attr('y', xGutterBounds.size.height / 2 + 3)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', '11px')
                        .attr('font-family', 'sans-serif')
                        .attr('fill', 'black')
                        .attr('transform', 'rotate(90,'
                            + (xGutterBounds.size.width / 2 - 7)
                            + ','
                            + xGutterBounds.size.height / 2
                            + ')')
                        .text(this.state.yLabel);
            ;

        },

        xTickValues : function() {
            return;
        },

        xTickLabel : function(val) {
            return val;
        },

        renderXAxis : function() {

            var $self = this;

            if (this.state.xScale == undefined || this.state.xScale.domain == undefined) {
                return;
            }

            var xAxis =
                d3.svg.axis()
                    .scale(this.state.xScale)
                    .orient('bottom');

            var ticks = this.state.xTickValues;

            if (ticks != undefined) {
                xAxis
                    .tickValues(ticks)
                    .tickSubdivide(0)
                    .tickFormat( function(d) { return $self.xTickLabel.call($self, d) } )
                ;
            }

            var gxAxis = this.D3svg().select( this.region('yPadding') ).select('.xAxis');

            if (gxAxis[0][0] == undefined) {
                gxAxis = this.D3svg().select( this.region('yPadding') )
                    .append('g')
                        .attr('class', 'xAxis axis')
            }

            gxAxis.transition().call(xAxis);
console.log("SCALE " , this.state.xScale(0));
        },



        renderYAxis : function() {

            if (this.state.yScale == undefined) {
                return;
            }

            var yAxis =
                d3.svg.axis()
                    .scale(this.state.yScale)
                    .orient('left');

            var gyAxis = this.D3svg().select( this.region('xPadding') ).select('.yAxis');

            if (gyAxis[0][0] == undefined) {
                gyAxis = this.D3svg().select( this.region('xPadding') )
                    .append('g')
                        .attr('class', 'yAxis axis')
                        .attr("transform", "translate(" + this.xPaddingBounds().size.width + ",0)")
            }

            gyAxis.transition().call(yAxis);
        },

        renderChart : function() { },

        shouldComponentUpdate: function(props) {
            // XXX needs to defer to d3 for drawing
            return false;
        },

        componentDidMount: function() {
            console.log("IT MOUNTED", this.D3svg());

            var D3svg = this.D3svg();

            /*
                    +------------------------+
                    | UL|   yGutter      |UR |
                    +------------------------+
                    | X |   chart        | X |
                    | P |                | G |
                    +------------------------+
                    | LL|   yPadding     |LR |
                    +------------------------+
            */

            var regions = [
                'chart', //add the chart first, because we want it to be at the lowest level.
                'UL','UR','LL','LR', //corners are low priority
                'yGutter','xGutter','yPadding','xPadding'   //labels win
            ];

            //used when debug is on.
            var colors = [
                'red',      'green',    'blue',
                'cyan',     'magenta',  'yellow',
                'purple',   'orange',   'gray'
            ];

            D3svg.selectAll('defs').data([null]).enter().append('defs').attr('class', 'definitions');

            var $vis = this;

            var regionG = D3svg.selectAll('g')
                .data(regions)
                .enter()
                    .append('g')
                        .attr('class', function(region) { return region } )
                        .attr('data-x', $.proxy(function(region) { var bounds = this[region + 'Bounds'](); return bounds.origin.x }, this) )
                        .attr('data-y', $.proxy(function(region) { var bounds = this[region + 'Bounds'](); return bounds.origin.y }, this) )
                        .attr('data-width',  $.proxy(function(region) { var bounds = this[region + 'Bounds'](); return bounds.size.width }, this) )
                        .attr('data-height', $.proxy(function(region) { var bounds = this[region + 'Bounds'](); return bounds.size.height }, this) )
                        .attr('transform',
                            $.proxy(
                                function(region) {
                                    var bounds = this[region + 'Bounds']();
                                    return 'translate(' + bounds.origin.x + ',' + bounds.origin.y + ')';
                                }, this)
                        );

            regionG
                .append('rect')
                    .attr('x', 0 )
                    .attr('y', 0 )
                    .attr('width',  $.proxy(function(region) { var bounds = this[region + 'Bounds'](); return bounds.size.width }, this) )
                    .attr('height', $.proxy(function(region) { var bounds = this[region + 'Bounds'](); return bounds.size.height }, this) )
                    .attr('fill', function(d) {return $vis.props.debug ? colors.shift() : $vis.props.bgColor})
                    .attr('class', 'background');

            $.each(
                regions,
                function (idx, region) {

                    D3svg.selectAll('.' + region).selectAll('g').data([{region : $vis.region(region, true), r: region}], function (d) { return d.region })
                        .enter()
                            .append('g')
                            .attr('class', function(d) { return d.region})
                            .attr('transform', function(d) {

                                var transform = $vis.state.transformations[d.r] || $vis.state.transformations.global;
                                if (transform == undefined) {
                                    return;
                                }

                                transform = $.extend(true, { translate : { x : 0, y : 0}, scale : {width : 1, height : 1} }, transform );

                                return 'translate(' + transform.translate.x + ',' + transform.translate.y + ')'
                                    + ' scale(' + transform.scale.width + ',' + transform.scale.height + ')';
                            })
                }
            );

this.state.xScale = d3.scale.linear().domain([0,100]).range([0, this.chartBounds().size.width]);
this.state.yScale = d3.scale.linear().domain([0,100]).range([this.chartBounds().size.height, 0]);

            this.renderVis();

        },
    }
);


},{"./RGBColor.js":1,"./geometry/geometry_point.js":5,"./geometry/geometry_rectangle.js":6,"./geometry/geometry_size.js":7}]},{},[8]);
