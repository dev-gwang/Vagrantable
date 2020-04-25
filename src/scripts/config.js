const storage = require('electron-json-storage')
const fs = require('fs')
var config = {}
const dataPath = `${storage.getDataPath()}/vagrantable`

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
  storage.setDataPath(dataPath)
  if (!fs.existsSync(`${dataPath}/vagrantable.json`)) {
    if (!fs.existsSync(`${dataPath}`)) {
      fs.mkdirSync(dataPath)
    }
    console.log('The path not exists. ')
    return 0
  }
  return 1
}

config.writeConfigFile = function (value) {
  storage.set(`${dataPath}`, value, function (error) {
    if (error) {
      console.log(error)
    }
  })
}

config.versionCheck = function (latest) {
  var data = this.data
  if (data.version !== latest.version) {
    data.version = latest.version
    for (var key in latest) {
      if (!data.hasOwnProperty(key)) {
        data[key] = ''
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

  this.data = JSON.parse(fs.readFileSync(`${dataPath}/vagrantable.json`))
  // })
  // myFirstPromise.then(successMessage => {
  // console.log(successMessage)
  // })
}

module.exports = config