// src/scripts/pages/tg-channel-full.js
export async function init() {
  // Надёжный импорт: берём default, если он есть, иначе сам модуль
  const mod = await import('echarts')
  const echarts = mod.default ?? mod

  function createEchart(domElementId, opt) {
    const chartDom = document.getElementById(domElementId)
    if (!chartDom) return
    const myChart = echarts.init(chartDom)
    if (opt) myChart.setOption(opt)
  }

  function createEchartGradientStyle(color1, color2) {
    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: color1 },
      { offset: 1, color: color2 },
    ])
  }

  // ============= ECHARTS ==============
  const xAxisData = []
  const data1 = []
  const data2 = []
  for (let i = 1; i <= 10; i++) {
    xAxisData.push('Авг' + i)
    data1.push(+(Math.random() * 15).toFixed(2))
    data2.push(+(Math.random() * 5).toFixed(2))
  }

  const emphasisStyle = {
    itemStyle: { shadowBlur: 2, shadowColor: 'rgba(0,0,0,1)' },
  }

  const options = {
    legend: { data: ['Посты', 'Репосты'], right: '5%' },
    xAxis: {
      data: xAxisData,
      axisLine: { onZero: true },
      splitLine: { show: false },
      splitArea: { show: false },
      axisLabel: {
        interval: 0,
        rotate: 0,
        fontSize: 12,
        width: 60,
        overflow: 'truncate',
      },
    },
    yAxis: { min: 0, scale: true },
    grid: {
      width: '100%',
      height: '100%',
      left: 5,
      bottom: 72,
    },
    series: [
      {
        name: 'Посты',
        type: 'bar',
        stack: 'one',
        emphasis: emphasisStyle,
        data: data1,
        barWidth: 21,
        itemStyle: { color: '#FE6E00', borderRadius: [5, 5, 0, 0] },
      },
      {
        name: 'Репосты',
        type: 'bar',
        stack: 'one',
        emphasis: emphasisStyle,
        data: data2,
        itemStyle: { color: '#FDDAC0', borderRadius: [5, 5, 0, 0] },
      },
    ],
  }

  // Мини-графики
  const echartsDate = []
  const echartsData = [Math.random() * 300]
  for (let i = 1; i < 4; i++) {
    const now = new Date()
    now.setDate(now.getDate() - (4 - i))
    echartsDate.push(now.toISOString().split('T')[0])
    echartsData.push(Math.round((Math.random() - 0.5) * 20 + echartsData[i - 1]))
  }

  const echartsOptions = {
    grid: { left: 0, right: 0, top: 0, bottom: 0, containLabel: false },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: echartsDate,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false },
    },
    legend: { show: false },
    series: [
      {
        type: 'line',
        data: echartsData,
        symbol: 'none',
        itemStyle: { color: '#FE6E00' },
        areaStyle: { color: createEchartGradientStyle('#FDDAC0', '#FFFFFF') },
      },
    ],
  }

  createEchart('echarts_container-id', options)
  createEchart('echarts_container_subs-id', echartsOptions)
  createEchart('echarts_container_views-id', echartsOptions)

  console.log('Tg Channel page echarts', echarts.version || '')
}
