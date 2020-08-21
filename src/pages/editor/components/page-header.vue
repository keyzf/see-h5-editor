<template>
  <div class="components-page-header">
    <h1 class="logo-wrapper cursor-pointer" @click="$router.push('/')">
      <img src="../common/images/logo.png" alt="">
      <span>See H5</span>
    </h1>
    <slot></slot>
    <!-- <div class="pull-right">
      <userHeaderBar class="marginL30"/>
    </div> -->
  </div>
</template>

<script>
// import userHeaderBar from './user-header-bar'
import { mapState } from 'vuex'

export default {
  name: 'page-header',
  components: {
    // userHeaderBar
  },
  data () {
    return {}
  },
  computed: {
    ...mapState({
      userData: state => state.user.userData,
      token: state => state.user.token
    })
  },
  methods: {
    logoutFn () {
      this.$router.push({ name: 'Login' })
    },
    goLogin () {
      this.$mUtils.Cookie.set('beforeLoginUrl', encodeURIComponent(this.$route.fullPath), 1 / 24 / 60, window.location.host, window.location.pathname.substring(0, window.location.pathname.length - 1)) // 保存用户进入的url
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .components-page-header {
    height: 48px;
    line-height: 48px;
    padding-left: 12px;
    padding-right: 12px;
    box-shadow: 0px 3px 16px 0px rgba(0, 0, 0, 0.1);
  }


  .logo-wrapper {
    font-size: 20px;
    color: #000;
    display: flex;
    align-items: center;

    img {
      width: 26px;
      height: 28px;
      display: inline-block;
      margin-right: 10px;
      margin-left: 10px;
    }
  }

  .el-dropdown-link {
    color: white;
  }

  .user-header-image {
    display: inline-block;
    vertical-align: middle;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 4px;
    font-size: 32px;
    line-height: 32px;
    text-align: center;
    margin-top: -5px;
  }
</style>
