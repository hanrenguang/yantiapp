const app = getApp()

Page({
  data: {
    subject: '',
    searchClass: 'search-default',
    subjectList: [],
    showMsg: false,
    isShow: false,
    msg: ''
  },
  onLoad: function () {
    var _self = this
    wx.request({
      url: app.globalData.domain + 'PineSystem/subject/getAllSubject',
      method: 'POST',
      data: {},
      success: function (res) {
        var subjectList = []

        for (var key in res.data) {
          if (res.data[key].subjectName) {
            subjectList.push(res.data[key].subjectName)
          }
        }

        _self.setData({
          subjectList: subjectList
        })
      },
      fail: function () {
        showMsg('请求失败', _self)
      }
    })
  },
  onInput: function (e) {
    this.setData({
      subject: e.detail.value
    })
  },
  onFocus: function (e) {
    this.setData({
      searchClass: 'search-enter',
      showMsg: false
    })
  },
  onBlur: function (e) {
    if (!this.data.subject) {
      this.setData({
        searchClass: 'search-default'
      })
    }
  },
  searchSubject: function (e) {
    var _self = this

    // 清空列表
    _self.setData({
      subjectList: []
    });

    wx.request({
      url: app.globalData.domain + 'PineSystem/subject/selectSubject',
      method: 'POST',
      data: {
        subjectName: this.data.subject
      },
      success: function (res) {
        if (!res.data.subjectName) {
          _self.setData({
            subjectList: [],
            showMsg: true
          })
          return;
        }
        var newSubject = [res.data.subjectName];
        _self.setData({
          subject: '',
          searchClass: 'search-default',
          subjectList: _self.data.subjectList.concat(newSubject),
          showMsg: false
        })
      },
      fail: function () {
        showMsg('请求失败', _self)
      }
    })
  },
  tapSubject: function (e) {
    app.globalData.subject = e.target.dataset.subject
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
