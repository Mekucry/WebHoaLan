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
            }
            else{
                alert("Không có quyền truy cập!");
                window.location.href = "trangchu.html";
            }
            document.getElementById('dangxuat').addEventListener('click', () => {
                fetch(`/dangxuat`);
                window.location.href = "trangchu.html";
            });
        }
        else{
            alert("Không có quyền truy cập!");
            window.location.href = "trangchu.html";
        }
    } catch (error) {
        console.error(error);
    }
}

let dsdon={};
async function hiendon(ngay) {
    if(ngay == "00"){
        document.getElementById('donhang').innerHTML+=`
            <p id="trong">Trống</p>
        `;
        return;
    }
    try{
        await tttk();
        const res = await fetch(`/hiendonhang?sdtkh=admin&ngay=${ngay}`);
        let data = await res.json();
        let datatrangthai="";
        if(data[0].trangthai=="danggiao"){
            datatrangthai=data[0].trangthai;
            data[0].trangthai="Đang giao";

        }
        if(data[0].trangthai=="dahuy"){
            datatrangthai=data[0].trangthai;
            data[0].trangthai="Đã hủy";
        }
        if(data[0].trangthai=="hoanthanh"){
            datatrangthai=data[0].trangthai;
            data[0].trangthai="Hoàn thành";
        }
        document.getElementById('donhang').innerHTML+=`
            <div class="don" id="don${ngay}">
                <div class="ttdon">
                    <a id="tgdat">Thời gian đặt: ${ngaygio(ngay)} <br>
                    Khách hàng: ${dstk[data[0].sdtkh].ten} (SDT: ${data[0].sdtkh})</a>
                    <div class="trangthai">
                        <a id="tongtien">Tổng số tiền: ${doitien(data[0].tongtien)} đ</a>
                        <br>
                        <a>Trạng thái: </a>
                        <a id="trangthai${datatrangthai}"> ${data[0].trangthai}</a>
                    </div>
                </div>
            </div>
        `;
        data.forEach(row => {
            document.getElementById(`don${ngay}`).innerHTML+=`
                <div class=ctdon>
                    <img height="90px" src="data:image/jpg;base64,${row.hinh}" alt="Ảnh">
                    <div>
                        <a id="ctdontenhoa">${row.tenhoa}</a>
                        <br>
                        <a>Giá: ${doitien(row.gia)} đ</a>
                    </div>
                    <a id="x">x ${row.soluong}</a>
                </div>
            `;
        });
        document.getElementById(`don${ngay}`).innerHTML+=`
            <div id=ttnh>
                <a id=taito>Thông tin nhận hàng</a>
                <a>Tên người nhận: ${data[0].tennh}</a>
                <a>Số điện thoại người nhận: ${data[0].sdtnh}</a>
                <a>Địa chỉ người nhận: ${data[0].diachi}</a>
            </div>
        `;
        if(datatrangthai=="danggiao"){
            document.getElementById(`don${ngay}`).innerHTML+=`
                <div id="input">
                    <input type="button" value="Hoàn thành" onclick="trangthai('${ngay}', '${data[0].sdtkh}', 1)">
                    <input type="button" value="Hủy" onclick="trangthai('${ngay}', '${data[0].sdtkh}', -1)">
                </div>
            `;
        }
    }
    catch (error) {
        console.error('Có lỗi xảy ra:', error);
    }
}

async function hiendonhang(dk) {
    try{
        if(dk==1){
            await ktratrangthaidangnhap();
            const response = await fetch(`/ktradonhang?sdtkh=admin&dk=${dk}`);
            let dataktra = await response.json();
            dataktra.forEach(row => {
                hiendon(row);
            });
            if(dataktra.length==0){
                hiendon("00");
            }
        }
        if(dk==2 || dk==3 || dk==4){
            await ktratrangthaidangnhap();
            document.getElementById('donhang').innerHTML=``;
            const response = await fetch(`/ktradonhang?sdtkh=admin&dk=${dk}`);
            let dataktra = await response.json();
            dataktra.forEach(row => {
                hiendon(row);
            });
            if(dataktra.length==0){
                hiendon("00");
            }
        }
        if(dk==5){
            sothongke=0;
            sodontk=0;
            sohoatk=0;
            const response = await fetch(`/ktradonhang?sdtkh=admin&dk=3`);
            let dataktra = await response.json();
            dataktra.forEach(row => {
                thongke(row);
            });
            if(dataktra.length==0){
                thongke("00");
            }
        }
    }
    catch (error) {
        console.error('Có lỗi xảy ra:', error);
    }
}
hiendonhang(1);

async function hienanh() {
    try {
        const response = await fetch('/hinhhoa');
        if (!response.ok) {
            throw new Error('Lỗi khi lấy dữ liệu từ server');
        }
        let data = await response.json();
        if (data.length > 0) {
            let hoa="";
            data.forEach(row => {
                row.gia=doitien(row.gia);
                hoa += 
                `
                <div class="hoa" onclick="motrang('${row.tenhoa}')">
                    <img height="90px" src="data:image/jpg;base64,${row.hinh}" alt="Ảnh">
                    <a id="tenhoa">${row.tenhoa}</a>
                    <a>Giá: ${row.gia} đ</a>
                </div>
                `;
                dsdon[row.tenhoa]={
                    "gia": row.gia,
                    "hinh": row.hinh
                };
            });
            // document.getElementById('goiyhoa').innerHTML += hoa;
        } 
        else {
            document.getElementById('goiyhoa').innerHTML += '';
        }
    }
    catch (error) {
      console.error('Có lỗi xảy ra:', error);
    }
}
hienanh();

function ngaygio(ngay){
    ngay=ngay.replace("GMT", "GMT+");
    let date = new Date(ngay);

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    let formattedDate = `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
    return formattedDate;
}

function doitien(tien){
    let so=tien;
    let formattedNumber = so.toLocaleString('de-DE');
    return formattedNumber;
}

let dstk={};
async function tttk() {
    try{
        const response = await fetch(`/tttk`);
        let data = await response.json();
        data.forEach(row => {
            dstk[row.sdt]={
                "ten": row.ten
            };
        });
    }
    catch (error) {
        console.error('Có lỗi xảy ra:', error);
    }
}

async function trangthai(ngay, sdt, tthai) {
    try{
        const data = {
            "ngay": ngay,
            "sdt": sdt,
            "tthai": tthai
        };
        fetch('/trangthai', {
            method: 'POST',           
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)  
        })
        .then(response => response.json()) 
        .then(data => {
            console.log('Success:', data); 
        })
        .catch(error => {
            console.error('Error:', error); 
        });
    }
    catch (error) {
        console.error('Có lỗi xảy ra:', error);
    }
    location.reload();
}

// function motrang(tenhoa){
//     const url = `sanpham.html?tenhoa=${encodeURIComponent(tenhoa)}`;
//     window.location.href = url;
// }

let sothongke=0;
let sodontk=0;
let sohoatk=0;
let dshoadaban={};
async function thongke(ngay) {
    try{
        if(ngay=="00"){
            document.getElementById('divthongke').innerHTML=`
                <img src="hinhanh/document.png" height="200px">
            `;
            document.getElementById('divthongke').querySelector('img').style=`
                opacity: 0.2;
                margin-top: 20%;
                margin-left: 45%;
            `;
            return;
        }
        const res = await fetch(`/hiendonhang?sdtkh=admin&ngay=${ngay}`);
        let data = await res.json();
        if(data.length>0){
            sothongke+=data[0].tongtien;
            sodontk++;
            data.forEach(row => {
                sohoatk+=row.soluong;
            });
        }
        document.getElementById('divthongke').innerHTML=`
            <h2>THỐNG KÊ HOẠT ĐỘNG KINH DOANH</h2>
            <div id="sodon">
                <h3>Tổng số đơn hàng đã bán</h3>
                <a>${sodontk}</a>
            </div>
            <div id="tienthongke">
                <h3>Tổng doanh thu</h3>
                <a>${doitien(sothongke)} đ</a>
            </div>
            <div id="sohoa">
                <h3>số lượng hoa đã bán (chậu)</h3>
                <a>${sohoatk}</a>
            </div>
        `;
    }
    catch (error) {
        console.error('Có lỗi xảy ra:', error);
    }
}

const thongkediv=document.getElementById('thongke');
const divthongke=document.getElementById('divthongke');
thongkediv.addEventListener('click',function(event){
    if(1==1){
        divthongke.style='transform: scale(1)';
        event.stopPropagation();
    }
});
document.addEventListener('click', function(event) {
    if (!divthongke.contains(event.target )) {
        divthongke.style.transform = 'scale(0)';
    }
});