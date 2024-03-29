<template>
  <div class="TableContent border-info relative scroll">
    <el-table 
      :key="Props.tableKey" 
      v-loading="loading" 
      style="width:100%; height: calc(650px)" 
      :data="Props.DataSource"
      row-key="id" 
      lazy
      :tree-props="{ children: Props.child?.childrenKey, hasChildren: Props.child?.hasChildrenKey }"
      :load="Props.lazyLoad"
      stripe
      :efault-expand-all="false"
      @sort-change="handleSortChange"
      @select-all="handleMultipleSelectAll"
      @select="handleMultipleSelect"
    >
      <slot />
    </el-table>
    <div class="Pagination absolute flex-row flex-jus">
      <el-pagination 
        v-model:current-page="currentPage"
        v-model:page-size="pageSize" 
        :page-sizes="[10, 20, 30, 40]"
        :small="small" 
        :disabled="disabled" 
        :background="background" 
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange"
      />
      <div class="h-full flex-row flex-center mr-5">
        <el-button
          type="primary"
          :loading="loading"
          @click="emit('refresh')"
        >
          刷新数据
        </el-button>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { ref } from "vue";
import { lazyFunc, ChildProps, Sorted } from "@/components/TableFunction/index.type";
interface IProps {
  //数据源
  DataSource: object[];
  //懒加载函数
  lazyLoad ?: lazyFunc<any>;
  //子列表名称 //懒加载bool字段名称
  child ?: ChildProps; 
  //表格key
  tableKey?: number;
  //加载
  loading: boolean;
  //数据总数
  total: number;
}

interface Emit {
  //表格刷新事件
  (event: "refresh") : void;
  //表格修改分页大小事件
  (event: "handleSizeChange", limit: number) : void;
  //表格分页事件
  (event: "handleCurrentChange", offset: number) : void;
  //表格排序事件
  (event: "handleSortChange", sort: any): void;
  //表格选中事件
  (event: "handleMultipleSelect", selections: selection[], row: selection ) : void;
  //表格全选事件
  (event: "handleMultipleSelectAll", selections: selection[]) : void;
}
const emit = defineEmits<Emit>();

const Props = withDefaults(
  defineProps<IProps>(),
  { 
    tableKey: 0,
    loading: false,
    total: 0
  }
);

const handleSortChange = ({ column,  prop, order } : Sorted & { column : any } ) => {
  emit("handleSortChange", { prop, order });
}

const currentPage = ref(1);
const pageSize = ref(10);
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
  emit("handleSizeChange", val);
}

const handleCurrentChange = (val: number) => {
  emit("handleCurrentChange", val);
}

interface selection {
  [index: string] : any;
}

const handleMultipleSelectAll = (selections: selection[]) => {
  emit("handleMultipleSelectAll", selections);
}

const handleMultipleSelect = (selections: selection[], row: selection) => {
  emit("handleMultipleSelect", selections, row);
}

</script>

<style lang="scss" scoped>
.TableContent {
  width: 90%;
  margin: 0 auto;
  height: 700px;
}

.Pagination {
  bottom: 0px;
  right: 0px;
  height: 50px;
}
</style>