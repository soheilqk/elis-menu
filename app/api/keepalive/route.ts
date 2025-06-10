// app/api/keepalive/route.ts
import { createClient } from "@supabase/supabase-js";

export async function GET(): Promise<Response> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return new Response(
      JSON.stringify({
        error: "Missing required environment variables",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    // Simple query to keep database active
    const res = await supabase.from("categories").select("title");
    console.log(res.data);
    return new Response(
      JSON.stringify({
        message: "Database pinged successfully",
        categories: res.data?.map((category) => category.title),
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({
        error: "Failed to ping database",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
