var Tree = window.Tree;
var Vis = window.Vis;
console.log("IN ON TREE");
console.log("TREE BE ", Tree);
var t1 = new Tree();
console.log("T1 is ", t1);
var taxonomyGetter = require('gramene-taxonomy-with-genomes');
console.log("TG", taxonomyGetter);
taxonomyGetter.get().then(function (taxonomy) {
console.log("TGOT", taxonomy);
console.log("STILL HAS TREE", Tree);
    var t = new Tree( { dataset : taxonomy} );
console.log('constructed');
    console.log("MY TREE IS ", t);
console.log("RENDER INTO ",         document.getElementById('tree1'));

    React.render(
        React.createElement(
            Vis,
            {
                width : 1000,
                height : 1000,
                vis : t
            }
        ),
        document.getElementById('tree1')
    );


});

