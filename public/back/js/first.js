$(function(){

    var currentPage;
    var pageSize;
    render();
    function render(){
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType:"json",
            success:function(info){
                console.log(info);
                var htmlStr=template("tpl",info);
                $('tbody').html(htmlStr);
                //分页
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    totalPages:Math.ceil(info.page/info.size),
                    currentPage:info.page,
                    onPageClicked:function(a,b,c,page){
                        currentPage=page;
                        render();

                    }

                })
            }
        })
    }

})