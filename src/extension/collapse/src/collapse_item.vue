<template>
  <div class="ph-collapse-item">
    <div
      class="__collapse-title"
      :class="{ unfold: unfold }"
      @click="handleTitleClick"
    >
      <span v-if="title">{{ title }}</span>
      <template v-else>
        <slot name="title"></slot>
      </template>
      <ph-arrow-icon
        class="__collapse-icon"
        initStatus="down"
        activeStatus="up"
        :active="unfold"
      ></ph-arrow-icon>
    </div>
    <div
      class="__collapse-content"
      :style="{ height: unfold ? childrenHeight : 0 }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Emitter from '../../../mixins/emitter'

export default {
  name: 'PhCollapseItem',

  componentName: 'PhCollapseItem',

  mixins: [Emitter],

  data() {
    return {
      active: false,
      // index 会被ph-collapse设置
      index: null,
      childrenHeight: 0,
    }
  },

  props: {
    title: String,
    name: String,
  },

  computed: {
    header() {
      return this.title || this.$slots.title
    },

    unfold() {
      return this.itemName !== null
        ? this.$parent.hasItem(this)
        : this.active
    },

    itemName() {
      return this.name || this.index
    },
  },

  methods: {
    handleTitleClick() {
      this.active = !this.unfold
      this.dispatch('PhCollapse', 'item-click', this)
    },

    getChildrenHeight() {
      let d = this.$slots.default
      this.childrenHeight = d === undefined
        ? 0
        : d.reduce((sum, cur) => {
          let size = cur.elm.offsetHeight || 0
          return sum + size
        }, 0) + 'px'
    },
  },

  updated() {
    if (this.childrenHeight === 0) {
      this.getChildrenHeight()
    }
  },
}
</script>

<style lang="scss">
.ph-collapse-item {
  position: relative;

  .__collapse-title {
    cursor: pointer;
    user-select: none;
    position: relative;
    display: flex;
    align-items: center;

    &:hover {
      background-color: #f3f4f5;
    }

    &:first-child {
      padding: .6rem 1.75rem;
    }

    &.unfold {
      background-color: #f7f8fa;
    }
  }

  .__collapse-icon {
    position: absolute;
    right: 1.75rem;
  }

  .__collapse-content {
    transition: .3s;
    overflow: hidden;
    background-color: #f7f8fa;

    &.unfold {
      height: 100px;
    }
  }
}
</style>
