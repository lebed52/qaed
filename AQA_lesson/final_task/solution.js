import square from './square.js'
import getTriangleArea from './myMathModule.js';
 
const areaOfTriangle = (n) => {
  const height = n;
  const base = square(n) / 2;
  return getTriangleArea(height, base);
};

export default areaOfTriangle