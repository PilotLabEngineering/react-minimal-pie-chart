'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));

// from http://stackoverflow.com/a/18473154

var partialCircle = function partialCircle(cx, cy, r, start, end) {
	var length = end - start;
	if (length === 0) return [];

	var fromX = r * Math.cos(start) + cx;
	var fromY = r * Math.sin(start) + cy;
	var toX = r * Math.cos(end) + cx;
	var toY = r * Math.sin(end) + cy;
	var large = Math.abs(length) <= Math.PI ? '0' : '1';
	var sweep = length < 0 ? '0' : '1';

	return [['M', fromX, fromY], ['A', r, r, 0, large, sweep, toX, toY]];
};

var svgPartialCircle = partialCircle;

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};









var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};









var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var PI = Math.PI;
var degreesToRadians = function degreesToRadians(degrees) {
  return degrees * PI / 180;
};

var makePathCommands = function makePathCommands(cx, cy, startAngle, lengthAngle, radius) {
  var patchedLengthAngle = lengthAngle;

  if (patchedLengthAngle >= 360) patchedLengthAngle = 359.999;
  if (patchedLengthAngle <= -360) patchedLengthAngle = -359.999;

  return svgPartialCircle(cx, cy, // center X and Y
  radius, degreesToRadians(startAngle), degreesToRadians(startAngle + patchedLengthAngle)).map(function (command) {
    return command.join(' ');
  }).join(' ');
};

function ReactMinimalPieChartPath(_ref) {
  var cx = _ref.cx,
      cy = _ref.cy,
      startAngle = _ref.startAngle,
      lengthAngle = _ref.lengthAngle,
      radius = _ref.radius,
      lineWidth = _ref.lineWidth,
      reveal = _ref.reveal,
      active = _ref.active,
      expand = _ref.expand,
      expandRatio = _ref.expandRatio,
      props = objectWithoutProperties(_ref, ['cx', 'cy', 'startAngle', 'lengthAngle', 'radius', 'lineWidth', 'reveal', 'active', 'expand', 'expandRatio']);

  var actualRadio = radius - lineWidth / 2;
  var pathCommands = makePathCommands(cx, cy, startAngle, lengthAngle, actualRadio);
  var strokeDasharray = void 0;
  var strokeDashoffset = void 0;

  // Animate/hide paths with "stroke-dasharray" + "stroke-dashoffset"
  // https://css-tricks.com/svg-line-animation-works/
  if (typeof reveal === 'number') {
    strokeDasharray = PI * actualRadio / 180 * Math.abs(lengthAngle);
    strokeDashoffset = strokeDasharray + strokeDasharray / 100 * reveal;
  }

  var strokeWidth = lineWidth * (active && expand ? expandRatio : 1);

  return React__default.createElement('path', _extends({
    d: pathCommands,
    strokeWidth: strokeWidth,
    strokeDasharray: strokeDasharray,
    strokeDashoffset: strokeDashoffset
  }, props));
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
  expand: PropTypes.bool,
  expandRatio: PropTypes.number
};

ReactMinimalPieChartPath.defaultProps = {
  startAngle: 0,
  lengthAngle: 0,
  lineWidth: 100,
  radius: 100,
  expandRatio: 1.5
};

var VIEWBOX_SIZE = 100;
var VIEWBOX_HALF_SIZE = VIEWBOX_SIZE / 2;

var sumValues = function sumValues(data) {
  return data.reduce(function (acc, dataEntry) {
    return acc + dataEntry.value;
  }, 0);
};

var evaluateViewBoxSize = function evaluateViewBoxSize(ratio, baseSize) {
  // Wide ratio
  if (ratio > 1) {
    return baseSize + ' ' + baseSize / ratio;
  }
  // Narrow/squared ratio
  return baseSize * ratio + ' ' + baseSize;
};

// @TODO extract padding evaluation
var evaluateDegreesFromValues = function evaluateDegreesFromValues(data, totalAngle, totalValue, paddingAngle) {
  var total = totalValue || sumValues(data);

  // Remove segments padding from total degrees
  var degreesTakenByPadding = paddingAngle * data.length;
  var totalDegrees = Math.abs(totalAngle) - degreesTakenByPadding;

  if (totalDegrees > 360) totalDegrees = 360;
  if (totalAngle < 0) totalDegrees = -totalDegrees;

  // Append "degrees" into each data entry
  return data.map(function (dataEntry) {
    return Object.assign({ degrees: dataEntry.value / total * totalDegrees }, dataEntry);
  });
};

var makeSegmentTransitionStyle = function makeSegmentTransitionStyle(duration, easing) {
  var furtherStyles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  // Merge CSS transition necessary for chart animation with the ones provided by "segmentsStyle"
  var transition = ['stroke-dashoffset ' + duration + 'ms ' + easing, 'stroke-width 0.1s ' + easing, furtherStyles.transition].filter(Boolean).join(',');

  return {
    transition: transition
  };
};

var makeSegments = function makeSegments(data, props, hide) {
  // Keep track of how many degrees have already been taken
  var lastSegmentAngle = props.startAngle;
  var segmentsPaddingAngle = props.paddingAngle * (props.lengthAngle / Math.abs(props.lengthAngle));
  var reveal = void 0;

  var style = props.segmentsStyle;

  if (props.animate) {
    var transitionStyle = makeSegmentTransitionStyle(props.animationDuration, props.animationEasing, style);
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

  return data.map(function (dataEntry, index) {
    var isActiveSegment = index === props.activeIndex;
    var startAngle = lastSegmentAngle;
    lastSegmentAngle += dataEntry.degrees + segmentsPaddingAngle;

    return React__default.createElement(ReactMinimalPieChartPath, {
      key: dataEntry.key || index,
      cx: props.cx,
      cy: props.cy,
      startAngle: startAngle,
      lengthAngle: dataEntry.degrees,
      radius: props.radius,
      lineWidth: props.radius / 100 * props.lineWidth,
      reveal: reveal,
      style: style,
      active: isActiveSegment,
      expand: props.expand,
      expandRatio: props.expandRatio,
      stroke: dataEntry.color,
      strokeLinecap: props.rounded ? 'round' : undefined,
      fill: 'none',
      onMouseOver: props.onMouseOver && function (e) {
        return props.onMouseOver(e, props.data, index);
      },
      onMouseOut: props.onMouseOut && function (e) {
        return props.onMouseOut(e, props.data, index);
      },
      onClick: props.onClick && function (e) {
        return props.onClick(e, props.data, index);
      }
    });
  });
};

var ReactMinimalPieChart = function (_PureComponent) {
  inherits(ReactMinimalPieChart, _PureComponent);

  function ReactMinimalPieChart(props) {
    classCallCheck(this, ReactMinimalPieChart);

    var _this = possibleConstructorReturn(this, _PureComponent.call(this, props));

    if (_this.props.animate === true) {
      _this.hideSegments = true;
    }
    return _this;
  }

  ReactMinimalPieChart.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    if (this.props.animate === true && requestAnimationFrame) {
      this.initialAnimationTimerId = setTimeout(function () {
        _this2.initialAnimationTimerId = null;
        _this2.initialAnimationRAFId = requestAnimationFrame(function () {
          _this2.initialAnimationRAFId = null, _this2.startAnimation();
        });
      });
    }
  };

  ReactMinimalPieChart.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this.initialAnimationTimerId) {
      clearTimeout(this.initialAnimationTimerId);
    }
    if (this.initialAnimationRAFId) {
      cancelAnimationFrame(this.initialAnimationRAFId);
    }
  };

  ReactMinimalPieChart.prototype.startAnimation = function startAnimation() {
    this.hideSegments = false;
    this.forceUpdate();
  };

  ReactMinimalPieChart.prototype.render = function render() {
    if (this.props.data === undefined) {
      return null;
    }

    var normalizedData = evaluateDegreesFromValues(this.props.data, this.props.lengthAngle, this.props.totalValue, this.props.paddingAngle);

    return React__default.createElement(
      'div',
      {
        className: this.props.className,
        style: this.props.style
      },
      React__default.createElement(
        'svg',
        {
          viewBox: '0 0 ' + evaluateViewBoxSize(this.props.ratio, VIEWBOX_SIZE),
          width: '100%',
          height: '100%',
          style: { display: 'block', overflow: 'visible' }
        },
        makeSegments(normalizedData, this.props, this.hideSegments)
      ),
      this.props.children
    );
  };

  return ReactMinimalPieChart;
}(React.PureComponent);

ReactMinimalPieChart.displayName = 'ReactMinimalPieChart';

ReactMinimalPieChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number.isRequired,
    key: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    color: PropTypes.string
  })),
  cx: PropTypes.number,
  cy: PropTypes.number,
  ratio: PropTypes.number,
  totalValue: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  segmentsStyle: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  startAngle: PropTypes.number,
  lengthAngle: PropTypes.number,
  paddingAngle: PropTypes.number,
  lineWidth: PropTypes.number,
  radius: PropTypes.number,
  rounded: PropTypes.bool,
  animate: PropTypes.bool,
  animationDuration: PropTypes.number,
  animationEasing: PropTypes.string,
  expand: PropTypes.bool,
  expandRatio: PropTypes.number,
  activeIndex: PropTypes.number,
  reveal: PropTypes.number,
  children: PropTypes.node,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  onClick: PropTypes.func
};

ReactMinimalPieChart.defaultProps = {
  cx: VIEWBOX_HALF_SIZE,
  cy: VIEWBOX_HALF_SIZE,
  ratio: 1,
  startAngle: 0,
  lengthAngle: 360,
  paddingAngle: 0,
  lineWidth: 100,
  radius: VIEWBOX_HALF_SIZE,
  rounded: false,
  animate: false,
  animationDuration: 500,
  animationEasing: 'ease-out',
  activeIndex: -1,
  expand: true,
  expandRatio: 1.4,
  onMouseOver: undefined,
  onMouseOut: undefined,
  onClick: undefined
};

module.exports = ReactMinimalPieChart;
//# sourceMappingURL=index.js.map
