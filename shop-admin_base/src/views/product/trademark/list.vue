<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="showAdd"
      style="margin-bottom:20px"
      >添加</el-button
    >
    <!-- 优化,添加圈圈 -->
    <el-table :data="trademarks" stripe border v-loading="loading">
      <el-table-column label="序号" type="index" width="80" align="center">
      </el-table-column>
      <!-- prop是读date所有属性的值 -->
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌图片">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width:100px;height:60px" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="{ row, $index }">
          <el-button type="warning" icon="el-icon-edit" size="mini"
           @click="showUpdate(row)" >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      style="text-align:center;margin-top:20px"
      :current-page="page"
      :page-sizes="[3, 6, 9, 12]"
      :page-size="limit"
      layout="prev, pager, next,jumper,->,sizes,total"
      :total="total"
      @current-change="getTrademarks"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 点击遮罩层,内部会自动执行$emit('update:visable',false) 表示自动关闭 -->
    <el-dialog :title="form.id?'更新':'添加'" :visible.sync="isShowDialog">
      <el-form :model="form" style="width:80%">
        <el-form-item label="品牌名称" :label-width="formLabelWidth">
          <el-input
            v-model="form.tmName"
            autocomplete="off"
            placeholder="请输入品牌名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" :label-width="formLabelWidth">
          <!-- 指定图片的借口地质 -->
          <!-- 指定上传图片的借口地质 ,组件内部发送上传文件的额ajax请求 -->
          <!-- 此时会发生跨域.使用代理服务器 -->
          <!-- 改 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
            :before-upload="beforeLogoUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <!-- 这部分界面没显示 -->
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { trademark } from "../../../api";
export default {
  name: "TrademarkList",
  data() {
    return {
      loading: false, //加载圈圈最初不显示
      trademarks: [], //当前页的列表数据
      total: 0,
      page: 1, //表示当前页码
      limit: 3, //限制每一页的数据是三条
      isShowDialog: false, //是否显示添加的dialog的额对话框
      form: {
        //表单中收集数据
        tmName: "",
        logoUrl: ""
      },
      formLabelWidth: "120px",
      imageUrl: ""
    };
  },
  mounted() {
    this.getTrademarks();
  },
  methods: {
    //上传图片成功
    handleLogoSuccess(res, file) {
      //图片地址数据
      const logoUrl  = res.data;
      //保存图片地址信息
      this.form.logoUrl = logoUrl;
    },
    beforeLogoUpload(file) {
      //使用数组的indexof方法,
      const isJPGOrPNG = ["image/jpg", "image/png"].indexOf(file.type) >= 0;
      const isLt500KB = file.size / 1024 < 500;

      if (!isJPGOrPNG) {
        this.$message.error("上传头像图片只能是JPG/PNG  格式!");
      }
      if (!isLt500KB) {
        this.$message.error("上传头像图片大小不能超过 500kb!");
      }
      return isJPGOrPNG && isLt500KB;
    },
    async getTrademarks(page = 1) {
      this.page = page;
      //获取数据之前显示loading
      this.loading = true;
      //发送ajax
      const result = await this.$API.trademark.getList(page, this.limit);
      //数据显示之后隐藏loading
      this.loading = false;
      //成功接收数据
      if (result.code === 200) {
        const { records, total } = result.data;
        this.trademarks = records;
        this.total = total;
      } else {
        this.$message.error("获取列表失败");
      }
      //失败提示
    },
    handleSizeChange(pageSize) {
      //更新limit数据
      this.limit = pageSize;
      //重新获取第一页的数据
      this.getTrademarks();
    },
    showAdd() {
      /* this.isShowDialog = true; */
      this.form = {
        tmName: "",
        logoUrl: ""
      };
      //显示dialog
      this.isShowDialog = true;
    },
    /* 添加或者修改品牌 ==>对应的是同一个界面*/
    async addOrUpdateTrademark() {
      const trademark = this.form; //将需要的数据取出来
      let result; //先声明,不然内部声明,外部不可用
      if (trademark.id) {
        //如果trademark中有id就发update请求,
        result = await this.$API.trademark.update(trademark);
      } else {
        result = await this.$API.trademark.add(trademark);
      }
      if (result.code === 200) {
        this.$message.success(`${trademark.id ? "更新" : "添加"}成功`);
        this.isShowDialog = false;
        this.getTrademarks(trademark.id ? this.page : 1); //如果是更新当前页显示,如果是添加是第一页显示
        //清楚输入数据
        this.form = {
          tmName: "",
          imageUrl: ""
        };
      } else {
        this.$message.error(`${trademark.id ? "更新" : "添加"}失败`);
      }
    },
    /* 显示修改界面 */
    showUpdate(trademark){
    this.form=trademark
    this.isShowDialog=true
    },
    /* 删除操作message-box */
    /* 点击事件那块可能有问题 */
    deleteTrademark(trademark) {
      this.$confirm(`此操作将永久删除${trademark.tmName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
          //发送删除品牌的请求
          //如果成功?
          const result = await this.$API.trademark.remove(trademark.id);
          if (result.code == 200) {
            this.$message.success("删除品牌成功");
            //重新获取分页列表显示(先获取第一页)
            /* this.getTrademarks(1); */

            const page = this.trademarks.length === 1 ? page - 1 : this.page; //如果当前页只剩一条数据,获取上页显示,使用计算属性
            this.getTrademarks(page);
          } else {
            this.$message.error("删除品牌失败");
          }

        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
