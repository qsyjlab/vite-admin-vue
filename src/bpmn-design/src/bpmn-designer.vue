<template>
  <div class="bmpn-design-container">
    <el-button @click="downloadProcess('xml')">导出 xml</el-button>

    <div class="container">
      <div ref="containerRef" class="bpmn" style="height: 100%"></div>
      <div class="setting-pannel">
        <setting-pannel></setting-pannel>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { createBpmnContext, createBpmnDesigner, createInitialXml } from './bpmn'
import SettingPannel from './setting-pannel.vue'

const containerRef = ref()
const bpmnDesigner = createBpmnDesigner()

const { init, importXML, autoFitViewport, downloadProcess, mountEvent, setSelectedElement } =
  bpmnDesigner

createBpmnContext(bpmnDesigner)

onMounted(() => {
  init(containerRef.value)

  createNewDiagram(createInitialXml())

  mountEvent('element.click', event => {
    setSelectedElement(event.element)
  })
})

async function createNewDiagram(data) {
  data = data.replace(/<!\[CDATA\[(.+?)]]>/g, function (match, str) {
    return str.replace(/</g, '&lt;')
  })
  try {
    await importXML(data)
    autoFitViewport()
  } catch (err) {
    // console.error(err.message, err.warnings)
  }
}

function customProcessNode() {
  // const overlays = viewerInstance.get('overlays')
  // const canvas = viewerInstance.get('canvas')
  // const elementRegistry = viewerInstance.get('elementRegistry')
  // const modeling = viewerInstance.get('modeling')
}
</script>
<style lang="scss" scoped>
.container {
  height: calc(100% - 50px);
  display: flex;
  justify-content: space-between;

  .bpmn {
    flex: auto;
  }

  .setting-pannel {
    width: 400px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }
}

.bmpn-design-container {
  height: 100%;
}
</style>
