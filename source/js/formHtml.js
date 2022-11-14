const login = `
<div class="login form">
    <i class="fa-solid fa-arrow-right-to-bracket exit-form"></i>
    <form class="login-form" id="login">
        <div class="form__header text-center mt-4 text ">
            <h2>Đăng nhập</h2>
            <span class="">Chào mừng đến với IotLab Calendar</span>
        </div>
        <div class="group">
            <input  type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" maxlength="140" autocomplete="true" id="emailLogin"  required spellcheck="false">
            <label>Email</label>
        </div>
        <div class="group">
            <input  type="password" autocomplete="true" id="passLogin"   required>
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
    <span>Nếu bạn chưa có tài khoản? <span  class="span-dk span-dk-dn">Đăng kí ngay</span></span>
</div>
`
const register = `
<div class="register form">
    <i class="fa-solid fa-arrow-right-to-bracket exit-form"></i>
      <form class="register-form" id="register">
        <div class="form__header text-center mt-4 text">
          <h2>Đăng kí</h2>
          <span class="">Chào mừng đến với IotLab Calendar</span>
        </div>
        <!-- progressbar -->
        <ul id="progressbar">
          <li class="active-li">Thông tin tài khoản</li>
          <li id="progress2">Cài đặt và đăng kí</li>
        </ul>
        <!-- formfield -->
        <fieldset class="field-1 d-flex">
          <div class="group">
            <input type="email" id="emailRegister"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" maxlength="140"
            required spellcheck="false" />
            <label>Email</label>
          </div>
          <div class="group">
            <input type="password" id="passRegister" minlength="6" autocomplete="true" required />
            <label>Mật khẩu</label>
          </div>
          <div class="row-custom">
            <div class="col-7 flex-start">
              <div class="group">
                <input type="text" id="name" required spellcheck="false" />
                <label>Họ và tên</label>
              </div>
            </div>
            <div class="col-5 flex-end">
              <div class="group">
                <input type="text" id="idgv" required spellcheck="false" />
                <label>Mã giáo viên</label>
              </div>
            </div>
          </div>
          <button type="text" class="nextForm action-button btn btn-primary btn-custom-1">
            Next
          </button>
        </fieldset>

        <fieldset class="field-2">
          <div class="mb-3 w-80" style="position: relative;">
            <div class="img-preview">
                No image uploaded
            </div>
            <div class="source-base">
                <div class="source-base_imgs">
                </div>
            </div>
            <div " class="btn btn-secondary btn-img">Bấm vào đây để chọn ảnh sẵn có hoặc tải lên bên dưới</div>
            <input class="form-control form-control" id="form-avt" type="file"  accept="image/gif, image/jpeg, image/png" />
          </div>
          <div class="color-user w-80">
            <div class="btn btn-secondary btn-random">
                Bấm vào để lấy màu ngẫu nhiên hoặc chọn bên dưới
            </div>
            <input type="color" class="form-control form-control-color" id="colorInput" value="#FF0000"
              title="Choose your color" />
            <span class="messColor">!Không nên chọn màu trắng hoặc gần trắng hoặc đen hoặc gần đen</span>
          </div>
          <div class="container-btn">
            <button class="prevForm action-button btn btn-primary btn-custom-1">Prev</button>
            <input type="submit" value="Đăng kí" id="btnSubRes" class="btn btn-primary btn-submit" />
          </div>
        </fieldset>
      </form>
        <span>Tôi đã có tài khoản <span  class="span-dn span-dk-dn">Đăng nhập</span></span>

    </div>
`

const form = {
    login: login,
    register: register,
}
export default form;