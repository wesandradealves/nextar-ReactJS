"use client";

import React from 'react';
import { useMetadata } from '@/hooks/useMetadata';

export default function Login() {
  useMetadata({
    title: `Nextar - Login`,
    ogTitle: `Nextar - Login`
  });

  return <>Login</>;
}