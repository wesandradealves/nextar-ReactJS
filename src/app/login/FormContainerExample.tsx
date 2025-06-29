import React from 'react';
import { FormContainer, FormFieldConfig } from '@/components/molecules';
import { LoginCard, FormSection } from './styles';

/**
 * Exemplo de integração do FormContainer na tela de login
 */
export const LoginWithFormContainer: React.FC = () => {
  const loginFields: FormFieldConfig[] = [
    {
      id: 'email',
      label: 'E-mail',
      type: 'email',
      placeholder: 'Digite seu e-mail',
      required: true,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      }
    },
    {
      id: 'password',
      label: 'Senha',
      type: 'password',
      placeholder: 'Digite sua senha',
      required: true,
      validation: {
        minLength: 6
      }
    }
  ];

  const handleLogin = async (data: Record<string, string>) => {
    console.log('Login data:', data);
    // Aqui faria a autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Login realizado com: ${data.email}`);
  };

  return (
    <LoginCard>
      <FormSection>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1f2937' }}>
          Entrar no Sistema
        </h2>
        
        <FormContainer
          fields={loginFields}
          onSubmit={handleLogin}
          submitText="Entrar"
          validateOnBlur
          validateOnChange={false}
        />
      </FormSection>
    </LoginCard>
  );
};
