var BezierCurve = require('./bezier-curve');

function EllipticArc(cx, cy, a, b, theta, lambda1, lambda2) {
  this.cx = cx;
  this.cy = cy;
  this.a = a;
  this.b = b;
  this.theta = theta;
  this.lambda1 = lambda1;
  this.lambda2 = lambda2;

  this.cosTheta = Math.cos(theta);
  this.sinTheta = Math.sin(theta);
}

EllipticArc.prototype.eta = function(lambda) {
  return Math.atan2(Math.sin(lambda) / this.b, Math.cos(lambda) / this.a);
};

EllipticArc.prototype.getPoint = function(lambda) {
  var eta = this.eta(lambda);
  var cosEta = Math.cos(eta);
  var sinEta = Math.sin(eta);
  var a = this.a;
  var b = this.b;
  var cosTheta = this.cosTheta;
  var sinTheta = this.sinTheta;
  return {
    x: this.cx + a * cosTheta * cosEta - b * sinTheta * sinEta,
    y: this.cy + a * sinTheta * cosEta + b * cosTheta * sinEta
  };
};

EllipticArc.prototype.getDerivative = function(lambda) {
  var eta = this.eta(lambda);
  var cosEta = Math.cos(eta);
  var sinEta = Math.sin(eta);
  var a = this.a;
  var b = this.b;
  var cosTheta = this.cosTheta;
  var sinTheta = this.sinTheta;
  return {
    x: -a * cosTheta * sinEta - b * sinTheta * cosEta,
    y: -a * sinTheta * sinEta + b * cosTheta * cosEta
  };
};


EllipticArc.prototype._getApproximateCubicBezierCurve = function(lambda1, lambda2) {
  if (Math.abs(lambda2 - lambda1) >= Math.PI / 3) {
    throw new Error('not implemented yet. should produce multiple bezier curves.');
  }
  var eta1 = this.eta(lambda1);
  var eta2 = this.eta(lambda2);
  var p1 = this.getPoint(eta1);
  var p2 = this.getPoint(eta2);
  var eta21 = eta2 - eta1;
  var tanHalfEta21 = Math.tan(eta21 / 2);
  var alpha = Math.sin(eta21) * (Math.sqrt(4 + 3 * tanHalfEta21 * tanHalfEta21) - 1) / 3;
  var deriv1 = this.getDerivative(eta1);
  var deriv2 = this.getDerivative(eta2);
  var q1 = {
    x: p1.x + alpha * deriv1.x,
    y: p1.y + alpha * deriv1.y
  };
  var q2 = {
    x: p2.x - alpha * deriv2.x,
    y: p2.y - alpha * deriv2.y
  };
  return BezierCurve.fromPointArray([p1, q1, q2, p2]);
};

EllipticArc.prototype.getApproximateCubicBezierCurves = function() {
  var maxLambdaForOneCurve = Math.PI / 128;
  var lambda21 = this.lambda2 - this.lambda1;
  var n = Math.floor(lambda21 / maxLambdaForOneCurve);
  var curves = new Array(n);
  var i = 0;
  var lambda1, lambda2, arc;
  if (n === 0) {
    n = 1;
  }
  for (; i < n; i++) {
    lambda1 = this.lambda1 + lambda21 * i / n;
    lambda2 = this.lambda1 + lambda21 * (i + 1) / n;
    curves[i] = this._getApproximateCubicBezierCurve(lambda1, lambda2);
  }
  return curves;
};

module.exports = EllipticArc;
