/**
 * API Service - Centraliza todas as chamadas ao backend
 * Integração com NestJS backend
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface LoginRequest {
  username: string;
  password: string;
  loginType?: string;
}

interface PunchRequest {
  userId: string;
  punchType: "ENTRADA" | "INTERVALO" | "RETORNO" | "SAIDA";
  location?: {
    latitude: number;
    longitude: number;
  };
  photo?: string;
  notes?: string;
  attachmentUrl?: string;
}

interface TimeRecord {
  id: string;
  userId: string;
  userName: string;
  punchType: string;
  timestamp: string;
  location?: any;
  photo?: string;
  notes?: string;
  status: string;
  createdAt: string;
}

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  category?: string;
  active: boolean;
  createdAt: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "WARNING" | "ALERT" | "SUCCESS";
  userId?: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

class ApiService {
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem("auth_token");

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      // Verificar se a resposta é JSON antes de fazer parse
      const contentType = response.headers.get("content-type");
      const isJson = contentType?.includes("application/json");

      // Se não for JSON ou se for erro de rede, retornar erro apropriado
      if (!isJson) {
        const text = await response.text();
        if (!response.ok) {
          throw new Error(
            response.status === 503
              ? "Serviço indisponível. O backend pode estar offline."
              : `Erro ${response.status}: ${text || response.statusText}`
          );
        }
        // Se for sucesso mas não JSON, retornar texto como data
        return { success: true, data: text as any };
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro na requisição");
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      // Não logar erros repetitivos de conexão
      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        return {
          success: false,
          error:
            "Não foi possível conectar ao servidor. Verifique sua conexão.",
        };
      }

      // Apenas logar se não for erro 503 conhecido
      if (
        !(
          error instanceof Error &&
          error.message.includes("Serviço indisponível")
        )
      ) {
        console.error("API Error:", error);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  // ==================== AUTENTICAÇÃO ====================

  async login(
    credentials: LoginRequest
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async validateToken(): Promise<ApiResponse<User>> {
    return this.request("/auth/validate");
  }

  async logout(): Promise<ApiResponse> {
    localStorage.removeItem("auth_token");
    return { success: true };
  }

  // ==================== USUÁRIOS ====================

  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request("/users");
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request(`/users/${id}`);
  }

  async updateUserProfile(
    id: string,
    data: Partial<User>
  ): Promise<ApiResponse<User>> {
    return this.request(`/users/${id}/profile`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse> {
    return this.request(`/users/${id}`, {
      method: "DELETE",
    });
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<ApiResponse> {
    return this.request("/users/change-password", {
      method: "POST",
      body: JSON.stringify({ userId, oldPassword, newPassword }),
    });
  }

  // ==================== REGISTROS DE PONTO ====================

  async registerPunch(
    punchData: PunchRequest
  ): Promise<ApiResponse<TimeRecord>> {
    return this.request("/time-records/punch", {
      method: "POST",
      body: JSON.stringify(punchData),
    });
  }

  async getUserTimeRecords(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<TimeRecord[]>> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.request(`/time-records/user/${userId}${query}`);
  }

  async getAllTimeRecords(filters?: {
    startDate?: string;
    endDate?: string;
    userId?: string;
    status?: string;
  }): Promise<ApiResponse<TimeRecord[]>> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    if (filters?.userId) params.append("userId", filters.userId);
    if (filters?.status) params.append("status", filters.status);

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.request(`/time-records/all${query}`);
  }

  async getTodayStats(): Promise<ApiResponse<any>> {
    return this.request("/time-records/stats/today");
  }

  async approveTimeRecord(
    recordId: string,
    approverId: string,
    notes?: string
  ): Promise<ApiResponse> {
    return this.request("/time-records/approve", {
      method: "POST",
      body: JSON.stringify({ recordId, approverId, notes }),
    });
  }

  async rejectTimeRecord(
    recordId: string,
    approverId: string,
    reason: string
  ): Promise<ApiResponse> {
    return this.request("/time-records/reject", {
      method: "POST",
      body: JSON.stringify({ recordId, approverId, reason }),
    });
  }

  // ==================== NOTIFICAÇÕES ====================

  async getNotifications(
    userId?: string
  ): Promise<ApiResponse<Notification[]>> {
    const endpoint = userId
      ? `/notifications/user/${userId}`
      : "/notifications";

    const result = await this.request<Notification[]>(endpoint);

    // Se o backend estiver offline, retornar array vazio ao invés de erro
    // Isso evita loops de erro no console
    if (!result.success && result.error?.includes("Serviço indisponível")) {
      return {
        success: true,
        data: [],
        message: "Backend offline - usando cache local",
      };
    }

    return result;
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse> {
    return this.request(`/notifications/${notificationId}/read`, {
      method: "PUT",
    });
  }

  async markAllNotificationsAsRead(userId: string): Promise<ApiResponse> {
    return this.request("/notifications/mark-all-read", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
  }

  async createNotification(notificationData: {
    title: string;
    message: string;
    type: "INFO" | "WARNING" | "ALERT" | "SUCCESS";
    userId?: string;
    actionUrl?: string;
  }): Promise<ApiResponse<Notification>> {
    return this.request("/notifications", {
      method: "POST",
      body: JSON.stringify(notificationData),
    });
  }

  async deleteNotification(notificationId: string): Promise<ApiResponse> {
    return this.request(`/notifications/${notificationId}`, {
      method: "DELETE",
    });
  }

  // ==================== ESCALAS ====================

  async getShifts(
    userId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.request(`/shifts${query}`);
  }

  async createShift(shiftData: any): Promise<ApiResponse<any>> {
    return this.request("/shifts", {
      method: "POST",
      body: JSON.stringify(shiftData),
    });
  }

  async updateShift(
    shiftId: string,
    shiftData: any
  ): Promise<ApiResponse<any>> {
    return this.request(`/shifts/${shiftId}`, {
      method: "PUT",
      body: JSON.stringify(shiftData),
    });
  }

  async deleteShift(shiftId: string): Promise<ApiResponse> {
    return this.request(`/shifts/${shiftId}`, {
      method: "DELETE",
    });
  }

  async confirmShift(shiftId: string, userId: string): Promise<ApiResponse> {
    return this.request("/shifts/confirm", {
      method: "POST",
      body: JSON.stringify({ shiftId, userId }),
    });
  }

  // ==================== RELATÓRIOS ====================

  async generateReport(
    reportType: string,
    filters: any
  ): Promise<ApiResponse<any>> {
    return this.request("/reports/generate", {
      method: "POST",
      body: JSON.stringify({ reportType, filters }),
    });
  }

  async exportReport(
    reportType: string,
    format: "pdf" | "excel",
    filters: any
  ): Promise<ApiResponse<Blob>> {
    const response = await fetch(`${API_URL}/reports/export`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: JSON.stringify({ reportType, format, filters }),
    });

    if (!response.ok) {
      return { success: false, error: "Erro ao exportar relatório" };
    }

    const blob = await response.blob();
    return { success: true, data: blob };
  }

  // ==================== LOGS DE AUDITORIA ====================

  async getAuditLogs(filters?: {
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (filters?.userId) params.append("userId", filters.userId);
    if (filters?.action) params.append("action", filters.action);
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.request(`/audit-logs${query}`);
  }

  // ==================== UPLOAD DE ARQUIVOS ====================

  async uploadFile(
    file: File,
    metadata?: any
  ): Promise<ApiResponse<{ url: string; fileId: string }>> {
    const formData = new FormData();
    formData.append("file", file);
    if (metadata) {
      formData.append("metadata", JSON.stringify(metadata));
    }

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_URL}/files/upload`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro no upload");
      }

      return { success: true, data };
    } catch (error) {
      console.error("Upload Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro no upload",
      };
    }
  }

  async deleteFile(fileId: string): Promise<ApiResponse> {
    return this.request(`/files/${fileId}`, {
      method: "DELETE",
    });
  }

  // ==================== RECUPERAÇÃO DE SENHA ====================

  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<ApiResponse> {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    });
  }

  async verifyResetCode(code: string, email: string): Promise<ApiResponse> {
    return this.request("/auth/verify-reset-code", {
      method: "POST",
      body: JSON.stringify({ code, email }),
    });
  }

  // ==================== UPLOADS ====================

  async uploadFile(
    file: File,
    userId?: string,
    description?: string
  ): Promise<
    ApiResponse<{
      file: {
        id: string;
        filename: string;
        originalName: string;
        url: string;
        size: number;
        mimetype: string;
      };
    }>
  > {
    const formData = new FormData();
    formData.append("file", file);
    if (userId) formData.append("userId", userId);
    if (description) formData.append("description", description);

    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(`${API_URL}/uploads`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || "Erro ao fazer upload",
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Erro no upload:", error);
      return {
        success: false,
        error: "Erro ao fazer upload do arquivo",
      };
    }
  }

  // ==================== PUSH NOTIFICATIONS ====================

  async getVapidPublicKey(): Promise<{ publicKey: string }> {
    const response = await this.request("/push/public-key");
    if (response.success && response.data) {
      return response.data as { publicKey: string };
    }
    throw new Error("Falha ao obter chave pública VAPID");
  }

  async subscribePush(
    userId: string,
    subscription: PushSubscription
  ): Promise<ApiResponse> {
    return this.request("/push/subscribe", {
      method: "POST",
      body: JSON.stringify({
        userId,
        subscription: subscription.toJSON(),
      }),
    });
  }

  async unsubscribePush(
    userId: string,
    endpoint: string
  ): Promise<ApiResponse> {
    return this.request(`/push/unsubscribe/${userId}`, {
      method: "DELETE",
      body: JSON.stringify({ endpoint }),
    });
  }

  async testPushNotification(userId: string): Promise<ApiResponse> {
    return this.request(`/push/test/${userId}`, {
      method: "POST",
    });
  }

  // ==================== HEALTH CHECK ====================

  async healthCheck(): Promise<ApiResponse> {
    return this.request("/");
  }
}

export const apiService = new ApiService();
export type {
  ApiResponse,
  LoginRequest,
  PunchRequest,
  TimeRecord,
  User,
  Notification,
};
