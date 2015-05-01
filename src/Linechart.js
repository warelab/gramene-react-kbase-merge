require('./VisContainer');

Linechart = React.createClass(
    {

        render : function() {

            return (
                <VisContainer kbVis = 'kbaseLinechart' options = {this.props}></VisContainer>
            );

        },

        shouldComponentUpdate: function(props) {
            return false;
        },


    }
);
