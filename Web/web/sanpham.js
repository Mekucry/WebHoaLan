const urlParams = new URLSearchParams(window.location.search);
const tenhoa = urlParams.get('tenhoa');

dsluuhoa = {};
async function hienanh() {
    try {
        await daban();
        const response = await fetch('/hinhhoa');
        if (!response.ok) {
            throw new Error('Lỗi khi lấy dữ liệu từ server');
        }
        let data = await response.json();
        if (data.length > 0) {
            let data1=[];
            const randomNumbers = getUniqueRandomNumbers(4, 0, data.length-1);
            randomNumbers.forEach(randomNumber => {
                data1.push(data[randomNumber]);
            });
            let hoa="";
            data.forEach(row => {
                dsluuhoa[row.tenhoa]={
                    "gia": row.gia,
                    "hinh": row.hinh,
                    "thongtin": row.thongtin
                };
            });
            data1.forEach(row => {
                hoa += 
                `
                <div class="hoa" onclick="motrang('${row.tenhoa}')">
                    <img height="90px" src="data:image/jpg;base64,${row.hinh}" alt="Ảnh">
                    <a id="tenhoa">${row.tenhoa}</a>
                    <a>Giá: ${doitien(row.gia)} đ</a>
                    <a id="daban">${datasl[row.tenhoa].sl} đã bán</a>
                </div>
                `;
            });
            document.getElementById('goiyhoa').innerHTML += hoa;
        } 
        else {
            document.getElementById('goiyhoa').innerHTML += '';
        }
        document.getElementById('sanpham').innerHTML+=`
            <h2>${tenhoa}</h2>
            <img height="250px" src="data:image/jpg;base64,${dsluuhoa[tenhoa].hinh}" alt="Ảnh">
            <a>Giá: ${doitien(dsluuhoa[tenhoa].gia)} đ / Chậu <br> ${datasl[tenhoa].sl} đã bán</a>
            <pre>${dsluuhoa[tenhoa].thongtin}</pre>
            <input type="button" value="Thêm vào giỏ hàng" onclick="themvaogiohang()">
        `;
    }
    catch (error) {
      console.error('Có lỗi xảy ra:', error);
    }
}
hienanh();

function doitien(tien){
    let so=tien;
    let formattedNumber = so.toLocaleString('de-DE');
    return formattedNumber;
}

async function themvaogiohang() {
    try{
        if(loaitaikhoan.quyen != "kh"){
            alert("Bạn cần đăng nhập!");
            window.location.href = "dangnhap.html";
        }
        if(loaitaikhoan.quyen == "kh"){
            const themvaogio={
                "sdtuser": loaitaikhoan.sdt,
                "tenhoa": tenhoa,
                "hinh": dsluuhoa[tenhoa].hinh,
                "gia": dsluuhoa[tenhoa].gia
            };
            await fetch('/themvaogiohang', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(themvaogio)
            })
            alert("Thêm thành công");
        }
    }
    catch(error){
        console.error('Có lỗi xảy ra:', error);
    }
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

function motrang(tenhoa){
    const url = `sanpham.html?tenhoa=${encodeURIComponent(tenhoa)}`;
    window.location.href = url;
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