<template>
        <el-row class="home" :gutter="20">
            <el-col :span="8" style="margin-top:20px">
                <el-card shadow="hover">
                    <div class="user">
                        <img :src="userImg">
                        <div class="userinfo">
                            <p class="name">Admin</p>
                            <p class="access">超级管理员</p>
                        </div>
                    </div>
                    <div class="login-info">
                        <p>上次登陆的时间：<span>浙江-杭州</span></p>
                        <p>上次登陆的地点：<span>2022-09-18 23:52</span></p>
                    </div>
                </el-card>
                <el-card style="margin-top:20px; height:460px;">
                    <el-table :data="tableData" stripe style="width: 100%">
                        <el-table-column v-for="(val,key) in tableLable" :key="key"
                            :prop="key"
                            :label="val"
                        >
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="16" style="margin-top:20px">
                <div class="num">
                    <el-card v-for="(item,index) in countData" :key="index" :body-style="{ display:'flex', padding:0 }">
                        <i class="icon" :class="`el-icon-`+ item.icon" :style="{ background:item.color }"></i>
                        <div class="detail">
                            <p class="num">{{item.value}}</p>
                            <p class="txt">{{item.name}}</p>
                        </div>
                    </el-card>
                </div>
                <el-card style="height:280px">
                    <!-- <div style="height:280px" ref="echarts"></div> -->
                    <ECharts :chartData="echartData.order" style="height:280px"></ECharts>
                </el-card>
                <div class="graph">
                    <el-card style="height:265px">
                        <!-- <div style="height:250px" ref="userEcharts"></div> -->
                        <ECharts :chartData="echartData.user" style="height:250px"></ECharts>
                    </el-card>
                    <el-card style="height:265px">
                        <!-- <div style="height:250px" ref="videoEcharts"></div> -->
                        <ECharts :chartData="echartData.video" :isAxisChart="false" style="height:250px"></ECharts>
                    </el-card>
                </div>
            </el-col>
        </el-row>
</template>

<script>
    
    import {getData} from '@/api/data'
    // import * as echarts from 'echarts'
    import ECharts from '@/components/ECharts'


    export default {
        name:'Home',
        components:{
            ECharts
        },
        data() {
            return {
                userImg: require('@/assets/images/user.png'),
                tableData: [],
                tableLable: {
                    brand: '品牌',
                    monthSale: '本月销量',
                    sales: '总销量'
                },
                countData: [{
                    name: '今日待入职',
                    value: '13',
                    icon: 'success',
                    color: 'cadetblue'
                },{
                    name: '今日待转正',
                    value: '8',
                    icon: 'star-on',
                    color: 'darkkhaki'
                },{
                    name: '今日待续签合同',
                    value: '14',
                    icon: 's-goods',
                    color: 'rosybrown'
                },{
                    name: '本月待入职',
                    value: '66',
                    icon: 'success',
                    color: 'cadetblue'
                },{
                    name: '本月待转正',
                    value: '30',
                    icon: 'star-on',
                    color: 'darkkhaki'
                },{
                    name: '本月待续签合同',
                    value: '45',
                    icon: 's-goods',
                    color: 'rosybrown'
                }],
                echartData: {
                    order: {
                        xData: [],
                        series: []
                    },
                    user: {
                        xData: [],
                        series: []
                    },
                    video: {
                        series: []
                    }
                }
                
            }
        },
        mounted() {
            getData().then(res => {
                const {code, data} = res.data;
                if (code === 20000) {
                    this.tableData = data.tableData;
                    const order = data.orderData;
                    const xData = order.date;
                    const keyArr = Object.keys(order.data[0]);
                    const series = [];
                    keyArr.forEach(item => {
                        series.push({
                            name: item,
                            type: 'line',
                            data: order.data.map(val => val[item])
                        })
                    })

                    // const options = {
                    //     tooltip: {},
                    //     xAxis: {
                    //         data: xData,
                    //     },
                    //     yAxis: {},
                    //     legend: {
                    //         data: keyArr
                    //     },
                        
                    //     series
                    // }
                    this.echartData.order.xData = xData;
                    this.echartData.order.series = series;
                    // const E = echarts.init(this.$refs.echarts);
                    // E.setOption(options)

                    // const userOptions = {
                    //     tooltip: { trigger:'axis' },
                    //     legend: {
                    //         textStyle: {
                    //             color: '#333'
                    //         }
                    //     },
                    //     grid: {
                    //         left: '20%',
                    //     },
                    //     xAxis: {
                    //         type: 'category',
                    //         data: data.userData.map(item => item.date),
                    //         axisLine: {
                    //             lineStyle: {
                    //                 color: '#17b3a3'
                    //             }
                    //         },
                    //         axisLabel: {
                    //             color: '#333',
                    //             interval: 0,
                    //         }
                    //     },
                    //     yAxis: {
                    //         type: 'value',
                    //         axisLine: {
                    //             lineStyle: {
                    //                 color: '#17b3a3'
                    //             }
                    //         },
                    //     },
                    //     color: ['#2ec7c9', '#b6a2de'],
                    //     series: [
                    //         {
                    //             name: '新增用户',
                    //             type: 'bar',
                    //             data: data.userData.map(item => item.new),
                    //         },
                    //         {
                    //             name: '活跃用户',
                    //             type: 'bar',
                    //             data: data.userData.map(item => item.active),
                    //         },
                    //     ]
                    // }
                    this.echartData.user.xData = data.userData.map(item => item.date);
                    this.echartData.user.series = [
                            {
                                name: '新增用户',
                                type: 'bar',
                                data: data.userData.map(item => item.new),
                            },
                            {
                                name: '活跃用户',
                                type: 'bar',
                                data: data.userData.map(item => item.active),
                            },
                        ]
                    // const U = echarts.init(this.$refs.userEcharts);
                    // U.setOption(userOptions);

                    // const videoOptions = {
                    //     tooltip: { trigger:'item' },
                    //     series: [
                    //         {
                    //             data: data.videoData,
                    //             type: 'pie',
                    //         }
                    //     ]
                    // }
                    this.echartData.video.series = [
                            {
                                data: data.videoData,
                                type: 'pie',
                            }
                        ]
                    // const V = echarts.init(this.$refs.videoEcharts);
                    // V.setOption(videoOptions);
                }
            })


        }
    }
</script>

<style>

</style>