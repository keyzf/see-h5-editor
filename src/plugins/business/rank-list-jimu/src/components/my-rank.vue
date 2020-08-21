<template>
    <div class="my-info" :style="{color:colorMyRank}">
        <img class="my-info-bg" :src="imageSrcMyRank" alt="">
        <div class="my-info-content" :style="infoStyle">
            <span v-if="userInfo.rank>-1" class="my-rank">我的排名: <span
                class="num">{{Number(userInfo.rank) + 1}}</span></span>
            <span v-else class="my-rank">未参加活动</span>
            <div v-if="userInfo.rank>-1" class="my-num">
                <img v-if="imageSrcGiftIcon" class="my-icon" :src="imageSrcGiftIcon" alt="">
                <span>{{userInfo.total}}</span>
            </div>
        </div>
    </div>
</template>

<script>

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
        infoStyle () {
            return {
                bottom: `${this.myRankBottom}px`
            }
        }
    },
    data () {
        return {}
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
        font-size: 14px;

        .my-info-bg {
            width: 100%;
            display: block;
        }

        .my-info-content {
            box-sizing: border-box;
            padding: 0 22px;
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
        }

        .my-rank {
            line-height: 1;
            display: flex;
            align-items: center;

            .num {
                margin-left: 10px;
            }
        }

        .my-icon {
            height: 19px;
            display: block;
            margin-right: 2px;
        }
    }

</style>
