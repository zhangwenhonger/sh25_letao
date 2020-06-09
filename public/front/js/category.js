$(function(){

// 1.一进入页面渲染
    $.ajax({
        type: "get",
        url: "/category/queryTopCategory",
        dataType: "json",
        success: function (info) {
            console.log(info);
            var htmlStr = template("leftTpl", info);
            $('.lt_category_left ul').html(htmlStr);
            //    一进入页面，渲染第一个一级分类所对应的二级分类
            renderSecondById(info.rows[0].id);

        }
    });

// 2.点击一级分类，渲染二级分类页面
    $('.lt_category_left').on("click","a",function(){
        // 给自己加current，移除其他的current类
        $(this).addClass("current").parent().siblings().find("a").removeClass("current");
        var id=$(this).data("id");
        renderSecondById(id);
    });
//实现一个方法：专门根据一级分类ID去渲染二级分类
    function renderSecondById(id) {
        $.ajax({
            type: "get",
            url: "/category/querySecondCategory",
            dataType: "json",
            data: {
                id: id
            },
            success: function (info) {
                console.log(info);
                var htmlStr=template("rightTpl",info);
                $('.lt_category_right ul').html(htmlStr);

            }
        })
    };

})

