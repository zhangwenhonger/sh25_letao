/**
 * Created by lsy on 2020/6/1.
 */
$(function(){
    // 基于准备好的dom，初始化echarts实例
    var echart_1 = echarts.init(document.querySelector(".echarts_1"));

    // 指定图表的配置项和数据
    var option1 = {
        title: {
            text: '2017年注册人数',

        },
        tooltip: {
            // trigger: "axis"
        },
        legend: {
            data:['人数'],
            left: 'right'
        },
        xAxis: {
            data: ["1月","2月","3月","4月","5月","6月"]
        },
        yAxis: {},
        series: [{
            name: '人数',
            type: 'bar',
            data: [500, 2000, 360, 1000, 100, 200]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    echart_1.setOption(option1);

    // 基于准备好的dom，初始化echarts实例
    var echart_2 = echarts.init(document.querySelector(".echarts_2"));

    // 指定图表的配置项和数据
    option2 = {
        title: {
            text: '热门品牌销售',
            subtext: '2017年6月',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['耐克', '李宁', '特步', '热风', '卓诗尼']
        },
        series: [
            {
                name: '品牌',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    {value: 335, name: '耐克'},
                    {value: 310, name: '李宁'},
                    {value: 234, name: '特步'},
                    {value: 135, name: '热风'},
                    {value: 1548, name: '卓诗尼'}
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };


    // 使用刚指定的配置项和数据显示图表。
    echart_2.setOption(option2);
})