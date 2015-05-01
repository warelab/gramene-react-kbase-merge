var Accordion = React.createClass(
    {displayName: "Accordion",
        render : function() {

            var style = {};//{fontWeight : 'bold'};

console.log("ACC");
            return (
                React.createElement("div", {className: "accordion panel-group", style: style}, 
                     this.props.panels.map( function (panel, i) {
TIT : { panel.title }
                    })
                )
            );
        }
    }
);
