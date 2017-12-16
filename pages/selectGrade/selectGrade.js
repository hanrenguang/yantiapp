const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    gradeList: []
  },
  onLoad: function () {
    var year = util.getCurYear(new Date())
    var gradeList = []

    for (let i = 0; i < 8; i++) {
      gradeList.push(year--)
    }

    this.setData({
      gradeList: gradeList
    })
  },
  tapGrade: function (e) {
    app.globalData.grade = e.target.dataset.grade
    wx.navigateBack({
      delta: 1
    })
  }
})
