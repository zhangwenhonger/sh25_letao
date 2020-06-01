/**
 * Created by lsy on 2020/6/1.
 */
$(function(){
    //1.进行表单校验配置
    $("#form").bootstrapValidator({
    // 配置字段 和input框中指定的name关联
        fields:{
            username:{
                //配置校验规则
                validators:{
                    notEmpty:{
                        message:"用户名不能为空"
                    },
                    stringLength:{
                        min:2,
                        max:6,
                        message:"用户名长度必啥须在2-6位"
                    }

                }
            },
            password:{
                validators:{
                    notEmpty:{
                        message:"密码不能为空"
                    },
                    stringLength:{
                        min:6,
                        max:12,
                        message:"密码长度必须是6-12位"
                    }

                }
            }

        }

    })

});