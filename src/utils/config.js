const storage = require('electron-json-storage')
var config = {}
const dataPath = `${storage.getDataPath()}/Vagrantable`

config.getPath = function (arg1, arg2) {
  console.log(`${dataPath}`)
}

module.exports = config
