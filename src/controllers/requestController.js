import requestService from '../services/requestService.js';
import { successResponse, errorResponse } from '../utils/response.js';

class RequestController {
  async getRequestStatus(req, res, next) {
    try {
      const requestId = req.params.id;
      const data = await requestService.getRequestById(requestId);
      
      if (!data) {
        return errorResponse(res, 'Request tidak ditemukan', 404);
      }
      
      return successResponse(res, data, 'Request berhasil diambil');
    } catch (error) {
      next(error);
    }
  }

  async getRequestList(req, res, next) {
    try {
      const { user_id, page, limit, status } = req.query;
      
      if (!user_id) {
        return errorResponse(res, 'Parameter user_id diperlukan', 400);
      }
      
      const data = await requestService.getRequestsByUserId({
        userId: user_id,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        status: status
      });
      
      return successResponse(res, data, 'Daftar request berhasil diambil');
    } catch (error) {
      next(error);
    }
  }
}

export default new RequestController();