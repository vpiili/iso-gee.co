import express, { Application, Router, Request, Response } from 'express'
import axios from 'axios'

/**
 * FETCH
 */
interface GambinaData {
	id: string,
	alko: string,
	city: string,
	quantity: string
}

const getGambinaData = async (): Promise<GambinaData[]> => {
	const url: string = 'https://www.alko.fi/INTERSHOP/web/WFS/Alko-OnlineShop-Site/fi_FI/-/EUR/ViewProduct-Include?SKU=319027'

	const gambinaData = await axios.get(url)
	return parseData(gambinaData.data)
}

const parseData = (data: string) => {

    let dataAsList: string[] = data.split("relative store-item stockInStore")
    dataAsList.shift()

    return dataAsList.map(row  => {
      row = row.replace(/&auml;/g, 'ä').replace(/&Auml;/g, 'Ä').replace(/&ouml;/g, 'ö').replace(/&Ouml;/g, 'Ö')
      const id: string = row.substr(row.indexOf("StoreID=")+8,4)
      const alko: string = row.substring(row.indexOf('Alko ')+5,row.indexOf('</span>'))
      const city: string = alko.indexOf(" ") !== -1 ? alko.substring(0,alko.indexOf(" ")) : alko
      const quantity: string = row.substring(row.indexOf('StoreStock=')+11,row.indexOf('" h'))
      return { id: id, city: city, alko: alko, quantity: quantity }
    })
  }


/**
 * API
 */

const router: Router = Router()
router.use(require('cors')())

router.get('/gambinaData', (req: Request, res: Response) => {
  const jsonRes = {
    status: store && store.length > 0 ? 'OK' : 'Nothing present',
    results: store
  }
	res.json(jsonRes) 
})

router.get('/gambinaData/:city', (req: Request, res: Response) => {
  const dataByCity = store.filter(row => row.city.toLowerCase() === req.params.city.toLowerCase())
  const jsonRes = {
    status: dataByCity && dataByCity.length > 0 ? 'OK' : 'Nothing present',
    results: dataByCity
  }
	res.json(jsonRes)
})


/**
 * APP
 */

let store: GambinaData[]

const app: Application = express()
app.use('/api', router);
const PORT: number = Number(process.env.PORT) || 8080;

app.listen(PORT, async () => {
	await initializeApp()
	console.log(`Listening port ${PORT}...`)
})

const initializeApp = async () => {
	store = await getGambinaData()
	setInterval(async () => {
		store = await getGambinaData()
	}, 15*60*1000)
}