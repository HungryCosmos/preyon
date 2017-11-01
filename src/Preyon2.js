/**
 * Original repo: https://github.com/cmiscm/preyon
 * Original creator and copyright holder of Preyon: Jongmin Kim (http://cmiscm.com)
 *
 * Copyright (c) 2016 Jongmin Kim (http://cmiscm.com)
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 *
 * This file has been modified by me, HungryCosmos, to fit my personal website https://hungrycosmos.com
 *
 * Mofifications include, but not limited to:
 * - changes of variables, such as deleting, adding and mutating existing values
 * - changes of methods, such as deleting whole methods or it's parts, adding new instructions to existing methods,
 *   adding new conditions to make system more customizeable
 * - added configurations
 * - jaws are now opened right after closing and executing callback
 *
 *
 * VERSION: 2.0.0
 * DATE: 1 Nov 2017
 * UPDATES AND DOCS AT: https://github.com/HungryCosmos/preyon-2
 *
 * @licence MIT License, Copyright (c) 2016 Jongmin Kim (http://cmiscm.com) - author of original Preyon,
 * 2017 HungryCosmos - modifications, new configurations, builds, docs
 * @author https://github.com/HungryCosmos
 */

var TweenLite = require('gsap/TweenLite');
var Expo = require('gsap/EasePack').Expo;
var mergeJson = require('merge-json');

var defaults = require('./cfg/Preyon2.defaults');

var config, $canvas,
    _ctx, _points, _close, _open, _sw, _sh, _cx, _cy, _raf,
    _toothW2, _guide;


function init(pref) {
    config = mergeJson.merge(defaults, pref);

    if (!config.canvas || !config.chewTrigger) {
        throw new Error('Both canvas and chewTrigger are mandatory!');
    }

    if (!Array.isArray(config.chewEvents) || config.chewEvents.length < 1) {
        throw new Error('You must have at least one element in chewEvents array!');
    }
    
    $canvas = config.canvas;
    $canvas.style.backgroundColor = config.innerMouthColor;

    for (var i = 0; i < config.chewEvents.length; i++) {
        config.chewTrigger.addEventListener(config.chewEvents[i], toggleMouthState);
    }
    
    _toothW2 = config.toothW >> 1;
    _guide = {y: config.lowerLimit};

    window.addEventListener('resize', onResize, true);
    onResize();

    _raf = window.requestAnimationFrame(animate);
}

var isMouthOpened = true;
function toggleMouthState() {
    if (isMouthOpened) {
        closeMouth();
    } else {
        openMouth();
    }
}

function onResize() {
    var pos = $canvas.getBoundingClientRect();
    _sw = pos.width;
    _sh = pos.height;

    _cx = _sw >> 1;
    _cy = _sh >> 1;

    _close = {y1:_cy, y2:_cy, c1:_cy, c2:_cy};
    _open = {y1:0, y2:_sh, c1:-_cy, c2:_sh + _cy};
    _points = {y1:0, y2:_sh, c1:-_cy, c2:_sh + _cy};

    $canvas.width = _sw;
    $canvas.height = _sh;
    _ctx = $canvas.getContext('2d');
}

function closeMouth() {
    isMouthOpened = false;
    TweenLite.to(_guide, config.timeToCloseMouth, {
        y: config.upperLimit,
        ease: Expo.easeInOut,
        onComplete: chewPrey
    });
}

function chewPrey() {
    if (config.chewCallback) {
        config.chewCallback();
    }
    
    openMouth();
}

function openMouth() {
    isMouthOpened = true;
    TweenLite.to(_guide, config.timeToOpenMouth, {
        y: config.lowerLimit,
        ease: Expo.easeInOut
    });
}

function animate() {
    _raf = window.requestAnimationFrame(animate);
    _ctx.clearRect(0, 0, _sw, _sh);
    render();
}

function render() {
    if (_guide.y < config.lowerLimit) _guide.y = config.lowerLimit;
    else if (_guide.y > config.upperLimit) _guide.y = config.upperLimit;

    _points.y1 = getCurrent(_guide.y, _open.y1, _close.y1);
    _points.y2 = getCurrent(_guide.y, _open.y2, _close.y2);
    _points.c1 = getCurrent(_guide.y, _open.c1, _close.c1);
    _points.c2 = getCurrent(_guide.y, _open.c2, _close.c2);

    var i, point, no;

    for (i = 1; i < config.teethTotal; i++) {
        no = i % 2;
        if (no === 1) {
            point = getPointOnQuad({x:0, y:_points.y1}, {x:_cx, y:_points.c1}, {x:_sw, y:_points.y1}, i / config.teethTotal);
        } else {
            point = getPointOnQuad({x:0, y:_points.y2}, {x:_cx, y:_points.c2}, {x:_sw, y:_points.y2}, i / config.teethTotal);
        }
        drawTooth(point, no);
    }

    drawMouth();
    drawMouthPoint();
}

function drawMouth() {
    _ctx.strokeStyle = 'transparent';
    _ctx.lineWidth = 0;

    _ctx.fillStyle = config.upperJawFillColor;
    _ctx.beginPath();
    _ctx.moveTo(0, 0);
    _ctx.lineTo(_sw, 0);
    _ctx.lineTo(_sw, _points.y1);
    _ctx.quadraticCurveTo(_cx, _points.c1, 0, _points.y1);
    _ctx.lineTo(0, 0);
    _ctx.closePath();
    _ctx.fill();

    _ctx.fillStyle = config.lowerJawFillColor;
    _ctx.beginPath();
    _ctx.moveTo(0, _sh);
    _ctx.lineTo(_sw, _sh);
    _ctx.lineTo(_sw, _points.y2);
    _ctx.quadraticCurveTo(_cx, _points.c2, 0, _points.y2);
    _ctx.lineTo(0, _sh);
    _ctx.closePath();
    _ctx.fill();
}

function drawMouthPoint() {
    _ctx.fillStyle = 'transparent';

    _ctx.strokeStyle = config.upperJawStrokeColor;
    _ctx.lineWidth = config.upperJawStrokeWidth;
    _ctx.beginPath();
    _ctx.moveTo(_sw, _points.y1);
    _ctx.quadraticCurveTo(_cx, _points.c1, 0, _points.y1);
    _ctx.stroke();

    _ctx.strokeStyle = config.lowerJawStrokeColor;
    _ctx.lineWidth = config.lowerJawStrokeWidth;
    _ctx.beginPath();
    _ctx.moveTo(_sw, _points.y2);
    _ctx.quadraticCurveTo(_cx, _points.c2, 0, _points.y2);
    _ctx.stroke();
}

function drawTooth(pos, isUp) {
    var tx = pos.x, tx3 = tx + (_toothW2 >> 1),
        ty, toothH;
    if (isUp) {
        ty = pos.y - 80;
        toothH = config.toothH;
    } else {
        ty = pos.y + 80;
        toothH = -config.toothH;
    }

    _ctx.fillStyle = config.toothMainColor;
    _ctx.beginPath();
    _ctx.moveTo(tx, ty);
    _ctx.lineTo(tx + _toothW2, ty);
    _ctx.lineTo(tx, ty + toothH);
    _ctx.lineTo(tx - _toothW2, ty);
    _ctx.closePath();
    _ctx.fill();


    _ctx.fillStyle = config.toothSecondaryColor;
    _ctx.beginPath();
    _ctx.moveTo(tx3, ty);
    _ctx.lineTo(tx + _toothW2, ty);
    _ctx.lineTo(tx, ty + toothH);
    _ctx.closePath();
    _ctx.fill();
}

function getCurrent(cur, min, max) {
    return (max - min) * cur + min;
}

/*
 * Get point on curved line
 * p1: start point
 * p2: control point
 * p3: end point
 * p: p = 0 is the start of the curve, p = 0.5 is middle and p = 1 is end
 */
function getPointOnQuad(p1, p2, p3, p) {
    var x1 = (p2.x - p1.x) * p + p1.x,
        y1 = (p2.y - p1.y) * p + p1.y,
        x2 = (p3.x - p2.x) * p + p2.x,
        y2 = (p3.y - p2.y) * p + p2.y;
    return {x: (x2 - x1) * p + x1, y: (y2 - y1) * p + y1};
}

module.exports = {
    init: init
};
