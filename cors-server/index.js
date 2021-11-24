const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()

const PORT = 8000
const GAMBINA_ID = '319027'

app.use(cors())

app.get('/gambina', async (req, res) => {
    console.log('GET /gambina')
    const data = await fetchData()
    res.end(data)
})

const fetchData = () => {
    const url = `https://www.alko.fi/INTERSHOP/web/WFS/Alko-OnlineShop-Site/fi_FI/-/EUR/ViewProduct-Include?SKU=${GAMBINA_ID}`
    return axios.get(url)
      .then(res => res.data)
      .catch(e => console.error(e))
  }

app.listen(PORT, () => console.log(`listening port ${PORT}`))