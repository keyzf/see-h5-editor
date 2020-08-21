<template>
  <div class="see-music-player">
    <div class="video-play-audio" v-if="musicSrc">
      <a-player :key="JSON.stringify(musicInfo)" :music="musicInfo"/>
    </div>
  </div>
</template>

<script>
import Aplayer from 'vue-aplayer'

export default {
  name: 'SeeMusicPlayer',
  components: {
    'a-player': Aplayer
  },
  props: {
    text_title: {
      type: String,
      label: '歌曲名',
      default: ''
    },
    text_artist: {
      type: String,
      label: '歌手名',
      default: ''
    },
    musicSrc: {
      type: String,
      default:
        'https://media.meetstarlive.com/MTU5NzA0MDE1MzE2MSM2MjYjbXAz.mp3'
    },
    imageSrc: {
      type: String,
      default: require('./music.png')
    }
  },
  data () {
    return {}
  },
  computed: {
    musicInfo () {
      return {
        title: this.text_title,
        artist: this.text_artist,
        src: this.musicSrc,
        pic: this.imageSrc
      }
    }
  },
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style lang="scss" scoped>
  .see-music-player {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 10px;
    // border-radius: 50%;
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
