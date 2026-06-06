import { redirect } from "next/navigation";

/** Compat — older /en/studio/poems/new traffic is moved to /en/studio/new. */
export default function StudioPoemsNewRedirect() {
  redirect("/en/studio/new");
}
