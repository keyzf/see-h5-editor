<template>
  <div class="see-music-player">
    <audio
      hidden
      ref="audioPlayer"
      class="see-audio"
      :src="musicSrc"
      @timeupdate="updateTime"
      @canplay="onCanplay"
      @playing="onPlaying"
      @pause="onPause"
      preload></audio>
    <div class="left-controls">
      <div class="progress-wrapper" ref="progressBar"
           @click="changeTime"
           @touchstart="touchStart"
           @touchmove="touchMove"
           @touchend="touchEnd">
        <div ref="progressValue" :style="{width:position}" class="progress"></div>
        <img
          ref="progressBtn"
          :style="{left:position}"
          class="progress-btn"
          :src="imageSrc_progressBtn"
          alt="">
      </div>
      <div class="duration">{{currentTime|formatSecond}}</div>
    </div>
    <div class="control-btn">
      <img class="img" @click="handleMusicPlay" :src="playing ? imageSrc_stop:imageSrc_play" alt="bg">
    </div>
  </div>
</template>

<script>

function addZero (num) {
  return num < 10 ? '0' + num : num
}

export default {
  name: 'SeeBgMusic',
  filters: {
    // 格式时长
    formatSecond (interval = 0) {
      const minute = parseInt(interval / 60, 10)
      const second = parseInt(interval % 60)
      return `${addZero(minute)}:${addZero(second)}`
    }
  },
  props: {
    musicSrc: {
      type: String,
      default: 'https://media.meetstarlive.com/MTU5NzA0MDE1MzE2MSM2MjYjbXAz.mp3'
    },
    imageSrc_play: {
      type: String,
      default: '//img.ikstatic.cn/MTU5NjY5ODQxMjM1NSMzNzEjcG5n.png'
    },
    imageSrc_stop: {
      type: String,
      default: '//img.ikstatic.cn/MTU5NjY5ODM5OTgwOCMyODUjcG5n.png'
    },
    imageSrc_progressBtn: {
      type: String,
      default: '//img.ikstatic.cn/MTU5NjY5OTI2NjY3NyMgMzYjcG5n.png'
    }
  },
  data () {
    return {
      audioEl: null, // 音乐播放器
      progressBarEl: null, // 进度条容器
      playing: false, // 进度条按钮
      duration: 0, // 音乐时长
      currentTime: 0, // 当前播放的时间
      isTouching: false // 是否正在拖拽进度条 拖拽的时候 不更监听回掉新进度条
    }
  },
  computed: {
    position () {
      return this.duration ? (this.currentTime / this.duration) * 100 + '%' : 0
    }
  },
  created () {

  },
  mounted () {
    this.audioEl = this.$refs.audioPlayer
    this.progressBarEl = this.$refs.progressBar
    this.progressValueEl = this.$refs.progressValue
    this.progressBtnEl = this.$refs.progressBtn
  },
  methods: {
    onCanplay () {
      this.duration = this.$refs.audioPlayer.duration
    },
    updateTime (e) {
      !this.isTouching && (this.currentTime = e.target.currentTime)
    },
    handleMusicPlay () {
      if (!this.musicSrc) return
      if (this.playing) {
        this.pause()
      } else {
        this.play()
      }
    },
    play () {
      // 播放的时候暂停其他的音乐
      Array.from(document.querySelectorAll('.see-audio')).forEach(el => {
        el.pause()
      })
      this.audioEl.play()
    },
    pause () {
      this.audioEl.pause()
    },
    changeTime (event) {
      let coordStart = this.progressBarEl.getBoundingClientRect().left
      let coordEnd = event.pageX
      this.audioEl.currentTime = (coordEnd - coordStart) / this.progressBarEl.offsetWidth * this.duration
    },
    touchStart () {
      this.isTouching = true
    },
    touchMove (event) {
      let coordStart = this.progressBarEl.getBoundingClientRect().left
      let coordEnd = event.touches[0].pageX
      // 直接操作dom
      this.progressValueEl.style.width = this.progressBtnEl.style.left = ((coordEnd - coordStart) / this.progressBarEl.offsetWidth).toFixed(3) * 100 + '%'
    },
    touchEnd () {
      this.isTouching = false
      this.currentTime = this.audioEl.currentTime = this.progressValueEl.style.width.replace('%', '') / 100 * this.duration
    },
    // 开始播放了
    onPlaying () {
      this.playing = true
    },
    // 播放暂停了
    onPause () {
      this.playing = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .see-music-player {
    display: flex;

    .left-controls {
      margin-top: 10px;
      flex: 1;
      margin-right: 14px;
      margin-left: 7px;
    }

    .progress-wrapper {
      width: 100%;
      height: 7px;
      box-shadow: 0px 1px 4px 0px rgba(2, 3, 3, 0.52);
      background-color: #FFFFFF;
      border-radius: 14px;
      position: relative;

      .progress {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        width: 50%;
        height: 100%;
        background-color: #3F5EFB;
        border-radius: 14px;
      }

      .progress-btn {
        position: absolute;
        left: 0;
        top: -2px;
        transform: translateX(-50%);
        z-index: 2;
        width: 12px;
        height: 12px;
      }
    }

    .duration {
      text-align: right;
      margin-top: 3px;
      font-size: 12px;
      color: #fff;
    }

    .control-btn {
      flex-shrink: 0;
      width: 30px;

      .img {
        width: 100%;
      }
    }
  }

  .see-bg-music {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 10px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;

    &.playing {
      animation: spin 3s linear infinite;
    }
  }

  /* 无限旋转 */
  @keyframes spin {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
