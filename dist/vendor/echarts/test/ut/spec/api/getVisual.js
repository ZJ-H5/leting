/* jshint maxlen:200 */

describe('api/getVisual', function () {


    // TODO
    // test each chart type, which may set visual on view which can not get from List.
    // each of which should test visual map.
    // symbol and symbolSize should be tested.


    var utHelper = window.utHelper;

    var testCase = utHelper.prepare([
        'echarts/chart/pie',
        'echarts/chart/scatter',
        'echarts/chart/graph',
        'echarts/component/geo',
        'echarts/component/grid',
        'echarts/component/polar',
        'echarts/component/visualMap',
        'echarts/component/dataZoom'
    ]);

    testCase.createChart()('scatter', function () {
        var chart = this.chart;

        chart.setOption({
            xAxis: {},
            yAxis: {},
            color: ['#000', '#111', '#222'],
            visualMap: {
                seriesIndex: 3,
                demension: 1,
                min: 0,
                max: 10000,
                inRange: {
                    color: 'red'
                }
            },
            series: [
                {
                    id: 'k0',
                    type: 'scatter',
                    data: [[1000, 700], [333, 222]]
                },
                {
                    id: 'k1',
                    type: 'scatter',
                    data: [[10, 7]],
                    itemStyle: {
                        normal: {
                            color: '#fff'
                        }
                    }
                },
                {
                    id: 'k2',
                    type: 'scatter',
                    data: [
                        [10, 7],
                        {
                            value: [333, 222],
                            itemStyle: {
                                normal: {
                                    color: '#ff0'
                                }
                            }
                        }
                    ],
                    itemStyle: {
                        normal: {
                            color: '#eee'
                        }
                    }
                },
                {
                    id: 'k3',
                    type: 'scatter',
                    data: [
                        [10, 7],
                        {
                            value: [333, 9999],
                            itemStyle: {
                                normal: {
                                    color: '#ff0'
                                }
                            }
                        }
                    ],
                    itemStyle: {
                        normal: {
                            color: '#eee'
                        }
                    }
                }
            ]
        });

        var width = chart.getWidth();

        expect(chart.getVisual({dataIndex: 1}, 'color')).toEqual('#000');

        expect(chart.getVisual({dataIndex: 0, seriesIndex: 1}, 'color')).toEqual('#fff');
        expect(chart.getVisual({seriesIndex: 1}, 'color')).toEqual('#fff');

        expect(chart.getVisual({dataIndex: 1, seriesId: 'k2'}, 'color')).toEqual('#ff0');
        expect(chart.getVisual({seriesId: 'k2'}, 'color')).toEqual('#eee');

        expect(chart.getVisual({dataIndex: 1, seriesId: 'k3'}, 'color')).toEqual('rgba(255,0,0,1)');
        expect(chart.getVisual({seriesId: 'k3'}, 'color')).toEqual('#eee');
    });


    testCase.createChart()('dataZoom', function () {
        var chart = this.chart;

        chart.setOption({
            xAxis: {},
            yAxis: {},
            color: ['#000', '#111', '#222'],
            dataZoom: {
                xAxisIndex: 0,
                startValue: 45
            },
            series: [
                {
                    id: 'k2',
                    type: 'scatter',
                    data: [
                        [10, 7],
                        [20, 7],
                        [30, 7],
                        [40, 7],
                        {
                            value: [50, 222],
                            itemStyle: {
                                normal: {
                                    color: '#ff0'
                                }
                            }
                        }
                    ],
                    itemStyle: {
                        normal: {
                            color: '#eee'
                        }
                    }
                }
            ]
        });

        var width = chart.getWidth();

        expect(chart.getVisual({dataIndex: 4, seriesId: 'k2'}, 'color')).toEqual('#ff0');
        expect(chart.getVisual({dataIndexInside: 0, seriesId: 'k2'}, 'color')).toEqual('#ff0');
        expect(chart.getVisual({dataIndex: 1, seriesId: 'k2'}, 'color')).toEqual('#eee');
    });


    // testCase.createChart()('pie', function () {
    //     var chart = this.chart;

    //     chart.setOption({
    //         series: [
    //             {
    //                 id: 'k1',
    //                 type: 'pie',
    //                 center: [40, '50%'],
    //                 radius: [10, '50%'],
    //                 data: [
    //                     {x: 1000, y: 2000},
    //                     {x: 1000, y: 5000},
    //                     {x: 3000, y: 5000},
    //                     {x: 3000, y: 2000}
    //                 ],
    //                 links: []
    //             }
    //         ]
    //     });

    //     var height = chart.getHeight();

    //     expect(chart.containPixel('series', [40, height / 2])).toEqual(false);
    //     expect(chart.containPixel('series', [40, height / 2 + 10])).toEqual(true);
    //     expect(chart.containPixel('series', [9.5, 1])).toEqual(false);
    // });


    // testCase.createChart()('graph', function () {
    //     var chart = this.chart;

    //     chart.setOption({
    //         series: [
    //             {
    //                 id: 'k1',
    //                 type: 'graph',
    //                 left: 10,
    //                 right: '50%',
    //                 top: 30,
    //                 bottom: 40,
    //                 data: [
    //                     {x: 1000, y: 2000},
    //                     {x: 1000, y: 5000},
    //                     {x: 3000, y: 5000},
    //                     {x: 3000, y: 2000}
    //                 ],
    //                 links: []
    //             }
    //         ]
    //     });

    //     expect(chart.containPixel('series', [15, 35])).toEqual(true);
    //     expect(chart.containPixel('series', [3, 4])).toEqual(false);
    // });


});
