import requestService from '../services/requestService.js';
import { successResponse, errorResponse } from '../utils/response.js';

class RequestController {
  async getRequestStatus(req, res, next) {
    try {
      const { id } = req.params;
      const data = await requestService.getRequestById(id);

      if (!data) return errorResponse(res, 'Request tidak ditemukan', 404);

      return successResponse(res, data, 'Data request berhasil diambil');
    } catch (err) {
      next(err);
    }
  }

  async getRequestList(req, res, next) {
    try {
      const { user_id } = req.query;
      if (!user_id) return errorResponse(res, 'Parameter user_id wajib diisi', 400);

      const data = await requestService.getRequestsByUserId({ userId: user_id });
      return successResponse(res, data, 'Daftar request berhasil diambil');
    } catch (err) {
      next(err);
    }
  }
}

export default new RequestController();
