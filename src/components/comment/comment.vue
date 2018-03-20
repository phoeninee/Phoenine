<template>
  <li class="comment">
    <span class="comment-avatar">
      <img :src="avatar || '/static/img/bg.png'">
    </span>
    <div class="comment-body">
      <div class="mv1 color-first">
        <span class="fw6">{{ user }}</span>
        <template v-if="replyTargetID">
          <span class="gray5 mh1">
            <i class="fas fa-caret-right"></i>
          </span>
          <span class="fw6">{{ replyTargetUser }}</span>
        </template>
      </div>
      <p class="comment-content">{{ content }}</p>
      <div class="comment-op">
        <span v-if="!checkDisabled">
          <el-button
            v-if="replyTargetID"
            @click="checkConvr"
            plain
          >
            <i class="fas fa-comments"></i>&nbsp;查看对话
          </el-button>
          <el-button
            v-else-if="replys"
            @click="checkReplys"
            plain
          >
            <i class="fas fa-comments"></i>&nbsp;查看回复
          </el-button>
          <el-button
            @click="reply"
            plain
          >
            <i class="fas fa-reply"></i>&nbsp;回复
          </el-button>
        </span>
        <span class="f2 gray5">{{ dateInfo }}</span>
      </div>
    </div>
  </li>
</template>

<script>
import CommentEditor from './editor'

export default {
  name: 'Comment',

  data() {
    return {
      showReplyEditor: false,
    }
  },

  props: {
    commentList: Object,
    cid: String,
    user: String,
    replyTargetID: String,
    replys: Array,
    avatar: String,
    createdAt: Date,
    content: String,
    baseTime: Date,
    checkDisabled: Boolean,
  },

  computed: {
    // 返回 createdAt 日期以 baseTime 为基准的相应字符串格式
    dateInfo() {
      let target = this.createdAt
      let secDiff = (this.baseTime - target) / 1000

      if (secDiff <= 86400 * 7) {
        for (let [base, descriptor] of [
          [86400, '天前'], [3600, '小时前'], [60, '分钟前']
        ]) {
          if (secDiff > base) {
            return Math.floor(secDiff / base) + descriptor
          }
        }
        return '0分钟前'
      }

      let targetYear = target.getFullYear()
      let baseYear = this.baseTime.getFullYear()
      return (targetYear === baseYear ? '' : (targetYear + '/'))
        + [
          target.getMonth() + 1,
          target.getDate()
        ].join('/')
        + ` ${target.getHours() || '00'}:${target.getMinutes() || '00'}`
    },

    replyTargetUser() {
      let id = this.replyTargetID
      return id && this.commentList[id].user
    },
  },

  methods: {
    reply() {
      this.$emit('reply', this.cid, this.user)
    },

    checkConvr() {
      this.$emit('check-convr', this.cid)
    },

    checkReplys() {
      this.$emit('check-replys', this.cid)
    },
  },

  components: {
    CommentEditor,
  },
}
</script>

<style lang="scss">
$avatar-width: 3rem;
$avatar-mr: .5rem;

.color-first {
  color: $color-first;
}

.comment {
  display: flex;

  .comment-content {
    font-size: .9rem;
  }

  .comment-avatar {
    border-radius: 50%;
    width: $avatar-width;
    height: $avatar-width;
    margin-top: .5rem;
    margin-right: $avatar-mr;
    overflow: hidden;

    img {
      position: relative;
      height: $avatar-width;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .comment-body {
    width: 100%;
    border-top: 1px solid #ddd;
    font-size: 1rem;
    padding-top: .5rem;

    .comment-op button {
      padding: 0;
      margin: 0;
      margin-right: .5rem;
      border: none;
      font-size: .8rem;
    }
  }
}

.comment + .comment {
  margin-top: .75rem;
}
</style>