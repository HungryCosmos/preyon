var Preyon = Preyon || (function () {

    var $canvas, _ctx,
        _points, _close, _open,
        _toothW = 180, _toothH = 160, _teethTotal = 32,
        _toothW2 = _toothW >> 1,
        _moveY = 0,
        _lowerLimit = -1, _upperLimit = 1,
        _timeToCloseMouth = 0.8, _timeToOpenMouth = 2.0,
        _guide = {y:_lowerLimit},
        _sw, _sh, _cx, _cy, _raf,
        _innerMouthColor = 'transparent',
        _upperJawFillColor = '#000000', _upperJawStrokeColor = '#000000', _upperJawStrokeWidth = 0,
        _lowerJawFillColor = '#000000', _lowerJawStrokeColor = '#000000', _lowerJawStrokeWidth = 0,
        _toothMainColor = '#ffffff', _toothSecondaryColor = '#cccccc';

    function init(chewTriggerElId) {
        $canvas = document.getElementById('preyon-canvas');
        $canvas.style.backgroundColor = _innerMouthColor;

        window.addEventListener('resize', onResize, true);
        onResize();

        _raf = window.requestAnimationFrame(animate);

        var chewTrigger = document.getElementById(chewTriggerElId);
        chewTrigger.onclick = toggleMouthState;
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
        TweenLite.to(_guide, _timeToCloseMouth, {
            y:_upperLimit,
            ease: Expo.easeInOut,
            onComplete: chewPrey
        });
    }

    function chewPrey() {
        DriftingPrey.killPrey();
        openMouth();
    }

    function openMouth() {
        isMouthOpened = true;
        TweenLite.to(_guide, _timeToOpenMouth, {
            y:_lowerLimit,
            ease: Expo.easeInOut
        });
    }

    function animate() {
        _raf = window.requestAnimationFrame(animate);
        _ctx.clearRect(0, 0, _sw, _sh);
        render();
    }

    function render() {
        _guide.y += (_moveY * 0.005);
        if (_guide.y < _lowerLimit) _guide.y = _lowerLimit;
        else if (_guide.y > _upperLimit) _guide.y = _upperLimit;

        _points.y1 = getCurrent(_guide.y, _open.y1, _close.y1);
        _points.y2 = getCurrent(_guide.y, _open.y2, _close.y2);
        _points.c1 = getCurrent(_guide.y, _open.c1, _close.c1);
        _points.c2 = getCurrent(_guide.y, _open.c2, _close.c2);

        var i, point, no;

        for (i=1; i<_teethTotal; i++) {
            no = i % 2;
            if (no === 1) {
                point = getPointOnQuad({x:0, y:_points.y1}, {x:_cx, y:_points.c1}, {x:_sw, y:_points.y1}, i / _teethTotal);
            } else {
                point = getPointOnQuad({x:0, y:_points.y2}, {x:_cx, y:_points.c2}, {x:_sw, y:_points.y2}, i / _teethTotal);
            }
            drawTooth(point, no);
        }

        drawMouth();
        drawMouthPoint();
    }

    function drawMouth() {
        _ctx.strokeStyle = 'transparent';
        _ctx.lineWidth = 0;

        _ctx.fillStyle = _upperJawFillColor;
        _ctx.beginPath();
        _ctx.moveTo(0, 0);
        _ctx.lineTo(_sw, 0);
        _ctx.lineTo(_sw, _points.y1);
        _ctx.quadraticCurveTo(_cx, _points.c1, 0, _points.y1);
        _ctx.lineTo(0, 0);
        _ctx.closePath();
        _ctx.fill();

        _ctx.fillStyle = _lowerJawFillColor;
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

        _ctx.strokeStyle = _upperJawStrokeColor;
        _ctx.lineWidth = _upperJawStrokeWidth;
        _ctx.beginPath();
        _ctx.moveTo(_sw, _points.y1);
        _ctx.quadraticCurveTo(_cx, _points.c1, 0, _points.y1);
        _ctx.stroke();

        _ctx.strokeStyle = _lowerJawStrokeColor;
        _ctx.lineWidth = _lowerJawStrokeWidth;
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
            toothH = _toothH;
        } else {
            ty = pos.y + 80;
            toothH = -_toothH;
        }

        _ctx.fillStyle = _toothMainColor;
        _ctx.beginPath();
        _ctx.moveTo(tx, ty);
        _ctx.lineTo(tx + _toothW2, ty);
        _ctx.lineTo(tx, ty + toothH);
        _ctx.lineTo(tx - _toothW2, ty);
        _ctx.closePath();
        _ctx.fill();


        _ctx.fillStyle = _toothSecondaryColor;
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

    return {
        init: init
    }
})();
