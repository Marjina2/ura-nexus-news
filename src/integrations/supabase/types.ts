export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      profiles: {
        Row: {
          avatar_url: string | null
          country: string
          created_at: string | null
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
          country: string
          created_at?: string | null
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
          country?: string
          created_at?: string | null
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
      generate_verification_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      increment_article_views: {
        Args: { article_url: string }
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
