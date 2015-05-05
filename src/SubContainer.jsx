SubContainer = React.createClass(
    {
        getInitialState : function () {
            return {
                content : this.props.state || 'No content'
            }
        },

        render : function() {

            return(
                <div>{ this.state.content } { this.props.content }</div>
            );

        },

    }
);
