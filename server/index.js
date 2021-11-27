const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()

const PORT = process.env.PORT || 8000
const GAMBINA_ID = '319027'

app.use(cors())
app.use(express.static('public'))

app.get('/data', async (req, res) => {
    console.log('GET /data')
    const data = await fetchData()
    res.send(data)
})

const fetchData = async () => {
    const url = `https://www.alko.fi/INTERSHOP/web/WFS/Alko-OnlineShop-Site/fi_FI/-/EUR/ViewProduct-Include?SKU=${GAMBINA_ID}`
    const resp = await axios.get(url)
    return resp.data
  }

app.listen(PORT, () => console.log(`listening port ${PORT}`))