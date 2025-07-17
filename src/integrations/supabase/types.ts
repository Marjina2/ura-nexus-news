export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_generated_articles: {
        Row: {
          author: string | null
          auto_generated: boolean | null
          category: string
          content: string
          country: string
          created_at: string
          generation_batch_id: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          next_generation_time: string | null
          published_at: string
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author?: string | null
          auto_generated?: boolean | null
          category: string
          content: string
          country?: string
          created_at?: string
          generation_batch_id?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          next_generation_time?: string | null
          published_at?: string
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author?: string | null
          auto_generated?: boolean | null
          category?: string
          content?: string
          country?: string
          created_at?: string
          generation_batch_id?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          next_generation_time?: string | null
          published_at?: string
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      cached_articles: {
        Row: {
          cached_at: string
          category: string | null
          content: string | null
          description: string | null
          enhanced_content: string | null
          enhanced_title: string | null
          id: string
          key_points: string[] | null
          published_at: string
          seo_optimized: boolean | null
          source_name: string
          summary: string | null
          tags: string[] | null
          title: string
          url: string
          url_to_image: string | null
        }
        Insert: {
          cached_at?: string
          category?: string | null
          content?: string | null
          description?: string | null
          enhanced_content?: string | null
          enhanced_title?: string | null
          id?: string
          key_points?: string[] | null
          published_at: string
          seo_optimized?: boolean | null
          source_name: string
          summary?: string | null
          tags?: string[] | null
          title: string
          url: string
          url_to_image?: string | null
        }
        Update: {
          cached_at?: string
          category?: string | null
          content?: string | null
          description?: string | null
          enhanced_content?: string | null
          enhanced_title?: string | null
          id?: string
          key_points?: string[] | null
          published_at?: string
          seo_optimized?: boolean | null
          source_name?: string
          summary?: string | null
          tags?: string[] | null
          title?: string
          url?: string
          url_to_image?: string | null
        }
        Relationships: []
      }
      gnews_api_keys: {
        Row: {
          api_key: string
          created_at: string | null
          id: string
          is_active: boolean | null
          key_name: string | null
          last_used: string | null
        }
        Insert: {
          api_key: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key_name?: string | null
          last_used?: string | null
        }
        Update: {
          api_key?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key_name?: string | null
          last_used?: string | null
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          author: string | null
          category: string | null
          created_at: string
          excerpt: string | null
          full_content: string | null
          id: string
          image_url: string | null
          original_title: string
          original_url: string | null
          published_at: string | null
          region: string | null
          rephrased_at: string | null
          rephrased_title: string | null
          scraped_at: string | null
          source_id: number | null
          source_name: string
          source_url: string | null
          status: string | null
          summary: string | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          created_at?: string
          excerpt?: string | null
          full_content?: string | null
          id?: string
          image_url?: string | null
          original_title: string
          original_url?: string | null
          published_at?: string | null
          region?: string | null
          rephrased_at?: string | null
          rephrased_title?: string | null
          scraped_at?: string | null
          source_id?: number | null
          source_name?: string
          source_url?: string | null
          status?: string | null
          summary?: string | null
        }
        Update: {
          author?: string | null
          category?: string | null
          created_at?: string
          excerpt?: string | null
          full_content?: string | null
          id?: string
          image_url?: string | null
          original_title?: string
          original_url?: string | null
          published_at?: string | null
          region?: string | null
          rephrased_at?: string | null
          rephrased_title?: string | null
          scraped_at?: string | null
          source_id?: number | null
          source_name?: string
          source_url?: string | null
          status?: string | null
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_articles_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "news_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      news_sources: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean | null
          name: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          connected_devices: Json | null
          country: string
          created_at: string | null
          email_verification_sent_at: string | null
          email_verification_token: string | null
          email_verified: boolean | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          phone_number: string | null
          updated_at: string | null
          username: string
          verification_completed_at: string | null
          verification_sent_at: string | null
          verification_token: string | null
        }
        Insert: {
          avatar_url?: string | null
          connected_devices?: Json | null
          country: string
          created_at?: string | null
          email_verification_sent_at?: string | null
          email_verification_token?: string | null
          email_verified?: boolean | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          phone_number?: string | null
          updated_at?: string | null
          username: string
          verification_completed_at?: string | null
          verification_sent_at?: string | null
          verification_token?: string | null
        }
        Update: {
          avatar_url?: string | null
          connected_devices?: Json | null
          country?: string
          created_at?: string | null
          email_verification_sent_at?: string | null
          email_verification_token?: string | null
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          phone_number?: string | null
          updated_at?: string | null
          username?: string
          verification_completed_at?: string | null
          verification_sent_at?: string | null
          verification_token?: string | null
        }
        Relationships: []
      }
      saved_articles: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          published_at: string | null
          source_name: string | null
          title: string
          updated_at: string
          url: string
          view_count: number | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          source_name?: string | null
          title: string
          updated_at?: string
          url: string
          view_count?: number | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          source_name?: string | null
          title?: string
          updated_at?: string
          url?: string
          view_count?: number | null
        }
        Relationships: []
      }
      scraper_config: {
        Row: {
          created_at: string | null
          enable_categorization: boolean
          extract_full_content: boolean
          id: number
          indian_articles_per_source: number
          international_articles_per_source: number
          interval_minutes: number | null
          is_active: boolean | null
          last_run_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enable_categorization?: boolean
          extract_full_content?: boolean
          id?: number
          indian_articles_per_source?: number
          international_articles_per_source?: number
          interval_minutes?: number | null
          is_active?: boolean | null
          last_run_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enable_categorization?: boolean
          extract_full_content?: boolean
          id?: number
          indian_articles_per_source?: number
          international_articles_per_source?: number
          interval_minutes?: number | null
          is_active?: boolean | null
          last_run_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      spotlight_articles: {
        Row: {
          casualties_count: number | null
          content: string
          created_at: string
          emergency_contacts: Json | null
          event_type: string
          expires_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          live_updates: Json[] | null
          location: string | null
          priority: number | null
          sources: Json[] | null
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string
          video_urls: string[] | null
        }
        Insert: {
          casualties_count?: number | null
          content: string
          created_at?: string
          emergency_contacts?: Json | null
          event_type: string
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          live_updates?: Json[] | null
          location?: string | null
          priority?: number | null
          sources?: Json[] | null
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          video_urls?: string[] | null
        }
        Update: {
          casualties_count?: number | null
          content?: string
          created_at?: string
          emergency_contacts?: Json | null
          event_type?: string
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          live_updates?: Json[] | null
          location?: string | null
          priority?: number | null
          sources?: Json[] | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          video_urls?: string[] | null
        }
        Relationships: []
      }
      spotlight_news: {
        Row: {
          black_box_found: boolean | null
          casualties_count: number | null
          created_at: string
          date: string
          emergency_contacts: Json | null
          full_report: string | null
          gemini_topic: string
          id: string
          image_url: string | null
          location: string | null
          seo_title: string | null
          summary: string | null
          survivors_count: number | null
          updated_at: string
        }
        Insert: {
          black_box_found?: boolean | null
          casualties_count?: number | null
          created_at?: string
          date: string
          emergency_contacts?: Json | null
          full_report?: string | null
          gemini_topic: string
          id?: string
          image_url?: string | null
          location?: string | null
          seo_title?: string | null
          summary?: string | null
          survivors_count?: number | null
          updated_at?: string
        }
        Update: {
          black_box_found?: boolean | null
          casualties_count?: number | null
          created_at?: string
          date?: string
          emergency_contacts?: Json | null
          full_report?: string | null
          gemini_topic?: string
          id?: string
          image_url?: string | null
          location?: string | null
          seo_title?: string | null
          summary?: string | null
          survivors_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_bookmarks: {
        Row: {
          article_url: string
          bookmarked_at: string
          description: string | null
          id: string
          image_url: string | null
          source_name: string | null
          title: string
          user_id: string
        }
        Insert: {
          article_url: string
          bookmarked_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          source_name?: string | null
          title: string
          user_id: string
        }
        Update: {
          article_url?: string
          bookmarked_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          source_name?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_spotlight: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_unverified_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_verification_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      increment_article_views: {
        Args: { article_url: string }
        Returns: undefined
      }
      is_valid_email_domain: {
        Args: { email_address: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
