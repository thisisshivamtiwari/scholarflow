export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type Role = 'teacher' | 'student' | 'parent' | 'headmaster' | 'admin' | 'superadmin'
type CurriculumStatus = 'draft' | 'pending' | 'locked' | 'change_requested' | 'rejected'
type WeekStatus = 'completed' | 'partial' | 'not_covered'
type Presence = 'present' | 'absent' | 'late'
type GradeCategory = 'exam' | 'test' | 'assessment' | 'behaviour' | 'other'
type ResourceKind = 'video' | 'paper'
type TimetableDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
type RequestStatus = 'pending' | 'approved' | 'rejected'

type DefaultInsert = Record<string, unknown>
type DefaultUpdate = Record<string, unknown>

export type Database = {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string
          external_id: string
          name: string
          academic_year: string
          grade_threshold_percent: number
          attendance_threshold_percent: number
          parent_resource_access: boolean
          session_timeout_minutes: number
          attendance_lock_hours: number
          term_weeks: number
          created_at: string
          updated_at: string
        }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          school_id: string
          username: string
          display_name: string
          email: string
          role: Role
          class_label: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      parent_children: {
        Row: { parent_id: string; student_id: string }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      teacher_workspaces: {
        Row: { teacher_id: string; workspace_id: string }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      workspaces: {
        Row: {
          id: string
          school_id: string
          subject_name: string
          class_label: string
          teacher_user_id: string
          curriculum_status: CurriculumStatus
          submitted_at: string | null
          rejection_reason: string | null
          term_weeks: number | null
          created_at: string
          updated_at: string
        }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      topics: {
        Row: {
          id: string
          workspace_id: string
          heading: string
          sub_heading: string
          description: string
          target_weeks: number[]
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      topic_resources: {
        Row: {
          id: string
          topic_id: string
          kind: ResourceKind
          title: string
          url: string
          storage_path: string | null
          visible_to_students: boolean
          created_at: string
        }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      week_tracking: {
        Row: {
          id: string
          workspace_id: string
          week_index: number
          status: WeekStatus
          remarks: string
        }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      grades: {
        Row: {
          id: string
          workspace_id: string
          student_id: string
          category: GradeCategory
          assessment_name: string
          date: string
          value: string
          remarks: string
          created_at: string
          updated_at: string
        }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      attendance_records: {
        Row: {
          id: string
          workspace_id: string
          student_id: string
          date: string
          presence: Presence
          reason_code: string | null
          locked_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      timetable_slots: {
        Row: {
          id: string
          school_id: string
          day: TimetableDay
          start_time: string
          end_time: string
          subject_name: string
          class_label: string
          teacher_user_id: string | null
          teacher_name: string
          room: string
          workspace_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      change_requests: {
        Row: {
          id: string
          workspace_id: string
          reason: string
          status: RequestStatus
          requested_by: string | null
          requested_at: string
          created_at: string
        }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      account_requests: {
        Row: {
          id: string
          school_id: string | null
          school_external_id: string
          name: string
          email: string
          requested_role: Role
          notes: string | null
          status: RequestStatus
          requested_at: string
          created_at: string
        }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      subject_requests: {
        Row: {
          id: string
          school_id: string
          teacher_id: string
          subject_name: string
          class_label: string
          school_subject_id: string | null
          notes: string
          status: RequestStatus
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      behaviour_records: {
        Row: {
          id: string
          workspace_id: string
          student_id: string
          date: string
          rating: number
          remark: string
          status: RequestStatus
          recorded_by: string
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      student_enrollments: {
        Row: { student_id: string; workspace_id: string }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      year_groups: {
        Row: { id: string; school_id: string; label: string; sort_order: number }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      school_subjects: {
        Row: {
          id: string
          school_id: string
          name: string
          code: string
          year_group_labels: string[]
        }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      grading_schemes: {
        Row: {
          id: string
          school_id: string
          name: string
          scheme_type: string
          config: Json
        }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      attendance_reason_codes: {
        Row: { id: string; school_id: string; code: string; label: string }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          school_id: string | null
          user_id: string | null
          action: string
          table_name: string
          record_id: string | null
          delta: Json | null
          created_at: string
        }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
      notification_log: {
        Row: {
          id: string
          school_id: string | null
          recipient_email: string
          notification_type: string
          payload: Json
          status: string
          created_at: string
        }
        Insert: DefaultInsert
        Update: DefaultUpdate
        Relationships: []
      }
    }
    Views: {
      v_flagged_students: {
        Row: { student_id: string; school_id: string; reason: string }
        Relationships: []
      }
      v_timetable_conflicts: {
        Row: {
          school_id: string
          slot_id: string
          day: string
          start_time: string
          description: string
        }
        Relationships: []
      }
    }
    Functions: {
      resolve_login_email: {
        Args: { p_school_external_id: string; p_username: string }
        Returns: string
      }
      resolve_platform_login_email: {
        Args: { p_username: string }
        Returns: string
      }
      approve_syllabus: { Args: { p_workspace_id: string }; Returns: undefined }
      reject_syllabus: {
        Args: { p_workspace_id: string; p_reason?: string }
        Returns: undefined
      }
      submit_curriculum_for_approval: {
        Args: { p_workspace_id: string }
        Returns: undefined
      }
      approve_change_request: { Args: { p_request_id: string }; Returns: undefined }
      reject_change_request: { Args: { p_request_id: string }; Returns: undefined }
      list_onboarding_schools: {
        Args: Record<string, never>
        Returns: { external_id: string; name: string }[]
      }
      approve_subject_request: { Args: { p_request_id: string }; Returns: string }
      reject_subject_request: { Args: { p_request_id: string }; Returns: undefined }
      approve_behaviour_record: { Args: { p_record_id: string }; Returns: undefined }
      reject_behaviour_record: { Args: { p_record_id: string }; Returns: undefined }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
