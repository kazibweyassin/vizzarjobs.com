import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { EnhancedProfilePage } from "~/components/EnhancedProfilePage";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return <EnhancedProfilePage user={session.user} />;
}
