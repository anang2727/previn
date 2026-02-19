// app/dashboard-user/page.tsx
import { createClient } from "@/utils/supabase/server"
import DashboardContent from "./DashboardContent"
import { redirect } from "next/navigation"

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <DashboardContent user={user} />
}