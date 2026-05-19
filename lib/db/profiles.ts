import { isSupabaseConfigured } from "@/lib/supabase/check";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";
import {
  me as placeholderMe,
  getProfileByUsername as phByUsername,
} from "@/lib/db/placeholder";

export async function getProfileById(id: string): Promise<Profile | null> {
  if (!isSupabaseConfigured()) {
    return id === placeholderMe.id ? placeholderMe : null;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.warn("[profiles.getProfileById] error:", error.message);
    return null;
  }
  return (data as Profile) ?? null;
}

export async function getProfileByUsername(
  username: string,
): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return phByUsername(username);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (error) {
    console.warn("[profiles.getProfileByUsername] error:", error.message);
    return null;
  }
  return (data as Profile) ?? null;
}

export async function isUsernameAvailable(
  username: string,
  exceptId?: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;
  const supabase = await createClient();
  let q = supabase.from("profiles").select("id").eq("username", username);
  if (exceptId) q = q.neq("id", exceptId);
  const { data } = await q.maybeSingle();
  return !data;
}
