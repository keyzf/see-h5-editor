<template>
    <div class="see-text" v-text="text"></div>
</template>

<script>
export default {
    name: "SeeText", // 这个名字很重要，它就是未来的标签名<see-text></see-text>
    props: {
        text: {
            type: String,
            default: "这是一段文字"
        }
    },
    watch: {
        text(val) {
            console.log("log=>", val);
        }
    },
    data() {
        return {};
    }
};
</script>

<style lang="scss" scoped>
.see-text {
    white-space: pre-wrap;
}
</style>
