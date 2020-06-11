$(function () {
    var currentPage = 1;
    var pageSize = 2;

    //封装render
    function render(callback) {
        // $('.lt_product').html('<div class="loading"></div>');
        var params = {};
// 必传3个参数：
        params.proName = $('.search_input').val();
        params.page = currentPage;
        params.pageSize = pageSize;
// 可传2个参数：
        var $current = $('.lt-sort a.current');
        if ($current.length > 0) {
            var sortName = $current.data("type");
            var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
            params[sortName] = sortValue;

        }
        setTimeout(function(){
            $.ajax({
                type: "get",
                url: "/product/queryProduct",
                data: params,
                datatype: "json",
                success: function (info) {
                    // 真正拿到数据后执行的操作，通过callback函数传递进来了
                    callback && callback(info);
                }
            });
        },2000);

    }

//功能1:获取地址栏参数赋值给input
    var key = getSearch("key");
    $('.search_input').val(key);
    // render();


    mui.init({
        pullRefresh: {
            container: ".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            // 下拉刷新效果 是对原有数据的覆盖，执行的是html方法
            down : {
                auto: true,
                callback: function () {
                    //加载第一页
                    currentPage = 1;
                    // 拿到数据后，执行的方法是不一样的，所以通过回调函数的方式传递进去执行
                    render(function (info) {
                        var htmlStr = template("productTpl", info);
                        $('.lt_product').html(htmlStr);
                        //    ajax回来之后，需要结束下拉刷新，让内容回滚顶部
                        //     api做了更新，mui还没有更新上要用endPulldownToRefresh()  坑！
                        mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();

                        // 需要启用上拉加载:第一页数据被重新加载之后，又有数据可以进行上拉加载了
                        mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
                    });
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            },
            // 上拉加载效果 是在原有基础的结构上进行追加，追加到后面，执行的是append方法
            up : {
                callback: function () {
                    //需要加载下一页（第二页）数据,更新当前页
                    currentPage++;
                    render(function (info) {
                        var htmlStr = template("productTpl", info);
                        $('.lt_product').append(htmlStr);
                        //   当数据回来之后 结束上拉加载
                        //   true没有更多数据，显示提示语，会自动禁用上拉加载，防止发送无效的ajax   false还有更多数据
                        if (info.data.length === 0) {
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                        } else {
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(false);
                        }


                    });
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            },
        }
    });


//功能2：点击搜索按钮，实现搜索功能
    $('.search_btn').click(function () {
        var key = $(".search_input").val();
        if (key.trim() === '') {
            mui.toast("请输入关键字", {duration: 2000});
            return;
        }
        // 执行一次下拉刷新
        mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();

        var history = localStorage.getItem("search_list") || '[]';
        var arr = JSON.parse(history);
        var index = arr.indexOf(key);
        if (index != -1) {
            arr.splice(index, 1);
        }
        if (arr.length >= 10) {
            arr.pop();
        }
        arr.unshift(key);
        localStorage.setItem("search_list", JSON.stringify(arr));

    });

//功能3：添加排序功能
//     mui认为在下拉刷新和上拉加载容器中，使用click会有300ms延迟的话，性能不好，用tap
    $(".lt_sort a[data-type]").on("tap",function () {
        if ($(this).hasClass("current")) {
            $(".lt_sort").find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
        } else {
            $(this).addClass("current").siblings().removeClass("current");
        }
        mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();

    });

//功能4：事件委托，点击每个商品，跳转到详情页
    $(".lt_product").on("tap",".it_product_item",function(){
        var id=$(this).data("id");
        location.href="product.html?productId="+id;
    })

})