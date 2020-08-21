<template>
    <div class="see-rank-list">
        <div class="title-row" :style="{color:color_title}">
            <div class="title-col"><span>{{ text_rank }}</span></div>
            <div class="title-col"><span>{{ text_avatar }}</span></div>
            <div class="title-col"><span>{{ text_nick }}</span></div>
            <div class="title-col"><span>{{ text_giftCount }}</span></div>
        </div>
        <div v-if="list.length === 0" class="empty">
            <img class="empty-img" :src="imageSrc_emptyBg" alt="">
        </div>
        <ul v-if="list.length > 0" class="list-wrapper">

            <li v-for="(item, index) in list" :class="`item ${item.live_id?'living':''}`" :key="index">
                <div class="rank">
                    <template v-if="index===0 && imageSrc_firstIcon">
                        <img :src="imageSrc_firstIcon"/>
                    </template>
                    <template v-else>{{ item.object_id ? index + 1 :'?'}}</template>
                </div>
                <div class="avatar">
                    <img @click="handleAvatarClick(item)" :src="item.thumb" alt=""/>
                </div>
                <div class="nick">
                    <div>{{ item.name }}</div>
                    <div class="remark" v-if="index===0">{{ text_firstRemark }}</div>
                    <div class="remark" v-if="index===1">{{ text_secondRemark }}</div>
                    <div class="remark" v-if="index===2">{{ text_thirdRemark }}</div>
                </div>
                <div class="score">
                    <span class="item-total">{{ item.total | numberFilter}}</span>
                </div>
            </li>
        </ul>
        <my-rank
            ref="myRank"
            :user-info="userInfo"
            :color-my-rank="color_myRank"
            :image-src-my-rank="imageSrc_myRank"
            :my-rank-bottom="number_myRankBottom"
            :image-src-gift-icon="imageSrc_giftIcon"/>
    </div>
</template>

<script>
import API from './apis'
import MyRank from './components/my-rank'
import { demoList, demoUserInfo } from './mock'

const MIN_LENGTH = 20
const DEFAULT_AVATAR = '//img.ikstatic.cn/MTU5NzEzMzQ3NTA5NSM2MjkjcG5n.png'

export default {
    name: 'SeeRankListJimu',
    components: { MyRank },
    filters: {
        numberFilter (val) {
            return val > 100000 ? (val / 10000).toFixed(0) + '万' : val
        }
    },
    props: {
        configBtn: {
            label: '数据源配置',
            type: String,
            default: `/pages/activity/rank-config/index.html`
        },
        text_api: {
            label: '接口配置',
            type: String,
            default: ''
        },
        color_title: {
            label: '标题颜色',
            type: String,
            default: '#999999'
        },
        color_myRank: {
            label: '我的排名颜色',
            type: String,
            default: '#FFF'
        },
        imageSrc_myRank: {
            label: '我的排名背景',
            type: String,
            default: '//img.ikstatic.cn/MTU5MDEzMzA5NTg1MyM2NDQjcG5n.png'
        },
        number_myRankBottom: {
            label: '我的排名bottom值',
            type: Number,
            default: 10
        },
        text_rank: {
            label: '排名',
            type: String,
            default: '排名'
        },
        text_avatar: {
            label: '头像',
            type: String,
            default: '头像'
        },
        text_nick: {
            label: '昵称',
            type: String,
            default: '昵称'
        },
        text_giftCount: {
            label: '礼物数量',
            type: String,
            default: '礼物数量'
        },
        imageSrc_giftIcon: {
            label: '礼物图标',
            type: String,
            default: '//img.ikstatic.cn/MTU4OTg2ODMxNjUyMyMyMTYjcG5n.png'
        },
        imageSrc_firstIcon: {
            label: '第一名图标',
            type: String,
            default: '//img.ikstatic.cn/MTU4OTg2ODM2Mjg0OSM4MjQjcG5n.png'
        },
        text_firstRemark: {
            label: '第一名备注文字',
            type: String,
            default: '奖励：xxxx元，夏日1头像框'
        },
        text_secondRemark: {
            label: '第二名备注文字',
            type: String,
            default: '奖励：xxxx元，夏日2头像框'
        },
        text_thirdRemark: {
            label: '第三名备注文字',
            type: String,
            default: '奖励：xxxx元，夏日3头像框'
        },
        imageSrc_emptyBg: {
            label: '省缺图',
            type: String,
            default: '//img.ikstatic.cn/MTU5Njc5NzE0Mjg0MiM2NDkjcG5n.png'
        },
        currentPageIndex: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            list: [], // 所有排行榜到数据
            userInfo: {} // 所有自己到数据
        }
    },
    computed: {},
    mounted () {
        this.fetchList()
    },
    methods: {
        fetchList () {
            API.GET_RANK_DATA(this.globalVariable, this.text_api).then((res) => {
                if (Array.isArray(res.data.list) && res.data.list.length > 0) {
                    this.list = res.data.list || []
                    this.userInfo = res.data.user_info || []
                } else if (this.isPreview) { // 模拟一些数据
                    this.list = demoList
                    this.userInfo = demoUserInfo
                }
                const length = this.list.length
                if (length < MIN_LENGTH) {
                    for (let i = 0; i < MIN_LENGTH - length; i++) {
                        this.list.push({
                            'thumb': DEFAULT_AVATAR,
                            'name': '虚位以待'
                        })
                    }
                }
            })
        },
        // 点击头像跳转
        handleAvatarClick (data) {
            const shareData = {
                imageUrl: 'https://img.ikstatic.cn/MTU5NzIzMTU4OTc2MSMyOTcjcG5n.png',
                description: '收集碎片，获取专属礼物！',
                title: '超星计划'
            }
            if (data.live_id) {
                window.$bridge.jimu.openLiveRoom({ liveId: data.live_id, liveType: data.live_type }, shareData)
            } else {
                window.$bridge.jimu.openUserProfile({ uid: data.object_id }, shareData)
            }
            // setTimeout(() => {
            //     this.$refs.jimuWxDialog.openAppStore()
            // }, 2000)
        }
    }
}
</script>

<style lang="scss" scoped>
    .see-rank-list {
        .title-row {
            display: flex;
            padding-top: 7px;
            padding-bottom: 5px;
            text-align: center;

            .title-col {
                font-weight: 500;

                span {
                    font-size: 13px;
                    height: 18px;
                    align-items: center;
                    display: inline-flex;
                    padding: 0 6px;
                    line-height: 1;
                    background-color: rgba(57, 69, 165, 0.37);
                    border-radius: 9px;
                }

                &:nth-of-type(1) {
                    width: 21.5%;
                }

                &:nth-of-type(2) {
                    width: 47px;
                    margin: 0 9px;
                }

                &:nth-of-type(3) {
                    flex: 1;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                &:nth-of-type(4) {
                    width: 22%;
                }
            }
        }

        .item {
            margin-bottom: 4px;
            height: 59px;
            display: flex;
            align-items: center;
            background-image: url("//img.ikstatic.cn/MTU5NzA0MTcxODY5MCMgODgjcG5n.png");
            background-size: 100% 100%;

            &:first-child {
                color: #FFFDBA;
                background-image: url("//img.ikstatic.cn/MTU5NzA0MTc1OTUxMiM2NDUjcG5n.png");

                .avatar img {
                    border-color: #F1E386;
                }
            }

            &.living {
                .avatar {
                    position: relative;

                    img {
                        border-color: #89FFD7;
                    }

                    &:after {
                        content: '';
                        display: block;
                        width: 27px;
                        height: 11px;
                        background-size: 100% 100%;
                        background-image: url("//img.ikstatic.cn/MTU5NzEzMTI2NDM1NiMxNzIjcG5n.png");
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        z-index: 1;
                    }
                }
            }

            .remark {
                font-size: 11px;
                margin-top: 2px;
                line-height: 1;
                opacity: 0.6;
            }

            .rank {
                width: 21.5%;
                text-align: center;
                font-size: 20px;
                font-family: Source Han Sans CN;
                font-style: italic;
                font-weight: bold;

                img {
                    display: block;
                    width: 100%;
                }
            }

            .avatar {
                margin: 0 9px;

                img {
                    display: block;
                    width: 47px;
                    height: 47px;
                    border-radius: 50%;
                    overflow: hidden;
                    box-sizing: border-box;
                    border: 2px solid #D1D3FF;
                    object-fit: cover;
                }
            }

            .nick {
                flex: 1;
                overflow: hidden;
                margin-right: 5px;
                margin-left: 24px;

                > div {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }

            .score {
                margin-right: 10px;
                width: 22%;
                display: flex;
                text-align: right;
                align-items: center;
                justify-content: flex-end;
                overflow: hidden;

                .item-total {
                    max-width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }

            .icon {
                width: 34px;
                height: 34px;
                display: inline-block;
            }
        }

        .empty {
            height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;

            .empty-img {
                width: 200px;
            }
        }
    }
</style>
