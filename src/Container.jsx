Container = React.createClass(
    {

        render : function() {

            return(
                <ul>
                    This is the container
                    <SubContainer content = 'outer'></SubContainer>
                    { React.Children.map(
                        this.props.children,
                        function(child) {
                            console.log(child);

                            var state = child.props.content;
                            state = state == 'a'
                                ? undefined
                                : state;

                            return React.addons.cloneWithProps(child,
                                { state : state}
                            );
                        }
                    ) }
                    <SubContainer content = 'after'></SubContainer>
                </ul>
            );

        },

    }
);
