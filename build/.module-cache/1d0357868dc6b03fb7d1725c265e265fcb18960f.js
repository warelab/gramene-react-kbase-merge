var AccordionPanel = React.createClass(
    {displayName: "AccordionPanel",
        render : function() {

            var style = {fontWeight : 'bold'};
console.log("ACC PAN");
            return (
                React.createElement("div", {className: "panel panel-default"}, 
                    React.createElement("div", {className: "panel-heading", role: "tab", id: "headingOne", style: {padding : '0px'}}, 
                        React.createElement("i", {className: "fa fa-chevron-right pull-left", 
                            style: {
                                marginRight : '5px',
                                marginLeft : '3px',

                                color : 'gray'
                            }}), 
                        React.createElement("a", {href: "#", 
                            style: {
                                padding : '0px',
                                title : this.props.title,

                            }}, 
                             this.props.title
                        )
                    ), 
                    React.createElement("div", {id: "collapseOne", className: "panel-collapse collapse in", role: "tabpanel", "aria-labelledby": "headingOne"}, 
                        React.createElement("div", {className: "panel-body"}, 
                             this.props.body
                        )
                    )
                )
            );
        }
    }
);
