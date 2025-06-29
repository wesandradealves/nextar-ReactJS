"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useMetadata } from '@/hooks/useMetadata';
import { useAuth } from '@/context/auth';
import { useLoader } from '@/context/spinner';
import { LoginFormData } from '@/types';

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
      
      await login(data.email, data.password);
      
      // Login bem-sucedido - o middleware cuidará do redirect
    } catch (error) {
      console.error('Erro no login:', error);
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
          <Logo>Nextar</Logo>
          <Subtitle>Sistema de Manutenção</Subtitle>
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
                Lembrar de mim
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

/**
 * Styled Components para a página de login
 */
const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  width: 100%;
  max-width: 400px;
`;

const LogoSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  text-align: center;
  color: white;
`;

const Logo = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
`;

const FormSection = styled.div`
  padding: 40px 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.$hasError ? '#ef4444' : '#e5e7eb'};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    border-color: ${props => props.$hasError ? '#ef4444' : '#667eea'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const Checkbox = styled.input`
  margin-right: 8px;
  width: 16px;
  height: 16px;
`;

const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
`;

const ErrorMessage = styled.div<{ $isGlobal?: boolean }>`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: ${props => props.$isGlobal ? '0' : '4px'};
  margin-bottom: ${props => props.$isGlobal ? '20px' : '0'};
  padding: ${props => props.$isGlobal ? '12px 16px' : '0'};
  background-color: ${props => props.$isGlobal ? '#fef2f2' : 'transparent'};
  border: ${props => props.$isGlobal ? '1px solid #fecaca' : 'none'};
  border-radius: ${props => props.$isGlobal ? '8px' : '0'};
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &:active {
    transform: translateY(0);
  }
`;

const HelpSection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
`;

const HelpText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin: 0;
  line-height: 1.5;

  strong {
    color: #374151;
  }
`;