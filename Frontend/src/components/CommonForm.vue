<template>
    <el-form ref="form" :label-width="width || '100px'" :model="form_data" :inline="inline" :rules="rules">
        <el-form-item v-for="item in form_config" :key="item.lable" :label="item.label">
            <el-input
                v-if="item.type === 'input'"
                :placeholder="'请输入'+item.label"
                v-model="form_data[item.model]"
            >
            </el-input>
            <el-input
                v-if="item.type === 'password'"
                :type="'password'"
                :placeholder="'请输入'+item.label"
                v-model="form_data[item.model]"
            >
            </el-input>
            <el-switch
                v-if="item.type === 'switch'"
                v-model="form_data[item.model]"
            >
            </el-switch>
            <el-date-picker
                v-if="item.type === 'date'"
                placeholder="请选择日期"
                v-model="form_data[item.model]"
                type="date"
                value-format="yyyy-MM-dd"
            >
            </el-date-picker>
            <el-select
                v-if="item.type === 'select'"
                placeholder="请选择"
                v-model="form_data[item.model]"
            >
                <el-option 
                    v-for="item in item.opts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >

                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item><slot></slot></el-form-item>
    </el-form>
</template>

<script>
    export default {
        name: 'CommonForm',
        props: {
            formConfig: Array,
            formData: Object,
            inline: Boolean,
            rules: Object,
            width: String,
        },
        data() {
            return {
                form_config: this.formConfig,
                form_data: this.formData,
            };
        },
    }
</script>

<style>

</style>