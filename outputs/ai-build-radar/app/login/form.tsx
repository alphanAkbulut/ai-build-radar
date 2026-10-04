"use client";
import {useActionState} from 'react';
import {signIn} from './actions';
export function LoginForm({local}:{local:boolean}){const [state,action,pending]=useActionState(signIn,{error:''});return <form action={action} className="login-form">{!local&&<label>E-posta<input name="email" type="email" autoComplete="username" required/></label>}<label>{local?'Yerel erişim parolası':'Parola'}<input name="password" type="password" autoComplete="current-password" required/></label>{state.error&&<p className="error" role="alert">{state.error}</p>}<button className="primary" disabled={pending}>{pending?'Doğrulanıyor…':'Private workspace’e gir →'}</button></form>;}
