const app = getApp()

Page({
  data: {
    subject: '微积分',
    allCount: 0,
    waitTestCount: 0,
    completedCount: 0,
    isTap: false,
    msg: '',
    isShow: false
  },
  onShow: function () {
    var _self = this

    _self.setData({
      subject: app.globalData.subject ? app.globalData.subject : this.data.subject,
      isTap: false
    })
    wx.setNavigationBarTitle({
      title: _self.data.subject
    })

    wx.request({
      url: app.globalData.domain + 'PineSystem/praxis/selectPraxisIds',
      method: 'POST',
      data: {
        subjectName: _self.data.subject,
        testerId: app.globalData.testerId
      },
      success: function (res) {
        app.globalData.questionIdList = res.data.pool.split(',').filter(function (item) {
          return item !== ''
        })
        _self.setData({
          allCount: res.data.sumNum,
          waitTestCount: res.data.poolNum,
          completedCount: res.data.testedNum
        })

        if (_self.data.waitTestCount == 0) {
          _self.setData({
            isTap: true
          })
          showMsg('该科目暂无未测题', _self)
        }
      },
      fail: function () {
        showMsg('请求失败', _self)
      }
    })
  },
  goTest: function (e) {
    this.setData({
      isTap: true
    })
    wx.navigateTo({
      url: '../testQuestion/testQuestion'
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
}, 1200)

  return timer
}
