<template>
  <v-container>
    <v-row class="d-flex align-center mb-4">
      <v-col cols="12" sm="9" class="d-flex align-center">
        <v-text-field v-model="searchKeyword" label="搜尋討論（標題或內容）" clearable hide-details variant="outlined"
          style="max-width: 320px; margin-right: 12px;" />
        <v-select v-model="sortType" hide-details variant="outlined" :items="[
          { title: '留言最多', value: 'mostComment' },
          { title: '最新留言', value: 'newest' },
          { title: '留言最少', value: 'leastComment' }
        ]" label="排序" dense outlined style="max-width: 140px;" />
        <!-- 標籤篩選按鈕與選單 -->
        <v-menu v-model="tagMenu" :close-on-content-click="false" offset-y>
          <template #activator="{ props }">
            <v-btn v-bind="props" icon color="primary" class="ml-2" title="標籤篩選" variant="text">
              <v-icon>mdi-filter-variant-plus</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-select v-model="selectedTagFilters" :items="tagFilterOptions" label="選擇標籤" multiple clearable
                hide-details chips style="min-width: 200px;" />
            </v-list-item>
          </v-list>
        </v-menu>
        <!-- 已選標籤 chip -->
        <div class="ml-2" style="display: flex; align-items: center;">
          <v-chip v-for="tag in selectedTagFilters" :key="tag" color="primary" size="small" class="ma-1" label
            variant="tonal" closable @click:close="removeTagFilter(tag)">
            {{ tag }}
          </v-chip>
        </div>
      </v-col>
      <v-col cols="12" sm="3" class="d-flex align-center justify-end">
        <v-btn color="primary" @click="dialogAdd = true">新增討論</v-btn>
      </v-col>
    </v-row>

    <v-list two-line>
      <!-- 在討論列表中顯示標籤（tags） -->
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
              <div class="discussion-title" style="display: flex; align-items: center;">
                {{ discussion.title }}
                <template v-if="discussion.tags && discussion.tags.length">
                  <v-chip v-for="tagObj in discussion.tagsObj" :key="tagObj.tagId" :color="tagObj.color || 'primary'"
                    size="small" class="ma-1 ml-2" label variant="tonal" style="vertical-align: middle;">
                    {{ tagObj.name }}
                  </v-chip>
                </template>
              </div>
            </div>
            <div class="content">
              <template v-if="discussion.lastComment">
                <div class="last-comment-row">
                  <TruncateText :text="discussion.lastComment.content" :maxLength="50" />
                  <!-- 顯示留言附件 -->
                  <template v-if="discussion.lastCommentFiles && discussion.lastCommentFiles.length">
                    <span
                      v-for="(file, idx) in discussion.lastCommentFiles.slice(0, 3)"
                      :key="file.fileId"
                      class="comment-file ml-2"
                    >
                      <v-icon size="18" color="primary" style="vertical-align: middle;">mdi-paperclip</v-icon>
                      <span style="font-size:0.95em;">{{ file.originalName }}</span>
                    </span>
                    <span
                      v-if="discussion.lastCommentFiles.length > 3"
                      class="comment-file ml-2"
                      style="color: #888; font-size: 0.95em;"
                    >
                      +{{ discussion.lastCommentFiles.length - 3 }}
                    </span>
                  </template>
                </div>
              </template>
              <template v-else>
                <TruncateText :text="discussion.content" :maxLength="100" />
              </template>
            </div>
            <span v-if="discussion.lastComment" style="color:#888;font-size:0.92em;">
              {{ discussion.lastComment.createdBy }} / {{ timeAgo(discussion.lastComment.createdTime) }}
            </span>
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
            <v-combobox v-model="newDiscussion.tag" :items="tagSelectOptions" label="標籤（可輸入新標籤或選擇現有）" clearable
              hide-selected allow-overflow small-chips @update:modelValue="onTagChange" />
            <v-select v-model="newDiscussion.tagColor" :items="tagColorOptions" label="標籤顏色" item-title="label"
              item-value="value" clearable :disabled="isTagColorDisabled" />
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
import TruncateText from './truncateText.vue'

const router = useRouter()

const discussions = ref([...forumTestData.discussions])
const comments = ref([...forumTestData.comments])
const files = ref([...forumTestData.files])
const tags = ref([...forumTestData.tags]) // 新增：tags

const searchKeyword = ref('')
const dialogAdd = ref(false)

const newDiscussion = ref({
  title: '',
  content: '',
  tag: '',
  tagColor: '', // 新增：標籤顏色
})

const tagColorOptions = [
  { label: '藍色', value: 'blue' },
  { label: '綠色', value: 'green' },
  { label: '紫色', value: 'purple' },
  { label: '橘色', value: 'orange' },
  { label: '紅色', value: 'red' },
  { label: '灰色', value: 'grey' },
  { label: '黃色', value: 'yellow' },
]

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

// 標籤篩選按鈕與選單
const tagMenu = ref(false)

// 標籤篩選器
const selectedTagFilters = ref([])

// 標籤選項（顯示所有唯一標籤名稱）
const tagFilterOptions = computed(() =>
  Array.from(new Set(tags.value.map(t => t.name)))
)

// 移除已選標籤
function removeTagFilter(tag) {
  selectedTagFilters.value = selectedTagFilters.value.filter(t => t !== tag)
}

const filteredDiscussions = computed(() => {
  let result = discussions.value
  // 標題/內容搜尋
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    result = result.filter(
      (d) =>
        d.title.toLowerCase().includes(keyword) ||
        d.content.toLowerCase().includes(keyword)
    )
  }
  // 標籤篩選（AND 條件：所有選取標籤都要有）
  if (selectedTagFilters.value.length > 0) {
    result = result.filter(d => {
      const discussionTags = tags.value.filter(
        t => t.referenceType === 'discussion' && t.referenceId === d.discussionId
      )
      const tagNames = discussionTags.map(t => t.name)
      // 所有選取標籤都必須包含
      return selectedTagFilters.value.every(tag => tagNames.includes(tag))
    })
  }
  return result
})

const discussionsWithMeta = computed(() => {
  let arr = filteredDiscussions.value.map((d) => {
    const relatedComments = comments.value.filter(c => c.discussionId === d.discussionId)

    let fileCount = 0

    // 加上「主題本身」的檔案數
    const topicFiles = files.value.filter(f => f.referenceId === d.discussionId && f.status === 'Alive')
    fileCount += topicFiles.length

    // 加上「留言」的檔案數
    relatedComments.forEach(c => {
      const commentFiles = files.value.filter(f => f.referenceId === c.commentId && f.status === 'Alive')
      fileCount += commentFiles.length
    })

    // 找到最新留言
    let lastComment = null
    let lastCommentFiles = []
    if (relatedComments.length > 0) {
      lastComment = relatedComments.reduce((a, b) =>
        new Date(a.createdTime) > new Date(b.createdTime) ? a : b
      )
      // 取得該留言的檔案
      lastCommentFiles = files.value.filter(f => f.referenceId === lastComment.commentId && f.status === 'Alive')
    }

    // 新增：取得標籤
    const discussionTags = tags.value.filter(t => t.referenceType === 'discussion' && t.referenceId === d.discussionId)
    return {
      ...d,
      fileCount,
      commentCount: relatedComments.length,
      avatarUrl: d.avatarUrl || '',
      workTitle: d.workTitle || '',
      lastComment,
      lastCommentFiles, // 新增：最後留言的檔案
      tags: discussionTags.map(t => t.name),
      tagsObj: discussionTags,
      lastActivityTime: lastComment ? lastComment.createdTime : d.createdTime
    }
  })

  // 排序
  if (sortType.value === 'mostComment') {
    arr = arr.sort((a, b) => b.commentCount - a.commentCount)
  } else if (sortType.value === 'leastComment') {
    arr = arr.sort((a, b) => a.commentCount - b.commentCount)
  } else if (sortType.value === 'newest') {
    // 依據最新留言（若無留言則用討論建立時間）
    arr = arr.sort((a, b) => new Date(b.lastActivityTime) - new Date(a.lastActivityTime))
  }
  return arr
})

// 新增：新增標籤功能
const addTag = (name, referenceType, referenceId, color) => {
  const newTag = {
    tagId: 't' + Date.now(),
    name,
    referenceType,
    referenceId,
    color: color || 'primary', // 新增顏色
  }
  tags.value.push(newTag)
  forumTestData.tags.push(newTag)
}

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
    avatarUrl: '',
    workTitle: '',
  })

  // 新增：如果有輸入標籤，則新增標籤，帶入顏色
  if (newDiscussion.value.tag && newDiscussion.value.tag.trim()) {
    addTag(
      newDiscussion.value.tag.trim(),
      'discussion',
      newId,
      newDiscussion.value.tagColor || 'primary'
    )
  }

  newDiscussion.value.title = ''
  newDiscussion.value.content = ''
  newDiscussion.value.tag = ''
  newDiscussion.value.tagColor = ''
  dialogAdd.value = false
  form.value.resetValidation()
  router.push(`/edit/forum/${newId}`)
}

const onClickDiscussion = (discussion) => {
  router.push(`/edit/forum/${discussion.discussionId}`)
}

// 取得現有標籤名稱（唯一）
const tagSelectOptions = computed(() =>
  Array.from(new Set(tags.value.map(t => t.name)))
)

// 新增：標籤顏色是否被禁用
const isTagColorDisabled = ref(false)

// 新增：當標籤變更時，處理標籤顏色
function onTagChange(val) {
  // 檢查是否選擇了現有標籤
  const existTag = tags.value.find(t => t.name === val)
  if (existTag) {
    newDiscussion.value.tagColor = existTag.color || 'primary'
    isTagColorDisabled.value = true
  } else {
    newDiscussion.value.tagColor = ''
    isTagColorDisabled.value = false
  }
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

.last-comment-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex-wrap: wrap;
}

.last-comment-row .comment-file {
  white-space: nowrap;
}
</style>
