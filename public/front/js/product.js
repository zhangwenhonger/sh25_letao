$(function(){
//    1.获取地址栏参数发送ajax请求，进行商品渲染
    var productId=getSearch("productId");
    $.ajax({
        type:"get",
        url:"/product/queryProductDetail",
        data:{
            id:productId
        },
        dataType:"json",
        success:function(info){
            console.log(info);
            var htmlStr=template("productTpl",info);
            $('.lt_main .mui-scroll').html(htmlStr);

            //1.2手动进行轮播初始化
            //获得slider插件对象
            var gallery = mui('.mui-slider');
            gallery.slider({
                interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
            });

             //1.3手动初始化数字框
            mui('.lt_num .mui-numbox').numbox();
        }

    });

//    2.让尺码选中
    $('.lt_main').on("click",".lt_size span",function() {
        $(this).addClass("current").siblings().removeClass("current");
    })
//    3.加入购物车功能 点击 获取参数 productId num size,发送ajax
    $('#addCart').click(function(){
          var size=$('.lt_size span.current').text();
          var num=$('.mui-numbox-input').val();
          if(!size){
              mui.toast("请选择尺码");
              return;
          }
          $.ajax({
              type:"get",
              url:"",
              data:{
                  productId:productId,
                  num:num,
                  size:size
              },
              dataType: "json",
              success:function (info) {
              //加入购物车需要登录
              // (1)未登录
                  if(info.error===400){
                      //将来登录完后才能还要跳回来，可以将当前页的地址传过去即可
                      location.href="login.html?retUrl="+location.href;
                  }
              // (2)已登录,提示加入成功
                  if(info.success){
                    mui.confirm("添加成功","温馨提示",["去购物车","继续浏览"],function (e) {
                        if(e.index===0){
                            location.href="cart.html";
}
                    })
                  }


              }
          })
    })

})