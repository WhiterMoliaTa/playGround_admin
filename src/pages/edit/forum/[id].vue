<template>
  <v-container>
    <v-btn text @click="goBack" class="mb-4">
      <v-icon left>mdi-arrow-left</v-icon> 返回討論列表
    </v-btn>

    <v-card class="mb-6 pa-4">
      <h2>{{ discussion.title }}</h2>
      <div class="meta-info">
        發表人：{{ discussion.createdBy }} ｜ 發表時間：{{ formatTime(discussion.createdTime) }}
      </div>
      <div class="content">{{ discussion.content }}</div>

      <div v-if="discussionFiles.length" class="attachments mt-4">
        <strong>主題附件：</strong>
        <v-chip
          v-for="file in discussionFiles"
          :key="file.fileId"
          class="ma-1"
          color="primary"
          text-color="white"
          small
          @click="downloadFile(file)"
          style="cursor:pointer"
        >
          <v-icon left small>mdi-file-document-outline</v-icon>
          {{ file.originalName }}
        </v-chip>
      </div>
    </v-card>

    <h3>留言列表</h3>
    <v-list two-line>
      <v-list-item v-for="comment in commentsForDiscussion" :key="comment.commentId" class="comment-item">
          <v-list-item-title>{{ comment.createdBy }}</v-list-item-title>
          <v-list-item-subtitle>{{ comment.content }}</v-list-item-subtitle>
          <small class="grey--text">{{ formatTime(comment.createdTime) }}</small>

          <div v-if="filesForComment(comment.commentId).length > 0" class="attachments mt-2">
            <strong>附件：</strong>
            <v-chip
              v-for="file in filesForComment(comment.commentId)"
              :key="file.fileId"
              class="ma-1"
              color="primary"
              text-color="white"
              small
              @click="downloadFile(file)"
              style="cursor:pointer"
            >
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
        <v-textarea
          v-model="newCommentContent"
          label="留言內容"
          rows="3"
          :rules="[v => !!v || '內容不可為空']"
          required
        ></v-textarea>

        <v-file-input
          v-model="newCommentFiles"
          label="附件上傳"
          multiple
          show-size
          counter
          prepend-icon="mdi-paperclip"
          accept="*/*"
          clearable
          class="my-3"
        ></v-file-input>

        <v-btn :disabled="!formValid" color="primary" @click="addComment">送出留言</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { forumTestData } from '../../../data/testForum' // 你的測試資料路徑

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

const newCommentContent = ref('')
const newCommentFiles = ref([])

const formValid = ref(false)
const form = ref(null)

onMounted(() => {
  const found = forumTestData.discussions.find(d => d.discussionId === id)
  if (found) {
    Object.assign(discussion, found)
  } else {
    alert('找不到此討論！')
    router.back()
  }
})

const formatTime = (iso) => {
  return new Date(iso).toLocaleString()
}

const commentsForDiscussion = computed(() =>
  comments.value.filter(c => c.discussionId === id && c.status === 'A')
)

const filesForComment = (commentId) =>
  files.value.filter(f => f.referenceId === commentId && f.status === 'A')

const discussionFiles = computed(() =>
  files.value.filter(f => f.referenceId === id && f.status === 'A')
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
    status: 'A',
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
        status: 'A',
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
</script>

<style scoped>
.meta-info {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.content {
  white-space: pre-wrap;
  font-size: 1.1rem;
}

.mb-6 {
  margin-bottom: 24px;
}

.attachments {
  margin-top: 8px;
}

.comment-item {
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
  margin-bottom: 12px;
}
</style>
