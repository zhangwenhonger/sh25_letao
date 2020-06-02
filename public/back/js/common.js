/**
 * Created by lsy on 2020/6/1.
 */
//1.进度条
$(document).ajaxStart(function () {
    NProgress.start();
});
$(document).ajaxStop(function () {
    NProgress.done();

});
//登录拦截功能（登录页不需做登陆拦截）
//前后分离了，前端不知道用户是否登录，但是后台知道哦，发送ajax 查询用户状态
// 用户已登录，让用户继续访问     未登录，拦截到登录页
if(location.href.indexOf("login.html")===-1){
    $.ajax({
        type:"get",
        url:"/employee/checkRootLogin",
        dataType:"json",
        success:function(info){
            if (info.success){
                console.log("用户已登录")
            }
            if(info.error===400){
                location.href="login.html"
            }
        }
    })
}




$(function () {
//1.左侧分类管理的切换功能
    $('.nav .category').click(function () {
        $('.nav .child').stop().slideToggle();
    });
//2.左侧侧边栏切换功能
    $('.icon-menu').click(function () {
        $('.lt-aside').toggleClass("hidemenu");
        $('.lt-main').toggleClass("hidemenu");
        $('.lt-main .lt-topbar').toggleClass("hidemenu");
    });
//3.点击navbar退出图标，弹出模态框
    $('.icon-logout').click(function(){
        $('#logoutModal').modal("show");
    });
//4.点击退出按钮，发送ajax请求
    $('#logoutBtn').click(function(){
        $.ajax({
            type:"GET",
            url:"/employee/employeeLogout",
            dataType:"json",
            success:function(info){
                if(info.success){
                    window.location.href="login.html";
                }
            }

        })
    })
});