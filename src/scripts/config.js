const storage = require('electron-json-storage')
const fs = require('fs')
const path = require('path')
var config = {}
const dataPath = path.join(storage.getDataPath(), 'vagrantable')
config.getPath = function () {
  return dataPath
}

config.data = ''
config.setData = function (value) {
  this.data = value
}

config.getData = function () {
  return this.data
}

config.isConfigFileExists = () => {
  console.log(dataPath)
  storage.setDataPath(dataPath)
  if (!fs.existsSync(path.join(dataPath, 'vagrantable.json'))) {
    if (!fs.existsSync(dataPath)) {
      console.log(dataPath)
      fs.mkdirSync(dataPath, { recursive: true })
    }
    console.log('The path not exists. ')
    return 0
  }
  return 1
}

config.writeConfigFile = function (value) {
  storage.set(`${dataPath}`, value, function (error) {
    if (error) {
      console.log(`eeeee : ${error} ${value}`)
    }
  })
}

config.versionCheck = function (latest) {
  console.log(`versionCheck ${latest}`)
  var data = this.data
  if (data.version !== latest.version) {
    data.version = latest.version
    for (var key in latest.menu) {
      if (!data.hasOwnProperty(key)) {
        data.menu[key] = latest.menu[key]
      }
    }
    this.setData(data)
    this.writeConfigFile(data)
  }
}

config.readConfigFile = function () {
  // let myFirstPromise = new Promise((resolve, reject) => {
  // storage.getAll(function (error, data) {
  //   if (error) throw error
  //   console.log('a')
  //   this.setData(data)
  // })

  this.data = JSON.parse(fs.readFileSync(path.join(dataPath, 'vagrantable.json')))
  // })
  // myFirstPromise.then(successMessage => {
  // console.log(successMessage)
  // })
}

module.exports = config
