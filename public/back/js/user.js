
$(function() {
    var currentPage=1;
    var pageSize=5;
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
})

