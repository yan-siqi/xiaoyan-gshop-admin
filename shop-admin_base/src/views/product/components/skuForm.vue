<template>
  <el-form label-width="120px">
    <el-form-item label="spu名称">
      <span>{{ spu.spuName }}</span>
    </el-form-item>
    <el-form-item label="sku 名称">
      <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格">
      <el-input type="number" placeholder="sku价格" v-model="skuInfo.price">
      </el-input>
    </el-form-item>
    <el-form-item label="重量(KG)">
      <el-input type="number" placeholder="sku重量" skuInfo.weight> </el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input
        type="textarea"
        placeholder="sku规格描述"
        rows="5"
        v-model="skuInfo.skuDesc"
      >
      </el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form inline label-width="80px">
        <el-form-item
          :label="attr.attrName"
          style="margin:5px"
          v-for="attr in attrList"
          :key="attr.id"
        >
          <el-select v-model="attr.attrId_valueId">
            <el-option
              :label="value.valueName"
              :value="attr.id + '_' + value.id"
              v-for="value in attr.attrValueList"
              :key="attr.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form inline label-width="80px">
        <el-form-item
          :label="attr.saleAttrName"
          style="margin:5px"
          v-for="attr in spuSaleAttrList"
          :key="attr.id"
        >
          <el-select v-model="attr.saleAttrValueId">
            <el-option
              :label="value.saleAttrValueName"
              :value="value.id"
              v-for="value in attr.spuSaleAttrValueList"
              :key="value.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table
        border
        :data="spuImageList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="图片">
          <template slot-scope="{ row }">
            <img :src="row.imgUrl" style="width:150px;height:150px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-tag type="success" v-if="row.isDefault === '1'">
              默认
            </el-tag>
            <el-button type="primary" v-else @click="setDefault(row)"
              >设为默认</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="back">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      skuInfo: {
        category3Id: "",
        spuId: "",
        tmId: "",
        //表单输入框数据
        skuName: "", //sku名称
        skuDesc: "", //sku描述
        price: "", //价格
        weight: "", //重量
        //点击按钮收集数据
        skuDefaultImg: "",
        //提前保存请求钱收集数据
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: []
      },
      spu: {}, //所属的spu对象
      attrList: [], //平台属性列表
      spuImageList: [], //spu图片列表
      spuSaleAttrList: [], //销售属性列表
      selectedImageList: [] //所有选中的属性列表
    };
  },
  methods: {
    //保存数据
    async save() {
      const { skuInfo, attrList, spuSaleAttrList, selectedImageList } = this;
      //整理数据
      //指定;skuAttrValueList
      skuInfo.skuAttrValueList = attrList.reduce((pre, attr) => {
        const attrId_valueId = attr.attrId_valueId;
        if (attrId_valueId) {
          //判断前提是有该属性,才需要添加
          const [attrId, valueId] = attrId_valueId.split("_");
          pre.push({
            attrId,
            valueId
          });
        }
        return pre;
      }, []);
      //指定:skuSaleAttrValueList
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((pre, attr) => {
        const saleAttrValueId = attr.saleAttrValueId;
        if (saleAttrValueId) {
          pre.push({
            saleAttrValueId
          });
        }
        return pre;
      }, []);
      //指定:skuImageList
      skuInfo.skuImageList = selectedImageList.map(item => ({
        imgName: item.imgName,
        imgUrl: item.imgUrl,
        spuImgId: item.id,
        isDefault: item.isDefault
      }));
      //发送添加skuInfo去请求
      const result = await this.$API.sku.addUpdate(skuInfo);
      if (result.code === 200) {
        this.$message.success("保存成功");
        //成功后数据重置
        this.resetData();
        //通知父组件保存成功
        this.$emit("saveSuccess");
      } else {
        this.$message.error("保存数据失败");
      }
    },
    //返回
    back() {
      //数据重置
      this.resetData();
      //通知父组件取消操作
      this.$emit("cancel");
    },
    //数据重置
    resetData() {
      (this.skuInfo = {
        category3Id: "",
        spuId: "",
        tmId: "",
        //表单输入框数据
        skuName: "", //sku名称
        skuDesc: "", //sku描述
        price: "", //价格
        weight: "", //重量
        //点击按钮收集数据
        skuDefaultImg: "",
        //提前保存请求钱收集数据
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: []
      }),
        (this.spu = {}), //所属的spu对象
        (this.attrList = []), //平台属性列表
        (this.spuImageList = []), //spu图片列表
        (this.spuSaleAttrList = []), //销售属性列表
        (this.selectedImageList = []); //所有选中的属性列表
    },
    //选中项发生改变的回调
    handleSelectionChange(selection) {
      this.selectedImageList = selection;
    },
    //将当前图片指定为默认图片
    setDefault(spuImage) {
      this.spuImageList.forEach(item => (item.isDefault = "0")); //将全局的都指定
      //将当前项变为默认值
      spuImage.isDefault = "1";
      //向sku默认保存url
      this.skuInfo.skuDefaultImg = spuImage.imgUrl;
    },
    //初始化添加数据
    initAddDdata(spu) {
      //保存spu
      this.spu = spu;
      //将相关数据保存到spu
      (this.skuInfo.category3Id = spu.category3Id),
        (this.skuInfo.spuId = spu.id),
        (this.skuInfo.tmId = spu.tmId);
    },
    //异步请求获取数据获取当前界面需要初始显示的数据
    async getSpuInitData() {
      //异步请求获取平台属性列表
      const { category1Id, category2Id, category3Id, id } = this.spu;
      const promise1 = this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      //异步请求获取图片列表
      const promise2 = this.$API.sku.getSpuImageList(id);
      //异步请求获取销售属性列表
      const promise3 = this.$API.sku.getSpuSaleAttrList(id);
      //利用promise.all()来得到3个promise成功的数据
      const results = await Promise.all([promise1, promise2, promise3]);
      this.attrList = results[0].data;
      const spuImageList = results[1].data;
      //给图片列表中的每个属性都添加一个isDefault属性 值0
      spuImageList.forEach(item => (item.isDefault = "0"));
      this.spuImageList = spuImageList;
      this.spuSaleAttrList = results[2].data;
    }
  }
};
</script>

<style lang="less" scoped></style>
