"use client"
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

export default function Home() {

  const { data: session } = authClient.useSession()

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    authClient.signUp.email({
      email,
      password,
      name,
    }, {
      onRequest: (ctx) => {

      },
      onSuccess: (ctx) => {
        window.alert("User created successfully");
      },
      onError: (ctx) => {
        alert(ctx.error.message);
      },
    });
  };

  const onLogin = () => {
    authClient.signIn.email({
      email,
      password,
    }, {
      onRequest: (ctx) => {

      },
      onSuccess: (ctx) => {
        window.alert("User logged in successfully");
      },
      onError: (ctx) => {
        alert(ctx.error.message);
      },
    });
  };

  if (session) {
    return (
      <div>
        <h1>Welcome, {session.user.name}</h1>
        <p>Email: {session.user.email}</p>
        <Button onClick={() => authClient.signOut()}>Sign Out</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-3 p-3">
      <div className="flex flex-col gap-4">
        <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button onClick={onSubmit}>Register</Button>
      <div className="flex flex-col gap-4">
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button onClick={onLogin}>Login</Button>
    </div>
  );
}
