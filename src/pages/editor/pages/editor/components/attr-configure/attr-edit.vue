<template>
  <el-scrollbar class="components-attr-edit">
    <div class="attr-edit-inner" v-if="activeElementUUID">
			<div class="props-attr-style">
        <metaAttr></metaAttr>
      </div>
      <div class="props-attr-style">
        <propsAttr></propsAttr>
      </div>
      <div class="common-attr-style">
        <baseAttr></baseAttr>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
	import baseAttr from './attr-props-components/base-attr'
	import propsAttr from './attr-props-components/props-attr/index.vue'
	import metaAttr from './attr-props-components/meta-attr'
	import {mapState, mapGetters} from 'vuex'

	export default {
		props: {},
		components: {
			baseAttr,
			propsAttr,
			metaAttr
		},
		computed: {
			...mapState({
				projectData: state => state.editor.projectData,
				activePageUUID: state => state.editor.activePageUUID,
				activeElementUUID: state => state.editor.activeElementUUID
			}),
			...mapGetters([
				'currentPageIndex',
			])
		}
	}
</script>

<style scoped>
  .components-attr-edit {
    height: 100%;
  }

</style>
