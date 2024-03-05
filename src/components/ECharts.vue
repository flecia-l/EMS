<template>
    <div ref="echart"></div>
</template>

<script>
    import * as echarts from 'echarts'

    export default {
        props: {
            isAxisChart: {
                type: Boolean,
                default: true
            },
            chartData:{
                type: Object,
                default: () => {
                    return {
                        xData: [],
                        series: []
                    }
                }
            }
        },
        data() {
            return {
                axisOptions:{
                        tooltip: { trigger:'axis' },
                        legend: {
                            textStyle: {
                                color: '#333'
                            }
                        },
                        grid: {
                            left: '15%',
                        },
                        xAxis: {
                            type: 'category',
                            data: [],
                            axisLine: {
                                lineStyle: {
                                    color: '#17b3a3'
                                }
                            },
                            axisLabel: {
                                color: '#333',
                                interval: 0,
                            }
                        },
                        yAxis: {
                            type: 'value',
                            axisLine: {
                                lineStyle: {
                                    color: '#333'
                                }
                            },
                        },
                        color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3'],
                        series: []
                },
                normalOptions: {
                    tooltip: { trigger:'item' },
                    series: []
                },
                echart: null
            }
        },
        watch: {
            chartData: {
                handler() {
                    this.initChart()
                },
                deep: true
            }
        },
        methods: {
            initChart() {
                this.initChartData()
                if(this.echart) {
                    this.echart.setOptions(this.options)
                } else {
                    this.echart = echarts.init(this.$refs.echart)
                    this.echart.setOption(this.options)
                }
            },
            initChartData() {
                if(this.isAxisChart) {
                    this.axisOptions.xAxis.data = this.chartData.xData
                    this.axisOptions.series = this.chartData.series
                } else {
                    this.normalOptions.series = this.chartData.series
                }
            }
        },
        computed: {
            options() {
                return this.isAxisChart ? this.axisOptions : this.normalOptions
            }
        }
    }
</script>

<style>

</style>