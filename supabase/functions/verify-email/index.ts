import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const userId = url.searchParams.get('userId');

    if (!token || !userId) {
      return new Response(
        "Missing token or userId parameter",
        {
          status: 400,
          headers: { "Content-Type": "text/plain", ...corsHeaders },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify the token
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('email_verification_token, email_verification_sent_at')
      .eq('id', userId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch profile: ${fetchError.message}`);
    }

    if (!profile || profile.email_verification_token !== token) {
      return new Response(
        "Invalid verification token",
        {
          status: 400,
          headers: { "Content-Type": "text/plain", ...corsHeaders },
        }
      );
    }

    // Check if token is expired (24 hours)
    const sentAt = new Date(profile.email_verification_sent_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - sentAt.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      return new Response(
        "Verification token has expired",
        {
          status: 400,
          headers: { "Content-Type": "text/plain", ...corsHeaders },
        }
      );
    }

    // Mark email as verified
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        email_verified: true,
        email_verification_token: null,
        email_verification_sent_at: null
      })
      .eq('id', userId);

    if (updateError) {
      throw new Error(`Failed to update profile: ${updateError.message}`);
    }

    // Redirect to success page
    const redirectUrl = `${Deno.env.get("SUPABASE_URL")?.replace('/rest/v1', '')}/auth?verified=true`;
    
    return new Response(null, {
      status: 302,
      headers: {
        "Location": redirectUrl,
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in verify-email function:", error);
    return new Response(
      `Verification failed: ${error.message}`,
      {
        status: 500,
        headers: { "Content-Type": "text/plain", ...corsHeaders },
      }
    );
  }
};

serve(handler);