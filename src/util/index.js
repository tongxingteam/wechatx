/**
 * 请求服务
 */
import wepy from 'wepy';

import QueryTripListByWord from '../mock/queryTripListByWord';
import PublishTrip from '../mock/publishTrip';

const mockData = {
    queryTripListByWord: QueryTripListByWord,
    publishTrip: PublishTrip
};

const DEBUG = false;
const host = 'https://wxtx.ilvdudu.com/v1/';
const HttpService = {
    // 接口map
    Apis: {
        queryTripListByWord: 'queryTripListByWord', // 查询行程列表
        publishTrip: 'publishTrip' //  发布行程
    },
    _getUrl (name) {
        return host + (HttpService.Apis[name] || name);
    },
    async Post (config) {
        const { urlName, data, success, fail, complete, page } = config;
        if(DEBUG){
            await sleep(3);
            HttpService._success.bind(HttpService, success, fail)(mockData[urlName]());
            complete && complete();
        }else{
            return wepy.request({
                url: HttpService._getUrl(urlName),
                method: 'POST',
                header: {
                    uid: wx.getStorageSync('uid'),
                    page: '',
                    platform: 'wechat',
                    'content-type':'application/x-www-form-urlencoded'
                },
                data,
                success: HttpService._success.bind(HttpService, success, fail),
                fail: HttpService._fail.bind(HttpService, fail),
                complete: HttpService._complete.bind(HttpService, complete)
            });
        }
    },
    async Get (config) {
        const { urlName, data, success, fail, complete, page } = config;
        const params = [];
        for(let key in data){
            params.push(`${key}=${data[key]}`);
        }
        if(DEBUG){
            await sleep(3);
            HttpService._success.bind(HttpService, success, fail)(mockData[urlName]());
            complete && complete();
        }else{
            return wepy.request({
                url: HttpService._getUrl(urlName) + `?${params.join('&')}`,
                method: 'GET',
                header: {
                    uid: wx.getStorageSync('uid'),
                    page: '',
                    platform: 'wechat'
                },
                success: HttpService._success.bind(HttpService, success),
                fail: HttpService._fail.bind(HttpService, fail),
                complete: HttpService._complete.bind(HttpService, complete)
            });
        }
    },
    _success (success, fail, res, statusCode, header) {
        if(typeof res === 'undefined'){
            fail && fail('请求失败');
            return;
        }

        const { code, msg, data} = res.data;
       
        if(code === 20000){
            success && success(+code, data, msg);
        }else{
            if(code === 99999){ // 非法操作
                wx.showToast({
                    title: '非法操作',
                    icon: 'none',
                    duration: 2500,
                    mask: true
                });
            }
            fail && fail(msg);
            console.log(msg);
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
        complete && complete();
    }
};

function sleep(s){
    return new Promise(function(resolve){
        setTimeout(()=>{
            resolve();
        }, s*1000);
    });
}

export default HttpService