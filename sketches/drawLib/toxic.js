//shorthand constructors for toxiclib classes
const toxi = require('toxiclibsjs');

const Vec2d = toxi.geom.Vec2D;
const simplex = toxi.math.noise.simplexNoise;
const Spline2d = toxi.geom.Spline2D;
const random = toxi.math.MathUtils.random;
const radians = toxi.math.MathUtils.radians;
const tLine = toxi.geom.Line2D;
const Polygon2d = toxi.geom.Polygon2D;
const Ellipse = toxi.geom.Ellipse;
const Wave = toxi.math.waves;

module.exports = { Wave, Vec2d, simplex, Spline2d, random, radians, tLine, Ellipse, Polygon2d };
