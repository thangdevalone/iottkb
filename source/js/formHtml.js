const login=`
<div class="login form">
    <form class="login-form">
        <div class="form__header text-center mt-4 text ">
            <h2>Đăng nhập</h2>
            <span class="">Chào mừng đến với IotLab Calendar</span>
        </div>
        <div class="group">
            <input  type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" maxlength="140" required spellcheck="false">
            <label>Email</label>
        </div>
        <div class="group">
            <input  type="password" required>
            <label>Mật khẩu</label>
        </div>
        <div class="login__submit mt-4">
            <input type="submit" value="Đăng nhập" class="btn btn-primary btn-submit">
        </div>
        
    </form>
    <div class="other-login">
        Đăng nhập bằng
        <div class="other-login__button">
            <div class="btn btn-primary " id="btn-fb">
                <i class="fa-brands fa-facebook-f"></i>
            </div>
            <div class="btn btn-primary " id="btn-gg">
                <i class="fa-brands fa-google"></i>
            </div>
            <div class="btn btn-primary" id="btn-ms">
                <img src="https://www.microsoft.com/favicon.ico" alt="microsoft-ico">
            </div>
        </div>
    </div>
    <span>Nếu bạn chưa có tài khoản? <span class="span-dk">Đăng kí ngay</span></span>
</div>
`