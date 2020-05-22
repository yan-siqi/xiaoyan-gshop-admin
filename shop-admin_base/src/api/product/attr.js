/* 平台属性 */
import request from "@/utils/request"
export default {
  //GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  getList(category1Id, category2Id, category3Id) {
    //根据三级分类获取属性列表
    return request(
      `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    );
  },
  remove(id) {
    //DELETE /admin/product/deleteAttr/{attrId}
    return request.delete(`/admin/product/deleteAttr/${id}`);
  },
  getValueList(attrId) {
    //GET /admin/product/getAttrValueList/{attrId}
    return request(`/admin/product/getAttrValueList/${attrId}`);
  },
  /* 保存属性 */
  addOrUpdate(attrInfo){
    //也包含两个属性添加或者是更新（传id）
    //POST /admin/product/saveAttrInfo
    return request.post('/admin/product/saveAttrInfo',attrInfo)
  }
};
