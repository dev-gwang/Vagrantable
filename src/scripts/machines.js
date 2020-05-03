var exec = require('child_process').exec
var config = {}
config.getMachineLists = function () {
  var arr = []
  let myFirstPromise = new Promise((resolve, reject) => {
    exec('vagrant box list', function (error, stdout, stderr) {
      arr = stdout.split('\n')
      console.log(arr)
      for (var i = 0; i < arr.length - 1; i++) {
        arr[i] = { text: arr[i].split(' ')[0], value: arr[i].split(' ')[0] }
      }
      if (error !== null) {
        console.log(error)
      }
      resolve()
    })
  })
  myFirstPromise.then(successMessage => {
    console.log(successMessage)
  })
}

module.exports = config
