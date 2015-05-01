var Accordion = React.createClass(
    {displayName: "Accordion",
        render : function() {

            var style = {};//{fontWeight : 'bold'};

            var panels = [];
            for (var i = 0; i < this.props.panels.length; i++) {
                var panel = this.props.panels[i];
                panels.push(React.createElement(AccordionPanel, {title: panel.title, body: panel.body}));
            }

            return (
                React.createElement("div", {className: "accordion panel-group", style: style}, 
                    panels 
                )
            );
        }
    }
);
