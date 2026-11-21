import Link from "next/link";
import LoginForm from "@/components/LoginForm";
import SocialButtons from "@/components/SocialButtons";
import LangToggle from "@/components/LangToggle";
import { authText } from "@/data/authText";
import { getLang } from "@/lib/i18n";
import { safeNext } from "@/lib/redirect";

export default async function LoginPage({ searchParams }) {
  const lang = await getLang();
  const a = authText[lang];
  const { next: rawNext } = await searchParams;
  const next = safeNext(rawNext);
  const registerHref = next === "/" ? "/register" : `/register?next=${encodeURIComponent(next)}`;

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
        <h1 className="text-2xl font-bold">{a.loginTitle}</h1>
        <LoginForm
          lang={lang}
          next={next}
          labels={{
            email: a.email,
            password: a.password,
            submit: a.signIn,
            wait: a.wait,
            success: a.welcome,
            fail: a.signInFail,
          }}
        />
        <SocialButtons orText={a.or} failText={a.signInFail} next={next} />
        <p className="mt-6 text-sm text-center text-gray-600">
          {a.newUser}{" "}
          <Link href={registerHref} className="text-brand font-semibold">
            {a.signUp}
          </Link>
        </p>
      </div>
    </main>
  );
}