import ky from "ky";

import { apiBaseUrl } from "@/constants/config/base-url";

// 백엔드 API 호출에 공통으로 사용할 ky 인스턴스입니다.
export const apiClient = ky.create({
  prefix: apiBaseUrl,
  timeout: 10000,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        if (typeof window === "undefined") {
          return;
        }

        const accessToken = localStorage.getItem("festival_auth_token");

        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
  },
});
