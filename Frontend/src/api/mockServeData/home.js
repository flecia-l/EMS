import Mock from 'mockjs'

let list = []
export default {
    getStatisticalData: () => {
        for (let i = 0; i < 7; i++) {
            list.push(Mock.mock({
                苹果:Mock.Random.float(100, 8000, 0, 0),
                三星:Mock.Random.float(100, 8000, 0, 0),
                华为:Mock.Random.float(100, 8000, 0, 0),
                小米:Mock.Random.float(100, 8000, 0, 0),
                OPPO:Mock.Random.float(100, 8000, 0, 0),
                VIVO:Mock.Random.float(100, 8000, 0, 0),
            }))
        }
        return {
            code: 20000,
            data: {
                //饼图
                videoData:[
                    {
                        name: '苹果',
                        value: 5999
                    },
                    {
                        name: '小米',
                        value: 2999
                    },
                    {
                        name: '华为',
                        value: 5999
                    },
                    {
                        name: '三星',
                        value: 4999
                    },
                    {
                        name: 'VIVO',
                        value: 1999
                    },
                    {
                        name: 'OPPO',
                        value: 2999
                    },
                ],
                //柱状图
                userData:[
                    {
                        date: '周一',
                        new: 23,
                        active: 213,
                    },
                    {
                        date: '周二',
                        new: 43,
                        active: 324,
                    },
                    {
                        date: '周三',
                        new: 34,
                        active:674,
                    },
                    {
                        date: '周四',
                        new: 45,
                        active: 456,
                    },
                    {
                        date: '周五',
                        new: 80,
                        active:576,
                    },
                    {
                        date: '周六',
                        new: 32,
                        active: 234,
                    },
                    {
                        date: '周末',
                        new: 82,
                        active: 983,
                    },
                ],
                //折线图
                orderData: {
                    date: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    data: list
                },
                tableData: [{
                    brand: '苹果',
                    monthSale: '113121',
                    sales: '932977'
                }, {
                    brand: '三星',
                    monthSale: '23212',
                    sales: '465641'
                }, {
                    brand: '华为',
                    monthSale: '89324',
                    sales: '732022'
                }, {
                    brand: '小米',
                    monthSale: '32434',
                    sales: '803094'
                }, {
                    brand: 'OPPO',
                    monthSale: '12303',
                    sales: '293821'
                }, {
                    brand: 'VIVO',
                    monthSale: '20931',
                    sales: '294823'
                }],

            }
        }
    }
}