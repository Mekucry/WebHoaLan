const urlParams = new URLSearchParams(window.location.search);
const ndtk = urlParams.get('ndtk');

if(ndtk.length<4){
    document.getElementById('kqtk').innerHTML+=`
        <img id="hinhrong" height="250px" src="hinhanh/document.png" alt="">
    `;
}

if(ndtk.length>=4){
    dsluuhoa = {};
    async function hienanh() {
        try {
            await daban();
            const response = await fetch('/hinhhoa');
            if (!response.ok) {
                throw new Error('Lỗi khi lấy dữ liệu từ server');
            }
            let data1 = await response.json();
            let data=[];
            data1.forEach(row =>{
                if(row.tenhoa.toLowerCase().includes(ndtk.toLowerCase())){
                    data.push(row);
                }
            });
            if (data.length > 0) {
                let hoa="";
                data.forEach(row => {
                    hoa += 
                    `
                    <div class="hoa" onclick="motrang('${row.tenhoa}')">
                        <img height="90px" src="data:image/jpg;base64,${row.hinh}" alt="Ảnh">
                        <a id="tenhoa">${row.tenhoa}</a>
                        <a>Giá: ${doitien(row.gia)} đ</a>
                        <a id="daban">${datasl[row.tenhoa].sl} đã bán</a>
                    </div>
                    `;
                    dsluuhoa[row.tenhoa]={
                        "gia": row.gia,
                        "hinh": row.hinh
                    };
                });
                document.getElementById('goiyhoa').innerHTML += hoa;
            } 
            else {
                document.getElementById('kqtk').innerHTML+=`
                    <img id="hinhrong" height="250px" src="hinhanh/document.png" alt="">
                `;
            }
        }
        catch (error) {
        console.error('Có lỗi xảy ra:', error);
        }
    }
    hienanh();
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

function doitien(tien){
    let so=tien;
    let formattedNumber = so.toLocaleString('de-DE');
    return formattedNumber;
}

function motrang(tenhoa){
    const url = `sanpham.html?tenhoa=${encodeURIComponent(tenhoa)}`;
    window.location.href = url;
}

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