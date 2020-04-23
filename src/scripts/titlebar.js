const customTitlebar = require('custom-electron-titlebar')
let MyTitlebar = new customTitlebar.Titlebar({
  backgroundColor: customTitlebar.Color.fromHex('#263238'),
  menu: ''
})
MyTitlebar.updateTitle('Vagrantable')
