<template>
  <el-form label-width="100px" v-show="visable">
    <el-form-item labele="spu名称">
      <el-input
        type="text"
        placeholder="请输入spu名称"
        v-show="spuInfo.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item labele="品牌">
      <el-input type="text" placeholder="请选择品牌名称" v-model="spuInfo.tmId">
        <el-option
          :label="tm.tmName"
          :value="tm.id"
          v-for="tm in trademarkList"
          :key="tm.id"
        ></el-option>
      </el-input>
    </el-form-item>
    <el-form-item labele="spu描述">
      <el-input
        type="textarea"
        placeholder="请输入spu描述"
        rows="5"
        v-model="spuInfo.description"
      >
      </el-input>
    </el-form-item>
    <el-form-item labele="spu图片">
      <!--是一个upload -->
      <el-upload
        multiple
        :file-list="spuImageList"
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <!-- .sync控制大图显示 -->
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select
        v-model="attrIdAttrName"
        :placeholder="
          unUsedSaleAttrList.length > 0
            ? `还有${unUsedSaleAttrList.length}个可以选`
            : 都被选完了
        "
        value=""
      >
        <el-option
          :label="attr.name"
          value="attr.id + ':'+attr.name"
          v-for="attr in unUsedSaleAttrList"
          :key="attr.id"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addSpuSaleAttr"
        :disabled="!attrIdName"
      >
        添加销售属性
      </el-button>
      <el-table border :data="spuInfo.spuSaleAttrList">
        <el-table-column
          label="序号"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column
          label="属性名"
          prop="saleAttrName"
          width="100"
        ></el-table-column>
        <el-table-column label="属性值名称列表">
          <template slot-scope="{ row, $index }">
            <el-tag
              v-for="(value, index) in row.spuSaleAttrValueList"
              :key="value.id"
              closable
              :disable-transitions="false"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ value.saleAttrValueName }}
            </el-tag>
            <el-input
              v-if="row.edit"
              placeholder="请输入属性值名称"
              v-model="row.saleAttrVAlieName"
              size="small"
              ref="saveTagInput"
              @keyup="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
            ></el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(row)"
              >+添加</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="150px">
          <template slot-scope="{ row, $index }">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="spuInfo.spuSaleAttrList.splice($index, 1)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="back">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      category3Id: 61,
      spuId: "",
      dialogImageUrl: "", //要显示大图的url
      dialogVisible: false, //是否显示大图的dialog
      spuInfo: {
        spuName: "",
        description: "",
        tmId: "",
        spuSaleAttrList: [],
        spuImageList: [] //spu销售属性的数组
      },
      spuImageList: [], //spu图片列表
      trademarkList: [], //品牌列表
      saleAttrList: [], //销售属性列表
      attrIdAttrName: "" //用来收集销售属性的id和name
    };
  },
  computed: {
    //判断还有几个可以选择
    unUsedSaleAttrList() {
      return this.saleAttrList.filter(attr =>
        this.spuInfo.spuSaleAttrList.every(
          spuAttr => spuAttr.saleAttrName !== attr.name
        )
      );
    }
  },
  methods: {
    //显示大图的的回调函数
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.Url; //保存大图
      this.dialogVisible = true; //大图显示
    },
    //点击删除的回调
    handleRemove(file, fileList) {
      this.spuImageList = fileList; //将上传的图片列表保存起来
    },
    //添加图片成功的回调函数
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList; //将上传的图片列表保存起来
    },
    //控制输入的数据
    handleInputConfirm(spuSaleAttr) {
      //取出数据
      const { spuSaleAttrValueName, baseSaleAttrId } = spuSaleAttr;
      //数据要求1:必须有属性值
      if (!spuSaleAttrValueName) {
        //没属性值,就不是编辑模式
        spuSaleAttr.edit = false;
        return;
      }
      //要求2:不能跟已经存在的数据重复
      const isReapet = spuSaleAttr.spuSaleAttrValueList.some(
        value => value.spuSaleAttrValueName === saleAttrValueName
      );
      if (isReapet) {
        // 提示信息
        this.$message("您输入的值已经存在了");
        return;
      }
      //在销售属性列表中添加销售属性值对象
      spuSaleAttr.spuSaleAttrValueList.push({
        saleAttrValueName,
        baseSaleAttrId
      });
      //显示查看模式
      spuSaleAttr.edit = true;
      spuSaleAttr.saleAttrValueName = "";
    },
    //添加销售属性列表
    addSpuSaleAttr() {
      const [baseSaleAttrId, saleAttrNAme] = this.attrIdAttrName.split(":");
      this.spuInfo.spuSaleAttrList.push({
        //添加新的spu
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      });
      //添加完成后清除数据
      this.attrIdAttrName = "";
    },
    //显示输入框
    showInput(spuSaleAttr) {
      //判断该属性自身是否有edit属性
      //有直接置为true
      if (spuSaleAttr.hasOwnProperty("edit")) {
        spuSaleAttr.edit = true;
      } else {
        //没有添加一个edit属性并且置为true-->此时使用set方法添加
        this.$set(spuSaleAttr, "edit", true);
      }
      //当前为编辑模式自动获取焦点
      this.$nextTick(() => this.$refs.saveTagInput.focus);
    },
    //由父组件调用方法加载数据
    initLoadAddData(category3Id) {
      this.spuInfo.category3Id = category3Id; //将数据保存的spuInfo中
      this.getTrademarkList(); //获取所有品牌列表
      this.getSaleAttrList(); //获取所有属性的销售属性列表
    },
    initLoadUpdateData() {
      this.spuId = spuId;
      this.getSpuInfo();
      this.getSpuImageList();
      this.getTrademarkList();
      this.getSaleAttrlist();
    },
    //获取spu的详细信息
    async getSpuInfo() {
      const result = await this.$API.spu.get(this.spuId); //根据id获取详细信息
      this.spuInfo = result.data;
    },
    //获取spu图片列表
    async getSpuImageList() {
      const result = await this.$API.sku.getSpuImageList(this.spuId);
      const spuImageList = result.data;
      //整理数据
      spuImageList.forEach(item => {
        item.name = item.imgName;
        item.url = item.imgUrl;
      });
      this.spuImageList = spuImageList; //将图片列表保存
    },
    //获取品牌数据
    async getTrademarkList() {
      const result = await this.$API.trademark.gtList();
      this.trademarkList = re;
    },
    //获取所有销售属性(id/name)列表
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleList();
      this.saleAttrList = result.data;
    },
    async save(){
      const{spuInfo,spuImageList}=this
      spuInfo.spuImageList=spuImageList.map(item=>({
        imgName:item.name,
        imgUrl:item.response?item.response.data:item.url}))
        spuInfo.spuSaleAttrList=spuInfo.spuSaleAttrList.filter((attr)=>{
          delete attr.edit
          delete attr.saleAttrValueName
          return attr.spuSaleAttrValueList.length>0
        })
        const result=await this.$API.spu.addUpdate(spuInfo)
        if(result.code===200){
          this.$message.success('保存数据成功')
          this.resetData()
          this.$emit('update:visible',false)
          this.$emit('saveSuccess')
        }else{
          this.$message.error('保存失败')
        }
      },

      //重置当前数据
        resetData () {
      this.dialogImageUrl = ''
      this.dialogVisible = false

      this.spuId = null
      this.spuInfo = {
        category3Id: '',
        spuName: '',
        description: '',
        tmId: '',
        spuImageList: [],
        spuSaleAttrList: []
      }
      this.spuImageList = []
      this.trademarkList = []
      this.saleAttrList = []
      this.attrIdAttrName = ''
    },
    //back
    back(){
      this.resetData()
      this.$emit('update:visible',false)
      this.$emit('cancel')
    }
    }

  }
</script>

<style lang="less" scoped></style>
