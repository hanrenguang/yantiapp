//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    phoneNumber: '',
    schoolInfo: '',
    gradeInfo: '',
    nameInfo: '',
    qqNumber: '',
    academyInfo: '',
    klass: '',
    tempFilePath: '',
    msg: '',
    isShow: false,
    phoneErr: false,
    nameErr: false,
    qqErr: false,
    klassErr: false,
    canTap: true
  },
  onShow: function () {
    if (this.data.schoolInfo !== app.globalData.school) {
      app.globalData.academy = ''
      this.setData({
        academyInfo: ''
      })
    }
    this.setData({
      schoolInfo: app.globalData.school,
      gradeInfo: app.globalData.grade,
      academyInfo: app.globalData.academy
    })
  },
  phoneFocus: function (e) {
    this.setData({
      phoneErr: false
    })
  },
  nameFocus: function (e) {
    this.setData({
      nameErr: false
    })
  },
  qqFocus: function (e) {
    this.setData({
      qqErr: false
    })
  },
  klassFocus: function (e) {
    this.setData({
      klassErr: false
    })
  },
  phoneBlur: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  nameBlur: function (e) {
    this.setData({
      nameInfo: e.detail.value
    })
  },
  qqBlur: function (e) {
    this.setData({
      qqNumber: e.detail.value
    })
  },
  klassBlur: function (e) {
    this.setData({
      klass: e.detail.value
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
        showMsg('成功选中图片', _self)
      }
    })
  },
  submitTap: function (e) {
    var _self = this
    var hasErr = false

    if (!util.checkPhoneNumber(_self.data.phoneNumber.trim())) {
      hasErr = true
      _self.setData({
        phoneErr: true
      })
      if (!_self.data.phoneNumber.trim()) {
        if (!_self.data.isShow) {
          showMsg('请输入手机号', _self)
        }
      }
    }
    if (!util.checkName(_self.data.nameInfo.trim())) {
      hasErr = true
      _self.setData({
        nameErr: true
      })
      if (!_self.data.nameInfo.trim()) {
        if (!_self.data.isShow) {
          showMsg('请输入姓名', _self)
        }
      }
    }
    if (!util.checkQQ(_self.data.qqNumber.trim())) {
      hasErr = true
      _self.setData({
        qqErr: true
      })
      if (!_self.data.qqNumber.trim()) {
        if (!_self.data.isShow) {
          showMsg('请输入QQ号', _self)
        }
      }
    }
    if (!util.checkSchool(_self.data.schoolInfo)) {
      hasErr = true
      if (!_self.data.isShow) {
        showMsg('请选择学校', _self)
      }
    }
    if (!util.checkAcademy(_self.data.academyInfo)) {
      hasErr = true
      if (!_self.data.isShow) {
        showMsg('请选择学院', _self)
      }
    }
    if (!util.checkGrade(_self.data.gradeInfo)) {
      hasErr = true
      if (!_self.data.isShow) {
        showMsg('请选择年级', _self)
      }
    }
    if (!util.checkKlass(_self.data.klass.trim())) {
      hasErr = true
      _self.setData({
        klassErr: true
      })
      if (!_self.data.klass.trim()) {
        if (!_self.data.isShow) {
          showMsg('请输入班级', _self)
        }
      }
    }
    if (!_self.data.tempFilePath) {
      hasErr = true
      if (!_self.data.isShow) {
        showMsg('请选择学生证照片', _self)
      }
    }

    if (hasErr) {
      return
    }

    _self.setData({
      canTap: false
    })

    // upload img & post input
    wx.uploadFile({
      url: app.globalData.domain + 'PineSystem/tester/register',
      filePath: _self.data.tempFilePath,
      name: 'file',
      formData:{
        // testerName: encodeURI(_self.data.nameInfo.trim()),
        // phoneNumber: encodeURI(_self.data.phoneNumber.trim()),
        // qqNumber: encodeURI(_self.data.qqNumber.trim()),
        // schoolName: encodeURI(_self.data.schoolInfo),
        // academyName: encodeURI(_self.data.academyInfo),
        // grade: encodeURI(_self.data.gradeInfo),
        // clazz: encodeURI(_self.data.klass.trim())
        testerName: _self.data.nameInfo.trim(),
        phoneNumber: _self.data.phoneNumber.trim(),
        qqNumber: _self.data.qqNumber.trim(),
        schoolName: _self.data.schoolInfo,
        academyName: _self.data.academyInfo,
        grade: _self.data.gradeInfo,
        clazz: _self.data.klass.trim()
      },
      success: function (res) {
        var data = JSON.parse(res.data)

        app.globalData.phoneNumber = _self.data.phoneNumber.trim()
        app.globalData.testerId = data.testerId

        wx.setStorageSync('phoneNumber', _self.data.phoneNumber.trim())
        wx.setStorageSync('testerId', data.testerId)

        //do something
        wx.redirectTo({
          url: '../myself/myself'
        })
      },
      complete: function (res) {
        _self.setData({
          canTap: true
        })
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
