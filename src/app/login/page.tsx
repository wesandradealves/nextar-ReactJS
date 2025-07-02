"use client";

import { useState } from 'react';
import { useMetadata } from '@/hooks/useMetadata';
import { useAuth } from '@/context/auth';
import { useLoader } from '@/context/spinner';
import { Logo } from '@/components/atoms';
import FormContainer from '@/components/molecules/FormContainer';
import type { FormFieldConfig } from '@/components/molecules/FormContainer/types';
import {
  LoginContainer,
  LoginCard,
  FormSection,
  CheckboxGroup,
  Checkbox,
  CheckboxLabel,
  ErrorMessage,
  HelpSection,
  HelpText
} from './styles';

/**
 * Componente de página de login
 * Utiliza FormContainer para gerenciamento do formulário com validação
 * Integrado com o contexto de autenticação e loading
 */
export default function Login() {
  const { login } = useAuth();
  const { setLoading } = useLoader();
  const [loginError, setLoginError] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  useMetadata({
    title: `Nextar - Login`,
    ogTitle: `Nextar - Login`
  });

  // Configuração dos campos do formulário
  const loginFields: FormFieldConfig[] = [
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Digite seu email',
      required: true,
      validation: {
        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
      }
    },
    {
      id: 'password',
      label: 'Senha',
      type: 'password',
      placeholder: 'Digite sua senha',
      required: true,
      helpText: 'Mínimo 3 caracteres',
      validation: {
        minLength: 3
      }
    }
  ];

  /**
   * Função para processar o envio do formulário
   */
  const handleSubmit = async (data: Record<string, string>) => {
    try {
      setLoginError('');
      setLoading(true);
      
      await login(data.email, data.password, rememberMe);
    } catch (error) {
      console.error('❌ Erro no login do formulário:', error);
      setLoginError('Credenciais inválidas. Verifique seu email e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-800 dark:to-purple-900 p-4">
      <LoginCard className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transition-all duration-300">
        <div className="flex justify-center py-6">
          <Logo variant="login" size="large" />
        </div>

        <FormSection className="px-8 pb-8">
          <FormContainer
            fields={loginFields}
            onSubmit={handleSubmit}
            submitText="Entrar"
            validateOnBlur
            validateOnChange={false}
          >
            <CheckboxGroup className="flex items-center mb-4">
              <Checkbox
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 mr-2 border-2 border-gray-300 rounded appearance-none cursor-pointer checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              />
              <CheckboxLabel htmlFor="rememberMe" className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                Lembrar de mim <small className="text-xs text-gray-500 dark:text-gray-400">(manter logado por 30 dias)</small>
              </CheckboxLabel>
            </CheckboxGroup>

            {loginError && (
              <ErrorMessage $isGlobal className="text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-5 text-sm">
                {loginError}
              </ErrorMessage>
            )}
          </FormContainer>

          <HelpSection className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <HelpText className="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed">
              Use as credenciais de teste:
              <br />
              <strong className="font-medium text-gray-800 dark:text-gray-200">Email:</strong> admin@nextar.com
              <br />
              <strong className="font-medium text-gray-800 dark:text-gray-200">Senha:</strong> admin123
              <br /><br />
              Outros usuários disponíveis:
              <br />
              <small className="text-xs text-gray-500 dark:text-gray-400">
                pesquisador@nextar.com / pesq123
                <br />
                agente@nextar.com / agente123
              </small>
            </HelpText>
          </HelpSection>
        </FormSection>
      </LoginCard>
    </LoginContainer>
  );
}