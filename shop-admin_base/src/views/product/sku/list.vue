<template>
  <el-card>
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
            icon="el-icon-info"
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
          <el-popconfirm
            :title="`确定删除${row.skuName}吗`"
            @onConfirm="delete row.id"
          >
            <hintButton
              solt="reference"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              title="删除"
            >
            </hintButton>
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
      skuInfo:{}
    }
  },
  mounted () {
    this.getSkuList()
  },
  methods: {
    //显示详情页信息
    showSkuInfo(skuId){
      this.$message.info('vvvv')
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
    this.loading=false
    this.skuList=result.data.records
    this.total=result.data.total
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
        this.getSkuList(this.el-progress-bar__inner)
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
        this.getSkuList(this.page)
      }else{
        this.$message({
          type:'error',
          message:'删除sku失败'
        })
      }
    }
  }
};
</script>
