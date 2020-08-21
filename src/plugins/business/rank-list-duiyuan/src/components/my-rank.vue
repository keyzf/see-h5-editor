<template>
    <div class="my-info" :style="{color:colorMyRank}">
        <img class="my-info-bg" :src="imageSrcMyRank" alt="">
        <div class="my-info-content" :style="infoStyle">
            <div class="my-rank">
                <span>{{myRank}}</span>
                <img @click="jumpToUserCenter(userInfo.uid)" class="my-avatar" :src="userInfo.portrait" alt="">
                <span class="my-nick">{{userInfo.nick}}</span>
            </div>
            <div class="my-num">
                <img v-if="imageSrcGiftIcon" class="my-icon" :src="imageSrcGiftIcon" alt="">
                <span class="my-num"><template v-if="imageSrcGiftIcon">x</template>  {{userInfo.total}}</span>
            </div>
        </div>
    </div>
</template>

<script>
const RANK_MAP = { 0: '第一名', 1: '第二名', '-1': '未上榜' }

export default {
    props: {
        colorMyRank: {
            type: String,
            default: ''
        },
        imageSrcMyRank: {
            type: String,
            default: ''
        },
        imageSrcGiftIcon: {
            type: String,
            default: ''
        },
        myRankBottom: {
            type: Number,
            default: 10
        },
        jumpToUserCenter: {
            type: Function,
            default: function () {
            }
        },
        userInfo: {
            type: Object,
            default: () => ({
                'nick': '',    //昵称
                'portrait': '',//头像
                'total': 0,//数值
                'rank': -1 //排名，0为第一名，1为第二名，-1表示没上榜
            })
        }
    },
    computed: {
        myRank () {
            return this.userInfo.rank + '' === '-1' ? '未上榜' : `第 ${Number(this.userInfo.rank) + 1} 名`
        },
        infoStyle () {
            return {
                bottom: `${this.myRankBottom}px`
            }
        }
    },
    data () {
        return {
            RANK_MAP
        }
    },
    mounted () {
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
    .my-info {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: $zIndex-fixed;
        width: 100%;
        min-height: 40px;
        box-sizing: border-box;

        .my-info-bg {
            width: 100%;
            display: block;
        }

        .my-info-content {
            box-sizing: border-box;
            padding: 0 15px;
            position: absolute;
            z-index: 9;
            left: 0;
            bottom: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .my-num {
            display: flex;
            align-items: center;
        }

        .my-icon {
            width: 34px;
            height: 34px;
        }

        .my-rank {
            display: flex;
            align-items: center;
        }

        .my-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            margin-left: 10px;
        }
        .my-nick{
            margin-left: 10px;
        }
    }

</style>
