"use client";

import { useState } from 'react';
import { useMetadata } from '@/hooks/useMetadata';
import { useAuth } from '@/context/auth';
import { useLoader } from '@/context/spinner';
import { Logo } from '@/components/atoms';
import { FormContainer, FormFieldConfig } from '@/components/molecules';
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
    <LoginContainer>
      <LoginCard>
        <Logo variant="login" size="large" />

        <FormSection>
          <FormContainer
            fields={loginFields}
            onSubmit={handleSubmit}
            submitText="Entrar"
            validateOnBlur
            validateOnChange={false}
          >
            <CheckboxGroup>
              <Checkbox
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <CheckboxLabel htmlFor="rememberMe">
                Lembrar de mim <small>(manter logado por 30 dias)</small>
              </CheckboxLabel>
            </CheckboxGroup>

            {loginError && (
              <ErrorMessage $isGlobal>{loginError}</ErrorMessage>
            )}
          </FormContainer>

          <HelpSection>
            <HelpText>
              Use as credenciais de teste:
              <br />
              <strong>Email:</strong> admin@nextar.com
              <br />
              <strong>Senha:</strong> admin123
              <br /><br />
              Outros usuários disponíveis:
              <br />
              <small>
                • ana.silva@antartica.br / admin123 (Gestão)
                <br />
                • carlos.oliveira@antartica.br / agente123 (Agente)
                <br />
                • maria.santos@antartica.br / pesq123 (Pesquisador)
              </small>
            </HelpText>
          </HelpSection>
        </FormSection>
      </LoginCard>
    </LoginContainer>
  );
}