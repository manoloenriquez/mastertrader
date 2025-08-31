import React from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { useState } from "react";
import { User } from "../types/database";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function signup() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const register = async () => {
    try {
      const signupRes = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (signupRes.error) {
        throw signupRes.error;
      }

      const insertRes = await supabase.from("users").insert<User>({
        id: signupRes.data.user.id,
        username: username,
        balance: 50000
      });

      if (insertRes.error) {
        throw insertRes.error;
      }

      console.log(`Registered ${username}, UUID: ${signupRes.data.user.id}`);
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout>
      <div className="vh-100 d-flex justify-content-center">
        <div className="form-access my-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              register();
            }}
          >
            <span>Create Account</span>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create Account
            </button>
          </form>
          <h2>
            Already have an account?
            <Link href="/login"> Sign in here</Link>
          </h2>
        </div>
      </div>
    </Layout>
  );
}
