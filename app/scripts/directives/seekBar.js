(function() {
    function seekBar($document) {
        /*
        * @function calculatePercent
        * @desc calculates where an event happened as a percent of the length of a seek bar
        * @param seekBar {Object} seek bar element, event {Object} event
        * @return {Number}
        */
        var calculatePercent = function(seekBar, event) {
            var offsetX = event.pageX - seekBar.offset().left;
            var seekBarWidth = seekBar.width();
            var offsetXPercent = offsetX / seekBarWidth;
            offsetXPercent = Math.max(0, offsetXPercent);
            offsetXPercent = Math.min(1, offsetXPercent);
            return offsetXPercent;
        };
        
        return {
            templateUrl: '/templates/directives/seek_bar.html',
            replace: true,
            restrict: 'E',
            scope: { 
                onChange: '&'
            },
            link: function(scope, element, attributes) {
                /*
                * @desc div element containing the markup for a seek bar feature
                * @type {Object}
                */
                var seekBar = $(element);
                
                /*
                * @desc updates scope.value with new value attribute
                */
                attributes.$observe('value', function(newValue) {
                    scope.value = newValue;
                });
                
                /*
                * @desc updates scope.max with new max attribute value
                */
                attributes.$observe('max', function(newValue) {
                    scope.max = newValue;
                });
                
                /*
                * @function percentString
                * @desc formats a value into the percent width of the seek bar
                * @returns {string}
                */
                var percentString = function() {
                    var value = scope.value;
                    var max = scope.max;
                    var percent = value / max * 100;
                    return percent + "%";
                };
                
                var notifyOnChange = function(newValue) {
                    if (typeof scope.onChange === 'function') {
                        scope.onChange({value: newValue});
                    }
                };
                
                /*
                * @desc will be populated with information on the location of each event passed to the object
                * @type {Number}
                */
                scope.value = 100;
                /*
                * @desc maximum value of the percent width of an object
                * @type {Number}
                */
                scope.max = 100;
                
                /*
                * @function fillStyle
                * @desc changes the width of the seek bar to be filled
                * @returns {Object}
                */
                scope.fillStyle = function() {
                    return {width: percentString()};
                };
                
                /*
                * @function thumbStyle
                * @desc changes the position of the seek bar's thumb element
                * @returns {Object}
                */
                scope.thumbStyle = function() {
                    return {left: percentString()};
                };
                
                /*
                * @function onClickSeekBar
                * @desc calculates how much of the seek bar should be filled
                * @params event {Object}
                */
                scope.onClickSeekBar = function(event) {
                    var percent = calculatePercent(seekBar, event);
                    scope.value = percent * scope.max;
                    notifyOnChange(scope.value);
                };
                
                /*
                * @function trackThumb
                * @desc tracks movement of thumb element with listeners, updates seek bar fill amount,
                * position of thumb element, and unbinds listeners with mouseup event
                */
                scope.trackThumb = function() {
                    $document.bind('mousemove.thumb', function(event) {
                        var percent = calculatePercent(seekBar, event);
                        scope.$apply(function() {
                            scope.value = percent * scope.max;
                            notifyOnChange(scope.value);
                        });
                    });
 
                    $document.bind('mouseup.thumb', function() {
                        $document.unbind('mousemove.thumb');
                        $document.unbind('mouseup.thumb');
                    });
                };
            }
        };
    }
    
    angular
        .module('blocJams')
        .directive('seekBar', ['$document', seekBar]);
})();