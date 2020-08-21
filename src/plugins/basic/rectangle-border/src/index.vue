<!--矩形边框-->
<template>
    <div class="see-rectangle-border">
        <slot :item="{...originData}"/>
    </div>
</template>

<script>
export default {
    name: 'SeeRectangleBorder',
    data () {
        return {
            originData: {
                testData: '这是一段模拟数据'
            }
        }
    },
    mounted () {
        this.fetchList()
    },
    methods: {
        fetchList () {}
    }
}
</script>

<style lang="scss" scoped></style>
