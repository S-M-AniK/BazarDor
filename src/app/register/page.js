import Link from "next/link";
import RegisterForm from "@/components/RegisterForm";
import SocialButtons from "@/components/SocialButtons";
import LangToggle from "@/components/LangToggle";
import { authText } from "@/data/authText";
import { getLang } from "@/lib/i18n";

export default async function RegisterPage() {
  const lang = await getLang();
  const a = authText[lang];

  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-brand text-white grid place-items-center text-xl">🛒</span>
            <span className="font-bold">{a.siteName}</span>
          </Link>
          <LangToggle lang={lang} />
        </div>
        <h1 className="text-2xl font-bold">{a.registerTitle}</h1>
        <RegisterForm
          lang={lang}
          labels={{
            name: a.name,
            email: a.email,
            password: a.passwordNew,
            submit: a.signUp,
            wait: a.wait,
            success: a.created,
            fail: a.signUpFail,
          }}
        />
        <SocialButtons orText={a.or} failText={a.signUpFail} />
        <p className="mt-6 text-sm text-center text-gray-600">
          {a.haveAccount}{" "}
          <Link href="/login" className="text-brand font-semibold">
            {a.signIn}
          </Link>
        </p>
      </div>
    </main>
  );
}