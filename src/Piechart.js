require('./VisContainer');

Piechart = React.createClass(
    {

        render : function() {

            return (
                <VisContainer kbVis = 'kbasePiechart' options = {this.props}></VisContainer>
            );

        },

        shouldComponentUpdate: function(props) {
            return false;
        },


    }
);
