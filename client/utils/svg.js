/**
 * Formats coordinate parameters for display in SVG element.
 * @param {object} coordinates raw coordinates of SVG element.
 * @returns {object} Formatted coordinates of SVG element.
 */
export const parsePosition = ({ x, y }) => ({
  x: `${x}%`,
  y: `${y}%`
});

/**
 * Formats size parameters for display in SVG element.
 * @param {object} coordinates Size of SVG element.
 * @returns {object} Formatted size parameters of SVG element.
 */
export const parseShape = ({ height, width }) => ({
  height: `${height}%`,
  width: `${width}%`
});
