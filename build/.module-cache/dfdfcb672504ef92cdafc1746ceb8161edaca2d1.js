var Accordion = React.createClass(
    {displayName: "Accordion",
        render : function() {

            var style = {};//{fontWeight : 'bold'};

            var panels = this.props.panels.map( function (panel, i) {
                return ( React.createElement(AccordionPanel, {title: panel.title, body: panel.body}) );
            });

console.log("ACC", this.props.panels);
            return (
                React.createElement("div", {className: "accordion panel-group", style: style}, 
                    panels 
                )
            );
        }
    }
);
