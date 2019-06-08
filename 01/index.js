const fs = require('fs')
const path = require('path')
const del = require('del')
const argv = require('minimist')(process.argv.slice(2))
const input = argv.i || argv.input || 'input'
const output = argv.o || argv.output || 'output'
const deleteInput = argv._.some(i => i === 'deleteInput')

if (!fs.existsSync(output)) {
  fs.mkdirSync(output)
}

const readDir = base => {
  const files = fs.readdirSync(base)

  files.forEach((item, i) => {
    const itemBase = path.join(base, item)
    const state = fs.statSync(itemBase)
    if (state.isDirectory()) {
      readDir(itemBase)
    } else {
      const newDir = path.join(output, item[0].toUpperCase())
      const newItemBase = path.join(newDir, item)
      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir)
      }
      if (!fs.existsSync(newItemBase)) {
        fs.link(itemBase, newItemBase, (err) => {
          if (err) console.log(err)
        })
      }
    }
  })
}

if (fs.existsSync(input)) {
  console.log(`
    Runnung with options:
    - Input dir: '${input}'
    - Output dir: '${output}'
    - Delete input after complete: '${deleteInput}'
  `)
  readDir(input)
  if (deleteInput) del(input)
} else {
  console.log('Input directory not found')
}
