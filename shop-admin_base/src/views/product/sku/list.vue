<template>
  <el-card class="sku-list">
    <el-table border stripe :data="skuList" v-loading="loading">
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
        row-key="id"
      >
      </el-table-column>
      <el-table-column prop="skuName" label="名称"> </el-table-column>
      <el-table-column prop="skuDesc" label="描述"> </el-table-column>
      <el-table-column label="默认图片" width="150" aligin="cemnter">
        <template slot-scope="{ row }">
          <div class="info">
            <div class="pic">
              <img :src="row.skuDefaultImg" alt="商品图片" style="width:80px" />
            </div>
          </div>
        </template>
      </el-table-column>
       <el-table-column prop="weight" label="重量(KG)"/>
      <el-table-column prop="price" label="价格(元)" width="80">
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="{ row }">
          <hintButton
            v-if="row.isSale == 0"
            title="上架"
            type="success"
            size="mini"
            icon="el-icon-top"
            @click="onSale(row.id)"
          >
          </hintButton>
          <hintButton
            v-if="row.isSale == 1"
            title="下架"
            type="waining"
            size="mini"
            icon="el-icon-top"
            @click="cancelSale(row.id)"
          >
          </hintButton>
          <hintButton
            title="修改"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="toUpdateSku(row.id)"
          >
          </hintButton>
          <hintButton
            title="查看详情"
            type="primary"
            size="mini"
            icon="el-icon-info"
            @click="showSkuInfo(row.id)"
          >
          </hintButton>
           <el-popconfirm :title="`确定删除 ${row.skuName} 吗`" @onConfirm="deleteSku(row.id)">
            <hint-button slot="reference" type="danger" size="mini" icon="el-icon-delete" title="删除"></hint-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50]"
      style="padding: 20px 0; text-align: center;"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getSkuList"
      @size-change="changeSize"
    />
        <el-drawer
      :visible.sync="isShowSkuInfo"
      direction="rtl"
      :withHeader="false"
      size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="18">
          <el-tag type="success" style="margin-right: 5px" v-for="value in skuInfo.skuAttrValueList" :key="value.id">
              {{value.attrId + '-' + value.valueId}}
          </el-tag>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">销售属性</el-col>
        <el-col :span="18">
          <el-tag type="success" style="margin-right: 5px" v-for="value in skuInfo.skuSaleAttrValueList" :key="value.id">
              {{value.id + '-' + value.saleAttrValueId}}
          </el-tag>
        </el-col>
      </el-row>

      <el-row >
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
           <el-carousel class="img-carousel" trigger="click" height="400px" :autoplay="false" arrow="always">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </el-card>
</template>

<script>
export default {
  name: "SkuList",
  data () {
    return {
      skuList:[],//sku列表
      loading:false,//是否是正在加载中
      total:0,//数据的总记录数量
      page:1,//默认显示第一页
      limit:10,//每页10条记录数据
      skuInfo:{},
      isShowSkuInfo:false
    }
  },
  mounted () {
    this.getSkuList()
  },
  methods: {
    handleClose(close){
    this.skuInfo={},
    this.isShowSkuInfo=false
    },

    //显示详情页信息
     async showSkuInfo(id){
      this.isShowSkuInfo=true
      const result =await this.$API.sku.get(id)
      this.skuInfo=result.data
    },
    //当页码发生变化,自动调用
    changeSize(zize){
      this.limit=size
      this.getList(1)//改变完之后显示第一页数据
    },
    //异步获取指定页的sku列表
    async getSkuList(page=1){
    this.page=page;
    this.loading=true
    const result=await this.$API.sku.getList(this.page,this.limit)
    this.skuList=result.data.records
    this.total=result.data.total
    this.loading=false
    },
    //对指定的sku实行上架请求
    onSale(skuId){
      this.$API.sku.onSale(skuId).then(result=>{
        this.$message({
          type:'success',
          message:'成功上架'
        })
        this.getSkuList(this.page)
      })
    },
    //对指定的sku实行下架请求
    cancelSale(skuId){
      this.$API.sku.cancelSale(skuId).then(result=>{
        this.$message({
          type:'success',
          message:'下架陈功'
        })
        this.getSkuList(this.page)
      })
    },
    //到sku更新的界面
    toUpdateSku(skuId){
      this.$message.warning('接口不支持,还没开发')
    },
    //删除sku
    async deleteSku(skuId){
      const result=await this.$API.sku.remove(skuId)
      if(result.code===200){
        this.$message({
          type:'success',
          message:'删除sku成功'
        })
        this.getSkuList(1)
      }else{
        this.$message({
          type:'error',
          message:'result.data|| result.message||删除sku失败'
        })
      }
    }
  }
};
</script>
<style lang="scss" scoped>
  .sku-list {
    .el-row {
      height: 40px;
      margin-left: 10px;
      .el-col {
        line-height: 40px;
        &.el-col-5 {
          text-align: right;
          font-weight: bold;
          font-size: 18px;
          margin-right: 15px;
        }
      }
    }
    .img-carousel {
      width: 400px;
      border: 1px solid #ccc;
      img {
        width: 100%;
        height: 100%;
      }

      /deep/ .el-carousel__indicator {
        button {
          background-color: hotpink;
        }

        &.is-active {
          button {
            background-color: green;
          }
        }
      }
    }
  }
</style>
