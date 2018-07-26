//'use strict';
angular.module('app').value('dict', {}).run(['dict','$rootScope','$timeout',  function(dict,$rootScope,$timeout){

  // $http.get('data/city.json').success(function(resp){
  //   dict.city = resp;
  // });
  // $http.get('data/salary.json').success(function(resp){
  //   dict.salary = resp;
  // });
  // $http.get('data/scale.json').success(function(resp){
  //   dict.scale = resp;
  // });
  //   dict.postUrl = 'http://d3.cto.shovesoft.com/ltzy/';
    $rootScope.localhostimg = '/image/tou.png';
    $rootScope.showTips = function (msg) {
        alert(msg)
    };


    
    //角色多选
    dict.rolemultiple = function(newArr,oldArr,event,index){
        let targetdiv=event.currentTarget
        let id = oldArr[index].id
            if($(targetdiv).hasClass('border50')){
                $(targetdiv).removeClass('border50').addClass('bordere0');
                if(newArr.length<=0){return}
                newArr.forEach(function(item,indx){
                    if(id===newArr[indx]){
                        newArr.splice(indx,1)
                    }
                })
            }else{
                $(targetdiv).removeClass('bordere0').addClass('border50');
                newArr.push(id);
            }
            console.log(newArr)
            return newArr
    }

    // 记忆工能
    dict.remable = function(ajaxArr,newArr){

    }

    
    

    // 单次提交定时器
    dict.timeouts = function(flag=false,data=3000,fun){
        window.clearTimeout(tim);
        if(flag === false){
         var tim = $timeout(function(){
                fun(true)
            },data)
        }
    }
    $rootScope.no = '暂无数据';

    dict.timeConverter=function(UNIX_timestamp){

        var a = new Date(UNIX_timestamp);

        var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];

        var year = a.getFullYear();

        var month = months[a.getMonth()];

        var date = a.getDate()<10?'0'+a.getDate():a.getDate();

        var hour = a.getHours()<10?'0'+a.getHours():a.getHours();

        var min = a.getMinutes()<10?'0'+a.getMinutes():a.getMinutes();

        var sec = a.getSeconds()<10?'0'+a.getMinutes():a.getMinutes();

        // var time = date + '/' + month + '/' + year + '/' + hour + ':' + min + ':' + sec ;

        var time = year + '/' + month + '/' + date + ' ' + hour + ":" + min;

        return time;
    }

    //计算文字长度
    dict.GetLength = function(str) {
        return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
    };


    dict.timeConverter2=function(UNIX_timestamp){

        var a = new Date(UNIX_timestamp);

        var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];

        var year = a.getFullYear();

        var month = months[a.getMonth()];

        var date = a.getDate()<10?'0'+a.getDate():a.getDate();

        var hour = a.getHours()<10?'0'+a.getHours():a.getHours();

        var min = a.getMinutes()<10?'0'+a.getMinutes():a.getMinutes();

        var sec = a.getSeconds()<10?'0'+a.getMinutes():a.getMinutes();

        // var time = date + '/' + month + '/' + year + '/' + hour + ':' + min + ':' + sec ;

        var time = year + '-' + month + '-' + date + ' ' + hour + ":" + min + ':' + sec ;

        return time;
    }

    dict.timeConverter3=function(UNIX_timestamp,flag){

        var a = new Date(UNIX_timestamp);

        var months = ['1','2','3','4','5','6','7','8','9','10','11','12'];

        var year = a.getFullYear();

        var month = months[a.getMonth()];

        var date = a.getDate();

        var hour = a.getHours();

        if(flag===1){
            return year+'年'+month+'月'+date+'日';
        }else if(flag===3){
            return year+'-'+month+'-'+date
        }else if(flag===4){
            return year+'-'+'0'+month+'-'+'0'+date
        }else{
            return hour;
        }

    }

    dict.REX2=function (val){
        var parnt = /^[1-9]\d*(\.\d+)?$/;
        if(!parnt.exec(val)){
            alert("必须输入大于0的金额(数字)!");
            return;
        }else{
            return val
        }
    }

    dict.REX = function(obj){
        //修复第一个字符是小数点 的情况.
        if(obj !=''&& obj.substr(0,1) == '.'){
            obj="";
        }
        obj = obj.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效
        obj = obj.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
        obj = obj.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
        obj = obj.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
        if(obj.indexOf(".")< 0 && obj !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            if(obj.substr(0,1) == '0' && obj.length == 2){
                obj = obj.substr(1,obj.length);
            }
        }
    }


    dict.handleConFiles=function(e){
        console.info(e.target.files[0]);
        $('#annexfile').val(e.target.files[0].name);
        // $rootScope.filename = file.name.toString();
        // var type=files[0].type;
        // console.log(type);
        // console.log($rootScope.filename);
        // $('#annexfile').val($rootScope.filename);
        // //console.log(filename);
        // var reader = new FileReader();
        // reader.readAsDataURL(file);
        // reader.onload = function() {
        //     console.log(this.result);
        //     if(files[0].type.indexof(aplication)){//data:application/msword;base64,
        //
        //         //data:application/vnd.ms-excel;base64,
        //         // $rootScope.result64=this.result.split('data:image/jpeg;base64,',2)[1].toString();
        //     }else{
        //         // $rootScope.result64=this.result.split('data:image/jpeg;base64,',2)[1].toString();
        //     }
        //
        //
        //
        // };
    }
    dict.handleConFile=function(e,target,indx) {
        $(target).parent().parent().find('.annexfile').val(e.target.files[0].name);
        console.log(indx);
    }
    dict.uploadhandle=function(e,target){
        console.log(target);
        var type=$(target).attr("src");
        console.log($('.annexfile'));
        $('.annexfile').eq(type-1).val(e.target.files[0].name);
    }
    $('.mylook').on('hover',function(){
        $(this).find('.chart').show();
    })
}]);
