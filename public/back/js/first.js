$(function(){

    var currentPage=1;
    var pageSize=5;
    render();
// 1.已进入页面发送ajax请求 模板引擎渲染 分页插件 分页点击事件
    function render(){
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType:"json",
            success:function(info){
                console.log(info);
                var htmlStr=template("tpl",info);
                $('tbody').html(htmlStr);
                //分页
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
//2.点击添加分类，出现模态框
    $('.addBtn').click(function(){
        $('#addModal').modal("show");
    });
//3.使用表单校验插件进行表单校验
    $('#form').bootstrapValidator({
        feedbackIcons:{
            valid:'glyphicon glyphicon-ok',
            invalid:'glyphicon glyphicon-remove',
            validating:'glyphicon glyphicon-refresh',
        },
        fields:{
            categoryName:{
                validators:{
                    notEmpty:{
                        message:"一级分类不能为空"
                    }
                }
            }
        }
    });

// 4.注册表单校验成功事件，阻止浏览器默认行为 发送ajax
    $('#form').on("success.form.bv",function(e){
        e.preventDefault();
        $.ajax({
            type:"post",
            url:"/category/addTopCategory",
            data:$('#form').serialize(),
            dataType: "json",
            success:function(info){
                console.log(info);
                if(info.success){
                    //关闭模态框
                    $("#addModal").modal("hide");
                    //重新渲染第一页
                    currentPage=1;
                    render();
                //    重置模态框
                    $('#form').data("bootstrapValidator").resetForm(true);
                }
            }
        })
    })



})