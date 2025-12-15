let loaitaikhoan;
async function ktratrangthaidangnhap() {
    try {
        const response = await fetch(`/home`);
        loaitaikhoan = await response.json();
        if (loaitaikhoan.username == 'admin' && loaitaikhoan.status == 'in') {
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
            else{
                alert("Không có quyền truy cập!");
                window.location.href = "trangchu.html";
            }
            document.getElementById('dangxuat').addEventListener('click', () => {
                fetch(`/dangxuat`);
                location.reload();
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

let datagh;
async function layttgh() {
    try{
        await ktratrangthaidangnhap();
        const response = await fetch(`/giohang?sdtkh=${loaitaikhoan.sdt}`);
        if (!response.ok) {
            throw new Error('Lỗi khi lấy dữ liệu từ server');
        }
        datagh = await response.json();
    }
    catch (error) {
        console.error('Có lỗi xảy ra:', error);
    }
}

let tongtien=0;
async function hiengiohang() {
    try {
        await layttgh();
        await tttk();
        if (datagh.length > 0) {
            let giohang="";
            datagh.forEach(row => {
                if(row.tt=="con"){
                    giohang = 
                    `
                    <div class="hang">
                        <div class="img">
                            <img height="90px" src="data:image/jpg;base64,${row.hinh}" alt="Ảnh">
                        </div>
                        <div class="ghtenhoa">
                            <a id="tenhoa"> ${row.tenhoa} </a>
                            <br>
                            <a id="hanggia"> Giá: ${doitien(row.gia)} đ</a>
                        </div>
                        <div class="ghsoluong">
                            <button onclick="doisoluong('${row.tenhoa}', -1)">-</button>
                            <a id="soluong_${row.tenhoa}">${row.soluong}</a>
                            <button onclick="doisoluong('${row.tenhoa}', 1)">+</button>
                        </div>
                        <div class="ghcheck">
                            <input type="checkbox" name="hoa" class="checkbox" value="${row.tenhoa}">
                        </div>
                    </div>
                    `;
                }
                if(row.tt=="xoa"){
                    giohang = 
                    `
                    <div class="hang" id="daxoa">
                        <div class="img">
                            <img height="90px" src="data:image/jpg;base64,${row.hinh}" alt="Ảnh">
                        </div>
                        <div class="ghtenhoa">
                            <a id="tenhoa"> ${row.tenhoa} </a>
                            <br>
                            <a id="hanggia"> Giá: ${doitien(row.gia)} đ</a>
                        </div>
                        <div class="ghsoluong">
                            <a>Sản phẩm không tồn tại</a>
                            <br>
                            <button onclick="doisoluongsql('${row.tenhoa}', 0, '${loaitaikhoan.sdt}')">Xóa</button>
                        </div>
                        <div class="ghcheck"></div>
                    </div>
                    `;
                }
                document.getElementById('giohang').innerHTML += giohang;
            });
        } 
        else {
            document.getElementById('giohang').innerHTML = `
                <p>Trống</p>
            `;
            document.getElementById('giohang').style=`
                color:black;
                font-weight:bolder;
                font-size:xx-large;
                font-style:italic;
                text-align:center;
                background-color:rgba(0, 3, 202, 0.356);
                border-radius:10px;
                box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                height:300px;
            `;
        }
        document.getElementById('tennh').value = dstk[loaitaikhoan.sdt].tennh;
        document.getElementById('sdtnh').value = dstk[loaitaikhoan.sdt].sdtnh;
        document.getElementById('dcnh').value = dstk[loaitaikhoan.sdt].dcnh;
        const checkboxs = document.querySelectorAll('.checkbox');
        checkboxs.forEach(checkbox => {
            checkbox.addEventListener('change', function(){
                if (checkbox.checked) {
                    datagh.forEach(dtagh => {
                        if(dtagh.tenhoa==checkbox.value)
                            tongtien += dtagh.soluong*dtagh.gia;
                    });
                }
                else {
                    datagh.forEach(dtagh => {
                        if(dtagh.tenhoa==checkbox.value)
                            tongtien -= dtagh.soluong*dtagh.gia;
                    });
                }
                document.getElementById('tongtien').textContent = `${doitien(tongtien)} đ`;
            });
        });
    } 
    catch (error) {
      console.error('Có lỗi xảy ra:', error);
    }
}
hiengiohang();

function doisoluong(tenhoa, doiso) {
    const checkboxs = document.querySelectorAll('.checkbox');
    checkboxs.forEach(checkbox => {
        if(checkbox.value==tenhoa && checkbox.checked==true){
            datagh.forEach(dtagh => {
                if(dtagh.tenhoa==tenhoa){
                    tongtien -= dtagh.soluong*dtagh.gia;
                    document.getElementById('tongtien').textContent = `${doitien(tongtien)} đ`;
                }
            });
            checkbox.checked=false;
        }
    });
    datagh.forEach(row=>{
        if(row.tenhoa==tenhoa){
            row.soluong += doiso;
            if (row.soluong == 0) {
                row.soluong = 0;
            }
            if(row.soluong != 0){
                document.getElementById(`soluong_${tenhoa}`).textContent = `${row.soluong}`;
            }
            doisoluongsql(tenhoa, row.soluong, loaitaikhoan.sdt);
        }
    });
}

async function doisoluongsql(tenhoa, soluong, sdtkh) {
    await fetch(`/doisoluong?sdtkh=${sdtkh}&tenhoa=${tenhoa}&soluong=${soluong}`);
    document.getElementById('giohang').innerHTML = "";
    hiengiohang();
}

let dshinhhoa={};
async function hienanh() {
    try {
        await daban();
        const response = await fetch('/hinhhoa');
        if (!response.ok) {
            throw new Error('Lỗi khi lấy dữ liệu từ server');
        }
        let data = await response.json();
        if (data.length > 0) {
            let hoa="";
            let data1=[];
            const randomNumbers = getUniqueRandomNumbers(4, 0, data.length-1);
            randomNumbers.forEach(randomNumber => {
                data1.push(data[randomNumber]);
            });
            data.forEach(row => {
                dshinhhoa[row.tenhoa]={
                    "hinh" :row.hinh,
                    "gia" :row.gia
                };
            });
            data1.forEach(row => {
                hoa += 
                `
                <div class="hoa" onclick="motrang('${row.tenhoa}')">
                    <img height="90px" src="data:image/jpg;base64,${row.hinh}" alt="Ảnh">
                    <a id="tenhoa">${row.tenhoa}</a>
                    <a>${doitien(row.gia)} đ</a>
                    <a id="daban">${datasl[row.tenhoa].sl} đã bán</a>
                </div>
                `;
            });
            document.getElementById('goiyhoa').innerHTML += hoa;
        } 
        else {
            document.getElementById('goiyhoa').innerHTML += '';
        }
    } catch (error) {
      console.error('Có lỗi xảy ra:', error);
    }
}
hienanh();

let somadon;
async function donhang(tongtien, sdtkh, tenhoa, soluong, hinh, gia) {
    try{
        let tennh=document.getElementById('tennh').value;
        let sdtnh=document.getElementById('sdtnh').value;
        let dcnh=document.getElementById('dcnh').value;
        const ngay = new Date();
        await fetch('/donhang', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({sdtkh, tenhoa, soluong, tongtien, ngay, hinh, gia, tennh, sdtnh, dcnh})
        });
    }
    catch (error) {
        console.error('Có lỗi xảy ra:', error);
    }
}

async function ktradonhang(sdtkh) {
    try{
        const res = await fetch(`/ktradonhang?sdtkh=${sdtkh}`);
        let data = await res.json();
        somadon=data.madon;
    }
    catch (error) {
        console.error('Có lỗi xảy ra:', error);
    }
}

async function taodonhang(){
    let test=0;
    if(document.getElementById('tennh').value == "" || 
    document.getElementById('sdtnh').value == "" || document.getElementById('dcnh').value == ""){
        alert("Cần nhập đủ thông tin nhận hàng!");
        return ;
    }
    else{
        const checkboxs = document.querySelectorAll('.checkbox');
        await ktradonhang(loaitaikhoan.sdt);
        checkboxs.forEach(checkbox => {
            if(checkbox.checked==true){
                datagh.forEach(dtagh => {
                    if(dtagh.tenhoa==checkbox.value){
                        donhang(tongtien, loaitaikhoan.sdt, dtagh.tenhoa, dtagh.soluong, dtagh.hinh, dtagh.gia);
                        doisoluongsql(checkbox.value, 0, loaitaikhoan.sdt);
                        test++;
                    }
                });
            }
        });
    }
    if(test>0){
        await ttnh();
        alert("Đặt hàng thành công");
    }
}

function motrang(tenhoa){
    const url = `sanpham.html?tenhoa=${encodeURIComponent(tenhoa)}`;
    window.location.href = url;
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
                "ten": row.ten,
                "dcnh": row.diachi,
                "tennh": row.tennh,
                "sdtnh": row.sdtnh
            };
        });
    }
    catch (error) {
        console.error('Có lỗi xảy ra:', error);
    }
}

async function ttnh() {
    try{
        let tennh=document.getElementById('tennh').value;
        let sdtnh=document.getElementById('sdtnh').value;
        let dcnh=document.getElementById('dcnh').value;
        let sdt = loaitaikhoan.sdt;
        await fetch('/ttnh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({tennh, sdtnh, dcnh, sdt})
        });
    }
    catch (error) {
        console.error('Có lỗi xảy ra:', error);
    }
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