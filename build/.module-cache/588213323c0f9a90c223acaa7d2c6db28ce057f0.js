var AccordionPanel = React.createClass(
    {displayName: "AccordionPanel",
        render : function() {

            var style = {fontWeight : 'bold'};
console.log("ACC PAN");
            return (
                React.createElement("div", {className: "panel panel-default"}, 
                    React.createElement("div", {className: "panel-heading", role: "tab", id: "headingOne", style: {padding : '0px'}}, 
                        React.createElement("a", {"data-toggle": "collapse", "data-parent": "#accordion", href: "#collapseOne", "aria-expanded": "true", "aria-controls": "collapseOne"}, 
                            React.createElement("i", {className: "fa fa-chevron-right pull-left", 
                                style: {
                                    marginRight : '5px',
                                    marginLeft : '3px',
                                    height : '22px',
                                    lineHeight : '22px',
                                    color : 'gray'
                                }}), 
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
