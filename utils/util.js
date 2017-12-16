function checkQQ(qq) {
  var reg = /^\d+$/

  return reg.test(qq)
}

function checkSchool(school) {
  if (!school) {
    return false
  } else {
    return true
  }
}

function checkAcademy(academy) {
  if (!academy) {
    return false
  } else {
    return true
  }
}

function checkGrade(grade) {
  if (!grade) {
    return false
  } else {
    return true
  }
}

function checkName(name) {
  if (!name) {
    return false
  } else {
    return true
  }
}

function checkKlass(klass) {
  if (!klass) {
    return false
  } else {
    return true
  }
}

function checkPhoneNumber(phoneNumber) {
  var reg = /^1[3|4|5|7|8]\d{9}$/

  return reg.test(phoneNumber)
}

function getCurYear(date) {
  var year = date.getFullYear()

  return year
}

function json2Form(json) {
  var str = []
  for(var key in json){
    str.push(encodeURIComponent(key) + "=" + encodeURIComponent(json[key]))
  }
  return str.join("&")
}

module.exports = {
  checkPhoneNumber: checkPhoneNumber,
  checkQQ: checkQQ,
  checkSchool: checkSchool,
  checkAcademy: checkAcademy,
  checkGrade: checkGrade,
  checkName: checkName,
  checkKlass: checkKlass,
  getCurYear: getCurYear,
  json2Form: json2Form
}
