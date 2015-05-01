var Accordion = React.createClass(
    {displayName: "Accordion",
        render : function() {

            var style = {};//{fontWeight : 'bold'};


            return (
                React.createElement("div", {className: "accordion panel-group", style: style}, 
                     this.props.panels.map( function (panel, i) {
                        React.createElement(AccordionPanel, {title: panel.title, body: panel.body})
                    })
                )
            );
        }
    }
);
