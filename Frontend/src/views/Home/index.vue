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
            <p>上次登陆的地点：<span>浙江-杭州</span></p>
            <p>上次登陆的时间：<span>2022-09-18 23:52</span></p>
          </div>
        </el-card>

        <el-card class="box-card" style="margin-top:20px;">
        <div slot="header" class="clearfix">
          <span>日历</span>
        </div>
        <el-calendar v-model="value"></el-calendar>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top:20px">

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

        <el-card style="margin-top:20px; height:460px;">
  <!-- <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column v-for="(val,key) in tableLable" :key="key" :prop="key" :label="val"></el-table-column>
  </el-table> -->
  <div v-if="saleData" class="sale-image-container">
    <img :src="saleData.imageUrl" alt="本月销量图" class="sale-image">
  </div>
</el-card>


        <div class="graph">

            <el-card class="box-card" style="margin-top:20px;">

    <span>公告栏</span>

    <ul class="announcement-list">
  <li v-for="(announcement, index) in announcements" :key="index">
    {{ announcement }}
  </li>
</ul>

</el-card>


<el-card class="box-card" style="margin-top:20px;">
  <div slot="header" class="clearfix">
    <span>天气预报</span>
  </div>
  <div v-if="weatherData">
    <img :src="weatherData.imageUrl" alt="天气预报" style="width: 100%; height: auto;">
  </div>
  <div v-else>
    加载中...
  </div>
</el-card>


        </div>

      </el-col>


    </el-row>
  </template>
  
  <script>
  import { getData } from '@/api/data';
  import * as echarts from 'echarts';
  import ECharts from '@/components/ECharts';
  import axios from 'axios';
  
  export default {
    name: 'Home',
    components: {
      ECharts,
    },
    data() {
      return {
        announcements: [

      '1.重要通知：',
      '为了确保新员工顺利融入我们的团队，新员工培训计划已制定完成。所有新员工请按照指定时间和地点参加培训。详细信息请登录员工管理系统查看。',

'2.公告：',
'年度绩效评估即将开始。所有员工请在规定的时间内完成自评和上级评定。请留意评估系统中的通知，以了解更多细节。',

'3.提醒：',
'为了确保公司运转顺畅，提醒员工提前提交假期申请。请在员工管理系统中填写假期申请表格，并提前获得批准。',

'4.通知：',
'公司文化周活动即将展开！请所有员工留意员工管理系统上发布的活动安排，并积极参与各项活动，共同营造愉快的工作氛围。',

'5.公告：',
'一场重要会议将于本周召开，讨论公司未来发展方向及策略规划。请相关部门负责人提前准备，并准时参加会议。',

'6.提醒：',
'为提升公司员工的安全意识和应急处置能力，安全意识培训计划已启动。请所有员工按时参加培训并提高警惕。',

        ],
        userImg: require('@/assets/images/user.png'),
        tableData: [],
        tableLable: {
          brand: '品牌',
          monthSale: '本月销量',
          sales: '总销量',
        },
        countData: [{
          name: '今日待入职',
          value: '13',
          icon: 'success',
          color: 'cadetblue',
        },{
          name: '今日待转正',
          value: '8',
          icon: 'star-on',
          color: 'darkkhaki',
        },{
          name: '今日待续签合同',
          value: '14',
          icon: 's-goods',
          color: 'rosybrown',
        },{
          name: '本月待入职',
          value: '66',
          icon: 'success',
          color: 'cadetblue',
        },{
          name: '本月待转正',
          value: '30',
          icon: 'star-on',
          color: 'darkkhaki',
        },{
          name: '本月待续签合同',
          value: '45',
          icon: 's-goods',
          color: 'rosybrown',
        }],
        echartData: {
          order: {
            xData: [],
            series: [],
          },
          user: {
            xData: [],
            series: [],
          },
          video: {
            series: [],
          },
        },
        selectedDate: new Date(), // 初始化选中的日期为当前日期
        weatherData: {
            imageUrl: '/weather.png'
    },
    saleData: {
            imageUrl: '/sale.png'
    },
      };
    },
    methods: {
        fetchAnnouncements() {
    fetch('D:/CODE/EMS/EMS/Frontend/public/announcements_file.txt')
    .then(response => response.text())
      .then(text => {
        // 假设每条公告在txt文件中是以"数字. "开头的，例如 "1. 公告内容"
        this.announcements = text.split('\n').filter(line => line.startsWith('重要通知：') || line.startsWith('公告：') || line.startsWith('提醒：') || line.startsWith('通知：')).map((line, index) => {
          // 假设每个公告的标题都是以冒号结束的，这里我们去掉了序号和冒号前的部分
          return line.slice(line.indexOf('：') + 1);
        });
      })
      .catch(error => console.error('获取公告出错:', error));
  },



      handleDateChange(date) {
        console.log('Selected Date:', date);
        // 日期变化，重新加载数据
      },
    //   fetchWeatherData() {
    //   const apiKey = 'YOUR_API_KEY'; // 天气API密钥
    //   const city = 'YOUR_CITY_NAME'; // 获取天气的城市
    //   const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    //   axios.get(url)
    //     .then(response => {
    //       this.weatherData = response.data.current; // 天气数据在response.data.current
    //       //使用this.weatherData
    //     })
    //     .catch(error => {
    //       console.error('Error fetching weather data:', error);
    //     });
    // },
    },
    mounted() {
        this.fetchAnnouncements();
        // this.fetchWeatherData(); // 获取天气数据
      getData().then(res => {
        const { code, data } = res.data;
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
              data: order.data.map(val => val[item]),
            });
          });
  
          const options = {
            tooltip: {},
            xAxis: {
              data: xData,
            },
            yAxis: {},
            legend: {
              data: keyArr,
            },
            series,
          };
          this.echartData.order.xData = xData;
          this.echartData.order.series = series;
          const E = echarts.init(this.$refs.echarts);
          E.setOption(options);
  
          const userOptions = {
            tooltip: { trigger:'axis' },
            legend: {
              textStyle: {
                color: '#333',
              },
            },
            grid: {
              left: '20%',
            },
            xAxis: {
              type: 'category',
              data: data.userData.map(item => item.date),
              axisLine: {
                lineStyle: {
                  color: '#17b3a3',
                },
              },
              axisLabel: {
                color: '#333',
                interval: 0,
              },
            },
            yAxis: {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#17b3a3',
                },
              },
            },
            color: ['#2ec7c9', '#b6a2de'],
            series: [
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
            ],
          };
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
          ];
          const U = echarts.init(this.$refs.userEcharts);
          U.setOption(userOptions);
  
          const videoOptions = {
            tooltip: { trigger:'item' },
            series: [
              {
                data: data.videoData,
                type: 'pie',
              },
            ],
          };
          this.echartData.video.series = [
            {
              data: data.videoData,
              type: 'pie',
            },
          ];
          const V = echarts.init(this.$refs.videoEcharts);
          V.setOption(videoOptions);
        }
      });
    },
  };

  </script>
  
 <style scoped>
  .box-card {
    width: 100%;
    transition: all 0.3s;
  }
  .el-calendar {
    border: none;
  }
  .sale-image-container {
  text-align: center; 
}

.sale-image {
  max-width: 100%; 
  height: auto; 
}
.announcement-list li {
  font-size: 12px;  
  color: #003d66; 
}

</style>