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
          <p>上次登陆的地点：<span>{{ lastLogin.location }}</span></p>
          <p>上次登陆的时间：<span>{{ lastLogin.time }}</span></p>
        </div>
      </el-card>

      <el-card class="box-card calendar-card" style="margin-top:20px;">
        <div slot="header" class="clearfix">
          <span>日历</span>
        </div>
        <el-calendar v-model="value"></el-calendar>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top:20px"></el-col>

    <el-col :span="16" style="margin-top:20px">
      <div class="num">
        <el-card v-for="(item, index) in countData" :key="index" :body-style="{ display: 'flex', padding: 0 }">
          <i class="icon" :class="`el-icon-` + item.icon" :style="{ background: item.color }"></i>
          <div class="detail">
            <p class="num">{{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>

      <el-card style="margin-top:20px; height:460px;">
        <div v-if="saleData" class="sale-image-container">
          <img :src="saleData.imageUrl" alt="本月销量图" class="sale-image">
        </div>
      </el-card>

      <el-card class="box-card" style="margin-top:20px;">
        <div slot="header" class="clearfix">
          <span>公告栏</span>
        </div>
        <ul class="announcement-list">
          <li v-for="(announcement, index) in announcements" :key="index" class="announcement-item">
            <!-- Line container for vertical line and bullet -->
            <div class="line-container">
              <!-- Vertical line -->
              <div class="vertical-line"></div>
              <!-- Bullet point -->
              <div class="bullet" v-if="hasNumber(announcement)"></div>
            </div>
            <!-- Announcement content -->
            <span class="content">{{ announcement }}</span>
            <!-- Horizontal line after each announcement, except the last one -->
            <div v-if="index !== announcements.length - 1" class="horizontal-line"></div>
          </li>
        </ul>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import Mock from 'mockjs';
import { getData } from '@/api/data';
import * as echarts from 'echarts';
import ECharts from '@/components/ECharts';

export default {
  name: 'Home',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ECharts,
  },
  data() {
    return {
      lastLogin: {
        location: '',
        time: '',
      },
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
      }, {
        name: '今日待转正',
        value: '8',
        icon: 'star-on',
        color: 'darkkhaki',
      }, {
        name: '今日待续签合同',
        value: '14',
        icon: 's-goods',
        color: 'rosybrown',
      }, {
        name: '本月待入职',
        value: '66',
        icon: 'success',
        color: 'cadetblue',
      }, {
        name: '本月待转正',
        value: '30',
        icon: 'star-on',
        color: 'darkkhaki',
      }, {
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
      saleData: {
        imageUrl: '/sale.png'
      },
    };
  },
  methods: {
    fetchAnnouncements() {
      // 从文件获取公告内容
      // 暂不实现，保留原方法
    },
    handleDateChange(date) {
      console.log('Selected Date:', date);
      // 日期变化，重新加载数据
    },
    hasNumber(text) {
      return /\d/.test(text);
    },
    fetchLastLogin() {
      this.lastLogin.time = Mock.Random.date('yyyy-MM-dd HH:mm:ss') + ' ' + Mock.Random.time('HH:mm:ss');
      this.lastLogin.location = Mock.Random.city(true);
    },
  },
  mounted() {
    this.fetchLastLogin();
    this.fetchAnnouncements();
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
          tooltip: { trigger: 'axis' },
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
          tooltip: { trigger: 'item' },
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
/* 确保悬停时按钮样式不变 */
.el-button:hover {
  list-style: none;
  padding: 0;
  text-align: left;
}

/* 列表项样式 */
.announcement-item {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #34495e;
  margin-bottom: 15px;
  line-height: 1.5;
}

/* 子弹点样式 */
.announcement-item .bullet {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #17b3a3;
  position: relative;
  margin-right: 12px;
  z-index: 1;
}
.announcement-item .bullet::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px; /* 中心白色部分的直径 */
  height: 6px; /* 中心白色部分的直径 */
  border-radius: 50%;
  background: white;
  z-index: 2;
}

/* 列表缩进样式 */
.announcement-item.has-number .content {
  text-indent: 20px;
}

.announcement-item:not(.has-number) .content {
  text-indent: 32px;
}

/* 竖线样式 */
.announcement-list {
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
}

.announcement-list::before {
  content: '';
  position: absolute;
  left:4px; /* 子弹点中心位置，可能需要根据实际情况调整 */
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #17b3a3;
  z-index: 0;
}

/* 标题和内容的样式，保证标题在一行内显示 */
.announcement-item .title,
.announcement-item .content {
  font-weight: bold;  
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 40px); /* 留出足够空间，避免与子弹点重叠 */
  display: block;
}


.announcement-list li::after {
  content: '';
  display: block;
  height: 1px;
  background-color: #17b3a3; /* 横线颜色 */
  margin-top: 15px; /* 在公告和横线之间添加一些空间 */
  margin-bottom: 15px; /* 在横线和下一条公告之间添加一些空间 */
}

.announcement-list li:last-child::after {
  display: none;
}

/* 包裹容器样式 */
.announcement-item .text-container {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 确保内容垂直居中 */
}


/* 其余样式保持不变 */
.box-card {
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.box-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 16px rgba(0, 0, 0, 0.2);
}

.box-card .clearfix {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  padding: 10px 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ebebeb;
}

.el-calendar {
  padding: 15px;
}

.el-calendar .el-button {
  border: none;
  background-color: #17b3a3;
  color: #fff;
}

.el-calendar .el-button:hover {
  background-color: #159d92;
}

.el-calendar .cell {
  color: #333;
}

.el-calendar .is-today .el-button {
  border-color: #17b3a3;
  font-weight: bold;
}

.el-calendar .is-selected .el-button {
  background-color: #17b3a3;
  color: #fff;
}
</style>

