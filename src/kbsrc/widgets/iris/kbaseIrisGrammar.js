/*


*/
define('kbaseIrisGrammar',
    [
        'jquery',
        'kbwidget',
    ],
    function ($) {


    $.KBWidget({

		  name: "kbaseIrisGrammar",

        version: "1.0.0",
        options: {
            defaultGrammarURL : document.URL.replace('iris.html', 'grammar.json'),
        },

        init: function(options) {

            this._super(options);

            if (this.options.defaultGrammarURL.match(/^file:\/\//)) {
                this.options.defaultGrammarURL = 'grammar.json';
            }

            if (this.options.$loginbox != undefined) {
                this.$loginbox = this.options.$loginbox;
            }

            this.appendUI( $( this.$elem ) );

            this.retrieveGrammar(this.options.defaultGrammarURL);

            return this;

        },

        appendUI : function($elem) {

        },

        detokenize : function (tokens) {

            var detokenized = '';

            //comments are a special case. Parse out nothing.
            if (tokens.length && ! $.isArray(tokens[0]) && tokens[0].match(/^\s*#/)) {
                return tokens[0];
            }

            if (tokens.forceString == undefined) {
                tokens.forceString = {};
            }

            for (var idx = 0; idx < tokens.length; idx++) {
                var token = tokens[idx];
                if ($.isArray(token)) {
                    detokenized += this.detokenize(token) + ';';
                }
                else {
                    //pipes are a frustrating special case. Quote the string if it has a pipe, as long as it is not a pipe.
                    if (token.match(/[\s;|]/) && token != '|' || tokens.forceString[idx]) {
                        if (token.match(/"/) && ! token.match(/\\"/)) {
                            detokenized += " '" + token + "'";
                        }
                        else {
                            detokenized += ' "' + token + '"';
                        }
                    }
                    else {
                        if (token.length) {
                            detokenized += ' ' + token;
                        }
                        else {
                            detokenized += " ''";
                        }
                    }
                }
            }

            if (detokenized.match(/;$/)) {
                detokenized = detokenized.substring(0, detokenized.length - 1);
            }

            if (detokenized.match(/^ /)) {
                detokenized = detokenized.substring(1, detokenized.length);
            }

            return detokenized;

        },

        tokenize : function(string) {

            var tokens = [];
            tokens.forceString = {};
            var partial = '';
            var quote = undefined;
            var escaped = false;
            var tokensList = [];
            var lastRedirectChar = false;
            var lastChr = '';

            //nothing given? Nothing returned.
            if (string == undefined || ! string.length) {
                return tokens;
            }

            //comments are a special case. Parse out nothing.
            if (string.match(/^\s*#/)) {
                tokens.push(string);
                return tokens;
            }

            for (var idx = 0; idx < string.length; idx++) {
                var chr = string.charAt(idx);

                if (quote == undefined) {
                    if (chr.match(/[?;\n]/)) {

                        if (partial.length) {
                            tokens.push(partial);
                            partial = '';
                        }

                        if (tokens.length) {
                            tokensList.push(tokens);
                            tokens = [];
                            tokens.forceString = {};
                        }
                        lastChr = chr;
                        continue;
                    }
                }

                if (chr.match(/\S/) || quote != undefined) {

                    var isRedirectChar = chr.match(/[\|><]/)
                        ? true
                        : false;

                    var isKBid = false;
                    if (partial.match(/kb$/) && chr == '|' || partial.match(/kb\|$/)  ) {
                        isKBid = true;
                    }

                    //Fine. We need to deal with appending and STDERR redirects.
                    if (chr == '>' && partial != undefined && partial.match(/((^|\s)2|>)$/)
                        && ! quote && ! isKBid) {
                        partial += chr;
                        lastRedirectChar = isRedirectChar;
                        continue;
                    }

                    if ( (isRedirectChar || lastRedirectChar) && ! quote && ! isKBid) {
                        if (partial.length) {
                            tokens.push(partial);
                        }
                        partial = chr;
                    }
                    else {
                        partial += chr;
                    }

                    lastRedirectChar = isRedirectChar;

                }
                else {
                    if (partial.length) {
                        tokens.push(partial);
                        partial = '';
                    }
                    lastChr = chr;
                    continue;
                }

                if (quote != undefined) {

                    if (chr == quote && ! escaped) {
                        //I want to revisit commenting this out to potentially add the ability to echo redirect chars
                        //also not to alter original quotes at all. Or maybe it should be an object with an explicit string
                        //flag set? I'm not completely sure.
                        partial = partial.substring(1, partial.length - 1);
                        tokens.push(partial);
                        tokens.forceString[tokens.length - 1] = true;
                        partial = '';
                        quote = undefined;
                        lastChr = chr;
                        continue;
                    }

                }

                if (quote == undefined && lastChr.match(/\s/) ) {
                    if (chr == '"' || chr == "'") {
                        quote = chr;
                    }
                }

                if (chr == '\\') {
                    escaped = true;
                }
                else {
                    escaped = false;
                }

                lastChr = chr;

            }

            if (partial.length) {
                tokens.push(partial)
            }

            if (tokensList.length && tokens.length) {
                tokensList.push(tokens);
            }

            return tokensList.length
                ? tokensList
                : tokens;
        },


        //IMPORTANT NOTE! WE CAN CURRENTLY -ONLY- EVALUATE SINGLE COMMAND QUESTIONS
        //IF YOU PASS IN A TOKENIZED LIST OF TOKENS (; or / delimited), IT WILL -ONLY-
        //EVALUATE THE FIRST ONE
        evaluate : function (string, callback) {

            var tokens  = this.tokenize(string);
            var grammar = this.grammar;

            if (grammar == undefined) {
                this.retrieveGrammar(this.options.defaultGrammarURL, $.proxy(function() {this.evaluate(string, callback); }, this));
                return;
            }

            //grammar = grammar._root;

            var execute = undefined;
            var tokenVariables = undefined;

            var variables = {};

            var returnObj = {
                parsed : '',
                string : string,
                grammar : grammar._root,
            };

            // XXX ONLY EVALUATE FIRST QUESTION.
            if ($.isArray(tokens[0])) {
                tokens = tokens[0];
                tokens.forceString = {};
            }

            if (tokens[0] == 'explain') {
                tokens.shift();
                returnObj.explain = 1;
            }

            for (var idx = 0; idx < tokens.length; idx++) {

                var token = tokens[idx];
                var childFound = false;

                for (child in returnObj.grammar.children) {

                    var info = returnObj.grammar.children[child];

                    if (info.regex && token.match(info.regex)) {
                        returnObj.grammar = returnObj.grammar.children[child];
                        childFound = true
                    }
                    else if (child.match(/^\$/)) {
                        returnObj.grammar = returnObj.grammar.children[child];
                        childFound = true;
                    }

                    else if (token == child) {
                        returnObj.grammar = returnObj.grammar.children[child];
                        childFound = true;
                    }
                    else if (! info.caseSensitive) {
                        var regex = new RegExp('^' + child + '$', 'i');
                        if (token.match(regex)) {
                            returnObj.grammar = returnObj.grammar.children[child];
                            childFound = true;
                        }
                    }

                    if (childFound) {
                        if (child.match(/^\$/)) {
                            variables[child] = token;
                        }

                        if (returnObj.parsed.length) {
                            returnObj.parsed += ' ' + token;
                        }
                        else {
                            returnObj.parsed = token;
                        }

                        returnObj.grammar = info;
                        returnObj.execute = info.execute;
                        break;
                    }

                }
                if (! childFound && ! returnObj.grammar.childrenOptional) {
                    returnObj.tail = tokens.splice(idx, tokens.length - idx).join(' ');
                    break;
                }
            }

            if (returnObj.grammar.children != undefined && Object.keys(returnObj.grammar.children).length && ! returnObj.grammar.childrenOptional) {
                returnObj.error = "Parse error at " + token;
                returnObj.fail = 1;
                delete returnObj.execute;
                returnObj.token = token;
                returnObj.tail = tokens.splice(idx, tokens.length - idx).join(' ');
                var next = [];
                if (returnObj.grammar.children != undefined) {
                    for (prop in returnObj.grammar.children) {
                        //next.push(prop);
                        next.push(this.nextForGrammar(prop, returnObj.grammar.children));
                    }
                }
                returnObj.next = next.sort();

                if (callback) {
                    callback(returnObj);
                }
                return returnObj;

            }


            returnObj.rawExecute = returnObj.execute;
            for (var variable in variables) {
                returnObj.execute = returnObj.execute.replace(variable, variables[variable]);
            }

            if (returnObj.tail) {
                var m;
                if (m = returnObj.tail.match(/^into\s+(\S+)/)) {
                    returnObj.execute += ' > ' + m[1];
                }
                else {
                    returnObj.fail = 1;
                    returnObj.error = 'Extra characters - ' + returnObj.tail;
                }
            }

            if (callback) {
                callback(returnObj);
            };

            return returnObj;

        },

        nextForGrammar : function(next, grammar) {

            if (next == undefined) {
                next = '';
            }

            var nextGrammar = grammar[next].children;
            var ng;
            var throttle = 1000;

            while (nextGrammar != undefined && throttle-- > 0) {
                if (Object.keys(nextGrammar).length == 1) {
                    var prop = Object.keys(nextGrammar)[0];

                    next = next.length
                        ? next + ' ' + prop
                        : prop;

                    nextGrammar = nextGrammar[prop].children;

                }
            }

            return next;
        },


        allQuestions : function(filter) {
            var questions =  [
                "Display the dna sequence of contig $contig_id from $max to $min",
                "Display the dna sequence of gene $gene_id",
                "What type of family is $family",
                "What is the function of family $family",
                "What fids are in family $family",
                "Display sequences in family $family as fasta",
                "Display sequences in family $family",
                "What is the function of feature $feature_id",
                "What fids in k12 have attached publications",
                "What publications have been connected to gene thrB",
                "Show the DNA sequence of fid thrB",
                "Display the protein sequence of fid thrB",
                "Which protein families contain gene $gene_id",
                "Is fid thrB in an atomic regulon",
                "Which fids appear to have correlated expression with gene thrB",
                "What is the location of feature thrB",
                "What protein sequence corresponds to fid $fid",
                "Which contigs are in genome $genome",
                "What is the size of genome $genome",
                "What is the KBase id of SEED genome $genome",
                "What is the KBase id of SEED feature $feature",
                "What is the source of genome $genome",
                "Which are the closest genomes to $genome",
                "What is the name of genome $genome",
                "Which genomes have models",
                "Which models exist for genome $genome",
                "Which reactions exist in genome $genome",
                "Which reactions are in model $model",
                "What reactions connect to role $role",
                "What roles relate to reaction $reaction",
                "What complexes implement reaction $reaction",
                "What reactions does complex $complex implement",
                "Describe the biomass reaction for model kb|fm.0",
                "What compounds are connected to model $model",
                "What media are known",
                "What compounds are considered part of media $media",
                "show reactions that connect to compound $compound",
                "How many otus exist",
                "What otus exist",
                "What otu contains $otu",
                "What genomes are in OTU $otu",
                "What annotations are known for protein sequence $sequence",
                "What roles are used in models",
                "What roles are used in subsystem $subsystem",
                "What subsystems include role $role",
                "What features in $feature implement role $role",
                "What families implement role $role",
                "What roles occur in subsystem $subsystem",
                "What roles are in subsystem $subsystem",
                "What genomes are in subsystem $subsystem",
                "What subsystems are in genome $genome",
                "what is the taxonomy of genome $genome",
                "What is the taxonomic group id of $group_id",
                "What genomes are in taxonomic group $group",
            ];

            if (filter == undefined) {
                return questions;
            }
            else {
                var filteredQ = [];
                var qRegex = new RegExp(filter);
                for (var idx = 0; idx < questions.length; idx++) {
                    var q = questions[idx];
                    if (q.match(qRegex)) {
                        filteredQ.push(q);
                    }
                }
                return filteredQ;
            }
        },

        XXXallQuestionsBOGUS : function(grammar, prefix) {
            if (prefix == undefined) {
                prefix = '';
            }

            if (grammar == undefined) {
                if (this.grammar == undefined) {
                    this.retrieveGrammar(this.options.defaultGrammarURL, $.proxy(function() {this.allQuestions(); }, this));
                    return;
                }
                else {
                    grammar = this.grammar._root.children;
                }
            }

            for (var child in grammar) {

                var childPrefix = prefix.length
                    ? prefix + ' ' + child
                    : child;

            }
        },

        retrieveGrammar : function(url, callback) {

            var token = undefined;

            $.ajax(
                {
    		        async : true,
            		dataType: "text",
            		url: url,
            		crossDomain : true,
            		beforeSend: function (xhr) {
		                if (token) {
                			xhr.setRequestHeader('Authorization', token);
		                }
            		},
            		success: $.proxy(function (data, status, xhr) {

            		    var json = JSON.parse(data);

            		    this.grammar = json;

            		    if (callback) {
            		        callback();
            		    }

		            }, this),
            		error: $.proxy(function(xhr, textStatus, errorThrown) {

            		    try {
                            var json = JSON.parse(xhr.responseText);

                            this.grammar = json;

                            if (callback) {
                                callback();
                            }
                        }
                        catch (e) {}

		            }, this),
                    type: 'GET',
    	        }
    	    );

        }


    });

});
