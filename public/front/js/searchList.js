$(function(){
//  1.获取地址栏传递过来的搜索关键字 赋值给input，一进入页面,渲染一次
    var key=getSearch("key");
    $('.search_input').val(key);
    render();
//   根据搜索关键字 发送ajax请求 进行页面渲染
    function render(){
        //请求数据渲染时显示加载中的效果
        $('.lt_product').html('<div class="loading"></div>')
        var params={};

        //三个必传参数
        params.proName=$('.search_input').val();
        params.page=1;
        params.pageSize=100;

        //两个可传可不传参数
        //(1)通过根据高亮的a来判断传哪个参数  键 price num
        //(2)通过箭头判断升序还是降序        值 1升  2降
        var $current = $('.lt_sort a.current');
        if($current.length>0){
        //    有高亮的a，说明需要进行排序 获取传给后台的键 值
            var sortName=$current.data('type');
            var sortValue=$current.find("i").hasClass("fa-angle-down")?2:1;
            params[sortName]=sortValue;
        }
        $.ajax({
            type:"get",
            url:"/product/queryProduct",
            data:params,
            datatype:"json",
            success:function(info){
                console.log(info);
                var htmlStr=template("productTpl",info);
                $(".lt_product").html(htmlStr);
            }
        });
    }

//  2.点击搜索按钮，实现搜索功能
    $('.search_btn').click(function(){
        var key=$('.search_input').val();
        if(key.trim()===""){
           // 提示框
           mui.toast("请输入关键字",{
               duration:2000
            });
            return;
        }
        render();


        //    需要将搜索关键字，追加存储到本地存储中
        var history=localStorage.getItem("search_list")||'[]';
        var arr =JSON.parse(history);
        //2.1删除重复的项
        var index = arr.indexOf( key );
        if(index != -1){
            arr.splice(index,1);
        }
        //2.2长度控制在10
        if(arr.length>=10){
            arr.pop();
        }
        arr.unshift(key);
        localStorage.setItem("search_list",JSON.stringify(arr));

    })
//  3.排序功能
//     通过属性选择器给价格和库存添加点击事件
//     如果自己有curren类，切换箭头的方向即可
//     如果自己没有current类，给自己加上current类，并且移除兄弟元素的current
    $(".lt_sort a[data-type]").click(function(){
        if($(this).hasClass("current")){
            $(this).find("i").toggleClass("fa-angle-up").toggleClass("fa-angle-down");

        }
        else{
            $(this).addClass("current").siblings().removeClass("current");
        }
        render();
    })
//4.添加加载中效果


});