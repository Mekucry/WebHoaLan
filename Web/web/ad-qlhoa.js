let loaitaikhoan;
async function ktratrangthaidangnhap() {
    try {
        const response = await fetch(`/home`);
        loaitaikhoan = await response.json();
        if (loaitaikhoan.username == 'admin' && loaitaikhoan.status == 'in') {
            if(loaitaikhoan.quyen != 'admin'){
                alert("Không có quyền truy cập");
                window.addEventListener('beforeunload', function() {
                    document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
                });
                window.location.href = '/dangnhap.html';
                return;
            }
            if(loaitaikhoan.quyen == 'admin'){
                var usericon=document.getElementById('usericon');
                usericon.insertAdjacentHTML('afterend', '<div id="newdiv"></div>');
                document.getElementById('newdiv').innerHTML = `
                    <a>ADMIN</a>
                    <button class="navbutton" id="qlhoaad">Quản lý hoa</button>
                    <button class="navbutton" id="qldon">Quản lý đơn hàng</button>
                    <button class="navbutton" id="qltkk">Quản lý tài khoản</button>
                    <button class="navbutton" id="dangxuat">Đăng xuất</button>
                `;
                document.getElementById('qldon').addEventListener('click', () => {
                    window.location.href = "ad-qldonhang.html";
                });
                document.getElementById('qlhoaad').addEventListener('click', () => {
                    window.location.href = "ad-qlhoa.html";
                });
                document.getElementById('qltkk').addEventListener('click', () => {
                    window.location.href = "ad-qltaikhoan.html";
                });
                
                const newdiv=document.getElementById('newdiv');
                usericon.addEventListener('click',function(event){
                    if(1==1){
                        newdiv.style='transform: scale(1)';
                        event.stopPropagation();
                    }
                });
                document.addEventListener('click', function(event) {
                    if (!newdiv.contains(event.target )) {
                        newdiv.style.transform = 'scale(0)';
                    }
                });
                document.getElementById('icongiohang').style='display:none';
                document.getElementById('dangxuat').addEventListener('click', () => {
                    fetch(`/dangxuat`);
                    location.reload();
                });
            }
        }
        else{
            alert("Không có quyền truy cập");
            window.addEventListener('beforeunload', function() {
                document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
            });
            window.location.href = '/dangnhap.html';
            return;
        }
    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
    }
}
async function ktratrangthai() {
    await ktratrangthaidangnhap();
}
ktratrangthai();

const them=document.getElementById('nutthem');
const themhoa=document.getElementById('themhoa');
them.addEventListener('click',function(event){
    themhoa.style='transform: scale(1)';
    event.stopPropagation();
});
document.addEventListener('click', function(event) {
    if (!themhoa.contains(event.target )) {
        themhoa.style.transform = 'scale(0)';
    }
});

let data;
async function hienanh() {
    try {
        await daban();
        const response = await fetch('/hinhhoa');
        if (!response.ok) {
            throw new Error('Lỗi khi lấy dữ liệu từ server');
        }
        data = await response.json();
            if (data.length > 0) {
        let hoa="";
        data.forEach(row => {
            hoa += 
            `
            <div class="thongtinhoa">
                <img src="data:image/jpg;base64,${row.hinh}" alt="Ảnh">
                <a id="tenhoa">${row.tenhoa}</a>
                <a class="giahoa">${doitien(row.gia)} đ</a>
                <a id="daban">${datasl[row.tenhoa].sl} đã bán</a>
            </div>
            `;
        });
        document.getElementById('dshoa').innerHTML=hoa;
        } 
        else {
            document.getElementById('dshoa').innerHTML = '';
        }
    } catch (error) {
      console.error('Có lỗi xảy ra:', error);
    }
}

async function xoahoadachon(tenhoa) {
    try{
        const response=await fetch(`/xoahoa?tenhoabixoa=${tenhoa}`,{
            method: 'DELETE'
        });
        if(response.ok){
            console.log("xoa");
        }
    }
    catch(error){
        console.error("Lỗi kết nối:", error);
    }
}

async function xemcthoa() {
    await hienanh();
    const thongtinhoa=document.querySelectorAll('.thongtinhoa');
    const xemcthoa=document.getElementById('xemcthoa');
    thongtinhoa.forEach(tthoa => {
        tthoa.addEventListener('click',function(event){
            const tenhoa=tthoa.querySelector('#tenhoa').textContent;
            data.forEach(row =>{
                if(row.tenhoa==tenhoa){
                    xemcthoa.innerHTML=`
                    <button id="xoahoa">Xóa</button>
                    <h2>Thông Tin Chi Tiết</h2>
                    <img height="200px" src="data:image/jpg;base64,${row.hinh}" alt="Ảnh">
                    <div id="themten">
                        <p>${row.tenhoa}</p>
                        <br>
                        <a id="giatien">${doitien(row.gia)} đ</a>
                    </div>
                    <div id="thongtinct">
                        <pre>${row.thongtin}</pre>
                    </div>
                    `;
                    const xoahoa=document.getElementById('xoahoa');
                    xoahoa.addEventListener('click',function(event){
                        xoahoadachon(row.tenhoa);
                        location.reload();
                    });
                }
            });
            xemcthoa.style='transform: scale(1)';
            event.stopPropagation();
        });
    });
    document.addEventListener('click', function(event) {
        if (!xemcthoa.contains(event.target )) {
            xemcthoa.style.transform = 'scale(0)';
        }
    });
}
xemcthoa();

function doitien(tien){
    let so=tien;
    let formattedNumber = so.toLocaleString('de-DE');
    return formattedNumber;
}

let datasl={};
async function daban() {
    try{
        let response = await fetch(`/hinhhoa`);
        let dulieu = await response.json();
        dulieu.forEach(row => {
            datasl[row.tenhoa]={
                "sl": 0
            }
        });
        response = await fetch(`/hiendonhang?sdtkh=daban`);
        dulieu = await response.json();
        dulieu.forEach(row => {
            datasl[row.tenhoa]={
                "sl": 0
            }
        });
        dulieu.forEach(row => {
            datasl[row.tenhoa]={
                "sl": datasl[row.tenhoa].sl += row.soluong
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}