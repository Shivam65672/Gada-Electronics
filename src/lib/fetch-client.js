"use client";

export async function fetchApi(url, options) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error || "Something went wrong");
  }

  return json.data;
}

export function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}
