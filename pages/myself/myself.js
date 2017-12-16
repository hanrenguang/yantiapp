const app = getApp()

Page({
  data: {
    qqNumber: 0,
    school: '',
    grade: 0,
    testCount: 0,
    rightCount: 0,
    errCount: 0,
    authStatus: '正在认证',
    isAuth: false,
    userName: '',
    phoneNumber: '',
    avatarUrl: '',
    testerId: ''
  },
  goTest: function (e) {
    if (this.data.isAuth) {
      wx.navigateTo({
        url: '../subject/subject'
      })
    }
  },
  onLoad: function () {
    var _self = this
    var testerId = wx.getStorageSync('testerId')
    var phoneNumber = wx.getStorageSync('phoneNumber')

    if (!testerId || !phoneNumber) {
      wx.redirectTo({
        url: '../signUp/signUp'
      })
    } else {
      _self.setData({
        testerId: testerId
      })
    }

    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var avatarUrl = userInfo.avatarUrl
        app.globalData.avatarUrl = avatarUrl
        _self.setData({
          avatarUrl: avatarUrl
        })
      }
    })

    wx.request({
      url: app.globalData.domain + 'PineSystem/tester/getTesterDetail',
      method: 'POST',
      data: {
        testerId: this.data.testerId
      },
      success: function (res) {
        if (res.data.status === '已通过') {
          _self.setData({
            authStatus: '开始测题',
            isAuth: true
          })
        }
        _self.setData({
          userName: res.data.testerName,
          phoneNumber: res.data.phoneNumber,
          qqNumber: res.data.qqNumber,
          school: res.data.schoolName,
          grade: res.data.grade
        })
      }
    })
  },
  onShow: function () {
    var _self = this
    var testerId = app.globalData.testerId

    if (!testerId) {
      return
    }
    // request for auth status
    wx.request({
      url: app.globalData.domain + 'PineSystem/tester/getTesterDetail',
      method: 'POST',
      data: {
        testerId: _self.data.testerId ? _self.data.testerId : testerId
      },
      success: function (res) {
        _self.setData({
          testCount: res.data.sumNum,
          rightCount: res.data.trueNum,
          errCount: res.data.falseNum
        })
      }
    })
  }
})
