<template lang="pug">
VContainer(style="max-width: 800px;")
  canvas#todo
  VBtn.d-block.mx-auto.btnStyle.mt-5(@click="toggleType") Change Type
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import { useUserStore } from '@/store/user'

const user = useUserStore()
const chartRef = ref(null)
const type = ref(false)
let chart = null

const convertedTime = (element) => {
  const hour = Math.trunc(element.time)
  let minute = 0
  const float = element.time - hour
  if(float === 0.25) {
    minute = 15
  } else if (float === 0.5) {
    minute = 30
  } else if (float === 0.75) {
    minute = 45
  }

  return `${hour} : ${String(minute).padStart(2, '0')}`
}

const data = user.todoList.map(list => ({
  task: list.task,
  time: list.time,
  done: list.done
}))

const createChart = () => {
  if (chart) {
    chart.destroy()
  }
  chart = new Chart(
    chartRef.value,
    {
      type: type.value ? 'pie' : 'polarArea',
      data: {
        labels: data.map(row => row.task),
        datasets: [
          {
            label: '預計花費時間',
            data: data.map(row => row.time),
            // active: data.map(row => row.done),
          }
        ]
      },
      options: {
        layout: {
          padding: {
            top: 30,
            bottom: 30,
          }
        },
        plugins: {
          title: {
            display: true,
            text: '成為時間管理大師吧',
            font: {
              size: 36
            },
            padding: {
              bottom: 10
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const labelIndex = context.dataIndex;
                const datasetIndex = context.datasetIndex;
                const originalValue = context.chart.data.datasets[datasetIndex].data[labelIndex];
                return '預計花費時間 : ' + convertedTime({time: originalValue})
              }
            }
          },
          legend: {
            labels: {
              font: {
                size: 20
              },
              padding: 10
            },
            // onClick: function(e, legendItem) {
            //   const index = legendItem.index
            //   const ci = this.chart
            //   const meta = ci.getDatasetMeta(0)
            //   meta.data[index].hidden = !meta.data[index].hidden
            //   ci.update()
            // },
            filter: function(item, chart) {
              // item.datasetIndex is the index of the dataset in data.datasets
              // item.index is the index of the label in data.labels
              return data[item.index].done;
            }
          }
        }
      }
    }
  )
}

const toggleType = () => {
  type.value = !type.value
}

watch(type, createChart)

onMounted(() => {
  createChart()
})

chartRef.value = 'todo'
</script>

<style lang="sass" scoped>
.btnStyle
  background: #8FA9BF
  color: white
</style>