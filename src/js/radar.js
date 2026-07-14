function assertOptions(values, options) {
  const { center, radius, max } = options;
  if (!Array.isArray(values) || values.length < 3) throw new TypeError("Radar charts require at least three values.");
  if (![center, radius, max].every(Number.isFinite) || radius <= 0 || max <= 0) throw new TypeError("Radar chart options must be positive finite numbers.");
  if (values.some((value) => !Number.isFinite(value) || value < 0 || value > max)) throw new RangeError(`Radar values must be between 0 and ${max}.`);
}

function rounded(value) {
  return Number(value.toFixed(2));
}

export function buildRadarPoints(values, options = {}) {
  const settings = {
    center: options.center ?? 180,
    radius: options.radius ?? 112,
    max: options.max ?? 5,
  };
  assertOptions(values, settings);
  const step = (Math.PI * 2) / values.length;
  return values.map((value, index) => {
    const angle = -Math.PI / 2 + step * index;
    const distance = settings.radius * (value / settings.max);
    return Object.freeze({
      x: rounded(settings.center + Math.cos(angle) * distance),
      y: rounded(settings.center + Math.sin(angle) * distance),
    });
  });
}

export function toSvgPoints(points) {
  if (!Array.isArray(points) || points.length < 3) throw new TypeError("An SVG polygon requires at least three points.");
  return points.map(({ x, y }) => `${x},${y}`).join(" ");
}
