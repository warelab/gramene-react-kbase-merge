var AccordionPanel = React.createClass(
    {displayName: "AccordionPanel",

        getInitialState : function() {
        console.log("gIS", this.props);
            return { open : this.props.initialOpen || false };
        },

        handleClick : function(e) {
            e.preventDefault(); e.stopPropagation();

            //

            var $me = $(e.target).closest('.panel-heading');

            var $opened = $me.closest('.panel').find('.in');
            var $target = $me.next();

            if ($opened != undefined) {
                $opened.collapse('hide');
                var $i = $opened.parent().first().find('i');
                $i.removeClass('fa fa-chevron-down');
                $i.addClass('fa fa-chevron-right');
            }

            if ($target.get(0) != $opened.get(0)) {
                $target.collapse('show');
                var $i = $me.parent().find('i');
                $i.removeClass('fa fa-chevron-right');
                $i.addClass('fa fa-chevron-down');
            }

            //this.setState( { open : ! this.state.open } );
        },

        render : function() {

            var style = {fontWeight : 'bold'};
console.log("ACC PAN", this.state);

            var chevronClass = 'fa pull-left ';
            chevronClass += this.state.open ? 'fa-chevron-down' : 'fa-chevron-right';

            var bodyClass = 'panel-body collapse ';
            bodyClass += this.state.open ? 'in' : '';

            return (
                React.createElement("div", {className: "panel panel-default", style: { marginBottom : '2px'}}, 
                    React.createElement("div", {className: "panel-heading", role: "tab", style: {padding : '0px'}, onClick: this.handleClick}, 
                        React.createElement("i", {className: chevronClass, 
                            style: {
                                marginRight : '5px',
                                marginLeft : '3px',
                                height : '22px',
                                lineHeight : '22px',
                                color : 'gray'
                            }}), 
                        React.createElement("a", {href: "#", 
                            title:  this.props.title, 
                            style: {
                                padding : '0px',
                                height : '22px',
                                lineHeight : '22px',
                            }}, 
                             this.props.title
                        )
                    ), 
                    React.createElement("div", {className: bodyClass}, 
                         this.props.body
                    )
                )
            );
        }
    }
);
