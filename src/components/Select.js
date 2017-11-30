import React from 'react';
import PropTypes from 'prop-types';
import { FormControl } from 'react-bootstrap';

const Select = ({cities, current, onChange}) => (
  <FormControl componentClass="select" value={current} onChange={onChange} >
    {cities.map((city,i) => {
      return <option key={i} value={city}>{city}</option>
    })}
  </FormControl>
)

Select.PropTypes = {
  cities: PropTypes.array.isRequired,
  current: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Select;