(function() {
    function timecode() {
        return function(seconds) {
            output = buzz.toTimer(seconds);
            if (output[0] === '0') {
                return output.slice(1);
            };
            
            return output;
        }
    }
    
    angular
        .module('blocJams')
        .filter('timecode', timecode);
})();