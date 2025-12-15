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
                var usericon=document.getElementById('usericon');
                usericon.insertAdjacentHTML('afterend', '<div id="newdiv"></div>');
                document.getElementById('newdiv').innerHTML = `
                    <a style="text-align: center;">${loaitaikhoan.ten}</a>
                    <button class="navbutton" id="qldon">Quản lý đơn hàng</button>
                    <button class="navbutton" id="dangxuat">Đăng xuất</button>
                `;
                document.getElementById('qldon').addEventListener('click', () => {
                    window.location.href = "kh-qldonhang.html";
                });
                
                const newdiv=document.getElementById('newdiv');
                usericon.addEventListener('click',function(event){
                    if(1==1){
                        newdiv.style='transform: scale(1);';
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
        }
    } catch (error) {
        console.error(error);
    }
}
ktratrangthaidangnhap();

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();  
    const formData = new FormData(this);

    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    formObject['vaitro'] = 'kh';

    fetch('/themtk', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject)
    })
    .then(response => response.json())
    .then(data => {
        if(data.trangthaidangky=='thanhcong'){
            alert("Đăng ký thành công");
            window.location.href = '/dangnhap.html';
        }
        if(data.trangthaidangky=='sdtkhonghople'){
            alert("Số điện thoại không hợp lệ!");
        }
        if(data.trangthaidangky=='sdtdaduocdangky'){
            alert("Số điện thoại đã được đăng ký!");
        }
    })
});