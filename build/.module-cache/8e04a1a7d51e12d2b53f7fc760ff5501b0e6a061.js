var AccordionPanel = React.createClass(
    {displayName: "AccordionPanel",

        getInitialState : function() {
        console.log("gIS", this.props);
            return { open : this.props.initialOpen || false };
        },

        handleClick : function(e) {
            e.preventDefault(); e.stopPropagation();

            this.setState({open : ! this.state.open});

        },

        render : function() {

            var style = {fontWeight : 'bold'};
console.log("ACC PAN", this.state);

            var chevronClass = 'fa pull-left ';
            chevronClass += this.state.open ? 'fa-chevron-down' : 'fa-chevron-right';

            var bodyClass = 'panel-body collapse ';
            bodyClass += this.state.open ? 'in' : '';

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
