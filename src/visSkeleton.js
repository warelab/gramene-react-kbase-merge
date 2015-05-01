require('./vis.js');

function uuid () {

    var result = '';
    for (var i = 0; i < 32; i++) {
        result += Math.floor(Math.random()*16).toString(16).toUpperCase();
    }

    return 'uuid-' + result;
}

NAMEOFYOURVISTHINGY = React.createClass(
    {

        getInitialState : function() {
            return {

            }
        },

        getDefaultProps : function() {

            return {

            }

        },



        render : function() {

            var vis = React.createElement(Vis, this.props);
            this.state.vis = vis;

        },


        renderULCorner : function() {


        },

        renderXLabel : function() {

        },

        renderYLabel : function() {

        },


        renderXAxis : function() {

        },



        renderYAxis : function() {

        },

        renderChart : function() { },

        shouldComponentUpdate: function(props) {
            // XXX needs to defer to d3 for drawing
            return false;
        },

        componentDidMount: function() {

            this.renderVis();

        },
    }
);
