<template>
  <v-container>
    <v-row class="d-flex align-center mb-4">
      <v-col cols="12" sm="8">
        <v-text-field v-model="searchKeyword" label="搜尋討論（標題或內容）" clearable />
      </v-col>
      <v-col cols="12" sm="4" class="text-sm-right">
        <v-btn color="primary" @click="dialogAdd = true">新增討論</v-btn>
      </v-col>
    </v-row>

    <v-list two-line>
      <v-list-item
        v-for="discussion in discussionsWithMeta"
        :key="discussion.discussionId"
        class="discussion-item"
        @click="onClickDiscussion(discussion)"
        link
      >
        <div class="discussion-row">
          <!-- 左邊標題與內容 -->
          <div class="discussion-left">
            <div class="title big-title">{{ discussion.title }}</div>
            <div class="content">{{ discussion.content }}</div>
            <div class="meta-info">
              <span style="display: inline-block; width: 220px;">
                發表時間：{{ formatTime(discussion.createdTime) }}
              </span>
              ｜ 發表人：{{ discussion.createdBy }}
            </div>
          </div>

          <!-- 右邊 meta -->
          <div class="discussion-right pa-4">
            <v-badge :content="discussion.fileCount" color="primary" bordered overlap>
              <v-icon size="24">mdi-file-document</v-icon>
            </v-badge>

            <v-badge
              :content="discussion.commentCount"
              color="success"
              bordered
              overlap
              class="ml-4"
            >
              <v-icon size="24">mdi-comment</v-icon>
            </v-badge>

            <div class="last-comment-time" style="margin-top: 8px;">
              最後留言<br />
              {{ formatTime(discussion.lastCommentTime) }}
            </div>
          </div>
        </div>
      </v-list-item>

      <v-list-item v-if="discussionsWithMeta.length === 0">
        找不到符合條件的討論。
      </v-list-item>
    </v-list>

    <v-dialog v-model="dialogAdd" max-width="600px">
      <v-card>
        <v-card-title>新增討論</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-text-field
              v-model="newDiscussion.title"
              label="標題"
              :rules="[v => !!v || '標題不可為空']"
              required
            />
            <v-textarea
              v-model="newDiscussion.content"
              label="內容"
              rows="4"
              :rules="[v => !!v || '內容不可為空']"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialogAdd = false">取消</v-btn>
          <v-btn color="primary" @click="addDiscussion">新增</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { forumTestData } from '../data/testForum'

const router = useRouter()

const discussions = ref([...forumTestData.discussions])
const comments = ref([...forumTestData.comments])
const files = ref([...forumTestData.files])

const searchKeyword = ref('')
const dialogAdd = ref(false)

const newDiscussion = ref({
  title: '',
  content: '',
})

const form = ref(null)
const formValid = ref(false)

const formatTime = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleString()
}

const filteredDiscussions = computed(() => {
  if (!searchKeyword.value) return discussions.value
  const keyword = searchKeyword.value.trim().toLowerCase()
  return discussions.value.filter(
    (d) =>
      d.title.toLowerCase().includes(keyword) ||
      d.content.toLowerCase().includes(keyword)
  )
})

const discussionsWithMeta = computed(() => {
  return filteredDiscussions.value.map((d) => {
    const relatedComments = comments.value.filter(c => c.discussionId === d.discussionId)

    let fileCount = 0

    // 加上「主題本身」的檔案數
    const topicFiles = files.value.filter(f => f.referenceId === d.discussionId && f.status === 'A')
    fileCount += topicFiles.length

    // 加上「留言」的檔案數
    relatedComments.forEach(c => {
      const commentFiles = files.value.filter(f => f.referenceId === c.commentId && f.status === 'A')
      fileCount += commentFiles.length
    })

    const lastCommentTime = relatedComments.length > 0
      ? relatedComments.reduce((latest, c) =>
          new Date(c.updatedTime) > new Date(latest) ? c.updatedTime : latest,
          relatedComments[0].updatedTime
        )
      : d.createdTime

    return {
      ...d,
      fileCount,
      commentCount: relatedComments.length,
      lastCommentTime,
    }
  })
})


const addDiscussion = async () => {
  const valid = await form.value.validate()
  if (!valid) return

  const newId = 'd' + Date.now()
  const now = new Date().toISOString()

  forumTestData.discussions.push({
    discussionId: newId,
    title: newDiscussion.value.title.trim(),
    content: newDiscussion.value.content.trim(),
    createdTime: now,
    createdBy: 'user-new',
    updatedTime: now,
    updatedBy: 'user-new',
    status: 'O',
  })

  newDiscussion.value.title = ''
  newDiscussion.value.content = ''
  dialogAdd.value = false
  form.value.resetValidation()
  router.push(`/edit/forum/${newId}`)
}

const onClickDiscussion = (discussion) => {
  router.push(`/edit/forum/${discussion.discussionId}`)
}
</script>

<style scoped>
.discussion-row {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  /* 讓左右高度一致 */
  width: 100%;
  min-height: 90px;
  /* 可依需求調整 */
}

.discussion-left {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title.big-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.content {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* 限制顯示2行 */
  -webkit-box-orient: vertical;
  line-clamp: 2;
  /* 標準屬性，提升兼容性 */
  box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #555;
  font-size: 0.95rem;
  margin-bottom: 8px;
}

.meta-info {
  font-size: 0.9rem;
  color: #888;
  margin-top: auto;
  white-space: nowrap;
}

.discussion-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 120px;
  margin-left: 16px;
  justify-content: space-between;
}

.last-comment-time {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #888;
  white-space: nowrap;
}
.ml-4 {
  margin-left: 16px;
}
</style>
