var WDAccordion = React.createClass(
    {
        displayName : 'WLAccordion',
        render : function() {

            var style = {fontWeight : 'bold'};

            return (
                React.createElement("div", {className: "accordion", style: style}, "This is the accordion")
            );
        }
    }
);
