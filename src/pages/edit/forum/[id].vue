<template>
  <v-container>
    <v-btn text @click="goBack" class="mb-4">
      <v-icon left>mdi-arrow-left</v-icon> 返回討論列表
    </v-btn>

    <v-card class="mb-6 pa-4">
      <div style="display: flex; align-items: center;">
        <h2 style="margin: 0;">{{ discussion.title }}</h2>
        <template v-if="discussionTags.length">
          <v-chip v-for="tag in discussionTags" :key="tag.tagId" :color="tag.color || 'primary'" class="ml-2"
            size="small" label variant="tonal" style="vertical-align: middle;">
            {{ tag.name }}
          </v-chip>
        </template>
        <!-- 右側操作按鈕 -->
        <div style="margin-left: auto; display: flex; align-items: center;">
          <v-btn icon color="primary" @click="editDialog = true" title="編輯" variant="text">
            <v-icon>mdi-cog</v-icon>
          </v-btn>
          <v-btn icon color="error" @click="onDeleteDiscussion" title="刪除" variant="text">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="meta-info">
        發表人：{{ discussion.createdBy }} ｜ 發表時間：{{ formatTime(discussion.createdTime) }}
      </div>
      <div class="content">{{ discussion.content }}</div>
      <div v-if="discussionFiles.length" class="attachments mt-4">
        <strong>主題附件：</strong>
        <v-chip v-for="file in discussionFiles" :key="file.fileId" class="ma-1" color="primary" text-color="white" small
          @click="downloadFile(file)" style="cursor:pointer">
          <v-icon left small>mdi-file-document-outline</v-icon>
          {{ file.originalName }}
        </v-chip>
      </div>
    </v-card>

    <!-- 編輯討論 Dialog -->
    <v-dialog v-model="editDialog" max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">編輯討論</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="editFormValid">
            <v-text-field v-model="editDiscussion.title" label="標題" :rules="[v => !!v || '標題不可為空']" required />
            <v-textarea v-model="editDiscussion.content" label="內容" rows="4" :rules="[v => !!v || '內容不可為空']" required />
            <!-- 標籤設定：可多選現有標籤，也可新增 -->
            <v-combobox v-model="editDiscussion.tags" :items="allTagOptions" label="標籤（可多選或新增）" multiple clearable chips
              class="mt-2" @update:modelValue="onEditTagChange" />
            <!-- 標籤顏色選擇，僅當輸入新標籤時顯示 -->
            <v-select v-if="showTagColorSelect" v-model="editDiscussion.tagColor" :items="tagColorOptions" label="新標籤顏色"
              item-title="label" item-value="value" clearable class="mt-2" />

            <!-- 新增：編輯主題附件 -->
            <div class="mt-4">
              <strong>主題附件：</strong>
              <div v-if="editDiscussionFiles.length">
                <v-chip v-for="file in editDiscussionFiles" :key="file.fileId" class="ma-1" color="primary"
                  text-color="white" small style="cursor:pointer">
                  <v-icon left small>mdi-file-document-outline</v-icon>
                  {{ file.originalName }}
                  <v-btn icon small @click.stop="removeEditDiscussionFile(file)" variant="text">
                    <v-icon color="error" small>mdi-close</v-icon>
                  </v-btn>
                </v-chip>
              </div>
              <v-file-input v-model="editDiscussionNewFiles" label="新增附件" multiple show-size counter
                prepend-icon="mdi-paperclip" accept="*/*" clearable class="mt-2" />
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="editDialog = false">取消</v-btn>
          <v-btn color="primary" :disabled="!editFormValid" @click="saveEditDiscussion">儲存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <h3>留言列表</h3>
    <v-list two-line>
      <v-list-item v-for="comment in commentsForDiscussion" :key="comment.commentId" class="comment-item">
        <v-list-item-title>{{ comment.createdBy }}</v-list-item-title>
        <v-list-item-subtitle>{{ comment.content }}</v-list-item-subtitle>
        <small class="grey--text">{{ formatTime(comment.createdTime) }}</small>

        <div v-if="filesForComment(comment.commentId).length > 0" class="attachments mt-2">
          <strong>附件：</strong>
          <v-chip v-for="file in filesForComment(comment.commentId)" :key="file.fileId" class="ma-1" color="primary"
            text-color="white" small @click="downloadFile(file)" style="cursor:pointer">
            <v-icon left small>mdi-file-document-outline</v-icon>
            {{ file.originalName }}
          </v-chip>
        </div>
      </v-list-item>

      <v-list-item v-if="commentsForDiscussion.length === 0">
        尚無留言
      </v-list-item>
    </v-list>

    <v-card class="mt-6 pa-4">
      <h3>新增留言</h3>
      <v-form ref="form" v-model="formValid" lazy-validation>
        <v-textarea v-model="newCommentContent" label="留言內容" rows="3" :rules="[v => !!v || '內容不可為空']"
          required></v-textarea>

        <v-file-input v-model="newCommentFiles" label="附件上傳" multiple show-size counter prepend-icon="mdi-paperclip"
          accept="*/*" clearable class="my-3"></v-file-input>

        <v-btn :disabled="!formValid" color="primary" @click="addComment">送出留言</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { forumTestData } from '../../../data/testForum'

const route = useRoute()
const router = useRouter()

const id = route.params.id
const discussion = reactive({
  discussionId: '',
  title: '',
  content: '',
  createdTime: '',
  createdBy: '',
  updatedTime: '',
  updatedBy: '',
  status: '',
})

const comments = ref([...forumTestData.comments])
const files = ref([...forumTestData.files])
const tags = ref([...forumTestData.tags])

const newCommentContent = ref('')
const newCommentFiles = ref([])

const formValid = ref(false)
const form = ref(null)

// 編輯對話框
const editDialog = ref(false)
const editForm = ref(null)
const editFormValid = ref(false)
const editDiscussion = reactive({
  title: '',
  content: '',
  tags: [],
  tagColor: '' // 新增：標籤顏色
})

// 現有附件
const editDiscussionFiles = ref([])
const editDiscussionNewFiles = ref([]) // 新上傳附件

// 取得所有現有標籤名稱
const allTagOptions = computed(() =>
  Array.from(new Set(tags.value.map(t => t.name)))
)

// 標籤顏色選擇項目
const tagColorOptions = [
  { label: '藍色', value: 'blue' },
  { label: '綠色', value: 'green' },
  { label: '紫色', value: 'purple' },
  { label: '橘色', value: 'orange' },
  { label: '紅色', value: 'red' },
  { label: '灰色', value: 'grey' },
  { label: '主要', value: 'primary' }
]

// 是否顯示標籤顏色選擇
const showTagColorSelect = ref(false)

// 當標籤變更時的處理
function onEditTagChange(val) {
  // 只允許單一新標籤時選色（多選時僅最後一個為新標籤才可選色）
  const lastTag = Array.isArray(val) && val.length > 0 ? val[val.length - 1] : ''
  const exist = allTagOptions.value.includes(lastTag)
  showTagColorSelect.value = !!lastTag && !exist
  if (!showTagColorSelect.value) {
    editDiscussion.tagColor = ''
  }
}

// 初始化時帶入現有標籤
onMounted(() => {
  const found = forumTestData.discussions.find(d => d.discussionId === id)
  if (found) {
    Object.assign(discussion, found)
    editDiscussion.title = found.title
    editDiscussion.content = found.content
    // 取得目前討論的標籤
    editDiscussion.tags = tags.value
      .filter(t => t.referenceType === 'discussion' && t.referenceId === id)
      .map(t => t.name)
    // 初始化時帶入現有附件
    editDiscussionFiles.value = files.value.filter(
      f => f.referenceId === id && f.status === 'Alive'
    )
  } else {
    alert('找不到此討論！')
    router.back()
  }
})

const formatTime = (iso) => {
  return new Date(iso).toLocaleString()
}

const commentsForDiscussion = computed(() =>
  comments.value.filter(c => c.discussionId === id && c.status === 'Alive')
)

const filesForComment = (commentId) =>
  files.value.filter(f => f.referenceId === commentId && f.status === 'Alive')

const discussionFiles = computed(() =>
  files.value.filter(f => f.referenceId === id && f.status === 'Alive')
)

const discussionTags = computed(() =>
  tags.value.filter(
    t => t.referenceType === 'discussion' && t.referenceId === discussion.discussionId
  )
)

const downloadFile = (file) => {
  alert(`模擬下載檔案：${file.originalName}\n路徑：${file.filePath}`)
}

const addComment = async () => {
  const valid = await form.value.validate()
  if (!valid) return

  const now = new Date().toISOString()
  const newCommentId = 'c' + Date.now()

  const newComment = {
    commentId: newCommentId,
    discussionId: id,
    content: newCommentContent.value.trim(),
    createdTime: now,
    updatedTime: now,
    createdBy: 'user-new',
    updatedBy: 'user-new',
    status: 'Alive',
  }

  comments.value.push(newComment)

  if (newCommentFiles.value && newCommentFiles.value.length > 0) {
    newCommentFiles.value.forEach((file, index) => {
      const newFileId = 'f' + Date.now() + index
      files.value.push({
        fileId: newFileId,
        referenceId: newCommentId,
        originalName: file.name,
        storedName: '',
        filePath: '',
        fileType: '',
        fileSize: 0,
        createdBy: 'user-new',
        createdTime: now,
        updatedBy: 'user-new',
        updatedTime: now,
        status: 'Alive',
        type: 'caseForum',
      })
    })
  }

  newCommentContent.value = ''
  newCommentFiles.value = []
  form.value.resetValidation()
}

const goBack = () => {
  router.back()
}

// 刪除現有附件
function removeEditDiscussionFile(file) {
  editDiscussionFiles.value = editDiscussionFiles.value.filter(f => f.fileId !== file.fileId)
}

// 編輯討論儲存
function saveEditDiscussion() {
  if (!editDiscussion.title.trim() || !editDiscussion.content.trim()) return
  discussion.title = editDiscussion.title.trim()
  discussion.content = editDiscussion.content.trim()
  // 同步更新到 forumTestData
  const idx = forumTestData.discussions.findIndex(d => d.discussionId === discussion.discussionId)
  if (idx !== -1) {
    forumTestData.discussions[idx].title = discussion.title
    forumTestData.discussions[idx].content = discussion.content
  }
  // 更新標籤（先移除舊的，再加新的）
  tags.value = tags.value.filter(
    t => !(t.referenceType === 'discussion' && t.referenceId === id)
  )
  editDiscussion.tags.forEach(tagName => {
    const exist = forumTestData.tags.find(t => t.name === tagName)
    tags.value.push({
      tagId: 't' + Date.now() + Math.random().toString(36).slice(2, 6),
      name: tagName,
      referenceType: 'discussion',
      referenceId: id,
      color: exist
        ? exist.color
        : (editDiscussion.tagColor || 'primary')
    })
  })
  // 同步 forumTestData.tags
  forumTestData.tags = [
    ...forumTestData.tags.filter(
      t => !(t.referenceType === 'discussion' && t.referenceId === id)
    ),
    ...tags.value.filter(t => t.referenceType === 'discussion' && t.referenceId === id)
  ]

  // 處理附件：移除被刪除的，新增新上傳的
  // 1. 移除被刪除的
  files.value = files.value.filter(
    f => !(f.referenceId === id && f.status === 'Alive' && !editDiscussionFiles.value.some(ef => ef.fileId === f.fileId))
  )
  // 2. 新增新上傳的
  if (editDiscussionNewFiles.value && editDiscussionNewFiles.value.length > 0) {
    const now = new Date().toISOString()
    editDiscussionNewFiles.value.forEach((file, index) => {
      const newFileId = 'f' + Date.now() + index
      files.value.push({
        fileId: newFileId,
        referenceId: id,
        originalName: file.name,
        storedName: '',
        filePath: '',
        fileType: '',
        fileSize: 0,
        createdBy: 'user-edit',
        createdTime: now,
        updatedBy: 'user-edit',
        updatedTime: now,
        status: 'Alive',
        type: 'caseForum',
      })
    })
  }
  // 清空新上傳附件
  editDiscussionNewFiles.value = []

  // 同步 forumTestData.files
  forumTestData.files = [...files.value]

  editDialog.value = false
  editDiscussion.tagColor = ''
}

function onEditDiscussion() {
  editDiscussion.title = discussion.title
  editDiscussion.content = discussion.content
  editDialog.value = true
}

function onDeleteDiscussion() {
  if (confirm('確定要刪除此討論嗎？')) {
    // 刪除討論
    const idx = forumTestData.discussions.findIndex(d => d.discussionId === discussion.discussionId)
    if (idx !== -1) {
      forumTestData.discussions.splice(idx, 1)
      alert('已刪除，返回列表')
      router.back()
    }
  }
}
</script>

<style scoped>
.meta-info {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.5rem;
}

.content {
  white-space: pre-wrap;
  margin: 1rem 0;
}

.attachments {
  font-size: 0.875rem;
}

.comment-item {
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem 0;
}

.comment-item:last-child {
  border-bottom: none;
}
</style>
