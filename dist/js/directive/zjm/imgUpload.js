angular.module("app").directive("fileModel",["$parse","$http",function(e,t){return{restrict:"AE",scope:!1,template:'<div class="fl"><input type="button" id="storeBtn" style="padding:0; position: absolute; top: 0; left: 0; background: none; border: none;color: #fff; width:84px; height: 30px; line-height: 30px;" value="选择文件"><input type="file" name="testReport" id="file" ng-disabled="imgDisabled" style="position: absolute; top: 0; left: 0; opacity: 0;height: 30px;" accept="image/*"></div>',replace:!0,link:function(e,a,i){a.bind("click",function(){$("#file").val("")}),a.bind("change",function(){if(e.file=a[0].children[1].files,e.file[0].size>52428800)return alert("图片大小不大于50M"),e.file=null,!1;e.fileName=e.file[0].name;var i=e.fileName.substring(e.fileName.lastIndexOf(".")+1).toLowerCase();if("jpg"!=i&&"png"!=i&&"jpeg"!=i)return alert("图片仅支持png、jpg、jpeg类型的文件"),e.fileName="",e.file=null,e.$apply(),!1;if(e.$apply(),e.file){var l=new FormData,n=e.file[0];l.append("multipartFile",n),t({method:"POST",url:"http://192.168.5.32:8080/web-sample/attachment/fielUpload.do",data:l,headers:{"Content-Type":void 0},transformRequest:angular.identity}).then(function(t){e.data=t.data.data,console.log(e.data),e.thumb={imgSrc:e.data.filePath,picName:e.data.fileName},console.log(e.data)})}else alert("上传图片不能为空!")})}}}]);