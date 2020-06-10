$(function(){
//能1:获取地址栏参数赋值给input
    var key=getSearch("key");
    $('.search_input').val(key);
    render();

//功能2：点击搜索按钮，实现搜索功能
    $('.search_btn').click(function(){
        var key=$(".search_input").val();
        if(key.trim()===''){
            mui.toast("请输入关键字",{duration:2000});
            return;
        }
        render();

        var history=localStorage.getItem("search_list")||'[]';
        var arr=JSON.parse(history);
        var index=arr.indexOf(key);
        if(index!= -1){
            arr.splice(index,1);
        }
        if(arr.length>=10){
            arr.pop();
        }
        arr.unshift(key);
        localStorage.setItem("search_list",JSON.stringify(arr));

    });

//功能3：添加排序功能
    $(".lt_sort a[data-type]").click(function(){
        if($(this).hasClass("current")){
            $(".lt_sort").find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
        }
        else{
            $(this).addClass("current").siblings().removeClass("current");
        }
        render();
    });


//封装render
    function render(){
        $('.lt_product').html('<div class="loading"></div>')

        var params={};
// 必传3个参数：
        params.proName=$('.search_input').val();
        params.page=1;
        params.pageSize=100;
// 可传2个参数：
        var $current=$('.lt-sort a.current');
        if($current.length>0){
            var sortName=$current.data("type");
            var sortValue=$current.find("i").hasClass("fa-angle-down")?2:1;
            params[sortName]=sortValue;

        }
        $.ajax({
            type:"get",
            url:"/product/queryProduct",
            data:params,
            datatype:"json",
            success:function(info){
                var htmlStr=template("productTpl",info);
                $('.lt_product').html(htmlStr);
            }
        })
    }
})