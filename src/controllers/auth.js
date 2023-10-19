import * as services from '../sevices'

export const dangKi = async (req, res) => {
    try {
        const fileData = req.file;
        // Lấy thông tin từ request body hoặc request params
        const avatar = fileData?.path;
        const {name, email, password ,gioiTinh,sdt,diaChi,namSinh,role_id,} = req.body
        if (!name || !email || !password ||!sdt || !diaChi) return res.status(400).json({
            err: 1,
            mess: "Điền đầy đủ thông tin"
        })
        const response = await services.dangKi({name,email,password,gioiTinh,sdt,diaChi,namSinh,role_id,avatar})

        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(500).json({
            err: -1,
            mess: "Loi sever"
        })
    }
}

export const dangNhap = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) return res.status(400).json({
            err: 1,
            mess: "Chua nhap email hoac mat khau"
        })
        const response = await services.dangNhap(req.body)

        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(500).json({
            err: -1,
            mess: "Loi sever"
        })
    }
}


export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        await services.forgotPassword(email);
        res.status(200).json({
            err: 1,
            message: 'Bạn hãy vào email để xác thực cấp lại mật khẩu !!!!'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            err: -1,
            message: 'Tài khoản không tồn tại!!!'
        });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        await services.resetPassword(token, newPassword);
        res.status(200).json({ message: 'Mật khẩu đã được đặt lại.' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};
export const renderResetPasswordPage = (req, res) => {
    // Hiển thị trang HTML đặt lại mật khẩu cho người dùng
    res.sendFile(__dirname + '/reset-password.html');
};


// Controller để lấy thông tin người dùng
export const getCurent = async (req, res) => {
    try {
        // Lấy userId từ request params hoặc request query
        const { userId } = req.params;
        // Gọi hàm lấy thông tin người dùng từ service
        const result = await services.getCurents(userId);

        // Trả về kết quả cho client
        if (result.err === 0) {
            res.status(200).json({ message: result.mess, user: result.user });
        } else {
            res.status(404).json({ message: result.mess, user: null });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', user: null });
    }
};


// Controller để cập nhật thông tin người dùng
export const updateUserController = async (req, res) => {
    try {
        const fileData = req.file;
        // Lấy thông tin từ request body hoặc request params
        const image = fileData?.path;
        const userId = req.params.userId;
        const {name, newEmail, newPassword, gioiTinh,sdt,diaChi,namSinh} = req.body;
        // Gọi hàm cập nhật thông tin người dùng từ service
        const result = await services.updateUser({ userId,name, newEmail, newPassword,namSinh,gioiTinh,sdt,diaChi ,image});

        // Trả về kết quả cho client
        if (result.err === 0) {
            res.status(200).json({ message: result.mess });
        } else {
            res.status(400).json({ message: result.mess });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
// Controller để lấy tất cả thông tin người dùng
export const getAllUsers = async (req, res) => {
    try {
        // Gọi hàm lấy tất cả thông tin người dùng từ service
        const result = await services.getAllUser();

        // Trả về kết quả cho client
        if (result.err === 0) {
            res.status(200).json({ message: result.mess, users: result.users });
        } else {
            res.status(500).json({ message: result.mess, users: null });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', users: null });
    }
};
// Controller để lấy tất cả thông tin người dùng
export const getAllBenhViens = async (req, res) => {
    try {
        // Gọi hàm lấy tất cả thông tin người dùng từ service
        const result = await services.getAllBenhVien();

        // Trả về kết quả cho client
        if (result.err === 0) {
            res.status(200).json({ message: result.mess,  count: result.count,users: result.users });
        } else {
            res.status(500).json({ message: result.mess, users: null });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', users: null });
    }
};




export const themMoiChuyenKhoa = async (req, res) => {
    try {
        const { id_benhVien } = req.params;
        const {name,description} = req.body
        if (!name) return res.status(400).json({
            err: 1,
            mess: "Điền đầy đủ thông tin"
        })
        const response = await services.themChuyenKhoa({name,description,id_benhVien})

        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(500).json({
            err: -1,
            mess: "Loi sever"
        })
    }
}


export const themMoiBacSi = async (req, res) => {
    try {
        const { id_chuyenKhoa } = req.params;
        const fileData = req.file;
        const avatar = fileData?.path;
        const {name, email, password ,gioiTinh,sdt,diaChi,namSinh,role_id,description} = req.body
        if (!name) return res.status(400).json({
            err: 1,
            mess: "Điền đầy đủ thông tin"
        })
        const response = await services.themBacSi({name, email, password ,gioiTinh,sdt,diaChi,namSinh,role_id,description,id_chuyenKhoa,avatar})

        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(500).json({
            err: -1,
            mess: "Loi sever"
        })
    }
}



export const getChuyenKhoas = async (req, res) => {
    try {
        // Lấy userId từ request params hoặc request query
        const { id_benhVien } = req.params;
        // Gọi hàm lấy thông tin người dùng từ service
        const result = await services.getChuyenKhoa(id_benhVien);

        // Trả về kết quả cho client
        if (result.err === 0) {
            res.status(200).json({message: result.mess,  count: result.count,chuyenkhoa: result.chuyenkhoa });
        } else {
            res.status(404).json({message: result.mess,  count: result.count,chuyenkhoa: result.chuyenkhoa });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', user: null });
    }
};







