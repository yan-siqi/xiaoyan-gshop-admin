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
                @click="showSkuAdd(row)"
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
                @click="showSkuList(row)"
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
      <SpuForm
        ref="spuForm"
        :visible.sync="isShowSpuForm"
        @saveSuccess="handleSaveSuccess"
        @cancel="handleCancel"
      ></SpuForm>
      <SkuForm ref="skuForm" v-show="isShowSkuForm" @cancel="isShowSkuForm=false"></SkuForm>
      <!-- 取消的回调函数 -->
    </el-card>
        <el-dialog title="收货地址" :visible.sync="isShowSkuList">
      <el-table :data="skuList" border>
        <el-table-column property="skuName" label="名称"></el-table-column>
        <el-table-column property="price" label="价格(元)"></el-table-column>
        <el-table-column property="weight" label="重量(KG)"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" alt="" style="width: 100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "../components/SpuForm";
import SkuForm from "../components/SkuForm";
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
      isShowSkuForm: false,
      isShowSkuList: false,
      spu: {},
      skuList: []
    };
  },
  mounted() {
  /*  this.category1Id = 2
    this.category2Id = 13
    this.category3Id = 61
    this.getSpuList(); */
  },
  methods: {
    //异步显示spu下的所有sku列表
    async showSkuList(spu) {
      this.isShowSkuList = true;
      this.spu = spu;
      const result = await this.$API.sku.getListBySpuId(spu.id);
      this.skuList = result.data;
    },
    handleSaveSuccess() {
      //添加显示第一页
      //更新显示当前页
      //重新获取分页列表
      this.getSpuList(this.spuId ? this.page : 1);
      //跟新标致重置'
      this.spuId = null;
    },
    handleCancel() {
      //跟新标致重置'
      this.spuId = null;
    },
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
      this.spuId = id;
      this.isShowSpuForm = true; //显示spuForm修改界面
      this.$refs.spuForm.initLoadUpdateData(id);
    },
    showSkuAdd(spu) {
      this.isShowSkuForm = true;
      //对spu进行浅拷贝
      spu = { ...spu };
      spu.category1Id = this.category1Id;
      spu.category2Id = this.category2Id;
      //让skuForm去请求加载初始显示的数据
      console.log(this.$refs.skuForm);

      this.$refs.skuForm.initLoadAddData(spu);
    },
    showAddSpu() {
      this.isShowSpuForm = true;
      //spu通知添加界面的数据显示
      this.$refs.spuForm.initLoadAddData(this.category3Id);
    }
  },
  components: {
    SpuForm,
    SkuForm
  }
};
</script>
