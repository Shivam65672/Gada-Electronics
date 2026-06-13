import { NextResponse } from "next/server";

export function apiSuccess(data, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function handleApiError(error) {
  console.error("API Error:", error);
  if (error instanceof Error) {
    return apiError(error.message, 500);
  }
  return apiError("Internal server error", 500);
}
