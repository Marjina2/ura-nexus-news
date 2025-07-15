import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  email: string;
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { email, userId }: VerificationRequest = await req.json();

    // Generate verification token
    const verificationToken = crypto.randomUUID();
    const verificationUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/verify-email?token=${verificationToken}&userId=${userId}`;

    // Update user profile with verification token
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        email_verification_token: verificationToken,
        email_verification_sent_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      throw new Error(`Failed to update profile: ${updateError.message}`);
    }

    // Here you would typically send an email using a service like Resend
    // For now, we'll just return the verification URL for testing
    console.log(`Verification email would be sent to ${email}`);
    console.log(`Verification URL: ${verificationUrl}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Verification email sent successfully",
        // Remove this in production - only for testing
        verificationUrl: verificationUrl
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-verification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);