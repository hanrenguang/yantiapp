const app = getApp()
const util = require('../../utils/util')

Page({
  data: {
    feedbackDetail: '',
    tempFilePath: '',
    msg: '',
    isShow: false,
    feedbackId: ''
  },
  onLoad: function () {
    var _self = this
    wx.request({
      url: app.globalData.domain + 'PineSystem/praxis/praxisFeedback',
      method: 'POST',
      data: {
        recordId: app.globalData.recordId
      },
      success: function (res) {
        if (res.data.status === 'successful') {
          _self.setData({
            feedbackId: res.data.feedbackId
          })
        }
      },
      fail: function () {
        showMsg('请求失败', _self)
      }
    })
  },
  chooseImg: function (e) {
    var _self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        _self.setData({
          tempFilePath: res.tempFilePaths[0]
        })
        wx.uploadFile({
          url: app.globalData.domain + 'PineSystem/praxis/feedbackImage',
          filePath: _self.data.tempFilePath,
          name: 'file',
          formData:{
            feedbackId: _self.data.feedbackId
          },
          success: function (res) {
            var data = res.data
            if (data === 'error') {
              showMsg('上传失败', _self)
              return
            }
            showMsg('成功上传图片', _self)
          },
          fail: function (res) {
            showMsg('请求失败', _self)
          }
        })
      }
    })
  },
  textareaInput: function (e) {
    this.setData({
      feedbackDetail: e.detail.value
    })
  },
  submitTap: function (e) {
    var _self = this
    if (!_self.data.feedbackDetail) {
      showMsg('请填写反馈信息', _self)
      return
    }

    wx.showModal({
      title: '提示',
      content: '确定提交反馈信息吗？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.domain + 'PineSystem/praxis/praxisFeedback',
            method: 'POST',
            data: {
              feedbackId: _self.data.feedbackId,
              feedbackDetail: _self.data.feedbackDetail
            },
            success: function (res) {
              showMsg('正在返回测题页面', _self)
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      },
      fail: function () {
        showMsg('请求失败', _self)
      }
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
