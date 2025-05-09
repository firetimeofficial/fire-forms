import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/types";

// Use environment variables directly
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({
    req,
    res,
    supabaseUrl: supabaseUrl,
    supabaseKey: supabaseAnonKey,
  });

  const session = await supabase.auth.getUser(); // Adjust based on Supabase version

  // Handle form submissions
  if (req.nextUrl.pathname.startsWith("/form/") && req.method === "POST") {
    const formId = req.nextUrl.pathname.split("/")[2];

    // Check if multiple submissions are allowed
    const { data: form } = await supabase
      .from("forms")
      .select("allow_multiple_submissions")
      .eq("id", formId)
      .single();

    if (form && !form.allow_multiple_submissions) {
      // Set cookie to prevent multiple submissions
      const response = NextResponse.next();
      response.cookies.set(`form_${formId}_submitted`, "true", {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
      });
      return response;
    }
  }

  // Redirect to login if accessing admin pages without session
  if (req.nextUrl.pathname.startsWith("/admin") && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/form/:path*"],
};
