var AccordionPanel = React.createClass(
    {displayName: "AccordionPanel",
        render : function() {

            var style = {fontWeight : 'bold'};

            return (
                React.createElement("div", {className: "panel panel-default"}, 
                    React.createElement("div", {className: "panel-heading", role: "tab", id: "headingOne"}, 
                        React.createElement("h4", {className: "panel-title"}, 
                            React.createElement("a", {"data-toggle": "collapse", "data-parent": "#accordion", href: "#collapseOne", "aria-expanded": "true", "aria-controls": "collapseOne"}, 
                                 props.title
                            )
                        )
                    ), 
                    React.createElement("div", {id: "collapseOne", className: "panel-collapse collapse in", role: "tabpanel", "aria-labelledby": "headingOne"}, 
                        React.createElement("div", {className: "panel-body"}, 
                             props.body
                        )
                    )
                )
            );
        }
    }
);
