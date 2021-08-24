import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Functionality from './Functionality'

const GAMBINA_ID = '319027'

export default () => {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetchData(GAMBINA_ID)
      .then(data => parseData(data))
      .then(data => setData(data))
      .catch(e => console.error('Something is wrong :)'))
  }, [])
  
  return (
    data ? 
    <Functionality data={data} /> :
    <h3>Fetching data from API..</h3>
  )
}

const fetchData = (id) => {
  const url = `https://cors-anywhere.herokuapp.com/https://www.alko.fi/INTERSHOP/web/WFS/Alko-OnlineShop-Site/fi_FI/-/EUR/ViewProduct-Include?SKU=${id}`
  return axios.get(url)
    .then(res => res.data)
    .catch(e => console.error(e))
}

const parseData = (rawData) => {
  const rawDataInList = rawData
    .split('relative store-item stockInStore')
    .filter(e => e.includes('data-store-item'))
    .map(e => e.substring(e.indexOf('<a'), e.indexOf('</a>')))

  return rawDataInList.map(e => {
    const rows = e.split("\n")

    const storeId = rows[0].substring(rows[0].indexOf('StoreID=')+8, rows[0].indexOf('&StoreStock'))
    const stock = rows[3].substring(2, rows[3].indexOf('<'))
    const name = rows[1].substring(49, rows[1].indexOf('</span')).replace(/&Auml;/g, 'Ä').replace(/&auml;/g, 'ä').replace(/&Ouml;/g, 'Ö').replace(/&ouml;/g, 'ö')
    const city = name.substring(0, 4) === 'Alko' ? name.split(" ")[1] : name.split(" ")[0]

    return {
      storeId: storeId,
      stock: stock,
      name: name,
      city: city
    }

  })
}