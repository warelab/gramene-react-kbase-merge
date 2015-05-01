require('./VisContainer');

Treechart = React.createClass(
    {

        render : function() {

            return (
                <VisContainer kbVis = 'kbaseTreechart' options = {this.props}></VisContainer>
            );

        },

        shouldComponentUpdate: function(props) {
            return false;
        },


    }
);
