<template>
  <v-card class="form-g4-02 pa-4">
    <v-card-title class="d-flex justify-center text-h5 font-weight-bold">
      每日衛生檢查表 (G4-02)
    </v-card-title>
    
    <v-table>
      <thead>
        <tr>
          <th width="10%">項目</th>
          <th width="40%">檢查內容</th>
          <th width="10%">上午</th>
          <th width="10%">下午</th>
          <th width="10%">項目</th>
          <th width="40%">檢查內容</th>
          <th width="10%">上午</th>
          <th width="10%">下午</th>
        </tr>
      </thead>
      <tbody>
        <!-- 食材衛生管理 -->
        <tr>
          <td rowspan="6" class="text-center">食材衛生管理</td>
          <td>盒子都含保存期限及標籤，不使用髒損且具異味端吋。</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.foodSafety[0]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.foodSafety[0]" density="compact" hide-details></v-checkbox>
          </td>
          <td rowspan="6" class="text-center">原料半成品</td>
          <td>依原料(物)料、半成品及成品，依清潔度及類別不同分區存放並依序先進先出</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.ingredients[0]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.ingredients[0]" density="compact" hide-details></v-checkbox>
          </td>
        </tr>
        <tr>
          <td>不會咐指甲、戒指指甲油及配戴飾物。</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.foodSafety[1]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.foodSafety[1]" density="compact" hide-details></v-checkbox>
          </td>
          <td>標示入庫(開封或進貨)日期及有效日期，且未過期進出先利用先使用</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.ingredients[1]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.ingredients[1]" density="compact" hide-details></v-checkbox>
          </td>
        </tr>
        <tr>
          <td>食材無異常氣味、顏色及質地。</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.foodSafety[2]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.foodSafety[2]" density="compact" hide-details></v-checkbox>
          </td>
          <td>冷凍冷藏設備保持清潔，貯存溫度(≦-18℃及 0℃~7℃)符合，並按項記錄</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.ingredients[2]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.ingredients[2]" density="compact" hide-details></v-checkbox>
          </td>
        </tr>
        <tr>
          <td>不使用過期食材，且開封後依規定儲存。</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.foodSafety[3]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.foodSafety[3]" density="compact" hide-details></v-checkbox>
          </td>
          <td>冷凍冷藏設備保持清潔，貯存溫度(≦-18℃及 0℃~7℃)符合，並按項記錄</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.ingredients[3]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.ingredients[3]" density="compact" hide-details></v-checkbox>
          </td>
        </tr>
        <tr>
          <td>食材無異常氣味、顏色及質地。</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.foodSafety[4]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.foodSafety[4]" density="compact" hide-details></v-checkbox>
          </td>
          <td>冷凍冷藏設備保持清潔，貯存溫度(≦-18℃及 0℃~7℃)符合，並按項記錄</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.ingredients[4]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.ingredients[4]" density="compact" hide-details></v-checkbox>
          </td>
        </tr>
        <tr>
          <td>不使用過期食材，且開封後依規定儲存。</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.foodSafety[5]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.foodSafety[5]" density="compact" hide-details></v-checkbox>
          </td>
          <td>冷凍冷藏設備保持清潔，貯存溫度(≦-18℃及 0℃~7℃)符合，並按項記錄</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.ingredients[5]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.ingredients[5]" density="compact" hide-details></v-checkbox>
          </td>
        </tr>
        <!-- 作業場地環境衛生管理 -->
        <tr>
          <td rowspan="5" class="text-center">作業場地環境衛生管理</td>
          <td>工作中不雜談與情聊、飲食或其他不衛生的行為或行為。</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.environment[0]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.environment[0]" density="compact" hide-details></v-checkbox>
          </td>
          <td rowspan="5" class="text-center">冷凍冷藏管理</td>
          <td>冷凍冷藏設備保持清潔，貯存溫度(≦-18℃及 0℃~7℃)符合，並按項記錄</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.refrigeration[0]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.refrigeration[0]" density="compact" hide-details></v-checkbox>
          </td>
        </tr>
        <tr>
          <td>工作場所無異物、垃圾及污垢。</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.environment[1]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.environment[1]" density="compact" hide-details></v-checkbox>
          </td>
          <td>冷凍冷藏設備保持清潔，貯存溫度(≦-18℃及 0℃~7℃)符合，並按項記錄</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.refrigeration[1]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.refrigeration[1]" density="compact" hide-details></v-checkbox>
          </td>
        </tr>
        <tr>
          <td>工作中不穿拖鞋、涼鞋及其他不適當鞋類。</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.environment[2]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.environment[2]" density="compact" hide-details></v-checkbox>
          </td>
          <td>冷凍冷藏設備保持清潔，貯存溫度(≦-18℃及 0℃~7℃)符合，並按項記錄</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.refrigeration[2]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.refrigeration[2]" density="compact" hide-details></v-checkbox>
          </td>
        </tr>
        <tr>
          <td>工作中不穿拖鞋、涼鞋及其他不適當鞋類。</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.environment[3]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.environment[3]" density="compact" hide-details></v-checkbox>
          </td>
          <td>冷凍冷藏設備保持清潔，貯存溫度(≦-18℃及 0℃~7℃)符合，並按項記錄</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.refrigeration[3]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.refrigeration[3]" density="compact" hide-details></v-checkbox>
          </td>
        </tr>
        <tr>
          <td>工作中不穿拖鞋、涼鞋及其他不適當鞋類。</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.environment[4]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.environment[4]" density="compact" hide-details></v-checkbox>
          </td>
          <td>冷凍冷藏設備保持清潔，貯存溫度(≦-18℃及 0℃~7℃)符合，並按項記錄</td>
          <td class="text-center">
            <v-checkbox v-model="formData.morning.refrigeration[4]" density="compact" hide-details></v-checkbox>
          </td>
          <td class="text-center">
            <v-checkbox v-model="formData.afternoon.refrigeration[4]" density="compact" hide-details></v-checkbox>
          </td>
        </tr>
        <!-- 其他區域的表格結構省略 -->
        <!-- 最後一行簽名區域 -->
        <tr>
          <td colspan="8">
            <div class="d-flex justify-end align-center mt-4">
              <span class="mr-4">主管簽核:</span>
              <div class="signature-line" @click="openSignatureDialog"></div>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Signature Dialog -->
    <v-dialog v-model="showSignatureDialog" max-width="500px">
      <v-card>
        <v-card-title>請簽名</v-card-title>
        <v-card-text>
          <canvas ref="signatureCanvas" width="450" height="200" style="border: 1px solid #ccc;"></canvas>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="clearSignature">清除</v-btn>
          <v-btn color="primary" @click="saveSignature">確認</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';

// Form data structure
const formData = reactive({
  morning: {
    foodSafety: Array(6).fill(false),
    environment: Array(5).fill(false),
    ingredients: Array(6).fill(false),
    refrigeration: Array(5).fill(false),
    processingArea: Array(7).fill(false),
    personnelManagement: Array(5).fill(false),
    cleaning: Array(6).fill(false)
  },
  afternoon: {
    foodSafety: Array(6).fill(false),
    environment: Array(5).fill(false),
    ingredients: Array(6).fill(false),
    refrigeration: Array(5).fill(false),
    processingArea: Array(7).fill(false),
    personnelManagement: Array(5).fill(false),
    cleaning: Array(6).fill(false)
  },
  date: new Date().toISOString().substr(0, 10),
  signature: null
});

// Signature handling
const signatureCanvas = ref(null);
const signatureCtx = ref(null);
const isDrawing = ref(false);
const showSignatureDialog = ref(false);
let lastX = 0;
let lastY = 0;

function openSignatureDialog() {
  showSignatureDialog.value = true;
  setTimeout(() => {
    initSignatureCanvas();
  }, 100);
}

function initSignatureCanvas() {
  const canvas = signatureCanvas.value;
  if (!canvas) return;
  
  signatureCtx.value = canvas.getContext('2d');
  const ctx = signatureCtx.value;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000';
  
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);
  
  // Touch support
  canvas.addEventListener('touchstart', handleTouch);
  canvas.addEventListener('touchmove', handleTouchMove);
  canvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
  isDrawing.value = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
  if (!isDrawing.value) return;
  const ctx = signatureCtx.value;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function handleTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = signatureCanvas.value.getBoundingClientRect();
  const offsetX = touch.clientX - rect.left;
  const offsetY = touch.clientY - rect.top;
  
  isDrawing.value = true;
  [lastX, lastY] = [offsetX, offsetY];
}

function handleTouchMove(e) {
  e.preventDefault();
  if (!isDrawing.value) return;
  
  const touch = e.touches[0];
  const rect = signatureCanvas.value.getBoundingClientRect();
  const offsetX = touch.clientX - rect.left;
  const offsetY = touch.clientY - rect.top;
  
  const ctx = signatureCtx.value;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();
  [lastX, lastY] = [offsetX, offsetY];
}

function stopDrawing() {
  isDrawing.value = false;
}

function clearSignature() {
  const ctx = signatureCtx.value;
  ctx.clearRect(0, 0, signatureCanvas.value.width, signatureCanvas.value.height);
}

function saveSignature() {
  formData.signature = signatureCanvas.value.toDataURL('image/png');
  showSignatureDialog.value = false;
}

// Save form data
function saveForm() {
  // Add your save logic here
  console.log('Form data:', formData);
}

// Reset form data
function resetForm() {
  Object.keys(formData.morning).forEach(key => {
    formData.morning[key] = Array(formData.morning[key].length).fill(false);
    formData.afternoon[key] = Array(formData.afternoon[key].length).fill(false);
  });
  formData.signature = null;
}

onMounted(() => {
  // Additional initialization if needed
});

defineExpose({
  formData,
  saveForm,
  resetForm
});
</script>

<style scoped>
.form-g4-02 {
  max-width: 100%;
  margin: 0 auto;
}

.signature-line {
  width: 200px;
  height: 2px;
  background-color: #000;
  cursor: pointer;
}

th, td {
  padding: 8px;
  text-align: left;
  vertical-align: middle;
}

/* Prevent tables from getting too tall */
.v-table {
  max-height: 80vh;
  overflow-y: auto;
}

/* Print styles */
@media print {
  .v-checkbox {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>