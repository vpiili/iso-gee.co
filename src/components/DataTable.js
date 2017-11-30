import React from 'react'
import PropTypes from 'prop-types'

import DataRow from './DataRow.js'

const DataTable = ({data}) => (
  <ul>
    {
      data.map((i) => {
        return <DataRow key={i.id} id={i.id} alko={i.alko} quantity={i.quantity} />
      })
    }
  </ul>
)

DataTable.PropTypes = {
  data: PropTypes.array.isRequired
}

export default DataTable;