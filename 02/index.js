const fs = require('fs')
const path = require('path')
const del = require('del')
const util = require('util')
const argv = require('minimist')(process.argv.slice(2))
const input = argv.i || argv.input || 'input'
const output = argv.o || argv.output || 'output'
const deleteInput = argv._.some(i => i === 'deleteInput')

const access = util.promisify(fs.access)
const readdir = util.promisify(fs.readdir)
const mkdir = util.promisify(fs.mkdir)
const stat = util.promisify(fs.stat)
const link = util.promisify(fs.link)

const copyFile = async (from, to) => {
  try {
    await access(to)
  } catch (e) {
    try {
      await link(from, to)
      console.log(`Copied '${from}' to '${to}'`);
    } catch (e) {
      console.log(e)
    }
  }
}

const readDir = async base => {
  try {
    const files = await readdir(base)
    const cb = async item => {
      const itemBase = path.join(base, item)
      try {
        const status = await stat(itemBase)
        if (status.isDirectory()) {
          await readDir(itemBase)
        } else {
          const letter = item[0].toUpperCase()
          const newDir = path.join(output, letter)
          const newItemBase = path.join(newDir, item)
          try {
            await access(newDir)
            await copyFile(itemBase, newItemBase)
          } catch (e) {
            try {
              await mkdir(newDir)
              await copyFile(itemBase, newItemBase)
            } catch (e) {
              console.log(e)
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
    for (let i = 0; i < files.length; i++) {
      await cb(files[i])
    }
  } catch(e) {
    console.log(e)
  }
}

const init = async () => {
  console.log(`
    Runnung with options:
    - Input dir: '${input}'
    - Output dir: '${output}'
    - Delete input after complete: '${deleteInput}'
  `)
  try {
    await access(input)
  } catch (e) {
    console.log('Input directory doesn\'t exist')
    process.exit(1)
  }
  try {
    await access(output)
  } catch (e) {
    try {
      await mkdir(output)
    } catch (e) {
      console.log('Can not create output directory')
      process.exit(1)
    }
  }
  return new Promise( async (resolve, reject) => {
    try {
      await readDir(input)
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

init().then(async () => {
  if (deleteInput) await del(input)
  console.log('===========')
  console.log('Success END')
  process.exit()
}).catch( e => {
  console.log(e)
  process.exit(1)
})
