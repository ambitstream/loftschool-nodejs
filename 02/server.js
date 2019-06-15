const http = require('http');
const config = {
  interval: Number(process.env.INTERVAL) || 1,
  liveTime: Number(process.env.LIVETIME) || 5,
}
const delay = ms => new Promise((r, j) => setTimeout(r, ms))
const getUtcDateNow = () => ( new Date() ).toUTCString()

const runFor = async (time, interval, func, endFunc) => {
  while (time > Date.now()) {
    await delay(interval)
    func()
  }
  endFunc()
};

const server = http.createServer( (req, res) => {
  if (req.method === 'GET') {
    const killTimeMs = Date.now() + (config.liveTime * 1000);
    const intervalMs = config.interval * 1000;

    runFor(
      killTimeMs,
      intervalMs,
      () => console.log( getUtcDateNow() ),
      () => {
        console.log(`FINISHED AT ${getUtcDateNow()}`)
        process.exit()
        res.end()
      }
    )
  }
})

server.listen(3000, () => {
  console.log('Server running on port 3000')
})
