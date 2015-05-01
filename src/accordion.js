require('./accordionPanel') ;

Accordion = React.createClass(
    {

        getInitialState : function() {

            var state = {};
            state.initialOpen = [];

            state.initialOpen = this.props.panels.map(function(panel, i) {
                return panel.initialOpen || false;
            });

            return state;

        },

        toggleOpen : function(idx) {
            console.log("TOGGLES AT ", idx, this.props.panels);

            var io = this.state.initialOpen;
            io[idx] = ! io[idx];
            this.setState({initialOpen : io});

            //this.props.panels[idx].initialOpen = ! this.props.panels[idx].initialOpen;
            //this.forceUpdate();
        },

        render : function() {

            var accordion = this;

            var style = {};//{fontWeight : 'bold'};
console.log('ACC INIT', this.props, this.state);
            var panels = this.props.panels.map( function (panel, i) {
            console.log("RENDER PANEL", panel);
                return ( <AccordionPanel
                    title = {panel.title}
                    body = {panel.body}
                    initialOpen = {accordion.state.initialOpen[i]}
                    accordion = { accordion }
                    idx = { i } /> );
            });

console.log("ACC", this.props.panels);
            return (
                <div className = 'accordion' style = {style}>
                    { panels }
                </div>
            );
        }
    }
);
