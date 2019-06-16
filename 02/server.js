const http = require('http')
const config = {
  interval: Number(process.env.INTERVAL) || 1,
  liveTime: Number(process.env.LIVETIME) || 5
}
const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))
const getUtcDateNow = () => (new Date()).toUTCString()

const runFor = async (expiresAt, interval, func, endFunc) => {
  while (expiresAt > Date.now()) {
    try {
      func()
      await delay(interval)
    } catch (e) {
      console.log(e)
    }
  }
  endFunc()
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    const killTimeMs = Date.now() + (config.liveTime * 1000)
    const intervalMs = config.interval * 1000

    runFor(
      killTimeMs,
      intervalMs,
      () => console.log(getUtcDateNow()),
      () => {
        console.log(`FINISHED AT ${getUtcDateNow()}`)
        res.end()
        process.exit()
      }
    )
  }
})

server.listen(3000, () => {
  console.log('Server running on port 3000')
})
