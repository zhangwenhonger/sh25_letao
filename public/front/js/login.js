$(function(){
// 登录功能
//    给登录按钮注册点击事件  获取用户名和密码  发送ajax请求，进行登录验证
//     (1)登录成功
//             如果是从其他页面拦截过来的，跳回去
//             如果是直接访问login.html，跳到个人中心页

//     (2)登录失败，提示用户
    $('#loginBtn').click(function(){
        //获取用户名和密码
        var username = $('#username').val().trim();
        var password = $('#password').val().trim();
        if(username===""){
            mui.toast("请输入用户名");
           return;
        }
        if(password===""){
            mui.toast("请输入密码");
            return;
        }
        $.ajax({
            type:"post",
            url:"/user/login",
            data: {
                username:username,
                password:password
            },
            datatype:"json",
            success:function(info){
                console.log(info);

                if(info.error===403){
                    mui.toast("用户名或密码错误");
                    return;
                }
                //登录成功
                if(info.success){

//             1.如果是从其他页面拦截过来的，跳回去
//             2.如果是直接访问login.html，跳到个人中心页
                if(location.search.indexOf("retUrl")>-1){
                //    是从其他页面拦截过来的，需要跳回去
                    var retUrl=location.search.replace("?retUrl=","");
                    location.href=retUrl;
                }
                else{
                    location.href="user.html";
                }

                }
            }
        })


    })

})