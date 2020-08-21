import axios from 'axios'
import $bus from '@/utils/eventBus'
import { copyText } from '@/utils/index'
import { Toast } from 'vant'

/**
 *  元素点击事件相关方法
 * */
export default {
    mounted() {

    },
    methods: {
        /**
         * 链接跳转
         */
        _event_link(eventData) {
            return new Promise((resolve) => {
                if (eventData.url) {
                    window.location.href = eventData.url
                }
                resolve()
            })
        },
        /**
         * 分享
         * @private
         */
        _event_share() {
            return new Promise((resolve) => {
                window.alert('分享')
                resolve()
            })
        },
        /**
         * 表单提交
         * @private
         */
        _event_submitForm(eventData) {
            return new Promise((resolve) => {
                // 获取提交接口
                let apiUrl = eventData.url
                // 获取页面表单数据
                let formdata = {}
                for (const data of this.$children) {
                    if (!data.element.isForm) continue
                    if (data.$children[0].validate && !data.$children[0].validate()) return
                    const key = data.element.propsValue.text_name.value
                    const value = data.$children[0].value
                    formdata[key] = value
                }
                axios.post(apiUrl, formdata).then((res) => {
                    console.log(res)
                    resolve(res)
                })
            })
        },
        /*
        * 点击事件 js 脚本
        * */
        _event_onClick(eventData, element) {
            return new Promise((resolve) => {
                if (eventData.url) {
                    Function('"use strict";return (' + eventData.url + ")")()(element, this);
                    // eval(eventData.url)
                }
                resolve()
            })
        },
        /*
        * 切换状态
        * */
        _event_togglePage(eventData) {
            return new Promise((resolve) => {
                if (typeof this.setCurrentPage === 'function') {
                    this.setCurrentPage(eventData.url)
                }
                resolve()
            })
        },

        /*
        * 打开弹窗
        * */
        _event_openModal(eventData) {
            return new Promise((resolve) => {
                if (eventData.uuid) {
                    console.log(eventData)
                    $bus.$emit('openModal', { uuid: eventData.uuid })
                }
                resolve()
            })
        },

        /*
    * 打开弹窗
    * */
        _event_copyText(eventData) {
            // return new Promise((resolve) => {
            if (eventData.text) {
                // console.log(eventData)
                if (copyText(eventData.text)) {
                    Toast('复制成功')
                }
                // $bus.$emit('openModal', { uuid: eventData.uuid })
            }
            // resolve()
            // })
        }
    }
}
