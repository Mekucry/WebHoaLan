let loaitaikhoan;
async function ktratrangthaidangnhap() {
    try {
        const response = await fetch(`/home`);
        loaitaikhoan = await response.json();
        if (loaitaikhoan.username == 'admin' && loaitaikhoan.status == 'in') {
            if(loaitaikhoan.quyen == 'admin'){
                var usericon=document.getElementById('usericon');
                usericon.insertAdjacentHTML('afterend', '<div id="newdiv"></div>');
                document.getElementById('newdiv').innerHTML = `
                    <a>ADMIN</a>
                    <button class="navbutton" id="qlhoa">Quản lý hoa</button>
                    <button class="navbutton" id="qldon">Quản lý đơn hàng</button>
                    <button class="navbutton" id="qltkk">Quản lý tài khoản</button>
                    <button class="navbutton" id="dangxuat">Đăng xuất</button>
                `;
                document.getElementById('qldon').addEventListener('click', () => {
                    window.location.href = "ad-qldonhang.html";
                });
                document.getElementById('qlhoa').addEventListener('click', () => {
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
            }
            if(loaitaikhoan.quyen == 'kh'){
                alert("Không có quyền truy cập");
                window.addEventListener('beforeunload', function() {
                    document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
                });
                window.location.href = '/dangnhap.html';
                return;
                var usericon=document.getElementById('usericon');
                usericon.insertAdjacentHTML('afterend', '<div id="newdiv"></div>');
                document.getElementById('newdiv').innerHTML = `
                    <a>${loaitaikhoan.ten}</a>
                    <button class="navbutton" id="qlhoa">Thông tin tài khoản</button>
                    <button class="navbutton" id="qldon">Quản lý đơn hàng</button>
                    <button class="navbutton" id="dangxuat">Đăng xuất</button>
                `;
                document.getElementById('qldon').addEventListener('click', () => {
                    window.location.href = "kh-qldonhang.html";
                });
                document.getElementById('qlhoa').addEventListener('click', () => {
                    window.location.href = "kh-qldonhang.html";
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
                document.getElementById('icongiohang').addEventListener('click', () => {
                    window.location.href = "giohang.html";
                });
            }
            document.getElementById('dangxuat').addEventListener('click', () => {
                fetch(`/dangxuat`);
                location.reload();
            });
        }
        else{
            document.getElementById('usericon').addEventListener('click', () => {
                window.location.href = "dangnhap.html";
            });
            alert("Không có quyền truy cập");
            window.addEventListener('beforeunload', function() {
                document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
            });
            window.location.href = '/dangnhap.html';
            return;
        }
    } catch (error) {
        console.error(error);
    }
}
ktratrangthaidangnhap();

async function laytk() {
    try{
        const response = await fetch('/tttk');
        if (!response.ok) {
            throw new Error('Lỗi khi lấy dữ liệu từ server');
        }
        let data = await response.json();
        document.getElementById('qltk').innerHTML+=`
            <div id="cactk">
                <div class="tieudetk">
                    <a id="sdttk">Số điện thoại</a>
                    <a id="tentk">Tên</a>
                    <a id="mktk">Mật khẩu</a>
                    <a id="tttk">Tài khoản</a>
                </div>
            </div>
        `;
        data.forEach(row => {
            let mau="";
            let vaitro="";
            if(row.vaitro=="admin"){
                mau="vang";
                vaitro="admin";
            }
            if(row.vaitro=="kh"){
                mau="xanh";
            }
            if(row.vaitro=="khoa"){
                mau="do";
            }
            if(row.vaitro=="kh"){
                vaitro="khách hàng";
            }
            if(row.vaitro=="khoa"){
                vaitro="bị khóa";
            }
            document.getElementById('cactk').innerHTML+=`
                <div class="hovertk">
                    <div class="tk">
                        <a id="sdttk">${row.sdt}</a>
                        <a id="tentk">${row.ten}</a>
                        <a id="mktk">${row.matkhau}</a>
                        <a id="tttk" class="${mau}">${vaitro}</a>
                    </div>
                    <div id="${row.sdt}" class="nut">
                        <button id="doimk" onclick="khoatk('${row.sdt}', 2)">Đổi mật khẩu</button>
                    </div>
                </div>
            `;
            if(row.vaitro=="khoa"){
                document.getElementById(`${row.sdt}`).innerHTML+=`
                    <button id="bokhoa" onclick="khoatk('${row.sdt}', 1)">Bỏ khóa</button>
                `;
            }
            if(row.vaitro=="kh"){
                document.getElementById(`${row.sdt}`).innerHTML+=`
                    <button id="khoa" onclick="khoatk('${row.sdt}', -1)">khóa tài khoản</button>
                `;
            }
            document.getElementById(`${row.sdt}`).style=`
                display: none;
            `;
        });
        document.querySelectorAll('.hovertk').forEach(row => {
            row.querySelector('.tk').addEventListener('mouseenter', () => {
                row.querySelector('.tk').style=`
                    transform: scale(1.1);
                    margin-bottom:40px;
                `;
                row.querySelector('.nut').style=`
                    display: block;
                `;
            });
            row.addEventListener('mouseleave', () => {
                row.querySelector('.tk').style=`
                    transform: scale(1);
                    margin-bottom:10px;
                `;
                row.querySelector('.nut').style=`
                    display: none;
                `;
            });
            row.querySelector('#doimk').addEventListener('click', () => {
                if(!row.querySelector('input')){
                    row.querySelector('#doimk').insertAdjacentHTML('afterend', '<input type="text" id="ipdoimk">');
                    row.addEventListener('mouseleave', () => {
                        row.querySelector('input').remove();
                    });
                }
            });
        });
    }
    catch (error) {
        console.error('Có lỗi xảy ra:', error);
    }
}
laytk();

async function khoatk(sdt,khoa){
    try{
        let dem=0;
        let check=0;
        if(khoa==2){
            let div=document.getElementById(`${sdt}`);
            if(div.querySelector('input')){
                if( div.querySelector('input').value!=""){
                    khoa=div.querySelector('input').value;
                    check++;
                }
            }
        }
        if(khoa==1 || khoa==-1){
            check++;
        }
        if(check>0){
            await fetch('/suatk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({sdt, khoa})
            })
            dem++;
        }
        if(dem>0){
            location.reload();
        }
    }
    catch (error) {
        console.error('Có lỗi xảy ra:', error);
    }
}