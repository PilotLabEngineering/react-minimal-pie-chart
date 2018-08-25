import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Path from './ReactMinimalPieChartPath';
import Circle from './ReactMinimalPieChartCircle';
import Label from './ReactMinimalPieChartLabel';

const sumValues = data =>
  data.reduce((acc, dataEntry) => acc + dataEntry.value, 0);

// @TODO extract padding evaluation
const evaluateDegreesFromValues = (
  data,
  totalAngle,
  totalValue,
  paddingAngle
) => {
  const total = totalValue || sumValues(data);

  // Remove segments padding from total degrees
  const degreesTakenByPadding = paddingAngle * data.length;
  let totalDegrees = Math.abs(totalAngle) - degreesTakenByPadding;

  if (totalDegrees > 360) totalDegrees = 360;
  if (totalAngle < 0) totalDegrees = -totalDegrees;

  // Append "degrees" into each data entry
  return data.map(dataEntry =>
    Object.assign(
      { degrees: (dataEntry.value / total) * totalDegrees },
      dataEntry
    )
  );
};

const makeSegmentTransitionStyle = (duration, easing, furtherStyles = {}) => {
  // Merge CSS transition necessary for chart animation with the ones provided by "segmentsStyle"
  const transition = [
    `stroke-dashoffset ${duration}ms ${easing}`,
    furtherStyles.transition,
  ]
    .filter(Boolean)
    .join(',');

  return {
    transition,
  };
};

const makeSegments = (data, props, hide) => {
  // Keep track of how many degrees have already been taken
  let lastSegmentAngle = props.startAngle;
  const segmentsPaddingAngle =
    props.paddingAngle * (props.lengthAngle / Math.abs(props.lengthAngle));
  let reveal;

  let style = props.segmentsStyle;

  if (props.animate) {
    const transitionStyle = makeSegmentTransitionStyle(
      props.animationDuration,
      props.animationEasing,
      style
    );
    style = Object.assign({}, style, transitionStyle);
  }

  // Hide/reveal the segment?
  if (hide === true) {
    reveal = 0;
  } else if (typeof props.reveal === 'number') {
    reveal = props.reveal;
  } else if (hide === false) {
    reveal = 100;
  }

  return data.map((dataEntry, index) => {
    const isActiveSegment = index === props.activeIndex;
    const isFocusSegment = index === props.focusIndex;

    const startAngle = lastSegmentAngle;
    lastSegmentAngle += dataEntry.degrees + segmentsPaddingAngle;

    return (
      <Path
        key={dataEntry.key || index}
        cx={props.cx}
        cy={props.cy}
        startAngle={startAngle}
        lengthAngle={dataEntry.degrees}
        radius={props.radius}
        lineWidth={(props.radius / 100) * props.lineWidth}
        reveal={reveal}
        style={style}
        active={isActiveSegment}
        focus={isFocusSegment}
        expand={props.expand}
        expandFocusPercent={props.expandFocusPercent}
        expandActivePercent={props.expandActivePercent}
        stroke={dataEntry.color}
        strokeLinecap={props.rounded ? 'round' : undefined}
        fill="none"
        onMouseOver={
          props.onMouseOver && (e => props.onMouseOver(e, props.data, index))
        }
        onMouseOut={
          props.onMouseOut && (e => props.onMouseOut(e, props.data, index))
        }
        onClick={props.onClick && (e => props.onClick(e, props.data, index))}
      />
    );
  });
};

export default class ReactMinimalPieChart extends PureComponent {
  constructor(props) {
    super(props);

    if (this.props.animate === true) {
      this.hideSegments = true;
    }
  }

  componentDidMount() {
    if (this.props.animate === true && requestAnimationFrame) {
      this.initialAnimationTimerId = setTimeout(() => {
        this.initialAnimationTimerId = null;
        this.initialAnimationRAFId = requestAnimationFrame(() => {
          (this.initialAnimationRAFId = null), this.startAnimation();
        });
      });
    }
  }

  componentWillUnmount() {
    if (this.initialAnimationTimerId) {
      clearTimeout(this.initialAnimationTimerId);
    }
    if (this.initialAnimationRAFId) {
      cancelAnimationFrame(this.initialAnimationRAFId);
    }
  }

  startAnimation() {
    this.hideSegments = false;
    this.forceUpdate();
  }

  render() {
    if (this.props.data === undefined) {
      return null;
    }

    const normalizedData = evaluateDegreesFromValues(
      this.props.data,
      this.props.lengthAngle,
      this.props.totalValue,
      this.props.paddingAngle
    );

    return (
      <svg
        viewBox={`0 0 ${this.props.width} ${this.props.height}`}
        width="100%"
        height="100%"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {makeSegments(normalizedData, this.props, this.hideSegments)}
        {this.props.cutout ? (
          <Circle
            cx={this.props.cx}
            cy={this.props.cy}
            radius={this.props.cutoutRadius}
            fill={this.props.cutoutFill}
          />
        ) : null}
        {this.props.label ? (
          <Label className={this.props.labelClassName}>yay</Label>
        ) : null}
      </svg>
    );
  }
}

ReactMinimalPieChart.displayName = 'ReactMinimalPieChart';

ReactMinimalPieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      key: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      color: PropTypes.string,
    })
  ),
  width: PropTypes.number,
  height: PropTypes.number,
  cx: PropTypes.number,
  cy: PropTypes.number,
  totalValue: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ),
  segmentsStyle: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ),
  startAngle: PropTypes.number,
  lengthAngle: PropTypes.number,
  paddingAngle: PropTypes.number,
  lineWidth: PropTypes.number,
  radius: PropTypes.number,
  cutout: PropTypes.bool,
  cutoutRadius: PropTypes.number,
  cutoutFill: PropTypes.string,
  rounded: PropTypes.bool,
  animate: PropTypes.bool,
  animationDuration: PropTypes.number,
  animationEasing: PropTypes.string,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  expand: PropTypes.bool,
  expandFocusPercent: PropTypes.number,
  expandActivePercent: PropTypes.number,
  activeIndex: PropTypes.number,
  hoverIndex: PropTypes.number,
  reveal: PropTypes.number,
  children: PropTypes.node,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  onClick: PropTypes.func,
};

ReactMinimalPieChart.defaultProps = {
  width: 100,
  height: 100,
  cx: 50,
  cy: 50,
  startAngle: 0,
  lengthAngle: 360,
  paddingAngle: 0,
  lineWidth: 100,
  radius: 50,
  cutout: false,
  cutoutRadius: 30,
  cutoutFill: '#FFFFFF',
  rounded: false,
  animate: false,
  animationDuration: 500,
  animationEasing: 'ease-out',
  label: false,
  labelClassName: null,
  expand: true,
  activeIndex: -1,
  focusIndex: -1,
  expandFocusPercent: 0.1,
  expandActivePercent: 0.3,
  onMouseOver: undefined,
  onMouseOut: undefined,
  onClick: undefined,
};
