/**
 * @ngdoc filter
 * @name mobile_seller_tools_activity.mod:upload
 * @function
 * @description
 * # upload
 * Mod in the mobile_seller_tools_activity.
 */
define(function(require, exports, module) {

    var application = TOP.mobile.application,
        failObj = {
            ret: false,
            local_url: '',
            cdn_url: '',
            err_msg: ''
        };

    return {

        _uploadCallback : null,

        /**
         * 设置失败
         */
        _setFailed : function (err_msg) {
            if( typeof(err_msg) === 'object' ) {
                if(err_msg.errorMsg){
                    failObj.err_msg = err_msg.errorMsg;
                }
                else {
                    failObj.err_msg = JSON.stringify(err_msg);
                }
            }
            else {
                failObj.err_msg = err_msg;
            }
            this._uploadCallback(failObj);
        },

        /**
         * 选文件
         * @param  {[type]} type   [description]
         * @param  {[type]} sucFn  [description]
         * @param  {[type]} failFn [description]
         * @return {[type]}        [description]
         */
        _selectFiles : function (type, sucFn, failFn) {
            var self = this;

            application.request({
                event: 'selectFiles',
                biz: {
                    actions: type==='camera' ? '0' : '1', //文件源： 0拍照 1相册
                    limit: 1 //可选择文件最大数，目前因android版本存在并发上传失败率高，且来不及开发支持数组上传的功能，因此暂时限制上传数为1个
                },
                success: function(selectFilesRes) {
                    try {
                        var picData = selectFilesRes.res[0];
                        //var pathUrl = decodeURIComponent(picData).split("localpath=")[1];
                        sucFn && sucFn(picData);
                    }
                    catch(e){
                        self._setFailed( e );
                        failFn && failFn(e);
                    }

                },
                error: function(selectFilesRes) {
                    //console.log('failure::selectFilesRes', selectFilesRes);
                    self._setFailed( selectFilesRes );
                    failFn && failFn(selectFilesRes);
                }
            });

        },

        /**
         * 图片裁剪
         * @return {[type]} [description]
         */
        _cropImage : function (pathUrl, width, height, sucFn, failFn) {
            var self = this;

            //$('body').append('<p style="padding-bottom:60px;">裁剪图片：'+JSON.stringify(pathUrl)+'</p>');

            application.request({
                event:'cropImage',
                biz:{
                    type : 'fileurl',
                    data : pathUrl,
                    initWidth : width,
                    initHeight : height,
                    fixedRatio : 'fixedRatio'
                },
                success:function(res){
                    var picData = res.res;
                    sucFn && sucFn(picData);
                },
                error:function(res){
                    self._setFailed( res );
                    failFn && failFn(res);
                }
            });

        },

        /**
         * 上传文件
         * @return {[type]} [description]
         */
        _uploadFiles : function (picData, type, sucFn, failFn) {
            var self = this,
                uri;

            if(type == 'fileurl'){ //图片的全路径
                uri = picData;
            }
            else if(type == 'dataurl'){ //图片二进制
                uri = 'stream://data='+encodeURIComponent(picData)+'&mimetype=image/jpeg';
            }

            //$('body').append('<p style="padding-bottom:60px;">上传图片：'+encodeURIComponent(picData)+'</p>');

            application.request({
                event: 'uploadFilesToCDN',
                biz: {
                    bizCode: 'citylife', //circles_B2C
                    uri: uri
                },
                success: function(uploadFilesToCDNRes) {
                    //console.log('success::uploadFilesToCDNRes', uploadFilesToCDNRes);
                    try {
                        if (uploadFilesToCDNRes.errorMsg) {
                            self._setFailed( uploadFilesToCDNRes );
                            failFn && failFn(uploadFilesToCDNRes);
                            return;
                        }
                        var picUrl = decodeURIComponent(uploadFilesToCDNRes.uri).split('url=')[1];
                        sucFn && sucFn({ //成功了的回调
                            ret: true,
                            local_url: '',
                            cdn_url: picUrl,
                            err_msg: ''
                        });

                    } catch (e) {
                        self._setFailed( JSON.stringify(e) );
                        failFn && failFn(e);
                    }
                },
                error: function(uploadFilesToCDNRes) {
                    //console.log('failure::uploadFilesToCDNRes', uploadFilesToCDNRes);
                    self._setFailed( uploadFilesToCDNRes );
                    failFn && failFn(uploadFilesToCDNRes);
                }
            });

        },

        _isIOS : function () {
            var ua = window.navigator.userAgent;
            var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
            var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
            var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

            if (ipad || iphone || ipod) {
                return true;
            }
            else{
                return false;
            }
        },

        /**
         * 执行裁剪上传
         * @param  {[type]} options             [description]
         * @param  {[type]} uploadFilesCallback [description]
         * @return {[type]}                     [description]
         */
        cropUpload : function(options, uploadFilesCallback) {
            var self = this;

            if(typeof application === 'undefined'){
                alert('没有引入千牛插件，或者页面不在千牛中运行');
                return;
            }

            var type = options.type || 'camera',
                width = options.width || 640,
                height = options.height || 400;

            self._uploadCallback = uploadFilesCallback ? uploadFilesCallback : null;

            self._selectFiles(type, function(picData){

                var pathUrl = decodeURIComponent(picData).split("localpath=")[1];

                //如果是ios,需要延迟300ms才进入裁图，因为有个动画过场

                if(self._isIOS()){
                    setTimeout(function(){
                        self._cropImage(pathUrl, width, height, function(picData){

                            self._uploadFiles(picData, 'dataurl', function(uploadFilesToCDNRes){
                                uploadFilesCallback(uploadFilesToCDNRes);
                            });

                        });
                    }, 300);
                }
                else {
                    self._cropImage(pathUrl, width, height, function(picData){

                        self._uploadFiles(picData, 'dataurl', function(uploadFilesToCDNRes){
                            uploadFilesCallback(uploadFilesToCDNRes);
                        });

                    });
                }

            });

        },

        /**
         * 执行直接上传
         * @param  {[type]} options             [description]
         * @param  {[type]} uploadFilesCallback [description]
         * @return {[type]}                     [description]
         */
        doUpload : function (options, uploadFilesCallback) {
            var self = this;

            if(typeof application === 'undefined'){
                alert('没有引入千牛插件，或者页面不在千牛中运行');
                return;
            }

            var type = options.type || 'camera';

            self._uploadCallback = uploadFilesCallback ? uploadFilesCallback : null;

            self._selectFiles(type, function(picData){

                self._uploadFiles(picData, 'fileurl', function(uploadFilesToCDNRes){
                    uploadFilesCallback(uploadFilesToCDNRes);
                });

            });

        }

    };

});
