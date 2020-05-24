<template>
  <div>
    <el-card style="margin-bottom:20px">
      <CategorySelector @categoryChange="handleCategoryChange" />
    </el-card>
    <el-card>
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 20px"
          @click="showAddSpu"
          >添加SPU</el-button
        >
        <el-table :data="spuList" stripe border v-loading="loading">
          <el-table-column
            label="序号"
            type="index"
            width="80"
            align="center"
          ></el-table-column>
          <!-- prop是读date所有属性的值 -->
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <hint-button
                title="添加SKU"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="showSkuAdd"
              ></hint-button>
              <hint-button
                title="修改SPU"
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="showUpdateSpu(row.id)"
              ></hint-button>
              <hint-button
                title="删除SPU"
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></hint-button>
              <hint-button
                title="查询SKU"
                type="info"
                icon="el-icon-info"
                size="mini"

              ></hint-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          style="text-align: center; margin-top: 20px;"
          :current-page="page"
          :page-sizes="[3, 6, 9, 12]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        />
      </div>
      <SpuForm ref="spuForm" :visible.sync="isShowSpuForm"></SpuForm>
      <SkuForm v-show="isShowSkuForm"></SkuForm>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "../components/spuForm";
import SkuForm from "../components/skuForm";
export default {
  name: "SpuList",
  data() {
    return {
      spuList: [],
      loading: false,
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1,
      limit: 3,
      total: 0,
      isShowSpuForm: false, //是否显示spuForm界面
      isShowSkuForm: false
    };
  },
  mounted() {
    this.category3Id=61
    this.getSpuList();
  },
  methods: {
    handleCategoryChange({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
        this.spuList = [];
        this.total = 0;
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
        this.spuList = [];
        this.total = 0;
      } else {
        this.category3Id = categoryId;
        this.getSpuList(); //请求获取分页列表数据
      }
    },
    //指定获取分页列表的数据
    async getSpuList(page = 1) {
      this.page = page;
      const { limit, category3Id } = this;
      const result = await this.$API.spu.getList(page, limit, category3Id);
      if (result.code === 200) {
        const { records, total } = result.data;
        this.spuList = records;
        this.total = total;
      }
    },
    //当页面发生改变时的监听回调函数
    handleSizeChange(pageSize) {
      this.limit = pageSize;
      this.getSpuList(1); //当数据发生改变式显示的是第一个页面显示的数据
    },
    //显示spu的修改界面
    showUpdateSpu(id) {
      this.isShowSpuForm = true; //显示spuForm修改界面
      this.$refs.spuForm.initLoadUpdateData(id);
    },
    showSkuAdd() {
      this.isShowSkuForm = true;
    },
    showAddSpu(){
      this.isShowSpuForm = true;
      //spu通知添加界面的数据显示
      this.$refs.spuForm.initLoadAddData()
    }
  },
  components: {
    SpuForm,
    SkuForm
  }
};
</script>
