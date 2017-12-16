const app = getApp();

Page({
  data: {
    academyList: [],
    msg: '',
    isShow: false
  },
  onLoad: function () {
    var _self = this
    wx.request({
      url: app.globalData.domain + 'PineSystem/school/getAllAcademy',
      method: 'POST',
      data: {
        schoolName: app.globalData.school
      },
      success: function (res) {
        var academyList = []

        for (var key in res.data) {
          if (res.data[key].academyName) {
            academyList.push(res.data[key].academyName)
          }
        }

        _self.setData({
          academyList: academyList
        })
      },
      fail: function () {
        showMsg('请求失败', _self)
      }
    })
  },
  tapAcademy: function (e) {
    app.globalData.academy = e.target.dataset.academy
    wx.navigateBack({
      delta: 1
    })
  }
})

function showMsg(msg, self) {
  self.setData({
    msg: msg,
    isShow: true
  })
  var timer = setTimeout(function () {
    self.setData({
      msg: '',
      isShow: false
    })
  }, 1000)

  return timer
}
