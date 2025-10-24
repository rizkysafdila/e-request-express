import pool from '../config/database.js';

class RequestService {
  async getRequestById(requestId) {
    const query = `
      SELECT 
        r.id,
        r.user_id,
        r.title,
        r.description,
        r.status,
        r.created_at,
        r.updated_at,
        u.name as requester_name,
        u.email as requester_email,
        a.approved_by,
        a.approved_at,
        a.approval_notes,
        approver.name as approver_name
      FROM requests r
      INNER JOIN users u ON r.user_id = u.id
      LEFT JOIN approvals a ON r.id = a.request_id
      LEFT JOIN users approver ON a.approved_by = approver.id
      WHERE r.id = ?
    `;

    const [rows] = await pool.execute(query, [requestId]);

    if (rows.length === 0) {
      return null;
    }

    const request = rows[0];

    return {
      id: request.id,
      title: request.title,
      description: request.description,
      status: request.status,
      requester: {
        id: request.user_id,
        name: request.requester_name,
        email: request.requester_email
      },
      approval: request.approved_at ? {
        approved_by: request.approved_by,
        approver_name: request.approver_name,
        approved_at: request.approved_at,
        notes: request.approval_notes
      } : null,
      created_at: request.created_at,
      updated_at: request.updated_at
    };
  }

  async getRequestsByUserId({ userId, page, limit, status }) {
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        r.id,
        r.title,
        r.description,
        r.status,
        r.created_at,
        r.updated_at,
        a.approved_by,
        a.approved_at,
        approver.name as approver_name
      FROM requests r
      LEFT JOIN approvals a ON r.id = a.request_id
      LEFT JOIN users approver ON a.approved_by = approver.id
      WHERE r.user_id = ?
    `;

    const queryParams = [userId];

    if (status) {
      query += ' AND r.status = ?';
      queryParams.push(status);
    }

    query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    const [rows] = await pool.execute(query, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM requests WHERE user_id = ?';
    const countParams = [userId];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    return {
      requests: rows.map(request => ({
        id: request.id,
        title: request.title,
        description: request.description,
        status: request.status,
        approval: request.approved_at ? {
          approved_by: request.approved_by,
          approver_name: request.approver_name,
          approved_at: request.approved_at
        } : null,
        created_at: request.created_at,
        updated_at: request.updated_at
      })),
      pagination: {
        current_page: page,
        per_page: limit,
        total: total,
        total_pages: Math.ceil(total / limit)
      }
    };
  }
}

export default new RequestService();