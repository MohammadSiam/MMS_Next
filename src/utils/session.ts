"use client";
export const getToken = (): string | null => {
  return sessionStorage.getItem("token");
};

export const decodeToken = (token: string): any | null => {
  try {
    const parts = token.split(".");
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const getUserIdFromToken = (token: string): string | null => {
  const payload = decodeToken(token);
  return payload ? payload.userId : null;
};

export const getRoleFromToken = (token: string): string | null => {
  try {
    const decodedToken: any = decodeToken(token);
    // console.log(decodedToken.role);
    return decodedToken.role || null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const setToken = (token: string) => {
  sessionStorage.setItem("token", token);
};

export const removeToken = () => {
  sessionStorage.removeItem("token");
};

export const redirectUserBasedOnRole = (role: string, router: any) => {
  if (role === "super admin" || role === "admin") {
    router.push("/admin/dashboard");
  } else {
    router.push("/meetingList");
  }
};

export const redirectToLoginIfNoToken = (router: any) => {
  const token = getToken();
  if (!token) {
    router.push("/Login");
    return false;
  }
  return true;
};
