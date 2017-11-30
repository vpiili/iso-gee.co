import React from 'react'
import PropTypes from 'prop-types'

const DataRow = ({id, alko, quantity}) => (
  <li>
    <a href={'https://www.alko.fi/myymalat-palvelut/' + id} target='_blank'><span className='alko'>{alko}</span><span className='quantity'>{quantity}</span></a>
  </li>
)

DataRow.PropTypes = {
  id: PropTypes.number.isRequired,
  alko: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired
}

export default DataRow;