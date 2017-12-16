const app = getApp()
const WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    school: '',
    author: '',
    subject: '',
    combinationName: '',
    questions: [],
    hasSelection: false,
    selectionA: '',
    selectionB: '',
    selectionC: '',
    selectionD: '',
    bodyImgList: [],
    showAnswer: false,
    answer: '',
    answerImgList: [],
    analysis: '',
    analysisImgList: [],
    points: '',
    curQuestionIdx: 0,
    isShow: false,
    msg: '',
    canTapR: true,
    canTapU: true,
    canTapE: true,
    unTapR: true,
    unTapC: true,
    unTapE: true,
    isTapKfformula: false
  },
  onLoad: function () {
    var _self = this

    wx.request({
      url: app.globalData.domain + 'PineSystem/praxis/selectPraxis',
      method: 'POST',
      data: {
        praxisId: app.globalData.questionIdList[_self.data.curQuestionIdx]
      },
      success: function (res) {
        var data = res.data

        handleData(data, _self)
      },
      fail: function () {
        showMsg('请求失败', _self)
      }
    })
  },
  goPreQ: function (e) {
    var _self = this
    if (_self.data.curQuestionIdx <= 0) {
      _self.setData({
        msg: '没有上一题了',
        isShow: true
      })
      setTimeout(function () {
        _self.setData({
          msg: '',
          isShow: false
        })
      }, 1000)
      return
    }
    _self.setData({
      curQuestionIdx: --_self.data.curQuestionIdx
    })

    app.globalData.recordId = ''

    wx.request({
      url: app.globalData.domain + 'PineSystem/praxis/selectPraxis',
      method: 'POST',
      data: {
        praxisId: app.globalData.questionIdList[_self.data.curQuestionIdx]
      },
      success: function (res) {
        var data = res.data

        handleData(data, _self)
      },
      fail: function () {
        showMsg('请求失败', _self)
      }
    })
  },
  goNextQ: function (e) {
    var _self = this
    if (_self.data.curQuestionIdx >= app.globalData.questionIdList.length-1) {
      _self.setData({
        msg: '没有下一题了',
        isShow: true
      })
      setTimeout(function () {
        _self.setData({
          msg: '',
          isShow: false
        })
      }, 1000)
      return
    }
    _self.setData({
      curQuestionIdx: ++_self.data.curQuestionIdx
    })

    app.globalData.recordId = ''

    wx.request({
      url: app.globalData.domain + 'PineSystem/praxis/selectPraxis',
      method: 'POST',
      data: {
        praxisId: app.globalData.questionIdList[_self.data.curQuestionIdx]
      },
      success: function (res) {
        var data = res.data

        handleData(data, _self)
      },
      fail: function () {
        showMsg('请求失败', _self)
      }
    })
  },
  previewBodyImg: function (e) {
    var cur = e.target.dataset.url
    if (!cur) {
      return;
    }
    wx.previewImage({
      current: cur,
      urls: this.data.bodyImgList
    })
  },
  previewAnswerImg: function (e) {
    var cur = e.target.dataset.url
    if (!cur) {
      return;
    }
    wx.previewImage({
      current: cur,
      urls: this.data.answerImgList
    })
  },
  previewAnalysisImg: function (e) {
    var cur = e.target.dataset.url
    if (!cur) {
      return;
    }
    wx.previewImage({
      current: cur,
      urls: this.data.analysisImgList
    })
  },
  showAsw: function (e) {
    this.setData({
      showAnswer: !this.data.showAnswer
    })
  },
  hideAsw: function (e) {
    this.setData({
      showAnswer: !this.data.showAnswer
    })
  },
  rightTap: function (e) {
    var _self = this
    cantTapFunc(_self)

    wx.request({
      url: app.globalData.domain + 'PineSystem/praxis/testPraxis',
      method: 'POST',
      data: {
        praxisId: app.globalData.questionIdList[_self.data.curQuestionIdx],
        testerId: app.globalData.testerId,
        judge: '正确'
      },
      success: function (res) {
        if (res.data.status === 'successful') {
          showMsg('已设为正确', _self)
          _self.setData({
            unTapC: true,
            unTapE: true,
            unTapR: false
          })
        } else {
          showMsg('请求失败', _self)
        }
      },
      complete: function (res) {
        canTapFunc(_self)
      }
    })
  },
  uncertainTap: function (e) {
    var _self = this
    cantTapFunc(_self)

    wx.request({
      url: app.globalData.domain + 'PineSystem/praxis/testPraxis',
      method: 'POST',
      data: {
        praxisId: app.globalData.questionIdList[_self.data.curQuestionIdx],
        testerId: app.globalData.testerId,
        judge: '不确定'
      },
      success: function (res) {
        if (res.data.status === 'successful') {
          showMsg('已设为不确定', _self)
          _self.setData({
            unTapC: false,
            unTapR: true,
            unTapE: true
          })
        } else {
          showMsg('请求失败', _self)
        }
      },
      complete: function (res) {
        canTapFunc(_self)
      }
    })
  },
  errTap: function (e) {
    var _self = this
    cantTapFunc(_self)

    wx.request({
      url: app.globalData.domain + 'PineSystem/praxis/testPraxis',
      method: 'POST',
      data: {
        praxisId: app.globalData.questionIdList[_self.data.curQuestionIdx],
        testerId: app.globalData.testerId,
        judge: '错误'
      },
      success: function (res) {
        if (res.data.status === 'successful') {
          showMsg('正在跳转至反馈页', _self)
          _self.setData({
            unTapE: false,
            unTapC: true,
            unTapR: true
          })
          app.globalData.recordId = res.data.recordId
          wx.navigateTo({
            url: '../feedback/feedback'
          })
        } else {
          showMsg('请求失败', _self)
        }
      },
      complete: function (res) {
        canTapFunc(_self)
      }
    })
  },
  hideKfformula: function (e) {
    this.setData({
      isTapKfformula: false,
      kfformulaSrc: ''
    })
  }
})

function canTapFunc(self) {
  self.setData({
    canTapR: true,
    canTapU: true,
    canTapE: true
  })
}

function cantTapFunc(self) {
  self.setData({
    canTapR: false,
    canTapU: false,
    canTapE: false
  })
}

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

function handleData(data, _self) {
  WxParse.wxParse('questionBody', 'html', data.body, _self, 0);
  WxParse.wxParse('answer', 'html', data.answer, _self, 0);
  WxParse.wxParse('analysis', 'html', data.analysis, _self, 0);
  _self.setData({
    school: data.schoolName,
    author: data.createName,
    subject: data.subjectName,
    combinationName: data.combinationName,
    //questionBody: data.body,
    selectionA: data.selectionA ? 'A. ' + data.selectionA : '',
    selectionB: data.selectionB ? 'B. ' + data.selectionB : '',
    selectionC: data.selectionC ? 'C. ' + data.selectionC : '',
    selectionD: data.selectionD ? 'D. ' + data.selectionD : '',
    hasSelection: data.type === '选择题' ? true : false,
    bodyImgList: data.bodyAddress ? data.bodyAddress.split(',').filter(function (item) {
      return item !== ''
    }).map(function (item) {
      return app.globalData.imgUrl + item
    }) : [],
    //answer: data.answer,
    answerImgList: data.answerAddress ? data.answerAddress.split(',').filter(function (item) {
      return item !== ''
    }).map(function (item) {
      return app.globalData.imgUrl + item
    }) : [],
    //analysis: data.analysis,
    analysisImgList: data.analysisAddress ? data.analysisAddress.split(',').filter(function (item) {
      return item !== ''
    }).map(function (item) {
      return app.globalData.imgUrl + item
    }) : [],
    points: data.pointsName.split(',').join(' '),
    showAnswer: false,
    unTapR: true,
    unTapC: true,
    unTapE: true
  })
}
