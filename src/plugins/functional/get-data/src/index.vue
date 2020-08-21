<template>
    <div class="see-get-data"></div>
</template>

<script>
import request from "@/utils/request";

export default {
    name: "SeeGetData",
    props: {
        text_url: {
            label: "接口地址",
            type: String,
            default: ""
        },
        code_handleMethod: {
            label: "处理方法",
            type: String,
            default: "function(data){ return data }"
        }
    },
    data() {
        return {};
    },
    mounted() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            if (!this.text_url) return;
            request({
                method: "get",
                url: this.text_url
            }).then(({ data }) => {
                const finalData = this.runCodeWithData(this.code_handleMethod, data)
                this.dSet('data', finalData)
            });
        },
        runCodeWithData(obj, data) {
            return Function('"use strict";return (' + obj + ")")()(data);
        }
    }
};
</script>

<style lang="scss" scoped>

</style>
