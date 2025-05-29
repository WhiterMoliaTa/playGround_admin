<template>
  <div>
    <h1>OCR with Black & White + Sharpening</h1>

    <!-- PDF 上傳 -->
    <input type="file" accept="application/pdf" @change="onFileChange" />
    <canvas ref="canvasRef" style="border: 1px solid black;"></canvas>
    <hr />
    <h2>OCR Result:</h2>
    <pre style="white-space: pre-wrap; word-break: break-word;">{{ ocrText }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import * as pdfjsLib from 'pdfjs-dist/build/pdf'
import { createWorker } from 'tesseract.js'

pdfjsLib.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.mjs'

const canvasRef = ref(null)
const ocrText = ref('請選擇 PDF 開始辨識...')

// 黑白處理 + 銳化 + OCR 主流程
const processPdfPage = async (pdfData) => {
  ocrText.value = '載入中...'

  const loadingTask = pdfjsLib.getDocument({ data: pdfData })
  const pdf = await loadingTask.promise
  const page = await pdf.getPage(11)
  const scale = 6
  const viewport = page.getViewport({ scale })

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  canvas.width = viewport.width
  canvas.height = viewport.height

  await page.render({ canvasContext: ctx, viewport }).promise

  // 黑白二值化
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const gray = 0.299 * r + 0.587 * g + 0.114 * b
    const bw = gray > 128 ? 255 : 0
    data[i] = data[i + 1] = data[i + 2] = bw
  }
  // ctx.putImageData(imageData, 0, 0)

  // 銳化函式
  const sharpen = (ctx, width, height) => {
    const srcData = ctx.getImageData(0, 0, width, height)
    const dstData = ctx.createImageData(width, height)
    const src = srcData.data
    const dst = dstData.data

    const kernel = [
      0, -1,  0,
     -1,  5, -1,
      0, -1,  0
    ]
    const kernelSize = 3
    const half = Math.floor(kernelSize / 2)

    for (let y = half; y < height - half; y++) {
      for (let x = half; x < width - half; x++) {
        for (let c = 0; c < 3; c++) {
          let i = (y * width + x) * 4 + c
          let sum = 0
          for (let ky = -half; ky <= half; ky++) {
            for (let kx = -half; kx <= half; kx++) {
              const px = x + kx
              const py = y + ky
              const si = (py * width + px) * 4 + c
              const ki = (ky + half) * kernelSize + (kx + half)
              sum += src[si] * kernel[ki]
            }
          }
          dst[i] = Math.min(Math.max(sum, 0), 255)
        }
        dst[(y * width + x) * 4 + 3] = src[(y * width + x) * 4 + 3]
      }
    }

    ctx.putImageData(dstData, 0, 0)
  }

  // sharpen(ctx, canvas.width, canvas.height)

  // OCR 辨識
  ocrText.value = 'OCR 辨識中...'
  const dataUrl = canvas.toDataURL('image/png')
  const worker = await createWorker('chi_tra')
  const { data: { text } } = await worker.recognize(dataUrl)
  ocrText.value = text.replace(/ /g, '') 
  await worker.terminate()
}
// 當使用者選擇 PDF 檔案
const onFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    const arrayBuffer = reader.result
    processPdfPage(new Uint8Array(arrayBuffer))
  }
  reader.readAsArrayBuffer(file)
}
</script>
