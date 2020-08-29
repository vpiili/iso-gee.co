import React, { useState } from 'react'

export default ({data}) => {
    const [viewableCity, setViewableCity] = useState('Turku')

    return (
        <div className='container'>
            <CitySelect data={data} viewableCity={viewableCity} setViewableCity={setViewableCity} />
            <AlkoList data={data} viewableCity={viewableCity} />
        </div>
    )
}

const CitySelect = ({data, viewableCity, setViewableCity}) => (
    <select value={viewableCity} onChange={e => setViewableCity(e.target.value)}>{getCityOptions(data)}</select>
)

const AlkoList = ({data, viewableCity}) => (
    <ul>
        {getListItems(data, viewableCity)}
    </ul>
)

const getCityOptions = (data) => {
    return [...new Set(data.map(e => e.city))].map(city => <option key={city}>{city}</option>)
  }
  
  const getListItems = (data, viewableCity) => {
    return data
      .filter(e => e.city === viewableCity)
      .map(e => <li key={e.name}><a href={`https://www.alko.fi/myymalat-palvelut/${e.storeId}`} target='_blank' rel='noopener noreferrer'><span className='left'>{e.name}</span><span className='right'>{e.stock}</span></a></li>)
  }