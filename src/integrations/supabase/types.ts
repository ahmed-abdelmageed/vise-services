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
      application_status: {
        Row: {
          application_id: string | null
          id: string
          notes: string | null
          status: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          application_id?: string | null
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          application_id?: string | null
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_status_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "visa_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      client_documents: {
        Row: {
          client_id: string | null
          document_name: string
          document_type: string
          file_size: number | null
          id: string
          mime_type: string | null
          public_url: string | null
          storage_path: string
          uploaded_at: string | null
        }
        Insert: {
          client_id?: string | null
          document_name: string
          document_type: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          public_url?: string | null
          storage_path: string
          uploaded_at?: string | null
        }
        Update: {
          client_id?: string | null
          document_name?: string
          document_type?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          public_url?: string | null
          storage_path?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "visa_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      client_invoices: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string | null
          currency: string | null
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string | null
          payment_date: string | null
          service_description: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          issue_date?: string | null
          payment_date?: string | null
          service_description?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string | null
          payment_date?: string | null
          service_description?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "visa_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      visa_applications: {
        Row: {
          adults: number
          children: number
          country: string
          created_at: string | null
          email: string
          email_sent: boolean | null
          first_name: string
          id: string
          last_name: string | null
          passport_files: Json | null
          phone: string | null
          photo_files: Json | null
          reference_id: string | null
          service_type: string
          status: string | null
          total_price: number
          travel_date: string | null
          updated_at: string | null
          visa_type: string | null
        }
        Insert: {
          adults?: number
          children?: number
          country: string
          created_at?: string | null
          email: string
          email_sent?: boolean | null
          first_name: string
          id?: string
          last_name?: string | null
          passport_files?: Json | null
          phone?: string | null
          photo_files?: Json | null
          reference_id?: string | null
          service_type: string
          status?: string | null
          total_price: number
          travel_date?: string | null
          updated_at?: string | null
          visa_type?: string | null
        }
        Update: {
          adults?: number
          children?: number
          country?: string
          created_at?: string | null
          email?: string
          email_sent?: boolean | null
          first_name?: string
          id?: string
          last_name?: string | null
          passport_files?: Json | null
          phone?: string | null
          photo_files?: Json | null
          reference_id?: string | null
          service_type?: string
          status?: string | null
          total_price?: number
          travel_date?: string | null
          updated_at?: string | null
          visa_type?: string | null
        }
        Relationships: []
      }
      visa_services: {
        Row: {
          active: boolean
          baseprice: number
          created_at: string
          display_order: number
          flag: string | null
          formdescription: string
          formdescription_ar: string | null
          formtitle: string
          formtitle_ar: string | null
          id: string
          processingtime: string | null
          processingtime_ar: string | null
          requiresappointmenttypeselection: boolean
          requireslocationselection: boolean
          requiresmothersname: boolean
          requiresnationalityselection: boolean
          requiressaudiidiqama: boolean
          requiresserviceselection: boolean
          requiresvisacityselection: boolean
          title: string
          title_ar: string | null
          updated_at: string
          usavisacities: Json | null
        }
        Insert: {
          active?: boolean
          baseprice?: number
          created_at?: string
          display_order?: number
          flag?: string | null
          formdescription: string
          formdescription_ar?: string | null
          formtitle: string
          formtitle_ar?: string | null
          id?: string
          processingtime?: string | null
          processingtime_ar?: string | null
          requiresappointmenttypeselection?: boolean
          requireslocationselection?: boolean
          requiresmothersname?: boolean
          requiresnationalityselection?: boolean
          requiressaudiidiqama?: boolean
          requiresserviceselection?: boolean
          requiresvisacityselection?: boolean
          title: string
          title_ar?: string | null
          updated_at?: string
          usavisacities?: Json | null
        }
        Update: {
          active?: boolean
          baseprice?: number
          created_at?: string
          display_order?: number
          flag?: string | null
          formdescription?: string
          formdescription_ar?: string | null
          formtitle?: string
          formtitle_ar?: string | null
          id?: string
          processingtime?: string | null
          processingtime_ar?: string | null
          requiresappointmenttypeselection?: boolean
          requireslocationselection?: boolean
          requiresmothersname?: boolean
          requiresnationalityselection?: boolean
          requiressaudiidiqama?: boolean
          requiresserviceselection?: boolean
          requiresvisacityselection?: boolean
          title?: string
          title_ar?: string | null
          updated_at?: string
          usavisacities?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_reference_id: {
        Args: Record<PropertyKey, never>
        Returns: string
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
