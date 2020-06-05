$(function(){

    var currentPage=1;
    var pageSize=5;
//定义用来存储已上传图片的数组
    var picArr=[];
//1.一进入页面ajax请求数据 渲染页面 分页
    render();
    function render(){
        $.ajax({
            type:"get",
            url:"/product/queryProductDetailList",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType:"json",
            success:function(info) {
                console.log(info);
                var htmlStr = template("productTpl", info);
                $('tbody').html(htmlStr);
                //分页初始化
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    totalPages:Math.ceil(info.total/info.size),
                    currentPage:info.page,
                    //分页图标尺寸
                    size:"small",
                    //分页图标文字
                        //type:page first last prev next
                        //page:当前按钮所指页码
                        //current:当前页
                    itemTexts:function(type,page,current){
                        switch(type){
                            case "page":
                                return page;
                            case "first":
                                return "首页";
                            case "last":
                                return "尾页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            }
                     },
                     //分页图标文字配置 title提示信息
                    tooltipTitles:function(type,page,current){
                            switch(type){
                                case "page":
                                    return "前往第"+page+"页";
                                case "first":
                                    return "前往首页";
                                case "last":
                                    return "前往尾页";
                                case "prev":
                                    return "前往上一页";
                                case "next":
                                    return "前往下一页";
                            }
                     },
                    //使用bootstrap的提示框组件
                    useBootstrapTooltip:true,
                    //给分页添加点击事件
                    onPageClicked:function(a,b,c,page){
                        currentPage=page;
                        render();
                    }

                })
            }
        })
    };
// 2.点击添加商品按钮，添加模态框 发送ajax 请求二级分类数据 下拉框渲染
$('.addBtn').click(function(){
    $("#addModal").modal("show");
    $.ajax({
        type: "get",
        url:"/category/querySecondCategoryPaging",
        data:{
            page:1,
            pageSize:100
        },
        dataType: "json",
        success:function(info){
            var htmlStr=template("dropdownTpl",info);
            $(".dropdown .dropdown-menu").html(htmlStr);

        }

    })
});
//3.下拉框下面ul点击a时，事件委托
// 3.1把点击的a的内容赋值给下拉框
    $(".dropdown-menu").on("click","a",function () {
        var txt=$(this).text();
        $("#dropdownText").text(txt);
        // 3.2把ID设置给隐藏域
        var id=$(this).data("id");
        $('[name="brandId"]').val(id);
        // 3.3下拉框手动重置校验状态
        $('#form').data("bootstrapValidator").updateStatus("brandId","VALID");
    });
//*4.文件（图片）上传初始化 多文件上传，插件会遍历选中的图片，发送多次请求到服务器，将来响应多次，每次相应都会调用一次done
    $('#fileupload').fileupload({
        //返回的数据格式
        dataType:"json",
        //文件上传完成时调用的回调函数
        done:function(e,data){
            console.log(data.result);
            //4.2 往数组的最前面追加图片信息 // 往imgBox最前面追加img元素
            picArr.unshift(data.result);
            $('#imgBox').prepend('<img src="'+data.result.picAddr+'" width="100" alt="">');
            //4.3通过判断数组长度，如果大于3，将数组最后一项移除 将图片结构最后一项移除 :last-of-type .eq(-1)
            if(picArr.length>3){
                picArr.pop();
                $('#imgBox img').eq(-1).remove();

            };

            //4.4如果处理后，图片数组的长度为3，那么就通过校验，将图片上传手动重置校验状态
            if(picArr.length===3){
                $('#form').data("bootstrapValidator").updateStatus("picStatus","VALID");
            }


        }
    });
//5.表单校验初始化
    $('#form').bootstrapValidator({
        excluded:[],
        feedbackIcons:{
            valid:"glyphicon glyphicon-ok",
            invalid:"glyphicon glyphicon-remove",
            validating:"glyphicon glyphicon-refresh"
        },

        fields:{
            brandId:{
                validators:{
                    notEmpty:{
                        message:"请选择二级分类"
                    }
                }
            },
            proName:{
                validators:{
                    notEmpty:{
                        message:"请选择商品名称"
                    }
                }
            },
            proDesc:{
                validators:{
                    notEmpty:{
                        message:"请输入商品描述"
                    }
                }
            },
            num:{
                validators:{
                    notEmpty:{
                        message:"请输入商品库存"
                    },
                    //正则校验
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存必须是非零开头的数字组成'
                    }
                }
            },
            size:{
                validators:{
                    notEmpty:{
                        message:"请输入商品尺码"
                    },
                    //正则校验
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '商品尺码必须是xx-xx的格式'
                    }
                }
            },
            oldPrice:{
                validators:{
                    notEmpty:{
                        message:"请输入商品原价"
                    }
                }
            },
            price:{
                validators:{
                    notEmpty:{
                        message:"请输入商品正价"
                    }
                }
            },
            picStatus:{
                validators:{
                    notEmpty:{
                        message:"请上传三张图片"
                    }
                }
            }

        }
    });
// *5.2下拉框手动重置校验状态 放在3.3
//     $('#form').data("bootstrapValidator").updateStatus("字段名称","校验状态","校验规则");
// *5.3图片上传手动重置校验状态 放在4.4
//     $('#form').data("bootstrapValidator").updateStatus("picStatus","校验状态","校验规则");

//6.注册表单校验成功事件  阻止默认行为 发送ajax
    $('#form').on("success.form.bv",function(e){
        e.preventDefault();
//***获取表单元素的数据
        var paramsStr=$("#form").serialize();
//*拼接上图片的数据
        paramsStr += "&picAddr1="+picArr[0]+"&picName1="+ picArr[0].picAddr;
        paramsStr += "&picAddr2="+picArr[1]+"&picName1="+ picArr[1].picAddr;
        paramsStr += "&picAddr3="+picArr[2]+"&picName1="+ picArr[2].picAddr;

        $.ajax({
            type:"post",
            url:"/product/addProduct",
            data:paramsStr,
            dataType:"json",
            success:function(info){
// 6.2如果成功 关闭模态框 获取数据重新渲染第一页
                if(info.success){
                    $('#addModal').modal("hide");
                    currentPage=1;
                    render();
// 6.3重置
//*6.3.1重置*表单*内容及校验状态 $('#form').data("boorstrapValidator").resetForm();
                    $('#form').data("bootstrapValidator").resetForm(true);
//*6.3.2重置下拉列表和图片信息，因为这俩不是表单元素
                    $('#dropdownText').text("请选择二级分类");
                    //让所有图片自杀
                    $('#imgBox img').remove();

                }


            }

        })
    })





})