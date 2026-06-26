/**
 * Safely parses and evaluates a mathematical equation string for a given x value.
 * Supports: y = sin(x), x^2, cos(x) * x, pi, e, sin, cos, tan, sqrt, abs, log, ln, exp, +, -, *, /, (, )
 */
export function parseAndEvaluate(equationStr, xVal) {
  // 1. Extract expression from equation string
  let expr = equationStr.trim();
  if (expr.includes('=')) {
    const parts = expr.split('=');
    expr = parts[1] || parts[0];
  }
  expr = expr.toLowerCase();

  // 2. Replacements
  let cleanExpr = expr
    .replace(/\s+/g, '') // remove spaces
    // Handle implicit multiplication (e.g. 3x -> 3*x, 3sin(x) -> 3*sin(x), (x)(x) -> (x)*(x), x(x) -> x*(x))
    .replace(/(\d)([a-z(])/g, '$1*$2')
    .replace(/\bx\b(?=[a-z0-9(])/g, 'x*')
    .replace(/\)(?=[0-9a-zx(])/g, ')*')
    .replace(/\^/g, '**')
    .replace(/pi/g, 'Math.PI')
    .replace(/\be\b/g, 'Math.E')
    .replace(/sin\(/g, 'Math.sin(')
    .replace(/cos\(/g, 'Math.cos(')
    .replace(/tan\(/g, 'Math.tan(')
    .replace(/sqrt\(/g, 'Math.sqrt(')
    .replace(/abs\(/g, 'Math.abs(')
    .replace(/log\(/g, 'Math.log10(')
    .replace(/ln\(/g, 'Math.log(')
    .replace(/exp\(/g, 'Math.exp(')
    // Replace standalone x with xVal
    .replace(/\bx\b/g, 'xVal');

  // 3. Validation: Only allow digits, math operators, parentheses, xVal, and safe Math functions
  const testExpr = cleanExpr
    .replace(/Math\.(sin|cos|tan|sqrt|abs|log10|log|exp|PI|E)/g, '');

  const allowedPattern = /^[0-9+\-*/().,xVal]+$/;
  if (!allowedPattern.test(testExpr)) {
    throw new Error('Invalid characters or function used.');
  }

  // 4. Safe evaluation using Function constructor (isolated parameters)
  try {
    const fn = new Function('xVal', `return ${cleanExpr};`);
    const val = fn(xVal);
    return isNaN(val) || !isFinite(val) ? 0 : val;
  } catch (err) {
    throw new Error('Error evaluating mathematical expression.');
  }
}
