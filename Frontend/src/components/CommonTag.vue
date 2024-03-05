<template>
    <div class="tabs">
        <el-tag
            v-for="(item,index) in tags"
            :key="index"
            :closable="item.name !== 'home'"
            :effect="$route.name === item.name ? 'plain' : 'dark'"
            @click="clickTag(item)"
            @close="closeTag(item, index)"
            size="small"
        >
        {{item.label}}
        </el-tag>
    </div>
</template>

<script>
    import {mapState,mapGetters,mapMutations,mapActions} from 'vuex';

    export default {
        name: 'CommonTag',
        data() {
            return {

            }
        },
        computed: {
            ...mapState('tab',{
                tags: 'tabList',
            })
        },
        methods: {
            ...mapMutations('tab',{
                delTag: 'DEL_TAG',
            }),
            clickTag(item) {
                this.$router.push(item.path);
            },
            closeTag(item, index) {
                const length = this.tags.length-1;
                this.delTag(item);
                if(item.name !== this.$route.name) {
                    return
                }
                else{
                    if (index === length) {
                        this.$router.push(this.tags[index-1].path);
                    } else {
                        this.$router.push(this.tags[index].path);
                    }
                }
            },
        },
    }
</script>

<style lang="less" scoped>
.tabs {
    padding: 20px;
    .el-tag {
        margin-right: 15px;
        cursor: pointer;
    }
}
</style>