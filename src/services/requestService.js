import pool from '../config/database.js';

class RequestService {
  // GET /api/v1/request-status/:id
  async getRequestById(requestId) {
    const query = `
      SELECT 
        r.id,
        r.created_by AS user_id,
        r.title,
        r.description,
        r.request_type,
        r.status,
        r.created_at,
        r.updated_at,
        u.name AS requester_name,
        u.email AS requester_email,
        (
          SELECT al.created_at 
          FROM approval_logs al 
          WHERE al.request_id = r.id 
          AND al.action IN ('approved','rejected')
          ORDER BY al.created_at DESC 
          LIMIT 1
        ) AS approval_date
      FROM requests r
      INNER JOIN users u ON r.created_by = u.id
      WHERE r.id = ?
    `;

    const [rows] = await pool.execute(query, [requestId]);
    if (rows.length === 0) return null;

    const r = rows[0];

    return {
      id: r.id,
      title: r.title,
      description: r.description,
      type: r.request_type,
      status: r.status,
      requester: {
        id: r.user_id,
        name: r.requester_name,
        email: r.requester_email
      },
      approval_date: r.approval_date,
      created_at: r.created_at,
      updated_at: r.updated_at
    };
  }

  // GET /api/v1/request-list?user_id=...
  async getRequestsByUserId({ userId }) {
    const query = `
      SELECT 
        r.id,
        r.title,
        r.request_type,
        r.status,
        r.created_at,
        r.updated_at,
        (
          SELECT al.created_at 
          FROM approval_logs al 
          WHERE al.request_id = r.id 
          AND al.action IN ('approved','rejected')
          ORDER BY al.created_at DESC 
          LIMIT 1
        ) AS approval_date
      FROM requests r
      WHERE r.created_by = ?
      ORDER BY r.created_at DESC
    `;

    const [rows] = await pool.execute(query, [userId]);
    return rows.map(r => ({
      id: r.id,
      title: r.title,
      type: r.request_type,
      status: r.status,
      approval_date: r.approval_date,
      created_at: r.created_at,
      updated_at: r.updated_at
    }));
  }
}

export default new RequestService();
