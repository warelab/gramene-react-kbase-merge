AccordionPanel = React.createClass(
    {


        handleClick : function(e) {
            e.preventDefault(); e.stopPropagation();

            /*var $me = $(e.target).closest('.panel-heading');

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
            }*/
console.log(this.props);
            this.props.accordion.toggleOpen(this.props.idx);
            //setState( { open : ! this.state.open } );
        },

        render : function() {

            var style = {fontWeight : 'bold'};
console.log("ACC PANIC", this.state, this.props);

            var chevronClass = 'fa pull-left ';
            chevronClass += this.props.initialOpen ? 'fa-chevron-down' : 'fa-chevron-right';

            var bodyClass = 'panel-body collapse ';
            bodyClass += this.props.initialOpen ? 'in' : '';

            return (
                <div className="panel panel-default" style = {{ marginBottom : '2px'}} >
                    <div className="panel-heading" role="tab" style = {{padding : '0px'}} onClick = {this.handleClick}>
                        <i className = {chevronClass}
                            style = {{
                                marginRight : '5px',
                                marginLeft : '3px',
                                height : '22px',
                                lineHeight : '22px',
                                color : 'gray'
                            }} ></i>
                        <a href = '#'
                            title = { this.props.title }
                            style = {{
                                padding : '0px',
                                height : '22px',
                                lineHeight : '22px',
                            }} >
                            { this.props.title }
                        </a>
                    </div>
                    <div className = {bodyClass} >
                        { this.props.body }
                    </div>
                </div>
            );
        }
    }
);
