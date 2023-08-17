import { translate } from 'bing-translate-api'

const handler = async (req, res) => {
  const { text, from } = req.body
  return new Promise((resolve, reject) => {
    translate(text, from, 'en', true)
      .then((response) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')

        res.end(JSON.stringify({ translation: response.translation }))
        resolve()
      })
      .catch((error) => {
        res.json(error)
        res.status(405).end()
        resolve()
      })
  })
}

export default handler
