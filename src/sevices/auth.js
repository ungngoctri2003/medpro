import db from '../models'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import Sequelize from 'sequelize'
const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(9))


// Hàm đăng ký
export const dangKi = ({ name, email, password, gioiTinh, sdt, diaChi, namSinh, role_id, avatar }) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOrCreate({
            where: { email },
            defaults: {
                name,
                email,
                password: hashPassword(password),
                gioiTinh,
                namSinh,
                sdt,
                diaChi,
                role_id,
                avatar
            }
        })
        const token = response[1] ? jwt.sign({
            id: response[0].id,
            email: response[0].email,
            role_id: response[0].role_id,
        }, process.env.JWT_SECRET,
            {
                expiresIn: '90d'
            })
            : null
        resolve({
            err: response[1] ? 0 : 1,
            mess: response[1] ? 'Đăng kí thành công' : 'Tài khoản đã tồn tại',
            'access_token': token ? `Bearer ${token}` : token
        })
    }
    catch (e) {
        reject(e)
    }
})

export const getCurents = (userId) => new Promise(async (resolve, reject) => {
    try {
        // Sử dụng phương thức findByPk để tìm người dùng dựa trên userId
        const user = await db.User.findByPk(userId);

        if (!user) {
            resolve({
                err: -1,
                mess: 'Người dùng không tồn tại',
                user: null
            });
            return;
        }

        // Trả về thông tin người dùng
        resolve({
            err: 0,
            mess: 'Lấy thông tin người dùng thành công',
            user
        });
    } catch (error) {
        reject(error);
    }
});
export const getAllBenhVien = () => new Promise(async (resolve, reject) => {
    try {
        const benhvien = await db.User.findAndCountAll({
            where: {
                role_id: "R2"
            },
        });
        const users = benhvien.rows;
        const counts = benhvien.count;
        // Trả về thông tin người dùng
        resolve({
            err: 0,
            mess: 'Lấy thông tin bệnh viện thành công',
            count: `${counts}`,
            users
        });
    } catch (error) {
        reject(error);
    }
});
export const getAllBacSi = () => new Promise(async (resolve, reject) => {
    try {
        const bacsi = await db.User.findAndCountAll({
            where: {
                role_id: "R3"
            },
        });
        const users = bacsi.rows;
        const counts = bacsi.count;
        // Trả về thông tin người dùng
        resolve({
            err: 0,
            mess: 'Lấy thông tin bác sĩ thành công',
            count: `${counts}`,
            users
        });
    } catch (error) {
        reject(error);
    }
});
export const getAllKhachHang = () => new Promise(async (resolve, reject) => {
    try {
        const khachhang = await db.User.findAndCountAll({
            where: {
                role_id: "R4"
            },
        });
        const users = khachhang.rows;
        const counts = khachhang.count;
        // Trả về thông tin người dùng
        resolve({
            err: 0,
            mess: 'Lấy thông tin khách hàng thành công',
            count: `${counts}`,
            users
        });
    } catch (error) {
        reject(error);
    }
});
export const getAllUser = () => new Promise(async (resolve, reject) => {
    try {
        // Sử dụng phương thức findAll của mô hình User để lấy tất cả người dùng
        const users = await db.User.findAll();

        resolve({
            err: 0,
            mess: 'Lấy thông tin tất cả người dùng thành công',
            users
        });
    } catch (error) {
        reject(error);
    }
});
export const getChuyenKhoa = (id_benhVien) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Sescription.findAndCountAll({
            where: {
                id_benhVien
            },
        });
        // Trả về thông tin người dùng
        const chuyenkhoa = response.rows;
        const counts = response.count;
        resolve({
            err: 0,
            mess: 'Lấy thông tin chuyên khoa thành công',
            count: `${counts}`,
            chuyenkhoa
        });
    } catch (error) {
        reject(error);
    }
});
export const updateUser = async ({ userId, name, newEmail, newPassword, gioiTinh, sdt, diaChi, image, namSinh }) => {
    try {
        const response = await db.User.update(
            {
                name: name || db.sequelize.literal('name'),
                email: newEmail || db.sequelize.literal('email'),
                password: newPassword ? hashPassword(newPassword) : db.sequelize.literal('password'),
                gioiTinh: gioiTinh || db.sequelize.literal('gioiTinh'),
                namSinh: namSinh || db.sequelize.literal('namSinh'),
                sdt: sdt || db.sequelize.literal('sdt'),
                diaChi: diaChi || db.sequelize.literal('diaChi'),
                avatar: image || db.sequelize.literal('avatar'),
            },
            {
                where: { id: userId },
            }
        );

        if (response === 0) {
            return {
                err: 1,
                mess: 'Người dùng không tồn tại',
            };
        }

        return {
            err: 0,
            mess: 'Cập nhật thông tin người dùng thành công',
        };
    } catch (e) {
        throw e;
    }
};

// export const updateUser = ({ userId,name, newEmail, newPassword, image }) => new Promise(async (resolve, reject) => {
//     try {
//         // Tìm người dùng dựa trên userId
//         const user = await db.User.findByPk(userId);
//         if (!user) {
//             resolve({
//                 err: 1,
//                 mess: 'Người dùng không tồn tại'
//             });
//             return;
//         }
//         // Cập nhật thông tin người dùng nếu newEmail hoặc newPassword được cung cấp
//         if (name) {
//             user.name = name;
//         }
//         if (newEmail) {
//             user.email = newEmail;
//         }
//         if (newPassword) {
//             user.password = hashPassword(newPassword);
//         } if (image) {
//             user.avatar = image;
//         }
//         // Lưu các thay đổi vào cơ sở dữ liệu
//         await user.save();

//         resolve({
//             err: 0,
//             mess: 'Cập nhật thông tin người dùng thành công'
//         });
//     } catch (e) {
//         reject(e);
//     }
// });


// Hàm đăng nhập
export const dangNhap = ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { email },
            raw: true
        })


        // check password
        const isChecked = response && bcrypt.compareSync(password, response.password)
        const token = isChecked ? jwt.sign({
            id: response.id,
            email: response.email,
            role_id: response.role_id,
        }, process.env.JWT_SECRET,
            {
                expiresIn: '90d'
            })
            : null
        resolve({
            err: token ? 0 : 1,
            mess: token ? 'Đăng nhập thành công' : response ? 'Mật khẩu sai' : 'Tài khoản chưa được đăng kí',
            'access_token': token ? `${token}` : token
        })
    }
    catch (e) {
        reject(e)
    }
})





const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'quocthangforwork@gmail.com',
        pass: 'gtovgcshoqnolyao',
    },
});

// Hàm gửi email để quên mật khẩu
export const forgotPassword = async (email) => {
    const token = crypto.randomBytes(20).toString('hex');
    const user = await db.User.findOne({ where: { email } });
    let errorMessage = null; // Khởi tạo errorMessage là null
    if (user) {
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 900000; // Token hết hạn sau 15p
        await user.save();

        const resetLink = process.env.URL_SERVER + `/api/v1/auth/reset-password/${token}`;
        const mailOptions = {
            from: 'medpro@gmail.com',
            to: email,
            subject: 'Đặt lại mật khẩu',
            html: `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. ${resetLink}`
        };

        await transporter.sendMail(mailOptions);
    } else {
        throw errorMessage = 'Người dùng không tồn tại.';
    }
    return errorMessage;
};

// Hàm đặt lại mật khẩu
export const resetPassword = async (token, newPassword) => {

    const user = await db.User.findOne({
        where: {
            resetToken: token,
            resetTokenExpiry: { [Sequelize.Op.gt]: Date.now() },
        },
    });

    if (user) {
        const saltRounds = 10; // Số lượng vòng lặp hash (tùy chọn)
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();
    } else {
        throw new Error('Token không hợp lệ hoặc đã hết hạn.');
    }
};



export const themChuyenKhoa = ({ name, description, id_benhVien }) => new Promise(async (resolve, reject) => {
    try {
        const specialization = await db.Sescription.create({
            name,
            description
        });
        if (id_benhVien) {
            const benhVien = await db.User.findByPk(id_benhVien);

            if (benhVien) {
                // Liên kết chuyên khoa với bệnh viện
                await specialization.update({ id_benhVien: id_benhVien });
            }
        }

        resolve({
            err: false, // Không có lỗi
            mess: 'Đăng ký thành công',
        });
    } catch (error) {
        reject(error);
    }
});

export const themBacSi = ({ name, email, password ,gioiTinh,sdt,diaChi,namSinh,role_id,id_chuyenKhoa,avatar }) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.User.findOrCreate({
            where: { email },
            defaults: {
                name, 
                email, 
                password: hashPassword(password),
                gioiTinh,
                sdt,
                diaChi,
                namSinh,
                role_id,
                avatar
            },
        });
        if (id_chuyenKhoa) {
            const chuyenKhoa = await db.Sescription.findByPk(id_chuyenKhoa);

            if (chuyenKhoa) {
                // Liên kết người dùng với chuyên khoa
                await user[0].update({ id_chuyenKhoa: id_chuyenKhoa });
            }
        }

        resolve({
            err: !user[1], // Nếu người dùng đã tồn tại, user[1] sẽ là false, ngược lại là true
            mess: user[1] ? 'Đăng ký thành công' : 'Tài khoản đã tồn tại',
        });

    }
    catch (e) {
        reject(e)
    }
})