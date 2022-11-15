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
            <input  type="password" style="padding: 0px 35px 0px 10px;" autocomplete="true" id="passLogin" required>
            <label>Mật khẩu</label>
            <div class='eye' id="passEyeLogin"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.53 9.47004L9.47004 14.53C8.82004 13.88 8.42004 12.99 8.42004 12C8.42004 10.02 10.02 8.42004 12 8.42004C12.99 8.42004 13.88 8.82004 14.53 9.47004Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M17.82 5.76998C16.07 4.44998 14.07 3.72998 12 3.72998C8.46997 3.72998 5.17997 5.80998 2.88997 9.40998C1.98997 10.82 1.98997 13.19 2.88997 14.6C3.67997 15.84 4.59997 16.91 5.59997 17.77" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.42004 19.5301C9.56004 20.0101 10.77 20.2701 12 20.2701C15.53 20.2701 18.82 18.1901 21.11 14.5901C22.01 13.1801 22.01 10.8101 21.11 9.40005C20.78 8.88005 20.42 8.39005 20.05 7.93005" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15.5099 12.7C15.2499 14.11 14.0999 15.26 12.6899 15.52" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9.47 14.53L2 22" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 2L14.53 9.47" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
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
            <input type="password" id="passRegister" style="    padding: 0px 35px 0px 10px;" minlength="6" autocomplete="true" required />
            <label>Mật khẩu</label>
            <div class='eye' id="passEyeRegister"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.53 9.47004L9.47004 14.53C8.82004 13.88 8.42004 12.99 8.42004 12C8.42004 10.02 10.02 8.42004 12 8.42004C12.99 8.42004 13.88 8.82004 14.53 9.47004Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M17.82 5.76998C16.07 4.44998 14.07 3.72998 12 3.72998C8.46997 3.72998 5.17997 5.80998 2.88997 9.40998C1.98997 10.82 1.98997 13.19 2.88997 14.6C3.67997 15.84 4.59997 16.91 5.59997 17.77" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.42004 19.5301C9.56004 20.0101 10.77 20.2701 12 20.2701C15.53 20.2701 18.82 18.1901 21.11 14.5901C22.01 13.1801 22.01 10.8101 21.11 9.40005C20.78 8.88005 20.42 8.39005 20.05 7.93005" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15.5099 12.7C15.2499 14.11 14.0999 15.26 12.6899 15.52" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9.47 14.53L2 22" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 2L14.53 9.47" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
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