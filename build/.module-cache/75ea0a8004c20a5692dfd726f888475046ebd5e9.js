var AccordionPanel = React.createClass(
    {displayName: "AccordionPanel",

        handleClick : function(e) {
            e.preventDefault(); e.stopPropagation();

            var $opened = $(this).closest('.panel').find('.in');
            var $target = $(this).next();

            if ($opened != undefined) {
                $opened.collapse('hide');
                var $i = $opened.parent().first().find('i');
                $i.removeClass('fa fa-chevron-down');
                $i.addClass('fa fa-chevron-right');
            }

            if ($target.get(0) != $opened.get(0)) {
                $target.collapse('show');
                var $i = $(this).parent().find('i');
                $i.removeClass('fa fa-chevron-right');
                $i.addClass('fa fa-chevron-down');
            }
        },

        render : function() {

            var style = {fontWeight : 'bold'};
console.log("ACC PAN");
            return (
                React.createElement("div", {className: "panel panel-default", style: { marginBottom : '2px'}}, 
                    React.createElement("div", {className: "panel-heading", role: "tab", style: {padding : '0px'}, onClick: this.handleClick}, 
                        React.createElement("i", {className: "fa fa-chevron-right pull-left", 
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
                    React.createElement("div", {className: "panel-collapse collapse in", role: "tabpanel"}, 
                        React.createElement("div", {className: "panel-body"}, 
                             this.props.body
                        )
                    )
                )
            );
        }
    }
);
