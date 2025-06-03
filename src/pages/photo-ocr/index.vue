<template>
  <v-container>
    <v-row class="my-4" align="center" justify="space-between">
      <v-col cols="12" sm="5">
        <v-file-input label="上傳圖片或 PDF" accept="image/*,application/pdf" @change="handleFileChange" :disabled="loading"
          hide-details prepend-icon="mdi-camera" />
      </v-col>

      <v-col cols="12" sm="5">
        <v-select v-model="selectedLang" :items="langs" item-title="lang" item-value="name" label="選擇語言"
          :disabled="loading" hide-details prepend-icon="mdi-translate">
          <template #item="{ item }">
            {{ `${item.lang} (${item.name})` }}
          </template>
        </v-select>
      </v-col>
    </v-row>

    <v-row justify="center" class="my-4" v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="48" />
        <div>Processing...</div>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" md="6" class="text-center">
        <h3>Original Image</h3>
        <v-img :src="imageData" max-width="100%" max-height="300" contain />
        <h4 class="mt-4">Recognized Text (Original)</h4>
        <v-sheet elevation="1" class="pa-4" style="white-space: pre-wrap; background-color: #f5f5f5;"
          v-html="highlightedOriginalText" />
      </v-col>

      <v-col cols="12" md="6" class="text-center">
        <h3>Processed Image</h3>
        <v-img :src="processedImageData" max-width="100%" max-height="300" contain />
        <h4 class="mt-4">Recognized Text (Processed)</h4>
        <v-sheet elevation="1" class="pa-4" style="white-space: pre-wrap; background-color: #f5f5f5;"
          v-html="highlightedProcessedText" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Tesseract, createWorker } from 'tesseract.js';


const loading = ref(false);
const selectedLang = ref('chi_tra');
const imageData = ref(null);
const processedImageData = ref(null);
const originalText = ref('');
const processedText = ref('');
const langs = [
  { name: 'eng', lang: 'English' },
  { name: 'chi_sim', lang: 'Simplified Chinese' },
  { name: 'chi_tra', lang: 'Traditional Chinese' },
];

function diffHighlight(text1 = '', text2 = '') {
  const len = Math.max(text1.length, text2.length);
  let highlighted1 = '';
  let highlighted2 = '';

  for (let i = 0; i < len; i++) {
    const c1 = text1[i] || '';
    const c2 = text2[i] || '';
    if (c1 !== c2) {
      highlighted1 += `<mark>${c1 || ' '}</mark>`;
      highlighted2 += `<mark>${c2 || ' '}</mark>`;
    } else {
      highlighted1 += c1;
      highlighted2 += c2;
    }
  }

  return [highlighted1, highlighted2];
}

const highlightedTexts = computed(() => diffHighlight(originalText.value, processedText.value));
const highlightedOriginalText = computed(() => highlightedTexts.value[0]);
const highlightedProcessedText = computed(() => highlightedTexts.value[1]);

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  loading.value = true;
  originalText.value = '';
  processedText.value = '';
  processedImageData.value = null;

  const fileType = file.type;

  if (fileType === 'application/pdf') {
    console.log('PDF file detected');
    loading.value = false;

  } else if (fileType.startsWith('image/')) {
    imageData.value = URL.createObjectURL(file);

    originalText.value = await recognizeText(file);

    const processedImageURL = await preprocessImage(file);
    processedImageData.value = processedImageURL;

    const processedFile = await urlToFile(processedImageURL, 'processed.jpg');

    processedText.value = await recognizeText(processedFile);
    loading.value = false;
  } else {
    alert('Unsupported file type.');
    loading.value = false;
  }
};

const preprocessImage = (input) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.filter = 'grayscale(100%) contrast(150%)';
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg');
    };
    if (typeof input === 'string') {
      img.src = input;
    } else {
      img.src = URL.createObjectURL(input);
    }
  });
};

const recognizeText = async (input) => {
  const worker = await createWorker(selectedLang.value, 1, {
    logger: m => console.log(m)
  });
  const { data: { text } } = await worker.recognize(input);
  await worker.terminate();
  return text;
};

const urlToFile = async (url, filename) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};
</script>
