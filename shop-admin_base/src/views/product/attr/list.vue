<template>
  <div>
    <el-card>
      <CategorySelector ref="cs" @categoryChange="handleCategoryChange" />
    </el-card>

    <el-card>
      <div v-show="isShowList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 20px"
          @click="showAdd"
          :disabled="!category3Id"
          >添加属性</el-button
        >

        <el-table border :data="attrs">
          <el-table-column
            label="序号"
            type="index"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="150"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                style="margin: 2px"
                type="info"
                v-for="value in row.attrValueList"
                :key="value.id"
                >{{ value.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <HintButton
                title="修改"
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showUpdate(row)"
              ></HintButton>
              <el-popconfirm
                :title="`确定删除属性${row.attrName}`"
                @onConfirm="deleteAttr(row.id)"
              >
                <HintButton
                  slot="reference"
                  title="删除"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="!isShowList">
        <el-form inline :model="attr">
          <el-form-item label="属性名">
            <el-input
              type="text"
              v-model="attr.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attr.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>
        <!--
            {
              "attrId": 0,
              "id": 0,
              "valueName": "string"
            }
           -->
        <el-table border style="margin: 20px 0" :data="attr.attrValueList">
          <el-table-column
            label="序号"
            type="index"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input
                :ref="$index"
                v-if="row.edit"
                v-model="row.valueName"
                size="mini"
                placeholder="请输入属性值名称"
                @blur="toShow(row)"
                @keyup.enter.native="toShow(row)"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: inline-block; width: 100%"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 从当前位置开始删除一个属性 -->
              <el-popconfirm
                :title="`确定删除属性'${row.valueName}'`"
                @onConfirm="attr.attrValueList.splice($index, 1)"
              >
                <HintButton
                  slot="reference"
                  title="删除"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="save"
          :disabled="!attr.attrName || attr.attrValueList.length === 0"
          >保存</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "AttrList",
  data() {
    return {
      category1Id: "", //一级分类id
      category2Id: "", //二级分类id
      category3Id: "",
      attrs: [], //所有属性列表
      isShowList: true,
      attr: {
        //是要添加的平台属性对象
        //包括
        attrName: "",
        attrValueList: [],
        categoryId: "",
        categoryLevel: 3 //三级分类id
      }
    };
  },
  watch: {
    isShowList(value) {
      this.$refs.cs.disabled = !value;
    }
  },
  mounted() {
  /*   this.category1Id = 2;
    this.category2Id = 13;
    this.category3Id = 61;
    this.getAttrs(); */
  },
  methods: {
    handleCategoryChange({ categoryId, level }) {
      console.log("handleCategoryChange", categoryId, level);
      if (level === 1) {
        this.category1Id = categoryId;
        //如果当前显示的是一级分类id
        //重置二级三级分类id,以及数组的数据
        this.category2Id = "";
        this.category3Id = "";
        this.attrs = [];
      } else if (level === 2) {
        this.category2Id = categoryId; //将二级分类id就重置三级分类列表
        this.category3Id = "";
        this.attrs = [];
      } else {
        this.category3Id = categoryId; //三级分类确定
        this.getAttrs(); //异步请求获取属性列表显示
      }
    },
    async getAttrs() {
      //异步请求获取列表显示
      const { category1Id, category2Id, category3Id } = this; //对象的解构赋值,获取数据
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      this.attrs = result.data;
    },
    addAttrValue() {
      //添加属性值
      console.log(this.attr.attrValueList);
      this.attr.attrValueList.push({
        attrId: this.attr.id, //修改有值,添加没值
        valueName: "",
        edit: true //添加的新属性的值都是能自己编辑的
      });
      //让最后一个属性值得input自动获取焦点,新添加的属性值是没有id的,注意是界面更新之后显示
      this.$nextTick(() => {
        this.$refs[this.attr.attrValueList.length - 1].focus();
        console.log(this.$refs[this.attr.attrValueList.length - 1]);
      });
    },

    showAdd() {
      //在点击添加的时候一定确保是当前没有数据的界面
      (this.attr = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3
      }),
        (this.isShowList = false);
    },
    showUpdate(attr) {
      // this.attr={...attr};//保存要修改的属性对象//浅拷贝
      this.attr = cloneDeep(attr);
      this.isShowList = false; //显示更新的界面
    },
    toShow(value) {
      if (value.valueName) {
        const isRepeat = this.attr.attrValueList.some((item, index) => {
          if (item !== value) {
            return item.valueName === value.valueName;
          }
        });
        if (!isRepeat) {
          //如果不重复
          value.edit = false;
        } else {
          value.valueName = ""; //输入的无效,清除输入
          this.$message.wanrning("抱歉--您输入的名称已经存在");
        }
      }
    },
    toEdit(value, index) {
      if (value.hasOwnProperty("edit")) {
        //如果有编辑属性,指定属性值对象为true
        value.edit = true; //但是界面还没更新
      } else {
        //如果没有必须指定一个$set(),来添加新属性
        this.$set(value, "edit", true);
      }
      //找到当前行的input对象
      //必须是界面更新之后显示
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
     async deleteAttr(id) {
      //删除指定属性
      const result =await this.$API.attr.remove(id);
      console.log(result);

      if (result.code === 200) {
        this.$message.success(`删除属性成功`);
        //重新获取商品列表

        this.getAttrs();
      } else {
        this.$message.error(`删除属性失败`);
      }
    },
    async save() {
      //保存数据
      //准备参数数据,
      const attr = this.attr;
      //在提交请求之前对提交的数据做限制
      attr.attrValueList = attr.attrValueList.filter(value => {
        //请求保存的值是空，需要将数据过滤掉
        // return value.valueName!='';//只留下属性名不为空的值
        if (value.valueName !== "") {
          delete value.edit;
          return true;
        }
      });
      if (attr.attrValueList.length === 0) {
        this.$message.warning("至少指定一个属性值名称");
        return;
      }
      //提交添加/更新的需求
      const result = await this.$API.attr.addOrUpdate(attr);
      //如果保存成功
      if (result.code === 200) {
        this.$message.success("保存属性成功");
        //变为属性列表显示
        this.isShowList = true;
        this.getAttrs(); //重新获取列表显示
      } else {
        //如果保存失败
        this.$message.error("保存属性失败");
      }
    }
  }
};
</script>

<style scoped>
.edit-input {
  padding-right: 60px;
}
.save-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
