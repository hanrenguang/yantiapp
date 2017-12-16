const app = getApp();

Page({
  data: {
    schoolName: '',
    schoolList: [],
    searchClass: 'search-default',
    showMsg: false,
    msg: '',
    isShow: false
  },
  onLoad: function () {
    var _self = this
    wx.request({
      url: app.globalData.domain + 'PineSystem/school/getAllSchool',
      method: 'POST',
      data: {},
      success: function (res) {
        var schoolList = []

        for (var key in res.data) {
          if (res.data[key].schoolName) {
            schoolList.push(res.data[key].schoolName)
          }
        }

        _self.setData({
          schoolList: schoolList
        })
      },
      fail: function () {
        showMsg('请求失败', _self)
      }
    })
  },
  onInput: function (e) {
    this.setData({
      schoolName: e.detail.value
    })
  },
  onFocus: function (e) {
    this.setData({
      searchClass: 'search-enter',
      showMsg: false
    })
  },
  onBlur: function (e) {
    if (!this.data.schoolName) {
      this.setData({
        searchClass: 'search-default'
      })
    }
  },
  searchSchool: function (e) {
    var _self = this

    // 清空列表
    _self.setData({
      schoolList: []
    });

    wx.request({
      url: app.globalData.domain + 'PineSystem/school/selectSchoolByName',
      method: 'POST',
      data: {
        schoolName: this.data.schoolName
      },
      success: function (res) {
        if (!res.data.schoolName) {
          _self.setData({
            schoolList: [],
            showMsg: true
          })
          return;
        }
        var newSchool = [res.data.schoolName];
        _self.setData({
          schoolName: '',
          searchClass: 'search-default',
          schoolList: _self.data.schoolList.concat(newSchool),
          showMsg: false
        })
      },
      fail: function () {
        showMsg('请求失败', _self)
      }
    })
  },
  tapSchool: function (e) {
    app.globalData.school = e.target.dataset.school
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
