/**
 * 请求服务
 */
import wepy from 'wepy';

const host = 'https://wxtx.ilvdudu.com/v1/';
const HttpService = {
    // 接口map
    Apis: {
        list: 'list' // 测试
    },
    _getUrl (name) {
        return host + (HttpService.Apis['name'] || name);
    },
    Post (config) {
        wx.showLoading({
            title: '请求中...',
            mask: true
        });
        const { urlName, data, success, fail, complete, page } = config;
        return wepy.request({
                    url: HttpService._getUrl(urlName),
                    method: 'POST',
                    header: {
                        uid: wx.getStorageSync('uid'),
                        page: page || 'notFound',
                        platform: 'wechat',
                        'content-type':'application/x-www-form-urlencoded'
                    },
                    data,
                    success: HttpService._success.bind(HttpService, success),
                    fail: HttpService._fail.bind(HttpService, fail),
                    complete: HttpService._complete.bind(HttpService, complete)
            });
    },
    Get (config) {
        wx.showLoading({
            title: '请求中...',
            mask: true
        });
        const { urlName, data, success, fail, complete, page } = config;
        const params = [];
        for(let key in data){
            params.push(`${key}=${data[key]}`);
        }
        return wepy.request({
                    url: HttpService._getUrl(urlName) + `?${params.join('&')}`,
                    method: 'GET',
                    header: {
                        uid: wx.getStorageSync('uid'),
                        page: page || 'notFound',
                        platform: 'wechat'
                    },
                    success: HttpService._success.bind(HttpService, success),
                    fail: HttpService._fail.bind(HttpService, fail),
                    complete: HttpService._complete.bind(HttpService, complete)
            });
    },
    _success (success, res, statusCode, header) {
        const { code, msg, data} = res.data;
        if(code === 20000){
            success && success(code, data, msg);
        }else if(code === 99999){
            
        }else{
            console.error(msg);
        }
    },
    _fail (fail, err) {
        fail && fail();
        console.log('request fail:', err);
    },
    _complete (complete, xhr, status) {
        if(status === 'timeout'){
            console.warn('请求超时');
        }
        wx.hideLoading();
        complete && complete();
    }
};

export default HttpService