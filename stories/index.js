/* global module */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import PieChart from '../src/index.js';

const ContainDecorator = story => (
  <div
    style={{
      maxWidth: '400px',
      margin: '0 auto',
    }}
  >
    {story()}
  </div>
);

const dataMock = [
  { value: 10, color: '#E38627' },
  { value: 15, color: '#C13C37' },
  { value: 20, color: '#6A2135' },
];

class DemoInteraction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: dataMock,
      activeIndex: -1,
      focusIndex: -1,
    };

    this.onSegmentClick = this.onSegmentClick.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
  }

  onSegmentClick(e, d, i) {
    this.setState({
      activeIndex: i,
    });
  }

  onMouseOut(e, d, i) {
    this.setState({
      focusIndex: -1,
    });
  }

  onMouseOver(e, d, i) {
    this.setState({
      focusIndex: i,
    });
  }

  render() {
    return (
      <PieChart
        width={400}
        height={400}
        cx={200}
        cy={200}
        data={this.state.data}
        activeIndex={this.state.activeIndex}
        focusIndex={this.state.focusIndex}
        segmentsStyle={{
          transition: 'stroke-width .1s ease-out',
          cursor: 'pointer',
        }}
        radius={200}
        cutout={true}
        cutoutRadius={180}
        lengthAngle={-360}
        onClick={this.onSegmentClick}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        label="100"
        expand
        animate
      />
    );
  }
}

storiesOf('React minimal pie chart', module)
  .addDecorator(ContainDecorator)
  .add('default', () => <PieChart data={dataMock} />)
  .add('180° arc with custom "startAngle"/"lengthAngle"', () => (
    <PieChart
      data={dataMock}
      startAngle={180}
      lengthAngle={180}
    />
  ))
  .add('180° arc with negative "lengthAngle" and custom svg ratio', () => (
    <PieChart
      data={dataMock}
      lengthAngle={-180}
      ratio={2}
    />
  ))
  .add('custom center + "radius"', () => (
    <PieChart
      data={dataMock}
      cx={100}
      cy={100}
      startAngle={-180}
      lengthAngle={90}
      radius={100}
    />
  ))
  .add('with custom "lineWidth"', () => (
    <PieChart
      data={dataMock}
      lineWidth={15}
    />
  ))
  .add('with custom "lineWidth" + "rounded"', () => (
    <PieChart
      data={dataMock}
      lineWidth={15}
      rounded
    />
  ))
  .add('with custom "lineWidth" + "paddingAngle"', () => (
    <PieChart
      data={dataMock}
      lineWidth={15}
      paddingAngle={5}
    />
  ))
  .add(
    'with custom "lineWidth" + "paddingAngle" + negative "lengthAngle"',
    () => (
      <PieChart
        data={dataMock}
        lineWidth={15}
        paddingAngle={5}
        lengthAngle={-360}
      />
    )
  )
  .add('with custom "style" height', () => (
    <PieChart
      data={dataMock}
      style={{ height: '100px' }}
    />
  ))
  .add('uncomplete chart with custom "totalValue"', () => (
    <PieChart
      data={dataMock}
      totalValue={60}
    />
  ))
  .add('animation on mount with "animate"', () => (
    <PieChart
      data={dataMock}
      animate
    />
  ))
  .add('clockwise animation on mount with negative "lengthAngle"', () => (
    <PieChart
      data={dataMock}
      lengthAngle={-360}
      animate
    />
  ))
  .add('Interaction using click/mouseOver/mouseOut', () => <DemoInteraction />)
  .add('as a loading bar with "reveal"', () => {
    const Wrapper = class Wrapper extends Component {
      constructor(props) {
        super(props);

        this.state = {
          percentage: 20,
        };

        this.handleRangeChange = this.handleRangeChange.bind(this);
      }

      handleRangeChange(e) {
        const newValue = e.target.value;
        this.setState(() => ({ percentage: Number(newValue) }));
      }

      render() {
        return (
          <div>
            <PieChart
              data={[{ value: 1, key: 1, color: '#E38627' }]}
              reveal={this.state.percentage}
              lineWidth={20}
              animate
            />
            Reveal: {this.state.percentage}%
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={this.state.percentage}
              style={{ width: '100%' }}
              onChange={this.handleRangeChange}
            />
          </div>
        );
      }
    };

    return <Wrapper />;
  });
