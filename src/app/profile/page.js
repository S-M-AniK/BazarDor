import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import LogoutButton from "@/components/LogoutButton";
import { getSession } from "@/lib/session";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const { user } = session;

  return (
    <>
      <Navbar />
      <main className="max-w-xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-200 rounded-3xl p-8">
          <div className="w-16 h-16 rounded-full bg-brand-soft text-brand grid place-items-center text-2xl font-bold">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          <LogoutButton className="mt-6 bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-full" />
        </div>
      </main>
    </>
  );
}