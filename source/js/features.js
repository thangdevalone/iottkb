const feature_admin = `
<div style="width:100%">
<ul>
    <li class="pd-10 cursor-pointer feature feature-flex" class="feature" id="logUserInfor">
    <div>Thông tin tài khoản</div><div><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21H7C3 21 2 20 2 16V8C2 4 3 3 7 3H17C21 3 22 4 22 8V16C22 20 21 21 17 21Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 8H19" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15 12H19" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17 16H19" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8.49994 11.2899C9.49958 11.2899 10.3099 10.4796 10.3099 9.47992C10.3099 8.48029 9.49958 7.66992 8.49994 7.66992C7.50031 7.66992 6.68994 8.48029 6.68994 9.47992C6.68994 10.4796 7.50031 11.2899 8.49994 11.2899Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 16.33C11.86 14.88 10.71 13.74 9.26 13.61C8.76 13.56 8.25 13.56 7.74 13.61C6.29 13.75 5.14 14.88 5 16.33" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    </div>
    </li>
    <li class="pd-10 cursor-pointer feature feature-flex"  id="logDataWareHouse">
    <div>Kho dữ liệu</div><div><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.02 2.83992L3.63 7.03992C2.73 7.73992 2 9.22992 2 10.3599V17.7699C2 20.0899 3.89 21.9899 6.21 21.9899H17.79C20.11 21.9899 22 20.0899 22 17.7799V10.4999C22 9.28992 21.19 7.73992 20.2 7.04992L14.02 2.71992C12.62 1.73992 10.37 1.78992 9.02 2.83992Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.5 18H13.5C15.15 18 16.5 16.65 16.5 15V12C16.5 10.35 15.15 9 13.5 9H10.5C8.85 9 7.5 10.35 7.5 12V15C7.5 16.65 8.85 18 10.5 18Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 9V18" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7.5 13.5H16.5" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    </div>
    </li>
    <li class="pd-10 cursor-pointer feature feature-flex"id="logDataAnalystics">
    <div>Phân tích dữ liệu</div><div><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2V19C2 20.66 3.34 22 5 22H22" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5 17L9.59 11.64C10.35 10.76 11.7 10.7 12.52 11.53L13.47 12.48C14.29 13.3 15.64 13.25 16.4 12.37L21 7" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    </div>
    </li>
    <li class="pd-10 cursor-pointer feature feature-flex"  id="logCreateAccount">
    <div>Tạo tài khoản</div><div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19.2101 15.74L15.67 19.2801C15.53 19.4201 15.4 19.68 15.37 19.87L15.18 21.22C15.11 21.71 15.45 22.05 15.94 21.98L17.29 21.79C17.48 21.76 17.75 21.63 17.88 21.49L21.42 17.95C22.03 17.34 22.32 16.63 21.42 15.73C20.53 14.84 19.8201 15.13 19.2101 15.74Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M18.7001 16.25C19.0001 17.33 19.84 18.17 20.92 18.47" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3.40991 22C3.40991 18.13 7.25994 15 11.9999 15C13.0399 15 14.0399 15.15 14.9699 15.43" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>                    
    </div>
    </li>
</ul>
</div>
`
const feature_user = `
<div style="width:100%">
<ul>
    <li class="pd-10 cursor-pointer feature feature-flex"  id="logUserInfor">
    <div>Thông tin tài khoản</div><div><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21H7C3 21 2 20 2 16V8C2 4 3 3 7 3H17C21 3 22 4 22 8V16C22 20 21 21 17 21Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 8H19" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15 12H19" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17 16H19" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8.49994 11.2899C9.49958 11.2899 10.3099 10.4796 10.3099 9.47992C10.3099 8.48029 9.49958 7.66992 8.49994 7.66992C7.50031 7.66992 6.68994 8.48029 6.68994 9.47992C6.68994 10.4796 7.50031 11.2899 8.49994 11.2899Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 16.33C11.86 14.88 10.71 13.74 9.26 13.61C8.76 13.56 8.25 13.56 7.74 13.61C6.29 13.75 5.14 14.88 5 16.33" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    </div>
    </li>
    <li class="pd-10 cursor-pointer feature feature-flex"  id="logDataWareHouse">
    <div>Kho dữ liệu</div><div><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.02 2.83992L3.63 7.03992C2.73 7.73992 2 9.22992 2 10.3599V17.7699C2 20.0899 3.89 21.9899 6.21 21.9899H17.79C20.11 21.9899 22 20.0899 22 17.7799V10.4999C22 9.28992 21.19 7.73992 20.2 7.04992L14.02 2.71992C12.62 1.73992 10.37 1.78992 9.02 2.83992Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.5 18H13.5C15.15 18 16.5 16.65 16.5 15V12C16.5 10.35 15.15 9 13.5 9H10.5C8.85 9 7.5 10.35 7.5 12V15C7.5 16.65 8.85 18 10.5 18Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 9V18" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7.5 13.5H16.5" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    </div>
    </li>
    <li class="pd-10 cursor-pointer feature feature-flex" id="logDataAnalystics">
    <div>Phân tích dữ liệu</div><div><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2V19C2 20.66 3.34 22 5 22H22" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5 17L9.59 11.64C10.35 10.76 11.7 10.7 12.52 11.53L13.47 12.48C14.29 13.3 15.64 13.25 16.4 12.37L21 7" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    </div>
    </li>
</ul>
</div>
`
const feature_infor = `
<div class="modal infor-event">
<div class="modal-header ">
  <span class="exit-feature cursor-pointer"><i class="fa-solid fa-xmark"></i></span>
</div>
<h4 class="text-center  mt-2 mb-3" >Thông tin tài khoản</h4>
<form class="modal-body " id="infor">
  <div class="infor-form">
    <p class="fwb"><span class="title-imp">*</span> Thông tin cá nhân (Có thể thay đổi)</p>
    <div class="row-custom w-100 mb-4">
      <div class="col-4 justify-content-start">
        <div class="group">
          <input type="text" id="name" required spellcheck="false" />
          <label>Họ và tên</label>
        </div>
      </div>
      <div class="col-4 justify-content-center">
        <div class="group ">
          <input type="text" id="idgv" required spellcheck="false" />
          <label>Mã giáo viên</label>
        </div>
      </div>
      <div class="col-4 justify-content-end">
        <div class="group">
          <input type="text" id="sdt" required spellcheck="false" />
          <label>Số điện thoại</label>
        </div>
      </div>
      
    </div>
    <div class="row-custom w-100 mb-4 ">
    <div class="col-5 justify-content-start">
      <span>Ảnh đại diện: </span>
      <img id="avt-preview" alt="Ảnh đại diện"/>
    </div>
    </div>

    <div class="w-50 mb-4 ">
        <input class="form-control form-control" id="avt-file" type="file"  accept="image/gif, image/jpeg, image/png" /> 
    </div>
     
   
    <div class="infor-form infor-nochange">
      <p class="fwb"><span class="title-imp">*</span> Thông tin cá nhân (Không thể thay đổi)</p>
      <div class="row-custom w-100">
        <div class="col-6 justify-content-start">
          <div class="group">
            <input type="text" class="used disabled" id="email" required spellcheck="false" value="Not Found" disabled />
            <label>Email</label>
          </div>
        </div>
        <div class="col-6 justify-content-start">
          <div class="group">
            <input type="text" class="used disabled" id="admin" required spellcheck="false" value="Not Found" disabled />
            <label>Admin</label>
          </div>
        </div>
      </div>
  </div>
  <input type="submit" class="btn btn-primary btn-container btn-changeinfor" value="Lưu">
</form>
</div>
`
const features = {
  feature_admin: feature_admin,
  feature_user: feature_user,
  feature_infor: feature_infor,
}
export default features;