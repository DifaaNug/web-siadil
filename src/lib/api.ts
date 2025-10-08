/**
 * API Utility Functions
 * Fungsi helper untuk melakukan request ke API dengan access token
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://sso.pupuk-kujang.co.id";

/**
 * Generic API request helper dengan automatic token injection
 * @param endpoint - API endpoint path (contoh: "/documents", "/archives")
 * @param accessToken - Access token dari session
 * @param options - Fetch options (method, body, headers, etc.)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiRequest<T = any>(
  endpoint: string,
  accessToken: string | undefined,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Tambahkan Authorization header jika ada access token
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `API Error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}

/**
 * GET request
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiGet<T = any>(
  endpoint: string,
  accessToken: string | undefined
): Promise<T> {
  return apiRequest<T>(endpoint, accessToken, {
    method: "GET",
  });
}

/**
 * POST request
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiPost<T = any>(
  endpoint: string,
  accessToken: string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any
): Promise<T> {
  return apiRequest<T>(endpoint, accessToken, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * PUT request
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiPut<T = any>(
  endpoint: string,
  accessToken: string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any
): Promise<T> {
  return apiRequest<T>(endpoint, accessToken, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

/**
 * DELETE request
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiDelete<T = any>(
  endpoint: string,
  accessToken: string | undefined
): Promise<T> {
  return apiRequest<T>(endpoint, accessToken, {
    method: "DELETE",
  });
}

/**
 * Upload file dengan FormData
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiUploadFile<T = any>(
  endpoint: string,
  accessToken: string | undefined,
  formData: FormData
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {};

  // Tambahkan Authorization header jika ada access token
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData, // FormData tidak perlu Content-Type header
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Upload Error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
}

// ============================================
// CONTOH PENGGUNAAN:
// ============================================

/**
 * Example: Fetch documents dari API
 *
 * const { data: session } = useSession();
 * const accessToken = session?.accessToken;
 *
 * try {
 *   const documents = await apiGet("/api/documents", accessToken);
 *   console.log("Documents:", documents);
 * } catch (error) {
 *   console.error("Failed to fetch documents:", error);
 * }
 */

/**
 * Example: Create new document
 *
 * const newDocument = {
 *   title: "Document Title",
 *   description: "Document Description",
 *   archiveId: "archive-123"
 * };
 *
 * try {
 *   const result = await apiPost("/api/documents", accessToken, newDocument);
 *   console.log("Document created:", result);
 * } catch (error) {
 *   console.error("Failed to create document:", error);
 * }
 */

/**
 * Example: Upload file
 *
 * const formData = new FormData();
 * formData.append("file", fileInput.files[0]);
 * formData.append("title", "My Document");
 * formData.append("archiveId", "archive-123");
 *
 * try {
 *   const result = await apiUploadFile("/api/documents/upload", accessToken, formData);
 *   console.log("File uploaded:", result);
 * } catch (error) {
 *   console.error("Failed to upload file:", error);
 * }
 */
