var d3 = require('d3');
require('./main.css');
var BezierCurve = require('../lib/bezier-curve');
var EllipticArc = require('../lib/elliptic-arc');

var svg = d3.select('#example').append('svg')
  .attr({
    width: 400,
    height: 400
  });

var handleRadius = 8;
var tangentPointRadius = 4;
var intersectionRadius = 4;

var ellipse = {
  cx: 200,
  cy: 200,
  rx: 150,
  ry: 100
};

var ellipseLayer = svg.append('g').attr('class', 'ellipse-layer');
var bezierLayer = svg.append('g').attr('class', 'bezier-layer');

ellipseLayer.selectAll('ellipse').data([ellipse])
  .enter().append('ellipse')
  .attr({
    cx: function(d) { return d.cx; },
    cy: function(d) { return d.cy; },
    rx: function(d) { return d.rx; },
    ry: function(d) { return d.ry; }
  });

var theta = 0;
//var lambda1 = Math.PI / 4;
//var lambda2 = lambda1 + Math.PI / 4;
var lambda1 = Math.PI / 32;
var lambda2 = lambda1 + Math.PI / 32;
var ellipticArc = new EllipticArc(ellipse.cx, ellipse.cy, ellipse.rx, ellipse.ry, theta, lambda1, lambda2);
var curves = ellipticArc.getApproximateCubicBezierCurves();
console.log('curves', curves);

function pathData(curve) {
  var xs = curve.xs;
  var ys = curve.ys;
  switch (xs.length) {
  case 2:
    return 'M' + xs[0] + ' ' + ys[0] +
      ' ' + xs[1] + ' ' + ys[1];
  case 3:
    return 'M' + xs[0] + ' ' + ys[0] +
      'Q' + xs[1] + ' ' + ys[1] +
      ' ' + xs[2] + ' ' + ys[2];
  case 4:
    return 'M' + xs[0] + ' ' + ys[0] +
      'C' + xs[1] + ' ' + ys[1] +
      ' ' + xs[2] + ' ' + ys[2] +
      ' ' + xs[3] + ' ' + ys[3];
  }
}

bezierLayer.selectAll('path').data(curves)
  .enter().append('path')
  .attr({
    d: pathData
  });
