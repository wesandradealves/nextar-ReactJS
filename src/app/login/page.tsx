"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMetadata } from '@/hooks/useMetadata';
import { useAuth } from '@/context/auth';
import { useLoader } from '@/context/spinner';
import { LoginFormData } from '@/types';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
  LoginContainer,
  LoginCard,
  LogoSection,
  Logo,
  FormSection,
  FormGroup,
  Label,
  Input,
  CheckboxGroup,
  Checkbox,
  CheckboxLabel,
  ErrorMessage,
  SubmitButton,
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
      
      console.log('📝 Formulário de login enviado:', { 
        email: data.email, 
        rememberMe: data.rememberMe 
      });
      
      await login(data.email, data.password, data.rememberMe);
      
      console.log('✅ Login concluído no formulário');
      // Login bem-sucedido - o contexto cuidará do redirect
    } catch (error) {
      console.error('❌ Erro no login do formulário:', error);
      setLoginError('Credenciais inválidas. Verifique seu email e senha.');
      reset({ password: '' }); // Limpar apenas o campo de senha
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LogoSection>
          <Logo>
            <LazyLoadImage src='/logo.png' />
          </Logo>
        </LogoSection>

        <FormSection>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                {...register('email', {
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
                $hasError={!!errors.email}
              />
              {errors.email && (
                <ErrorMessage>{errors.email.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                {...register('password', {
                  required: 'Senha é obrigatória',
                  minLength: {
                    value: 3,
                    message: 'Senha deve ter pelo menos 3 caracteres'
                  }
                })}
                $hasError={!!errors.password}
              />
              {errors.password && (
                <ErrorMessage>{errors.password.message}</ErrorMessage>
              )}
            </FormGroup>

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

            <SubmitButton
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </SubmitButton>
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