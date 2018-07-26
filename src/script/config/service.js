angular.module('app').service('fileUpload', ['$http', 'server', function ($http, server) {
    this.uploadFileToUrl = function (file, uploadUrl,projectid,userid) {
        var fd = new FormData();
        fd.append('multipartFile', file);
        $http({
            method: 'POST',
            url: uploadUrl,
            // type:'json',
            data: fd,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).then(function successCallback(response) {
            // 请求成功执行代码da
            var data = response.data.data;
            var filename = data.fileName;
            var filePath = data.filePath;
           var size = data.size;
            server.server().savefile({
                fileName: filename,
                fileUrl: filePath,
                fileSize: size,
                dataId: projectid,
                createUser: userid
            }, function (data) {
                if (data.result === true) {
                    console.log(data.message);
                    alert('上传成功！');

                } else {
                    alert(data.message);
                }
            }, function (err) {

            });

        })
    }
}]);