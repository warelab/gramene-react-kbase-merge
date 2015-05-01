var AccordionPanel = React.createClass(
    {displayName: "AccordionPanel",

        handleClick : function(e) {
            e.preventDefault(); e.stopPropagation();
            console.log("I CLICKED IT");
        },

        render : function() {

            var style = {fontWeight : 'bold'};
console.log("ACC PAN");
            return (
                React.createElement("div", {className: "panel panel-default"}, 
                    React.createElement("div", {className: "panel-heading", role: "tab", id: "headingOne", style: {padding : '0px'}, onClick: this.handleClick}, 
                        React.createElement("i", {className: "fa fa-chevron-right pull-left", 
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
                    React.createElement("div", {className: "panel-collapse collapse in", role: "tabpanel", "aria-labelledby": "headingOne"}, 
                        React.createElement("div", {className: "panel-body"}, 
                             this.props.body
                        )
                    )
                )
            );
        }
    }
);
