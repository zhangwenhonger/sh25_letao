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
    //将隐藏域校验状态，设置成校验成功状态updateStatus(字段名，校验状态，校验规则)
    $('#form').data("bootstrapValidator").updateStatus("categoryId","VALID");
    });

//4.利用文件上传插件 初始化
    $('#fileupload').fileupload({
        dataType:"json",
        done:function(e,data){
           var imgUrl=data.result.picAddr;
            $('#imgBox img').attr("src",imgUrl);
            $('[name="brandLogo"]').val(imgUrl);
            $('#form').data("bootstrapValidator").updateStatus("brandLogo","VALID");
        }

    });
// 5.表单校验 input隐藏域校验类型 校验成功的状态
    $('#form').bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        excluded: [],
        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh',
        },
        //3. 指定校验字段
        fields:{
            categoryId: {
                validators:{
                    notEmpty:{
                        message:"请输入一级分类名称"
                    }
                }
            },
            brandName: {
                validators:{
                    notEmpty:{
                        message:"请输入二级分类名称"
                    }
                }
            },
            brandLogo: {
                validators:{
                    notEmpty:{
                        message:"请上传图片"
                    }
                }
            }

        }
    })

//     6.z注册表单校验成功事件，阻止默认行为，通过ajax请求获取数据重新渲染第一页
   $("#form").on("success.form.bv",function (e) {
        e.preventDefault();
        $.ajax({
            type:"post",
            url:"/category/addSecondCategory",
            data:$("#form").serialize(),
            dataType:"json",
            success:function(info){
                if(info.success){
                    $('#addModal').modal("hide");
                    currentPage=1;
                    render();
                    //重置
                    $('#form').data("bootstrapValidator").resetForm(true);
                    $('#dropdownText').text("请选择一级分类");
                    $('#imgBox img').attr("src","images/none.png");

                }
            }
        })



    })

})