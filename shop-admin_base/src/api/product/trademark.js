/* 商品管理的品牌管理的接口请求函数的模块 */

import request from "@/utils/request"; //ajax

const api_name = "/admin/product/baseTrademark/";

export default {

 //根据id获取对应的品牌
  getById(id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: "GET"
    });
  },
  //GET /admin/product/baseTrademark/getTrademarkList//获取品牌属性所有列表
  getList(page,limit) {
    if (page && limit) {//如果参数传了page和limit就返回分页列表
      return request(`/admin/product/baseTrademark/${page}/${limit}`); //GET /admin/product/baseTrademark/{page}/{limit}  分页列表
    } else {//如果没有传参数,就是获取所有的列表
      return request.get("/admin/product/baseTrademark/getTrademarkList");
    }
  },
  //DELETE /admin/product/baseTrademark/remove/{id}
  remove(id) {
    return request.delete(`/admin/product/baseTrademark/remove/${id}`);
  },
  //POST /admin/product/baseTrademark/save
  add(trademark) {
    return request.post(`${api_name}/save`, trademark); //不需要传id
  },
  //PUT /admin/product/baseTrademark/update
  update(trademark) {
    return request.put(`${api_name}/update`, trademark); //注意需要id
  }
};
