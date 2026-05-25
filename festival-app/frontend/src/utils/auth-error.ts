import { HTTPError } from "ky";

export async function getAuthErrorMessage(error: unknown) {
  if (error instanceof HTTPError) {
    const body = (await error.response.json().catch(() => null)) as { message?: string } | null;
    return body?.message ?? "요청을 처리하지 못했습니다.";
  }

  return "네트워크 상태를 확인해주세요.";
}
