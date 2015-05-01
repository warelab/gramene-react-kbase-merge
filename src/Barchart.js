require('./VisContainer');

Barchart = React.createClass(
    {

        render : function() {

            return (
                <VisContainer kbVis = 'kbaseBarchart' options = {this.props}></VisContainer>
            );

        },



        shouldComponentUpdate: function(props) {
            return false;
        },


    }
);
