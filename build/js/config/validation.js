//'use strict';
angular.module('app').config(['$validationProvider', function($validationProvider) {
  //表单验证
  var expression = {
    phone: /^1[\d]{10}$/,
    Require: /.+/,
    Email: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/,
    Phone: /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/,
      // Mobile: /^(0|86|17951)?(13[0-9]|15[012356789]|17[03678]|18[0-9]|14[57])[0-9]{8}$/,
      Mobile: /^\d+$/,
    Url: /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
    Currency: /^\d+(\.\d+)?$/,
    Number: /^\d+$/,
      // Bilu:/(^[1-9][0-9]$)|(^100&)|(^[1-9]$)$/,^(100|[1-9]\d|\d)(.\d{1,2})?%$
      Bilu:/(^[1-9][0-9]$)|(^100&)|(^[1-9]$)$/,
    Float:/^[0-9]+(.[0-9]{1,5})?$/,
    Zip: /^[1-9]\d{5}$/,
    QQ: /^[1-9]\d{4,8}$/,
    Integer: /^[-\+]?\d+$/,
    Double: /^[-\+]?\d+(\.\d+)?$/,
    English: /^[A-Za-z]+$/,
    Chinese: /^[\u0391-\uFFE5]+$/,
    Username: /^[a-z]\w{3,}$/i,
    Password: /^[\@A-Za-z0-9\!_\#\$\%\^\&\*\.\~]{8,22}$/,
    UnSafe: /^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/,
    Ip: /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/,
      // IDCard: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
    IDCard: /^\d+$/,
    DataFormat:/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
      // BankID:/^([1-9]{1})(\d{14}|\d{18})$/,
      BankID:/^\d+$/,
    ID:/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,

    password: function(value) {
      var str = value + ''
      return str.length > 5;
    },
    projectName:function (value) {
        var str = value + ''
        return str.length > 5 && str.length<=60;
    },
    process:function(value){
        return !!value;
    },
    required: function(value) {
      return !!value;
    },
    username:function(value) {
      return !!value;
    },

      textnote:function(value) {
          return !!value;
      },

    rate:function(value) {
        value = parseInt(value);
          return value>=0;
    },
      date:function(value) {
          value = parseInt(value);
          return value>=1&&value<=365;
      },
      rateData:function(value) {
          value = parseInt(value);
          return value>=0&&value<=100;
      },
  };
  //错误提示
  var defaultMsg = {
      projectName:{
          success: '',
          error: '*输入的长度必须大于5个字符且小于60个字符'
      },

      textnote:{
          success: '',
          error: '*描述内容不能为空'
      },

      date:{
          success: '',
          error: '*输入的日期必须大于1天且小于365'
      },
      rate:{
          success: '',
          error: '*比例必须大于等于0'
      },
      rateData:{
          success: '',
          error: '*比例必须大于等于0且小于等于100'
      },
      Currency:{
          success: '',
          error: '*数字必须为正数'
      },

      username:{
          success: '',
          error: '*名字不能为空'
      },
    required:{
          success: '',
          error: '*数据不能为空'
    },
    Phone: {
      success: '',
      error: '*请输入格式正确的电话号码'
    },
    Mobile: {
        success: '',
        error: '*请输入格式正确的11位手机号码'
    },
    IDCard:{
      success:'',
        error:'请输入格式正确的身份证号码'
    },
    Bilu:{
        success:'',
        error:'请输入格式为0-100之间的数值'
    },
    BankID:{
        success:'',
        error:'请输入正确格式的银行帐号'
    },
    ID:{
        success:'',
        error:'请输入15或18数字的身份证号码'
    },
    DataFormat:{
      success:'',
          error:'请输入正确的日期格式'
    },
      Number:{
          success:'',
          error:'请输入正确的面积'
      },
  };
  $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}]);
