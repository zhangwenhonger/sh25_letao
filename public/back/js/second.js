$(function(){
    var currentPage=1;
    var pageSize=5;
    render();
//1.一进入页面发送ajax请求，模板引擎，分页插件
    function render(){
      $.ajax({
          type:"get",
          url:"/category/querySecondCategoryPaging",
          data:{
              page:currentPage,
              pageSize:pageSize
          },
          dataType:"json",
          success:function(info){
              console.log(info);
              var htmlStr=template("secondTpl",info);
              $('tbody').html(htmlStr);
          //分页插件
              $('#paginator').bootstrapPaginator({
                  bootstrapMajorVersion:3,
                  totalPages:Math.ceil(info.total/info.size),
                  currentPage:info.page,
                  onPageClicked:function(a,b,c,page){
                      currentPage=page;
                      render();
                  }

              })
          }
      })
    };

//2.点击添加分类按钮，弹出模态框 发送ajax请求获取一级分类全部数据
//     通过page=1,pageSize=100模拟获取全部分类数据的接口
    $('.addBtn').click(function(){
        $('#addModal').modal("show");
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:1,
                pageSize:100
            },
            dataType:"json",
            success:function(info){
                console.log(info)
                var htmlStr=template("dropdownTpl",info);
                $('.dropdown-menu').html(htmlStr);


            }
        })
    });
//3.通过事件委托，给dropdownMenu下的a标签绑定点击事件
    $('.dropdown-menu').on('click',"a",function(){
        var txt=$(this).text();
        $('#dropdownText').text(txt);
        var id=$(this).data("id");
        $('[name="categoryId"]').val(id);
    });

//4.利用文件上传插件 初始化
    $('#fileupload').fileupload({
        dataType:"json",
        done:function(e,data){
           var imgUrl=data.result.picAddr;
            $('#imgBox img').attr("src",imgUrl);
            $('[name="brandLogo"]').val(imgUrl);
        }

    });
//    5.表单校验
//     6.添加按钮，阻止默认行为，通过ajax请求获取数据

})