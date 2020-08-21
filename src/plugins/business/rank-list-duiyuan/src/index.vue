<template>
    <div class="see-rank-list">
        <div v-if="list.length === 0" :class="cx('empty')">
            <img class="empty-img" :src="imageSrc_emptyBg" alt="">
        </div>
        <ul v-if="list.length > 0" :class="cx('list-wrapper')">
            <!-- <li :class="cx('item')" :style="{ color: color_title }">
                <div :class="cx('item-title')">{{ text_rank }}</div>
                <div :class="cx('item-title')">{{ text_avatar }}</div>
                <div :class="cx('item-title')">{{ text_nick }}</div>
                <div :class="cx('item-title')">{{ text_giftCount }}</div>
            </li> -->
            <li v-for="(item, index) in list" :class="cx('item')" :key="index">
                <div :class="cx('item-rank')">
                    <template v-if="index === 0">
                        <img :src="imageSrc_firstIcon" />
                    </template>
                    <template v-else-if="index === 1">
                        <img :src="imageSrc_secondIcon" />
                    </template>
                    <template v-else-if="index === 2">
                        <img :src="imageSrc_thirdIcon" />
                    </template>
                    <template v-else-if="index === 3">
                        <img :src="imageSrc_fourthIcon" />
                    </template>
                    <template v-else-if="index === 4">
                        <img :src="imageSrc_fifthIcon" />
                    </template>
                    <template v-else>{{ index + 1 }}</template>
                </div>
                <div :class="cx('item-avatar')">
                    <img
                        @click="handleAvatarClick(item.uid)"
                        :src="item.portrait"
                        alt=""
                    />
                </div>
                <div :class="cx('item-nick')">
                    <div>{{ item.nick }}</div>
                    <div class="remark" v-if="index === 0">
                        {{ text_firstRemark }}
                    </div>
                    <div class="remark" v-if="index === 1">
                        {{ text_secondRemark }}
                    </div>
                    <div class="remark" v-if="index === 2">
                        {{ text_thirdRemark }}
                    </div>
                    <div class="remark" v-if="index === 3">
                        {{ text_fourthRemark }}
                    </div>
                    <div class="remark" v-if="index === 4">
                        {{ text_fifthRemark }}
                    </div>
                </div>
                <div :class="cx('item-score')">
                    <img
                        v-if="imageSrc_giftIcon"
                        :class="cx('item-icon')"
                        :src="imageSrc_giftIcon"
                        alt=""
                    />
                    <span class="item-total"
                        ><template v-if="imageSrc_giftIcon">x</template>
                        {{ item.total || 0 }}</span
                    >
                </div>
            </li>
        </ul>
        <my-rank
            ref="myRank"
            v-if="radio_myRank === 1"
            :jump-to-user-center="handleAvatarClick"
            :user-info="userInfo"
            :color-my-rank="color_myRank"
            :image-src-my-rank="imageSrc_myRank"
            :my-rank-bottom="number_myRankBottom"
            :image-src-gift-icon="imageSrc_giftIcon"
        />
    </div>
</template>

<script>
import API from "./apis";
import MyRank from "./components/my-rank";
import { demoList, demoUserInfo } from "./mock";

const classPrefix = "see-rank-list";
const RANK_MAP = { 0: "第一名", 1: "第二名", "-1": "未上榜" };

export default {
    name: "SeeRankListDuiyuan",
    components: { MyRank },
    props: {
        configBtn: {
            label: "数据源配置",
            type: String,
            default: `/pages/activity/rank-config/index.html`
        },
        text_url: {
            label: "接口地址",
            type: String,
            default: ""
        },
        color_title: {
            label: "标题颜色",
            type: String,
            default: "#999999"
        },
        radio_myRank: {
            label: '是否展示我的排名',
            type: [Number, String],
            default: 1,
            options: [
                { content: '开启', value: 1 },
                { content: '关闭', value: 2 }
            ]
        },
        color_myRank: {
            label: "我的排名颜色",
            type: String,
            default: "#FFF"
        },
        imageSrc_myRank: {
            label: "我的排名背景",
            type: String,
            default: "//img.ikstatic.cn/MTU5MDEzMzA5NTg1MyM2NDQjcG5n.png"
        },
        number_myRankBottom: {
            label: "我的排名bottom值",
            type: Number,
            default: 10
        },
        text_rank: {
            label: "排名",
            type: String,
            default: "排名"
        },
        text_avatar: {
            label: "头像",
            type: String,
            default: "头像"
        },
        text_nick: {
            label: "昵称",
            type: String,
            default: "昵称"
        },
        text_giftCount: {
            label: "礼物数量",
            type: String,
            default: "礼物数量"
        },
        imageSrc_giftIcon: {
            label: "礼物图标",
            type: String,
            default: "//img.ikstatic.cn/MTU4OTg2ODMxNjUyMyMyMTYjcG5n.png"
        },
        imageSrc_firstIcon: {
            label: "第一名图标",
            type: String,
            default: "//img.ikstatic.cn/MTU4OTg2ODM2Mjg0OSM4MjQjcG5n.png"
        },

        imageSrc_secondIcon: {
            label: "第二名图标",
            type: String,
            default: "//img.ikstatic.cn/MTU4OTg2ODMzNzMzOCM2NTkjcG5n.png"
        },
        imageSrc_thirdIcon: {
            label: "第三名图标",
            type: String,
            default: "//img.ikstatic.cn/MTU4OTg2ODM1MjU0NyM4MzMjcG5n.png"
        },
        imageSrc_fourthIcon: {
            label: "第四名图标",
            type: String,
            default: "//img.ikstatic.cn/MTU4OTg2ODMzNzMzOCM2NTkjcG5n.png"
        },
        imageSrc_fifthIcon: {
            label: "第五名图标",
            type: String,
            default: "//img.ikstatic.cn/MTU4OTg2ODM1MjU0NyM4MzMjcG5n.png"
        },
        text_firstRemark: {
            label: "第一名备注文字",
            type: String,
            default: "奖励：xxxx元，夏日1头像框"
        },
        text_secondRemark: {
            label: "第二名备注文字",
            type: String,
            default: "奖励：xxxx元，夏日2头像框"
        },
        text_thirdRemark: {
            label: "第三名备注文字",
            type: String,
            default: "奖励：xxxx元，夏日3头像框"
        },
        text_fourthRemark: {
            label: "第四名备注文字",
            type: String,
            default: "奖励：xxxx元，夏日3头像框"
        },
        text_fifthRemark: {
            label: "第五名备注文字",
            type: String,
            default: "奖励：xxxx元，夏日3头像框"
        },
        imageSrc_emptyBg: {
            label: "空白背景图",
            type: String,
            default: ""
        },
        currentPageIndex: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            RANK_MAP,
            allList: [], // 所有排行榜到数据
            allUserInfo: [] // 所有自己到数据
        };
    },
    computed: {
        list() {
            return this.allList[0] || [];
        },
        userInfo() {
            return (
                this.allUserInfo[0] || {
                    nick: "", //昵称
                    portrait: "", //头像
                    total: "", //数值
                    rank: -1 //排名，0为第一名，1为第二名，-1表示没上榜
                }
            );
        }
    },
    mounted() {
        this.fetchList();
    },
    methods: {
        cx(s) {
            return `${classPrefix}-${s}`;
        },
        handleAvatarClick(uid) {
            try {
                if (!window.LXFlutter)
                    throw new Error("bridge 不存在，请检查是否已将bridge注入");
                window.LXFlutter.postMessage(
                    JSON.stringify({
                        message: "userProfile",
                        data: { uid, from: window.location.href }
                    })
                );
            } catch (error) {
                console.error(error);
            }
        },
        fetchList() {
            API.GET_RANK_DATA(this.globalVariable, this.text_url).then(res => {
                if (Array.isArray(res.data.list) && res.data.list.length > 0) {
                    this.allList = res.data.list || [];
                    this.allUserInfo = res.data.user_info || [];
                } else if (this.isPreview) {
                    // 模拟一些数据
                    this.allList = [demoList, demoList, demoList];
                    this.allUserInfo = [
                        demoUserInfo,
                        demoUserInfo,
                        demoUserInfo
                    ];
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.see-rank-list {
    &-item {
        margin-bottom: 12px;
        padding: 0 12px;
        display: flex;
        align-items: center;

        .remark {
            font-size: 11px;
            margin-top: 2px;
            line-height: 1;
            opacity: 0.6;
        }

        &-title {
            &:nth-of-type(1) {
                width: 10%;
                text-align: center;
            }

            &:nth-of-type(2) {
                width: 25%;
                text-align: center;
            }

            &:nth-of-type(3) {
                flex: 1;
                // text-align: left;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            &:nth-of-type(4) {
                text-align: right;
            }
        }

        &-rank {
            width: 10%;
            font-weight: 500;
            text-align: center;

            img {
                display: inline-block;
                width: 100%;
            }
        }

        &-avatar {
            width: 25%;

            img {
                display: block;
                width: 40px;
                height: 40px;
                margin: auto;
                border-radius: 50%;
                overflow: hidden;
                // background-color: #d9d9d9;
            }
        }

        &-nick {
            flex: 1;
            overflow: hidden;
            margin-right: 5px;

            > div {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

        &-score {
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

        &-icon {
            width: 34px;
            height: 34px;
            display: inline-block;
        }
    }

    &-empty {
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
