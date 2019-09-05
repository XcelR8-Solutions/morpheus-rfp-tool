var MorpheusHub = MorpheusHub || {};

(function() {
    var self = this;

    var init = function() {};

    function printOutParams(identifier, params) {
        Object.keys(params).forEach(function(key) {
            var value = params[key]
            // iteration code
            console.log(identifier + ": printOutParams key: " + key);
            console.log(identifier + ": printOutParams value: " + value);
        });
    }

    MorpheusHub.DebugService = {
        printOutParams: printOutParams
    };

    init();

})();
