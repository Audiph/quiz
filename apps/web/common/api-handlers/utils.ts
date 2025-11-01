import { ApiMethod, ErrorResponse } from '../types/api';

type RequestBody = object | FormData | string;

interface ApiRequestOptions {
  path: string;
  method: ApiMethod;
  token?: string;
  body?: RequestBody;
  params?: URLSearchParams;
  headers?: Record<string, string>;
  cache?: RequestCache;
  tags?: Array<string>;
  responseType?: 'json' | 'text' | 'void' | 'base64';
}

async function sanitiseError(response: Response): Promise<ErrorResponse> {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const errorData = await response.json();
    return {
      error: errorData.error || 'API Error',
      message: errorData.message || `Request failed with status ${response.status}`,
      details: errorData.details || { status: response.status, statusText: response.statusText },
    };
  }

  return {
    error: 'Request Failed',
    message: `Request failed with status ${response.status}: ${response.statusText}`,
    details: { status: response.status, statusText: response.statusText },
  };
}

async function apiRequest<T>({
  path,
  method,
  token,
  body,
  params,
  headers = {},
  cache = 'default',
  tags,
  responseType = 'json',
}: ApiRequestOptions): Promise<T | ErrorResponse> {
  const baseUrl = process.env.API_URL || 'http://localhost:8787';

  const buildFullUrl = (baseUrl: string, path: string, params?: URLSearchParams): string => {
    const url = new URL(path, baseUrl);
    if (params) {
      params.forEach((value, key) => url.searchParams.append(key, value));
    }

    return url.toString();
  };

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  if (body instanceof FormData) {
    delete requestHeaders['Content-Type'];
  }

  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
    cache,
  };
  if (body) {
    fetchOptions.body = body instanceof FormData ? body : JSON.stringify(body);
  }
  if (tags && tags.length > 0) {
    fetchOptions.next = { tags };
  }
  const response = await fetch(buildFullUrl(baseUrl, path, params), fetchOptions);
  if (!response.ok) return sanitiseError(response);
  if (responseType === 'void') return {} as T;
  if (responseType === 'text') return (await response.text()) as T;
  if (responseType === 'base64') return response.blob() as T;
  const result = (await response.json()) as Promise<T>;
  return result;
}

export interface ApiOptions extends Omit<ApiRequestOptions, 'method' | 'params'> {
  params?: URLSearchParams | Record<string, string | number | boolean> | string[][];
}

function createURLSearchParams(
  params: URLSearchParams | Record<string, string | number | boolean> | string[][],
): URLSearchParams {
  if (params instanceof URLSearchParams) {
    return params;
  }
  if (Array.isArray(params)) {
    return new URLSearchParams(params);
  }
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });
  return searchParams;
}

export async function getApi<T>(options: ApiOptions): Promise<T | ErrorResponse> {
  const { params, ...rest } = options;
  return apiRequest<T>({
    ...rest,
    method: ApiMethod.Get,
    params: params ? createURLSearchParams(params) : undefined,
  });
}

export async function postApi<T>(options: ApiOptions): Promise<T | ErrorResponse> {
  const { params, ...rest } = options;
  return apiRequest<T>({
    ...rest,
    method: ApiMethod.Post,
    params: params ? createURLSearchParams(params) : undefined,
  });
}

export async function putApi<T>(options: ApiOptions): Promise<T | ErrorResponse> {
  const { params, ...rest } = options;
  return apiRequest<T>({
    ...rest,
    method: ApiMethod.Put,
    params: params ? createURLSearchParams(params) : undefined,
  });
}

export async function deleteApi<T>(options: ApiOptions): Promise<T | ErrorResponse> {
  const { params, ...rest } = options;
  return apiRequest<T>({
    ...rest,
    method: ApiMethod.Delete,
    params: params ? createURLSearchParams(params) : undefined,
  });
}
