export interface IDashboard {
    id: number
    dashboard_title: string
    created_by: {
        first_name: string
        last_name: string
        id: number
    }
    changed_by: {
        first_name: string
        last_name: string
        id: number
    }
    created_on_delta_humanized: string
    changed_on_delta_humanized: string
    is_managed_externally: boolean
    status: string
}