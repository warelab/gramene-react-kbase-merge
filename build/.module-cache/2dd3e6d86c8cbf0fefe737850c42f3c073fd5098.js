var Accordion = React.createClass(
    {displayName: "Accordion",
        render : function() {

            var style = {};//{fontWeight : 'bold'};

            return (
                React.createElement("div", {className: "accordion panel-group", style: style}, 
                    React.createElement(AccordionPanel, null), 
                    React.createElement(AccordionPanel, null), 
                    React.createElement(AccordionPanel, null)
                )
            );
        }
    }
);
