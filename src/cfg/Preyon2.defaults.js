var DEFAULTS = {

    // dom
    canvas: null,
    chewTrigger: null,
    chewEvents: ['click'],
    chewCallback: null,

    // chew animation
    lowerLimit: -1,
    upperLimit: 1,
    timeToCloseMouth: 0.8,
    timeToOpenMouth: 2.0,

    // teeth
    toothW: 180,
    toothH: 160,
    teethTotal: 32,
    toothMainColor: '#ffffff',
    toothSecondaryColor: '#cccccc',

    // jaws
    innerMouthColor: 'transparent',
    upperJawFillColor: '#000000',
    upperJawStrokeColor: '#000000',
    upperJawStrokeWidth: 0,
    lowerJawFillColor: '#000000',
    lowerJawStrokeColor: '#000000',
    lowerJawStrokeWidth: 0
};

module.exports = DEFAULTS;