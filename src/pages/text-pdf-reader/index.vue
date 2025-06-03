<template>
  <div>
    <h1>'Hello, world!' example</h1>

    <!-- PDF 檔案選擇 -->
    <input type="file" accept="application/pdf" @change="onFileChange" />
    <canvas ref="canvasRef" style="border: 1px solid black; direction: ltr;"></canvas>
    <hr />
    <h2>擷取文字結果：</h2>
<pre style="white-space: pre-wrap; word-break: break-word;">{{ code }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import * as pdfjsLib from 'pdfjs-dist/build/pdf'

// 設定 worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.mjs'

const canvasRef = ref(null)
const code = ref('')

// 當使用者選擇 PDF 檔案
const onFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async function () {
    const typedarray = new Uint8Array(reader.result)

    const loadingTask = pdfjsLib.getDocument({ data: typedarray })
    const pdf = await loadingTask.promise
    const page = await pdf.getPage(1)

    const scale = 1.5
    const viewport = page.getViewport({ scale })
    const outputScale = window.devicePixelRatio || 1

    const canvas = canvasRef.value
    const context = canvas.getContext('2d')

    canvas.width = Math.floor(viewport.width * outputScale)
    canvas.height = Math.floor(viewport.height * outputScale)
    canvas.style.width = Math.floor(viewport.width) + 'px'
    canvas.style.height = Math.floor(viewport.height) + 'px'

    const transform = outputScale !== 1
      ? [outputScale, 0, 0, outputScale, 0, 0]
      : null

    const renderContext = {
      canvasContext: context,
      transform,
      viewport,
    }

    await page.render(renderContext).promise

    // 擷取文字
    const textContent = await page.getTextContent()
    const textItems = textContent.items.map(item => item.str)
    const extractedText = textItems.join(' ')

    console.log(extractedText)
    code.value = extractedText
  }

  reader.readAsArrayBuffer(file)
}
</script>
