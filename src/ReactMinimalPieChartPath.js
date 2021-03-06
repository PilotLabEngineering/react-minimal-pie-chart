import React from 'react';
import PropTypes from 'prop-types';
import partialCircle from 'svg-partial-circle';

const PI = Math.PI;
const degreesToRadians = degrees => (degrees * PI) / 180;

const makePathCommands = (cx, cy, startAngle, lengthAngle, radius) => {
  let patchedLengthAngle = lengthAngle;

  if (patchedLengthAngle >= 360) patchedLengthAngle = 359.999;
  if (patchedLengthAngle <= -360) patchedLengthAngle = -359.999;

  return partialCircle(
    cx,
    cy, // center X and Y
    radius,
    degreesToRadians(startAngle),
    degreesToRadians(startAngle + patchedLengthAngle)
  )
    .map(command => command.join(' '))
    .join(' ');
};

export default function ReactMinimalPieChartPath({
  cx,
  cy,
  startAngle,
  lengthAngle,
  radius,
  lineWidth,
  reveal,
  expand,
  active,
  focus,
  expandFocusPercent,
  expandActivePercent,
  ...props
}) {
  const actualRadio = radius - lineWidth / 2;
  const pathCommands = makePathCommands(
    cx,
    cy,
    startAngle,
    lengthAngle,
    actualRadio
  );
  let strokeDasharray;
  let strokeDashoffset;

  // Animate/hide paths with "stroke-dasharray" + "stroke-dashoffset"
  // https://css-tricks.com/svg-line-animation-works/
  if (typeof reveal === 'number') {
    strokeDasharray = ((PI * actualRadio) / 180) * Math.abs(lengthAngle);
    strokeDashoffset = strokeDasharray + (strokeDasharray / 100) * reveal;
  }

  const strokeWidth = !expand
    ? lineWidth
    : active
      ? lineWidth * (1 + expandActivePercent)
      : focus
        ? lineWidth * (1 + expandFocusPercent)
        : lineWidth;

  return (
    <path
      d={pathCommands}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      strokeDashoffset={strokeDashoffset}
      {...props}
    />
  );
}

ReactMinimalPieChartPath.displayName = 'ReactMinimalPieChartPath';

ReactMinimalPieChartPath.propTypes = {
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  startAngle: PropTypes.number,
  lengthAngle: PropTypes.number,
  radius: PropTypes.number,
  lineWidth: PropTypes.number,
  reveal: PropTypes.number,
  active: PropTypes.bool,
  focus: PropTypes.bool,
  expand: PropTypes.bool,
  expandFocusPercent: PropTypes.number,
  expandActivePercent: PropTypes.number,
};

ReactMinimalPieChartPath.defaultProps = {
  startAngle: 0,
  lengthAngle: 0,
  lineWidth: 100,
  radius: 100,
  active: false,
  focus: false,
  expandFocusPercent: 0.2,
  expandActivePercent: 0.5,
};
