/*--REGISTER RENDER--*/
let registerRender = (()=> {
    let $userName = $('#userName'),
        $spanName = $('#spanName'),
        $userPhone = $('#userPhone'),
        $spanPhone = $('#spanPhone'),
        $userPass = $('#userPass'),
        $spanPass = $('#spanPass'),
        $userPassConfirm = $('#userPassConfirm'),
        $spanPassConfirm = $('#spanPassConfirm'),
        $userBio = $('#userBio'),
        $spanBio = $('#spanBio'),
        $man = $('#man'),
        $woman = $('#woman'),
        $submit = $('#submit');

    let {url} = window.location.href.myQueryURLParameter();

    //=>验证用户名
    let checkName = ()=> {
        let val = $userName.val().trim(),
            reg = /^[\u4E00-\u9FA5]{2,5}(·[\u4E00-\u9FA5]{2,5})?$/;
        if (val.length === 0) {
            $spanName.html('用户名不能为空').addClass('error');
            return false;
        }
        if (!reg.test(val)) {
            $spanName.html('输入的真实姓名不正确').addClass('error');
            return false;
        }
        $spanName.html('').removeClass('error');
        return true;
    };

    //=>验证手机号码
    let checkPhone = ()=> {
        let val = $userPhone.val().trim(),
            reg = /^1\d{10}$/;
        if (val.length === 0) {
            $spanPhone.html('电话号码不能为空').addClass('error');
            return false;
        }
        if (!reg.test(val)) {
            $spanPhone.html('请输入正确的电话号').addClass('error');
            return false;
        }
        //->重复验证
        let code = 0;
        $.ajax({
            url: '/checkPhone',
            type: 'get',
            data: {
                phone: val
            },
            dataType: 'json',
            cache: false,
            async: false,
            success: function (result) {
                code = parseFloat(result['code']);
            }
        });
        if (code === 1) {
            $spanPhone.html('当前手机号已经被注册').addClass('error');
            return false;
        }

        $spanPhone.html('').removeClass('error');
        return true;
    };

    //=>验证密码
    let checkPass = ()=> {
        let val = $userPass.val().trim(),
            reg = /^[0-9a-zA-Z]{6,12}$/;
        if (val.length === 0) {
            $spanPass.html('密码不能为空').addClass('error');
            return false;
        }
        if (!reg.test(val)) {
            $spanPass.html('密码格式:6~12位数字和字母组成').addClass('error');
            return false;
        }
        $spanPass.html('').removeClass('error');
        return true;
    };

    //=>确认密码
    let checkPassConfirm = ()=> {
        let val = $userPass.val().trim(),
            val2 = $userPassConfirm.val().trim();
        if (val !== val2) {
            $spanPassConfirm.html('两次输入的密码不一致').addClass('error');
            return false;
        }
        $spanPassConfirm.html('').removeClass('error');
        return true;
    };

    //=>自我描述
    let checkBio = ()=> {
        let val = $userBio.val().trim();
        if (val.length < 10) {
            $spanBio.html('不要太懒哦，至少留下10个字以上的描述吧').addClass('error');
            return false;
        }
        if (val.length > 100) {
            $spanBio.html('您太勤快了，但是我们只能让输入100个字').addClass('error');
            return false;
        }
        $spanBio.html('').removeClass('error');
        return true;
    };

    //=>提交信息
    let sendAjax = ()=> {
        let success = (result)=> {
            if (result['code'] == 1) {
                new Dialog('注册失败，请稍后再试！', function () {
                    window.location.reload(true);
                });
                return;
            }

            //=>设置本地登录态
            cookie.set('userInfo', JSON.stringify(result['data']));
            if (url) {
                window.location.href = decodeURIComponent(url);
                return;
            }
            window.location.href = 'index.html';
        };

        $.ajax({
            url: '/register',
            type: 'post',
            data: {
                name: $userName.val().trim(),
                password: hex_md5($userPass.val().trim()),
                phone: $userPhone.val().trim(),
                bio: $userBio.val().trim(),
                sex: $man[0].checked ? 0 : 1
            },
            dataType: 'json',
            success: success
        });
    };

    return {
        init(){
            //=>失去焦点格式验证
            $userName.on('blur', checkName);
            $userPhone.on('blur', checkPhone);
            $userPass.on('blur', checkPass);
            $userPassConfirm.on('blur', checkPassConfirm);
            $userBio.on('blur', checkBio);

            //=>提交
            $submit.tap(function () {
                if (checkName() && checkPhone() && checkPass() && checkPassConfirm() && checkBio()) {
                    sendAjax();
                }
            });
        }
    }
})();
registerRender.init();







