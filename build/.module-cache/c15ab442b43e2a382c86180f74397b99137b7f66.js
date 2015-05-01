var AccordionPanel = React.createClass(
    {displayName: "AccordionPanel",
        render : function() {

            var style = {fontWeight : 'bold'};

            return (
                React.createElement("div", {class: "panel panel-default"}, 
                    React.createElement("div", {class: "panel-heading", role: "tab", id: "headingOne"}, 
                        React.createElement("h4", {class: "panel-title"}, 
                            React.createElement("a", {"data-toggle": "collapse", "data-parent": "#accordion", href: "#collapseOne", "aria-expanded": "true", "aria-controls": "collapseOne"}, 
                                "Collapsible Group Item #1"
                            )
                        )
                    ), 
                    React.createElement("div", {id: "collapseOne", class: "panel-collapse collapse in", role: "tabpanel", "aria-labelledby": "headingOne"}, 
                        React.createElement("div", {class: "panel-body"}, 
                            "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS."
                        )
                    )
                )
            );
        }
    }
);
