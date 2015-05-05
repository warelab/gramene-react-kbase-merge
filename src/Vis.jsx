var Point = require('./geometry/geometry_point.js');
var Rectangle = require('./geometry/geometry_rectangle.js');
var Size = require('./geometry/geometry_size.js');
var RGBColor = require('./RGBColor.js');

function uuid () {

    var result = '';
    for (var i = 0; i < 32; i++) {
        result += Math.floor(Math.random()*16).toString(16).toUpperCase();
    }

    return 'uuid-' + result;
}

Vis = React.createClass(
    {

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
                debug       : false,
                xGutter     : 20,
                xPadding    : 30,
                yGutter     : 20,
                yPadding    : 30,

                useIDMapping    : false,
                bgColor : 'none',
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

        createIDMapForDomain : function (domain) {
            var map = {};
            $.each(
                domain,
                function (idx, val) {
                    map[idx] = val;
                }
            );
            return map;
        },

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

    var ret = new Rectangle(
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

            return (
                <div style = {{width : this.props.width + 'px', height : this.props.height + 'px'}}>
                    <style>
                        .axis path, .axis line &#123; fill : none; stroke : black; shape-rendering : crispEdges;&#125; .axis text
                            &#123;font-family : sans-serif; font-size : 11px&#125;
                    </style>
                    <svg style = {{width : '100%', height : '100%'}}>

                    </svg>

                    <div className = 'visToolTip' style = {
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
                    }>

                    </div>

                </div>
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

//this.state.xScale = d3.scale.linear().domain([0,100]).range([0, this.chartBounds().size.width]);
//this.state.yScale = d3.scale.linear().domain([0,100]).range([this.chartBounds().size.height, 0]);

            this.renderVis();
this.props.vis.set(
    {
        $elem : this.getDOMNode(),
        D3svg : D3svg,
        component : this,
    }
);

            console.log("RV", this.props.vis);
this.props.vis.renderChart();

        },
    }
);
window.Vis = Vis;
module.exports = Vis;
