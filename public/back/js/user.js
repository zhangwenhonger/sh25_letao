
$(function() {
    var currentPage=1;
    var pageSize=5;
    var currentId;
    var isDelete;
//1.已进入页面发送ajax请求，获取用户列表数据，通过模板引擎渲染
    render();
    function render() {
        $.ajax({
            type: "get",
            url: "/user/queryUser",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (info) {
                console.log(info);
                var htmlStr = template("tpl", info);
                $('tbody').html(htmlStr);

                // 2.分页初始化
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    totalPages: Math.ceil(info.total / info.size),
                    currentPage: info.page,
                    onPageClicked:function(a,b,c,page){
                        console.log(page);
                        currentPage=page;
                        render();
                    }
                });
            }
        });
    }
//2.点击禁用启用按钮，显示模态框，通过事件委托绑定事件
    $('tbody').on("click",".btn",function(){
        $('#userModal').modal("show");

        //jquery提供了获取自定义属性的方法  获取当前id
        currentId=$(this).parent().data("id");
        // 如果是禁用按钮，说明需要将该用户设置成禁用状态，传0   判断给后台传0还是1
        isDelete=$(this).hasClass("btn-danger")?0:1;

    })
//3.点击确认按钮，发送ajax请求，修改对应用户状态
    $('#submitBtn').click(function(){
        $.ajax({
            type:"post",
            url:"/user/updateUser",
            data:{
                id:currentId,
                isDelete:isDelete
            },
            dataType:"json",
            success:function (info) {
                console.log(info);
                if(info.success){
                    //关闭模态框 重新渲染
                    $("userModal").modal("hide");
                    render();
                }

            }
        })
    })



})

