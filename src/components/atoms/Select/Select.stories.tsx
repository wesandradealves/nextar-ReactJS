import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './index';

const meta = {
  title: 'Atoms/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    hasError: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Selecione uma opção',
    children: (
      <>
        <option value="1">Opção 1</option>
        <option value="2">Opção 2</option>
        <option value="3">Opção 3</option>
      </>
    ),
  },
};

export const WithOptions: Story = {
  args: {
    placeholder: 'Selecione um status',
    options: [
      { value: 'ativo', label: 'Ativo' },
      { value: 'inativo', label: 'Inativo' },
      { value: 'pendente', label: 'Pendente' },
    ],
  },
};

export const WithError: Story = {
  args: {
    hasError: true,
    placeholder: 'Campo obrigatório',
    options: [
      { value: '1', label: 'Opção 1' },
      { value: '2', label: 'Opção 2' },
    ],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Campo desabilitado',
    options: [
      { value: '1', label: 'Opção 1' },
      { value: '2', label: 'Opção 2' },
    ],
  },
};

export const WithValue: Story = {
  args: {
    value: '2',
    options: [
      { value: '1', label: 'Opção 1' },
      { value: '2', label: 'Opção 2 (Selecionada)' },
      { value: '3', label: 'Opção 3' },
    ],
  },
};
