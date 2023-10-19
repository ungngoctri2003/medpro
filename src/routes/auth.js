import * as controller from '../controllers'
import express from 'express'
import uploadCloud  from '../mid/cloudinary-upload';
const router = express.Router();

router.post('/' ,uploadCloud.single('image'),controller.dangKi)
router.post('/login' ,controller.dangNhap)
// Định tuyến cho yêu cầu quên mật khẩu
router.post('/forgot-password', controller.forgotPassword);

// Định tuyến cho yêu cầu đặt lại mật khẩu
router.get('/reset-password/:token', controller.renderResetPasswordPage);
router.post('/reset-password/:token', controller.resetPassword);
router.get('/getCurent/:userId', controller.getCurent);
router.get('/getAllUser', controller.getAllUsers);
router.get('/getAllBenhVien', controller.getAllBenhViens);
router.post('/updateUser/:userId', uploadCloud.single('image'),controller.updateUserController);
router.post('/themchuyenkhoa/:id_benhVien', controller.themMoiChuyenKhoa);
router.post('/thembacsi/:id_chuyenKhoa',uploadCloud.single("image"), controller.themMoiBacSi);
router.get('/chuyenkhoa/:id_benhVien', controller.getChuyenKhoas);

module.exports = router