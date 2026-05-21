import ky from "ky";

import { apiBaseUrl } from "@/constants/config/base-url";

// 백엔드 API 호출에 공통으로 사용할 ky 인스턴스입니다.
export const apiClient = ky.create({
  prefix: apiBaseUrl,
  timeout: 10000,
});
