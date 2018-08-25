import React from 'react';
import PropTypes from 'prop-types';

export default function ReactMinimalPieChartLabel({ children, className }) {
  return (
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      className={className}
    >
      {children}
    </text>
  );
}

ReactMinimalPieChartLabel.displayName = 'ReactMinimalPieChartLabel';

ReactMinimalPieChartLabel.propTypes = {
  children: PropTypes.string,
  className: PropTypes.string,
};

ReactMinimalPieChartLabel.defaultProps = {
  children: null,
  className: null,
};
