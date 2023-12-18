import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import { customTranslate } from './lang'
import { EnhancementPalette, RewritePalette } from './additional-modules/palette'
import GridLineModule from 'diagram-js-grid-bg'
import { createContext, useContext } from './use-context'
import { InjectionKey, ref } from 'vue'

export function createBpmnDesigner() {
  let instance: BpmnModeler | null = null
  let container: HTMLDivElement | null = null

  const selectedElement = ref<any>(null)

  function autoFitViewport() {
    const bbox = (container as any)?.getBBox()

    const canvas = instance?.get('canvas') as any
    const currentViewbox = canvas?.viewbox()
    const elementMid = {
      x: bbox.x + bbox.width / 2 - 65,
      y: bbox.y + bbox.height / 2
    }
    canvas.viewbox({
      x: elementMid.x - currentViewbox.width / 2,
      y: elementMid.y - currentViewbox.height / 2,
      width: currentViewbox.width,
      height: currentViewbox.height
    })
  }

  async function importXML(data) {
    return await instance?.importXML(data)
  }

  function registerOverlay() {
    const overlays = instance?.get('overlays') as any
    const elementRegistry = instance?.get('elementRegistry') as any

    const shape = elementRegistry.get('UserTask_1')

    const div = document.createElement('div')
    div.classList.add('highlight-overlay')
    div.style.width = shape.width
    div.style.height = shape.height

    overlays.add('UserTask_1', {
      position: {
        top: -5,
        left: -5
      },
      html: div.innerHTML
    })
  }

  function init(el) {
    container = el
    instance = new BpmnModeler({
      container: el,
      moddleExtensions: {
        // flowable
      },
      additionalModules: [
        EnhancementPalette,
        GridLineModule,
        RewritePalette,

        {
          //汉化
          translate: ['value', customTranslate]
        }
      ]
    })

    // registerOverlay()
  }

  async function downloadProcess(type: string, name = 'xml') {
    try {
      const modeler = instance
      // 按需要类型创建文件并下载
      if (type === 'xml' || type === 'bpmn') {
        const { error, xml } = await modeler!.saveXML({})
        // 读取异常时抛出异常
        if (error) {
          console.error(`[Process Designer Warn ]: ${error.message || error}`)
        }
        const { href, filename } = setEncoded(type.toUpperCase(), name, xml!)
        downloadFile(href, filename)
      } else {
        const { svg } = await modeler!.saveSVG()
        // 读取异常时抛出异常
        const { href, filename } = setEncoded('SVG', name, svg!)
        downloadFile(href, filename)
      }
    } catch (e: any) {
      console.error(`[Process Designer Warn ]: ${e.message || e}`)
    }
  }

  function mountEvent(eventName, fn) {
    instance?.on(eventName, fn)
  }

  function setSelectedElement(element) {
    selectedElement.value = element
  }

  return {
    selectedElement,
    init,
    importXML,
    mountEvent,
    autoFitViewport,
    downloadProcess,
    setSelectedElement
  }
}

export function createInitialXml() {
  function randomStr() {
    return Math.random().toString(36).slice(-8)
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
    <definitions
      xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
      xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC"
      xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0"
      xmlns:xsd="http://www.w3.org/2001/XMLSchema"
      xmlns:flowable="http://flowable.org/bpmn"
      targetNamespace="http://www.flowable.org/processdef"
      >
      <process id="flow_${randomStr()}" name="flow_${randomStr()}">
        <startEvent id="start_event" name="开始" />
      </process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_flow">
        <bpmndi:BPMNPlane id="BPMNPlane_flow" bpmnElement="T-2d89e7a3-ba79-4abd-9f64-ea59621c258c">
          <bpmndi:BPMNShape id="BPMNShape_start_event" bpmnElement="start_event" bioc:stroke="">
            <omgdc:Bounds x="240" y="200" width="30" height="30" />
            <bpmndi:BPMNLabel>
              <omgdc:Bounds x="242" y="237" width="23" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
        </bpmndi:BPMNPlane>
      </bpmndi:BPMNDiagram>
    </definitions>
    `
}

// 根据所需类型进行转码并返回下载地址
export function setEncoded(type: string, filename: string, data: string) {
  const encodedData: string = encodeURIComponent(data)
  return {
    filename: `${filename}.${type.toLowerCase()}`,
    href: `data:application/${
      type === 'svg' ? 'text/xml' : 'bpmn20-xml'
    };charset=UTF-8,${encodedData}`,
    data: data
  }
}

// 文件下载方法
export function downloadFile(href: string, filename: string) {
  if (href && filename) {
    const a: HTMLAnchorElement = document.createElement('a')
    a.download = filename //指定下载的文件名
    a.href = href //  URL对象
    a.click() // 模拟点击
    URL.revokeObjectURL(a.href) // 释放URL 对象
  }
}

type Context = ReturnType<typeof createBpmnDesigner>

const contextKey: InjectionKey<Context> = Symbol()

export function createBpmnContext(context: any) {
  return createContext(context, contextKey)
}

export function useBpmnContext() {
  return useContext(contextKey)
}
