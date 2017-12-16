//app.js
App({
  onLaunch: function () {
    var testerId = wx.getStorageSync('testerId') || ''
    var phoneNumber = wx.getStorageSync('phoneNumber') || ''

    this.globalData.testerId = testerId
    this.globalData.phoneNumber = phoneNumber
  },
  globalData: {
    school: '',
    grade: '',
    subject: '',
    academy: '',
    avatarUrl: '',
    questionIdList: [],
    testerId: '',
    phoneNumber: '',
    recordId: '',
    domain: 'http://127.0.0.1:8080/',
    imgUrl: 'http://127.0.0.1:8080/image/praxis/'
  }
})
