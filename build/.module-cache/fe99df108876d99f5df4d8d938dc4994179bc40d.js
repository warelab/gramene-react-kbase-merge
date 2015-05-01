var Accordion = React.createClass(
    {
        displayName : 'Accordion',
        render : function() {

            var style = {fontWeight : 'bold'};

            return (
                React.createElement("div", {className: "accordion", style: style}, "This is the accordion")
            );
        }
    }
);
