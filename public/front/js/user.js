$(function(){
    // 1.一进入页面，请求当前用户数据，进行页面渲染
    $.ajax({
        type:"get",
        url:"/user/queryUserMessage",
        dataType:"json",
        success:function(info){
            console.log(info);
            //(1)用户没登录，拦截到登录页
            if(info.error===400){
                location.href="login.html";
                return;
            }
            //(1)用户已登录，通过模板渲染

            var htmlStr=template("userTpl",info);
            $('#userInfo').html(htmlStr);

        }

    });
//    退出功能
    $('.logoutBtn').click(function () {
        $.ajax({
            type:"get",
            url:"/user/logout",
            dataType:"json",
            success:function(info){
                if(info.success){
                    location.href="login.html";
                }

            }
        })
    })
})