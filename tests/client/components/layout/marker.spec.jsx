/* eslint-env node, jest */
import React from 'react';
import { mount } from 'enzyme';
import expect from 'expect';

import Place from '@material-ui/icons/Place';

import Marker from 'components/floor-plan/layout/location/marker';

describe('<Marker/>', () => {
  const receptionMarker = {
    name: 'Reception',
    type: 'anchor',
    coordinates: {
      x: 10,
      y: 10
    }
  };

  const mensBathroomMarker = {
    name: 'Mens Bathroom',
    type: 'restroom',
    coordinates: {
      x: 10,
      y: 10
    }
  };

  it('contains a Place icon if set as anchor and youAreHere prop is true', () => {
    const component = mount(<Marker marker={receptionMarker} youAreHere={true} />);

    expect(component.find(Place).length).toEqual(1);
  });

  it('contains no Place icon if not set as anchor', () => {
    const components = [
      mount(<Marker marker={mensBathroomMarker} youAreHere={true} />),
      mount(<Marker marker={mensBathroomMarker} youAreHere={false} />)
    ];

    components.forEach((component) => expect(component.find(Place).length).toEqual(0));
  });
});
