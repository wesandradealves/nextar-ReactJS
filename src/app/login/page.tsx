"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMetadata } from '@/hooks/useMetadata';
import { useAuth } from '@/context/auth';
import { useLoader } from '@/context/spinner';
import { LoginFormData } from '@/types';
import { Logo, Button } from '@/components/atoms';
import { FormField } from '@/components/molecules';
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
 * Utiliza React Hook Form para gerenciamento do formulário
 * Integrado com o contexto de autenticação e loading
 */
export default function Login() {
  const { login } = useAuth();
  const { setLoading } = useLoader();
  const [loginError, setLoginError] = useState<string>('');

  useMetadata({
    title: `Nextar - Login`,
    ogTitle: `Nextar - Login`
  });

  // Configuração do React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  /**
   * Função para processar o envio do formulário
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError('');
      setLoading(true);
      
      await login(data.email, data.password, data.rememberMe);
    } catch (error) {
      console.error('❌ Erro no login do formulário:', error);
      setLoginError('Credenciais inválidas. Verifique seu email e senha.');
      reset({ password: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo variant="login" size="large" />

        <FormSection>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              id="email"
              label="Email"
              type="email"
              placeholder="Digite seu email"
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
              error={errors.email?.message}
              required
            />

            <FormField
              id="password"
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              {...register('password', {
                required: 'Senha é obrigatória',
                minLength: {
                  value: 3,
                  message: 'Senha deve ter pelo menos 3 caracteres'
                }
              })}
              error={errors.password?.message}
              required
              helpText="Mínimo 3 caracteres"
            />

            <CheckboxGroup>
              <Checkbox
                id="rememberMe"
                type="checkbox"
                {...register('rememberMe')}
              />
              <CheckboxLabel htmlFor="rememberMe">
                Lembrar de mim <small>(manter logado por 30 dias)</small>
              </CheckboxLabel>
            </CheckboxGroup>

            {loginError && (
              <ErrorMessage $isGlobal>{loginError}</ErrorMessage>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

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