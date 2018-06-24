/**
 * 首页行程数据查询
 */
import Mock from 'mockjs';
const Random = Mock.Random;

const Location = [
    '北京',
    '天津',
    '青岛',
    '石家庄',
    '太原',
    '大连',
    '上海',
    '杭州',
    '南京',
    '苏州',
    '武汉',
    '西安',
    '兰州',
    '成都',
    '青海',
    '哈尔滨'
];

function getLocation(){
    const Loca = [];
    const Len = Math.ceil(Math.random() * 5);
    const Length = Location.length;
    for(let i=0; i<Len; i++){
        Loca.push(Location[Math.floor(Math.random()*Length)]);
    }
    return Loca;
}

function getTrip(){
    return [1,2,3,4,5,6,7,8,9,0].map(()=>{
        return {
            tripId: Math.random(),
            userId: Math.random(),
            userImg: Random.image('50X50'),
            userName: Random.string(3, 6),
            createTime: Random.datetime('yyyy-MM-dd'),
            location: getLocation(),
            startTime: Random.date('yyyy-MM-dd'),
            endTime: Random.date('yyyy-MM-dd')
        };
    });
}

export default () => {
    return {
        data: {
            code: 20000,
            msg: 'success',
            data: {
                count: 45,
                list: getTrip()
            }
        }
    }
}
