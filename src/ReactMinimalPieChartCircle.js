import React from 'react';
import PropTypes from 'prop-types';

export default function ReactMinimalPieChartCircle({ cx, cy, radius, fill }) {
  return <circle
    cx={cx}
    cy={cy}
    r={radius}
    fill={fill}
    pointerEvents="none"
  />;
}

ReactMinimalPieChartCircle.displayName = 'ReactMinimalPieChartCircle';

ReactMinimalPieChartCircle.propTypes = {
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  radius: PropTypes.number,
  fill: PropTypes.string,
};

ReactMinimalPieChartCircle.defaultProps = {
  cx: 0,
  cy: 0,
  radius: 100,
  fill: '#FFFFFF',
};
