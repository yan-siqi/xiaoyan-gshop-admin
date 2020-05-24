<template>
  <div>
    <el-form label-width="100px" v-show="visible">
      <el-form-item label="SPU名称">
        <el-input
          type="text"
          placeholder="SPU名称"
          v-model="spuInfo.spuName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spuInfo.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in trademarkList"
            :key="tm.id"
          ></el-option>
          <!--  <el-option label="B" value="2"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <!-- 加v-model -->
        <el-input
          type="textarea"
          placeholder="SPU描述"
          rows="5"
          v-model="spuInfo.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          :file-list="spuImageList"
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          v-model="attrIdAttrName"
          :placeholder="
            unUsedSaleAttrList.length > 0
              ? `还有${unUsedSaleAttrList.length}个可选`
              : '没有啦'
          "
          value=""
        >
          <el-option
            :label="attr.name"
            :value="attr.id + ':' + attr.name"
            v-for="attr in unUsedSaleAttrList"
            :key="attr.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSpuSaleAttr"
          :disabled="!attrIdAttrName"
          >添加销售属性</el-button
        >
        <el-table
          :data="spuInfo.spuSaleAttrList"
          style="margin-top:20px"
          border
        >
          <el-table-column
            label="序号"
            type="index"
            width="90"
            align="center"
          ></el-table-column>
          <el-table-column label="属性名" prop="saleAttrName"></el-table-column>
          <el-table-column label="属性值名称列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                style="margin-right:5px"
                v-for="(value, index) in row.spuSaleAttrValueList"
                :key="value.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                <!-- 交互效果:@close="handleClose(tag)" -->
                {{ value.saleAttrValueName }}
              </el-tag>
              <!-- 给attr关联edit属性 row.saleAttrValueName 便于后来生成对象-->
              <el-input
                style="width:100"
                class="input-new-tag"
                v-if="row.edit"
                v-model="row.saleAttrValueName"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
                <!-- @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm" -->
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >+ 添加</el-button
              >
              <!--  @click="showInput" -->
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="address">
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
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean
  },
  name: "SpuForm",
  data() {
    return {
      spuId:'',
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
    /* 课下看视频 :10.12*/
    unUsedSaleAttrList() {
      /* 没完成 */
      /* 判断是还有几种可以选择 */
      return this.saleAttrList.filter(attr =>
        this.spuInfo.spuSaleAttrList.every(
          spuAttr => spuAttr.saleAttrName !== attr.name
        )
      );
    }
  },
  methods: {
    handleRemove(file, fileList) {
      //点击删除按钮的回调函数
      console.log(file, fileList);
      this.spuImageList = fileList; //将已经上传的图片保存下来
    },
    handlePictureCardPreview(file) {
      //点击显示大图的回调函数
      //file:是被删除的图片

      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {
      //文件上传成功的回调函数(响应体数据对象,新上传的图片对象,所有的对象数组)
      this.spuImageList = fileList // 将上传的图片保存下来;
    },
    handleInputConfirm(spuSaleAttr) {
      //确定添加一个新的SPU销售属性值对象:
      //取数据
      const { saleAttrValueName, baseSaleAttrId } = spuSaleAttr;
      //整理数据
      //1.属性值名称必须有输入
      if (!saleAttrValueName) {
        //如果没有属性值,说明当前是添加模式,而非编辑模式
        spuSaleAttr.edit = false;
        return;
      }
      //保证输入的属性值不会和原来的属性值重复'
      const isRepeat = spuSaleAttr.spuSaleAttrValueList.some(
        value => value.saleAttrValueName === saleAttrValueName
      );
      if (isRepeat) {
        //如果是重复
        this.$message.warning("你输入的属性值已经存在了");
        return;
      }
      // 向spuSaleAttr.spuSaleAttrValueList中添加一个新的SPU销售属性值对象
      spuSaleAttr.spuSaleAttrValueList.push({
        saleAttrValueName,
        baseSaleAttrId
      });
      //查看模式
      spuSaleAttr.edit = true;
      spuSaleAttr.saleAttrValueName = "";
    },
    async save() {
      //保存输入值
      //净输入的值取出来,并对数据进行整理
      const { spuInfo, spuImageList } = this;
      //处理图片属性,当前的imageList助属性值为空
      spuInfo.spuImageList = spuImageList.map(item => ({
        imgName: item.name,
        imgUrl: item.response ? item.response.data : item.url
      }));
      //处理销售列表属性
      //1.删除不必要的参数数据
      //2.过滤掉属性中没有一个属性值对象的属性
      spuInfo.spuSaleAttrList = spuInfo.spuSaleAttrList.filter(attr => {
        delete attr.edit;
        delete attr.saleAttrValueName;
        return attr.spuSaleAttrValueList.length > 0;
      });
      //发送保存spu详情信息的异步ajax请求
      const result = await this.$API.spu.addUpdate(spuInfo);
      if (result.code === 200) {
        this.$message.success("SPU数据保存陈功");
      } else {
        this.$message.error("抱歉SPU数据保存失败了");
      }
    },
    back() {
      //分发自定义事件,使当前dialog关闭
      this.$emit("update:visible", false); //分发自定义事件使当前dialog关闭
    },
    //在当前行显示输入框
    showInput(spuSaleAttr) {
      if (spuSaleAttr.hasOwnProperty("edit")) {
        spuSaleAttr.edit = true; //当前是编辑模式
      } else {
        this.$set(spuSaleAttr, "edit", true);
      }
      //让输入框自动获取焦点
      this.$nextTick(() => this.$refs.saveTagInput.focus()); //?
    },
    addSpuSaleAttr() {
      //添加新的销售属性对象
      //收集数据
      const[baseSaleAttrId,saleAttrName]=this.attrIdAttrName.split(':');
      //添加新的spu属性对象
      this.spuInfo.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList:[]
      })
      //删除收集属性 的id和name
      this.attrIdAttrName=''
    },
    //由父组件调用方法,根据id请求加载数据
    initLoadUpdateData(spuId) {
      this.spuId = spuId; //保存spuId
      //1根据SPu的id获取SPU的详情信息
      this.getSpuInfo();
      //2.根据spu的id获取spu的图片列表\
      this.getSpuImageList();
      //3.获取所有的品牌列表
      this.getTrademarkList();
      //4.获取所有的销售属性列表
      this.getSaleAttrList();
    },
    //由父组件调用方法,根据id请求加载数据
    initLoadAddData() {
      //3.获取所有的品牌列表
      this.getTrademarkList();
      //4.获取所有的销售属性列表
      this.getSaleAttrList();
    },
    async getSpuInfo() {
      const result = await this.$API.spu.get(this.spuId);
      this.spuInfo = result.data;
    },
    async getSpuImageList() {
      const result = await this.$API.sku.getSpuImageList(this.spuId);
      const spuImageList = result.data;
      //对数据进行整理,必须保证有name和url数据
      spuImageList.forEach(item => {
        item.name = item.imgName;
        item.url = item.imgUrl;
      });
      this.spuImageList = spuImageList; //保存图片列表
    },
    async getTrademarkList() {
      const result = await this.$API.trademark.getList();
      this.trademarkList = result.data;
    },
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleList();
      this.saleAttrList = result.data;
    }
  }
};
</script>

<style lang="less" scoped></style>
