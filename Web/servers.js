var mysql = require('mysql2');  
var connection = mysql.createConnection({  
  database: "webhoa",
  host: "localhost",
  user: "root",
  password: "",
});  

connection.connect(function(err) {  
  if (err) throw err;  
  console.log("Kết nối thành công");  
});   

function validatePhoneNumber(phone) {
	const regex = /^(0[1-9])\d{8}$/;
	return regex.test(phone);
}

const express = require('express');
const multer = require('multer');
const session = require('express-session');
const path = require('path');
const app = express();
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');


const storage = multer.memoryStorage(); // Lưu tệp trong bộ nhớ (RAM)
const upload = multer({ storage: storage })

const cors = require('cors');
const { request } = require('http');
const e = require('express');
app.use(cors());


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: false
}));

app.use(function (request, response, next) {
	response.setHeader('Cache-Control', 'no-store');
	next();
});

app.use(express.json({limit: '50mb'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname+'/web',)));

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname +'/web/trangchu.html'));
});

app.post('/dangnhap', function(request, response) {
	let sdt = request.body.sdt;
	let matkhau = request.body.matkhau;
	if (sdt && matkhau) {
		connection.query('SELECT * FROM tk WHERE sdt = ? AND matkhau = ?',
			 [sdt, matkhau], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				if(results[0].vaitro=='kh'){
					let kh='admin';
					request.session.loggedin = true;
					request.session.vaitro = kh;
					request.session.quyen= 'kh';
					request.session.ten = results[0].ten;
					request.session.sdt = results[0].sdt;
					request.session.save();
					let trangthaidangnhap={
						"trangthaidangnhap": "thanhcong",
						"tentaikhoan": results[0].ten
					}
					response.json(trangthaidangnhap);
				}
				if(results[0].vaitro=='admin'){
					let admin='admin';
					request.session.loggedin = true;
					request.session.vaitro = admin;
					request.session.quyen= 'admin';
					request.session.ten = results[0].ten;
					request.session.save();
					let trangthaidangnhap={
						"trangthaidangnhap": "thanhcong",
						"tentaikhoan": results[0].ten
					}
					response.json(trangthaidangnhap);
				}
				if(results[0].vaitro=='khoa'){
					let kh='admin';
					request.session.loggedin = true;
					request.session.vaitro = kh;
					request.session.quyen= 'khoa';
					request.session.ten = results[0].ten;
					request.session.sdt = results[0].sdt;
					request.session.save();
					let trangthaidangnhap={
						"trangthaidangnhap": "khoa",
						"tentaikhoan": results[0].ten
					}
					response.json(trangthaidangnhap);
				}
			} 
			else{
				response.json({
					"trangthaidangnhap": "thatbai"
				});
			}		
		});
	}
});

app.post('/themhoa',  upload.single('image'),(request, response) => {
	const {ten, gia , thongtin} = request.body; 
	const {buffer} = request.file;
	connection.query('INSERT INTO qlhoa(tenhoa, gia, thongtin, hinh) VALUES(?,?,?,?)', 
		[ten, gia , thongtin, buffer], function(error, results) {
		if (error){
			console.error(error);
			response.send(`
				<html>
					<body>
						<script>
							alert('Đã có hoa này!');
							window.location.href = '/ad-qlhoa.html';
						</script>
					</body>
				</html>
			`);
		}
		else{
			response.send(`
				<html>
					<body>
						<script>
							alert('Thêm hoa thành công');
							window.location.href = '/ad-qlhoa.html';
						</script>
					</body>
				</html>
			`); 
		}  
	});
});

app.get('/hinhhoa', (request, res) => {
	connection.query('SELECT * FROM qlhoa', function(error, results) {
		if (error) throw error; 
		if (results.length > 0) {
			results.forEach(row => {
				const imageBase64 = row.hinh.toString('base64');
				row.hinh=imageBase64;
			});
      		res.json(results);
		}
	});
});

app.get('/doisoluong', (request, res) => {
	let sdtkh = request.query.sdtkh;
	let soluong = request.query.soluong;
	let tenhoa = request.query.tenhoa;
	if(soluong==0){
		connection.query('delete FROM giohang where tenhoa = ? and sdtkh= ?', 
			[tenhoa, sdtkh], function(error, results) {
			if(error){
				console.error(error);
			}
			else{
				res.json();
			}
		});
	}
	else{
		connection.query('update giohang set soluong = ? where sdtkh = ? and tenhoa = ?', 
			[soluong, sdtkh, tenhoa], function(error, results) {
			if(error){
				console.error(error);
			}
			else{
				res.json();
			}
		});
	}
});

app.get('/giohang', async (request, res) => {
    let sdtkh = request.query.sdtkh;
    try {
        const [results] = await connection.promise().query(
		'SELECT * FROM giohang where sdtkh = ?', [sdtkh]);
        if (results.length > 0) {
            let giohang = [];
            for (let rowgiohang of results) {
                const [resultsqlhoa] = await connection.promise().query(
				'SELECT * FROM qlhoa where tenhoa = ?', [rowgiohang.tenhoa]);
                if (resultsqlhoa.length > 0) {
                    for (let rowqlhoa of resultsqlhoa) {
                        giohang.push({
                            "tenhoa": rowgiohang.tenhoa,
                            "gia": rowgiohang.gia,
                            "hinh": rowgiohang.hinh,
                            "soluong": rowgiohang.soluong,
							"tt": "con"
                        });
                    }
                }
				if (resultsqlhoa.length == 0){
					giohang.push({
						"tenhoa": rowgiohang.tenhoa,
						"gia": rowgiohang.gia,
						"hinh": rowgiohang.hinh,
						"soluong": rowgiohang.soluong,
						"tt": "xoa"
					});
				}
            }
            res.json(giohang);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi truy vấn dữ liệu.' });
    }
});

app.delete('/xoa', function(request, response) {
	if(!request.session.loggedin || request.session.vaitro !== 'admin'){
		response.send("Không có quyền truy cập");
		return;
	}
	let status=request.body.status;
	const dulieu = request.body.dulieu;
	let value=request.body.value;
	let key=request.body.key;
	if(status==-1){
		connection.query('delete FROM ?? where ?? = ?', 
			[dulieu, key, value], function(error, results) {
			if (error) {
				console.error(error);
				response.status(500).send('Lỗi truy vấn cơ sở dữ liệu');
				return;
			}
		});
	}
});

app.delete('/xoahoa', function(request, response) {
	const tenhoabixoa = request.query.tenhoabixoa;
	connection.query('delete FROM qlhoa where tenhoa = ?', 
		[tenhoabixoa], function(error, results) {
		if (error) {
			console.error(error);
		}
	});
});

app.post('/themvaogiohang', function(request, response) {
	let sdtuser=request.body.sdtuser;
	let tenhoa=request.body.tenhoa;
	let hinh=request.body.hinh;
	let gia=request.body.gia;
	connection.query('select * from giohang where sdtkh=? and tenhoa=?', 
	[ sdtuser, tenhoa], function(error, results) {
		if(results.length==0){
			connection.query('INSERT INTO giohang(sdtkh, tenhoa, soluong, hinh, gia) VALUES(?,?,?,?,?)', 
			[ sdtuser, tenhoa, 1, hinh, gia], function(error, results) {
				if(error){
					console.error(error);
				}
				else{
					response.json("ok");
				}
			});
		}
		if(results.length>0){
			let soluong = results[0].soluong + 1;
			connection.query('update giohang set soluong = ? where sdtkh = ? and tenhoa = ?', 
			[soluong, sdtuser, tenhoa], function(error, results) {
				if(error){
					console.error(error);
				}
				else{
					response.json("ok");
				}
			});
		}
	});
});

app.post('/themtk', function(request, response) {
	// if(!request.session.loggedin || request.session.vaitro !== 'admin'){
	// 	response.send("Không có quyền truy cập");
	// 	return;
	// }
	let ten=request.body.ten;
	let sdt=request.body.sdt;
	let matkhau=request.body.matkhau;
	let vaitro=request.body.vaitro;
	if(validatePhoneNumber(sdt)){
		connection.query('INSERT INTO tk(sdt, ten, matkhau, vaitro) VALUES(?,?,?,?)', 
			[ sdt, ten, matkhau, vaitro], function(error, results) {
			if (error) {
				console.error(error);
				response.json({
					"trangthaidangky": "sdtdaduocdangky"
				});
			}
			else{
				response.json({
					"trangthaidangky": "thanhcong"
				});
			}
		});
	}
	else{
		response.json({
			"trangthaidangky": "sdtkhonghople"
		});
	}
});

app.get('/tttk', (request, res) => {
	connection.query('select * FROM tk', function(error, results) {
		if(error){
			console.error(error);
		}
		else{
			res.json(results);
		}
	});
});

app.get('/ktradonhang', (request, res) => {
	let sdtkh = request.query.sdtkh;
	let dk = request.query.dk;
	let dkdon="";
	if(dk==2){
		dkdon="danggiao"
	}
	if(dk==3){
		dkdon="hoanthanh"
	}
	if(dk==4){
		dkdon="dahuy"
	}
	if(sdtkh=="admin" & dk==1){
		connection.query('SELECT * FROM donhang',function(error, results) {
			if (error) throw error; 
			if (results.length > 0) {
				let ngaydon=[];
				results.forEach(result => {
					let dem = 0;
					ngaydon.forEach(row => {
						if(result.ngay == row){
							dem=1;
						}
					});
					if(dem==0){
						ngaydon.push(result.ngay);
					}
				});
				for(let j=0;j<ngaydon.length-1;j++) {
					for(let i=j+1;i<ngaydon.length;i++){
						let date1=new Date(`${ngaydon[j]}`);
						let date2=new Date(`${ngaydon[i]}`);
						if(date1.getTime() < date2.getTime()){
							let tam=ngaydon[j];
							ngaydon[j]=ngaydon[i];
							ngaydon[i]=tam;
						}
					}
				}
				res.json(ngaydon);
			}
			else{
				res.json(results);
			}
		});
	}
	if(sdtkh=="admin" & dk!=1){
		connection.query('SELECT * FROM donhang where trangthai = ?',[dkdon],function(error, results) {
			if (error) throw error; 
			if (results.length > 0) {
				let ngaydon=[];
				results.forEach(result => {
					let dem = 0;
					ngaydon.forEach(row => {
						if(result.ngay == row){
							dem=1;
						}
					});
					if(dem==0){
						ngaydon.push(result.ngay);
					}
				});
				for(let j=0;j<ngaydon.length-1;j++) {
					for(let i=j+1;i<ngaydon.length;i++){
						let date1=new Date(`${ngaydon[j]}`);
						let date2=new Date(`${ngaydon[i]}`);
						if(date1.getTime() < date2.getTime()){
							let tam=ngaydon[j];
							ngaydon[j]=ngaydon[i];
							ngaydon[i]=tam;
						}
					}
				}
				res.json(ngaydon);
			}
			else{
				res.json(results);
			}
		});
	}
	if(sdtkh!="admin" & dk==1){
		connection.query('SELECT * FROM donhang where sdtkh = ?',
			[sdtkh], function(error, results) {
			if (error) throw error; 
			if (results.length > 0) {
				let ngaydon=[];
				results.forEach(result => {
					let dem = 0;
					ngaydon.forEach(row => {
						if(result.ngay == row){
							dem=1;
						}
					});
					if(dem==0){
						ngaydon.push(result.ngay);
					}
				});
				for(let j=0;j<ngaydon.length-1;j++) {
					for(let i=j+1;i<ngaydon.length;i++){
						let date1=new Date(`${ngaydon[j]}`);
						let date2=new Date(`${ngaydon[i]}`);
						if(date1.getTime() < date2.getTime()){
							let tam=ngaydon[j];
							ngaydon[j]=ngaydon[i];
							ngaydon[i]=tam;
						}
					}
				}
				res.json(ngaydon);
			}
			else{
				res.json(results);
			}
		});
	}
	if(sdtkh!="admin" & dk!=1){
		connection.query('SELECT * FROM donhang where sdtkh = ? and trangthai = ?',
			[sdtkh, dkdon], function(error, results) {
			if (error) throw error; 
			if (results.length > 0) {
				let ngaydon=[];
				results.forEach(result => {
					let dem = 0;
					ngaydon.forEach(row => {
						if(result.ngay == row){
							dem=1;
						}
					});
					if(dem==0){
						ngaydon.push(result.ngay);
					}
				});
				for(let j=0;j<ngaydon.length-1;j++) {
					for(let i=j+1;i<ngaydon.length;i++){
						let date1=new Date(`${ngaydon[j]}`);
						let date2=new Date(`${ngaydon[i]}`);
						if(date1.getTime() < date2.getTime()){
							let tam=ngaydon[j];
							ngaydon[j]=ngaydon[i];
							ngaydon[i]=tam;
						}
					}
				}
				res.json(ngaydon);
			}
			else{
				res.json(results);
			}
		});
	}
});

app.post('/donhang', (request, res) => {
	let sdtkh = request.body.sdtkh;
	let soluong = request.body.soluong;
	let tenhoa = request.body.tenhoa;
	let tongtien = request.body.tongtien;
	let ngay = new Date(request.body.ngay);
	let hinh = request.body.hinh;
	let gia = request.body.gia;
	let tennh = request.body.tennh;
	let sdtnh = request.body.sdtnh;
	let dcnh = request.body.dcnh;
	ngay = ngay.toString();
	if (ngay.includes("+0700")) {
		ngay = ngay.replace("+0700", "0700");
	}
	connection.query(
		'insert into donhang(sdtkh, tenhoa, soluong, trangthai, tongtien, ngay, hinh, gia, diachi, tennh, sdtnh)values(?,?,?,?,?,?,?,?,?,?,?)',
		[sdtkh, tenhoa, soluong, "danggiao", tongtien, ngay, hinh, gia, dcnh, tennh, sdtnh],
		function(error, results) {
		if (error) throw error;
		else{
			res.json();
		}
	});
});

app.post('/ttnh', (request, res) => {
	let tennh = request.body.tennh;
	let sdtnh = request.body.sdtnh;
	let dcnh = request.body.dcnh;
	let sdt = request.body.sdt;
	connection.query(
		'update tk set diachi = ?, sdtnh = ?, tennh = ? where sdt = ?',
		[dcnh, sdtnh, tennh, sdt],
		function(error, results) {
		if (error) throw error;
		else{
			res.json();
		}
	});
});

app.post('/trangthai', (request, res) => {
	let sdtkh = request.body.sdt;
	let ngay = request.body.ngay;
	let tthai = request.body.tthai;
	if(tthai==1){
		connection.query(
			'update donhang set trangthai = "hoanthanh" where sdtkh = ? and ngay = ?',
			[sdtkh, ngay], function(error, results) {
			if (error) throw error;
		});
	}
	if(tthai==-1){
		connection.query(
			'update donhang set trangthai = "dahuy" where sdtkh = ? and ngay = ?',
			[sdtkh, ngay], function(error, results) {
			if (error) throw error;
		});
	}
});

app.get('/hiendonhang', (request, res) => {
	let sdtkh=request.query.sdtkh;
	let ngay=request.query.ngay;
	if(sdtkh=="admin"){
		connection.query('select * from donhang where ngay = ?',
			[ngay],function(error, results) {
			if (error) throw error;
			else{
				res.json(results);
			}
		});
	}
	if(sdtkh=="daban"){
		connection.query('select * from donhang where trangthai = ?',["hoanthanh"],function(error, results) {
			if (error) throw error;
			else{
				res.json(results);
			}
		});
	}
	if(sdtkh!="admin" & sdtkh!="daban"){
		connection.query('select * from donhang where sdtkh = ? and ngay = ?',
			[sdtkh, ngay],function(error, results) {
			if (error) throw error;
			else{
				res.json(results);
			}
		});
	}
});

app.post('/suatk', async function(request, res) {
    let sdt = request.body.sdt;
	let khoa = request.body.khoa;
	if(khoa==-1){
		connection.query('UPDATE tk SET vaitro = "khoa" WHERE sdt = ?', 
			[sdt], function(error, results) {
			if (error) throw error;
			else{
				res.json(results);
			}
		});
	}
	if(khoa==1){
		connection.query('UPDATE tk SET vaitro = "kh" WHERE sdt = ?', 
			[sdt], function(error, results) {
			if (error) throw error;
			else{
				res.json(results);
			}
		});
	}
	if(khoa!=1 & khoa!=-1){
		connection.query('UPDATE tk SET matkhau = ? WHERE sdt = ?', 
			[khoa, sdt], function(error, results) {
			if (error) throw error;
			else{
				res.json(results);
			}
		});
	}
});

app.post('/predict', upload.single('image'), async (req, res) => {
    try {
		if (!req.file) {
			return res.status(400).json({ error: 'No file uploaded' });
		}
        const form = new FormData();
        form.append('image',(req.file.buffer),{
			filename: 'image.jpg',
    		contentType: req.file.mimetype
		});
        const response = await axios.post('http://localhost:5000/predict', form, {
            headers: form.getHeaders(),
        });
		res.send(`
			<html>
				<body>
					<script>
						const url = 'timkiem.html?ndtk=${encodeURIComponent(response.data.result)}';
    					window.location.href = url;
					</script>
				</body>
			</html>
		`);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Lỗi server hoặc không kết nối được Python server' });
    }
});

app.get('/dangxuat', (request, response) => {
	request.session.loggedin=false;
	request.session.vaitro = '0';
	request.session.quyen = '0';
	request.session.ten = '';
	request.session.sdt = '';
    request.session.destroy((err) => {
        if (err) {
            return response.send('Lỗi khi đăng xuất');
        }
		response.clearCookie('connect.sid');
    });
});

app.get('/home', (request, response) => {
	let usersession;
	if(request.session.loggedin && request.session.vaitro === 'admin' && request.session.quyen === 'admin'){
		usersession = {
			username: 'admin',
			status: 'in',
			quyen: 'admin',
			ten: request.session.ten
		};
		response.json(usersession);

		usersession = {
			username: '0',
			status: '0',
			quyen: '0'
		};
	}
	else if(request.session.loggedin && request.session.vaitro === 'admin' && request.session.quyen === 'khoa'){
		usersession = {
			username: 'admin',
			status: 'in',
			quyen: 'khoa',
			ten: request.session.ten,
			sdt: request.session.sdt
		};
		response.json(usersession);

		usersession = {
			username: '0',
			status: '0',
			quyen: '0',
			ten: '0',
			sdt: '0'
		};
	}
	else if(request.session.loggedin && request.session.vaitro === 'admin' && request.session.quyen === 'kh'){
		usersession = {
			username: 'admin',
			status: 'in',
			quyen: 'kh',
			ten: request.session.ten,
			sdt: request.session.sdt
		};
		response.json(usersession);

		usersession = {
			username: '0',
			status: '0',
			quyen: '0',
			ten: '0',
			sdt: '0'
		};
	}
	else{
		usersession = {
			username: '0',
			status: '0',
			quyen: '0'
		};
		response.json(usersession);

		usersession = {
			username: '0',
			status: '0',
			quyen: '0'
		};
	}
});
  
app.listen(3000);