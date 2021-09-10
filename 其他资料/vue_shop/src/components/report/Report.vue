<template>
<div>
  <!--  面包屑导航-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    <el-breadcrumb-item>数据报表</el-breadcrumb-item>
  </el-breadcrumb>
<!--  卡片视图区域-->
  <el-card>
    <div id="main" style="width: 100%;height: 500px"></div>
  </el-card>
</div>
</template>

<script>
import _ from 'lodash'
export default {
name: "report",
  data(){
  return{
    options: {
      title: {
        text: '用户来源'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#E9EEF3'
          }
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          boundaryGap: false
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ]
    }
  }
  },
  created() {
  },
  // dom元素创建渲染完成
  mounted() {
    let echarts = require('echarts')
    let chartDom = document.getElementById('main');
    let myChart = echarts.init(chartDom);
    this.$http.get('reports/type/1').then(response => {
      console.log(response);//请求正确时执行的代码
      let result = response.data
      if (result.meta.status === 200) {
        this.$message.success(result.meta.msg)
        const chart = _.merge(result.data, this.options)
        myChart.setOption(chart)
      } else {
        this.$message.error('获取数据失败！')
      }
    }).catch(response => {
      //发生错误时执行的代码
      this.$message.warning('服务器错误！')
      console.log(response)
    });
  },
  methods:{}
}
</script>

<style lang="less" scoped>

</style>
