$(function () {
// 1.一进入页面发送ajax,通过模板引擎渲染
    function render() {
        $.ajax({
            type: "get",
            url: "/cart/queryCart",
            dataType: "json",
            success: function (info) {
                console.log(info);
                if (info.error === 400) {
                    location.href = "login.html";
                    return;
                }
                var htmlStr = template("cartTpl", {arr: info});
                $('#OA_task_2').html(htmlStr);

                //    渲染完成关闭下拉刷新
                mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh()
            }
        });
    }

//2.下拉刷新
    mui.init({
        pullRefresh: {
            container: ".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                auto: true,
                callback: function () {
                    render();
                }
            }
        }
    });

//3.删除
    $('.lt_main').on("tap", ".btn_del", function () {
        var id = $(this).data("id");
        $.ajax({
            type: "get",
            url: "/cart/deleteCart",
            //后台要求传的id参数是一个数组格式
            data: {
                id: [id]
            },
            dataType: "json",
            success: function (info) {
                if (info.success) {
                    //   调用一次下拉刷新
                    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
                }
            }


        })
    });

// 4.编辑
    $('.lt_main').on("tap", ".btn_edit", function () {
        //h5里面有一个dataset 可以一次性获取所有的自定义属性
        var obj = this.dataset;
        var id = obj.id;
        var htmlStr = template("editTpl", obj);
        htmlStr = htmlStr.replace(/\n/g, "");

        mui.confirm(htmlStr, "编辑商品", ["确认", "取消"], function (e) {
            if (e.index === 0) {
                //    确认按钮，进行获取尺码 数量 id，进行ajax提交
                var size = $('.lt_size span.current').text();
                var num = $('.mui-numbox-input').val();
                $.ajax({
                    type:"post",
                    url:"/cart/updateCart",
                    data:{
                        id:id,
                        size:size,
                        num:num
                    },
                    dataType:"json",
                    success:function (info) {
                        if(info.success){
                            mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
                        }



                    }

                })
            }
        })
        //   进行数字框初始化
        mui(".mui-numbox").numbox();
    });
//    5.让尺码可以被选
    $("body").on("click", ".lt_size span", function () {
        $(this).addClass("current").siblings().removeClass("current");
    })


})