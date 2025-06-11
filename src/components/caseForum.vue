<template>
  <v-container>
    <v-row class="d-flex align-center mb-4">
      <v-col cols="12" sm="9" class="d-flex align-center">
        <v-text-field v-model="searchKeyword" label="搜尋討論（標題或內容）" clearable hide-details variant="outlined"
          style="max-width: 320px; margin-right: 12px;" />
        <v-select v-model="sortType" hide-details variant="outlined" :items="[
          { title: '留言最多', value: 'mostComment' },
          { title: '最新發表', value: 'newest' },
          { title: '留言最少', value: 'leastComment' }
        ]" label="排序" dense outlined style="max-width: 140px;" />
      </v-col>
      <v-col cols="12" sm="3" class="d-flex align-center justify-end">
        <v-btn color="primary" @click="dialogAdd = true">新增討論</v-btn>
      </v-col>
    </v-row>

    <v-list two-line>
      <v-list-item v-for="discussion in discussionsWithMeta" :key="discussion.discussionId" class="discussion-item"
        @click="onClickDiscussion(discussion)" link>
        <div class="discussion-row">
          <!-- 左邊標題與內容 -->
          <div class="discussion-left">
            <div class="user-title-row">
              <v-avatar size="36" class="mr-3" color="primary" variant="tonal">
                <template v-if="discussion.avatarUrl">
                  <v-img :src="discussion.avatarUrl" cover />
                </template>
                <template v-else>
                  {{ discussion.createdBy.charAt(0).toUpperCase() }}
                </template>
              </v-avatar>

              <div class="user-info-text">
                <div class="user-name">{{ discussion.createdBy }}</div>
                <div class="worktitle">{{ discussion.workTitle || '職稱未設定' }}</div>
              </div>
              <div class="discussion-title">{{ discussion.title }}</div>
            </div>
            <div class="content">
              <template v-if="discussion.lastComment">
                {{ discussion.lastComment.content }}<br>
                <span style="color:#888;font-size:0.92em;">
                  {{ discussion.lastComment.createdBy }} / {{ timeAgo(discussion.lastComment.createdTime) }}
                </span>
              </template>
              <template v-else>
                {{ discussion.content }}
              </template>
            </div>
          </div>

          <!-- 右邊 meta -->
          <div class="discussion-right pa-4">
            <v-badge :content="discussion.fileCount" color="primary" bordered overlap>
              <v-icon size="24">mdi-file-document</v-icon>
            </v-badge>

            <v-badge :content="discussion.commentCount" color="success" bordered overlap class="ml-4">
              <v-icon size="24">mdi-comment</v-icon>
            </v-badge>
          </div>
        </div>
        <v-divider class="my-2" />
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
            <v-text-field v-model="newDiscussion.title" label="標題" :rules="[v => !!v || '標題不可為空']" required />
            <v-textarea v-model="newDiscussion.content" label="內容" rows="4" :rules="[v => !!v || '內容不可為空']" required />
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

const sortType = ref('mostComment')

const formatTime = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleString()
}

// 新增：計算多久前
function timeAgo(isoString) {
  const now = new Date()
  const past = new Date(isoString)
  const diff = Math.floor((now - past) / 1000)
  if (diff < 60) return `${diff}秒前`
  if (diff < 3600) return `${Math.floor(diff / 60)}分鐘前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小時前`
  return `${Math.floor(diff / 86400)}天前`
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
  let arr = filteredDiscussions.value.map((d) => {
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

    // 找到最新留言
    let lastComment = null
    if (relatedComments.length > 0) {
      lastComment = relatedComments.reduce((a, b) =>
        new Date(a.createdTime) > new Date(b.createdTime) ? a : b
      )
    }

    return {
      ...d,
      fileCount,
      commentCount: relatedComments.length,
      avatarUrl: d.avatarUrl || '',
      workTitle: d.workTitle || '',
      lastComment,
    }
  })

  // 排序
  if (sortType.value === 'mostComment') {
    arr = arr.sort((a, b) => b.commentCount - a.commentCount)
  } else if (sortType.value === 'leastComment') {
    arr = arr.sort((a, b) => a.commentCount - b.commentCount)
  } else if (sortType.value === 'newest') {
    arr = arr.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime))
  }
  return arr
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
    avatarUrl: '', // 這裡也要帶
    workTitle: '',
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
  width: 100%;
  min-height: 90px;
}

.discussion-left {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.user-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.user-info-text {
  display: flex;
  width: 100px;
  flex-direction: column;
  justify-content: center;
  margin-top: 8px;
}

.user-name {
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;
  line-height: 1.2;
}

.discussion-title {
  font-weight: bold;
  font-size: 1.3rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
  max-width: 60%;
}

.worktitle {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.2;
}

.content {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #555;
  font-size: 0.95rem;

  /* 標準草案支援（部分瀏覽器） */
  line-clamp: 2;
  box-orient: vertical;
}


.discussion-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 120px;
  margin-left: 16px;
  justify-content: space-between;
}

/* 移除最後留言時間樣式 */
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
