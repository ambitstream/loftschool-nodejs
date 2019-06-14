const fs = require('fs')
const path = require('path')
const del = require('del')
const argv = require('minimist')(process.argv.slice(2))
const input = argv.i || argv.input || 'input'
const output = argv.o || argv.output || 'output'
const deleteInput = argv._.some(i => i === 'deleteInput')

fs.access(output, err => {
  if (err) {
    fs.mkdir(output, err => {
      if (err) console.log(err);
    })
  }
})

const copyFile = (copyFrom, copyTo) => {
  fs.access(copyTo, err => {
    if (err) {
      fs.link(copyFrom, copyTo, (err) => {
        if (err) console.log(err);
      })
    }
  })
}

const readDir = base => {
  fs.readdir(base, (err, files) => {
    if (err) console.log(err);

    files.forEach((item, i) => {
      const itemBase = path.join(base, item)
      fs.stat(itemBase, (err, state) => {
        if (err) console.log(err);
        if (state.isDirectory()) {
          readDir(itemBase)
        } else {
          const newDir = path.join(output, item[0].toUpperCase())
          const newItemBase = path.join(newDir, item)
          fs.access(newDir, err => {
            if (err) {
              fs.mkdir(newDir, (err) => {
                if (err) console.log(err)
                copyFile(itemBase, newItemBase)
              })
            } else {
              copyFile(itemBase, newItemBase)
            }
          })
        }
      })
    })
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
