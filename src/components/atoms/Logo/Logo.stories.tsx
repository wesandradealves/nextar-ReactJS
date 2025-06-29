import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from './index';

const meta = {
  title: 'Atoms/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'header', 'login'],
      description: 'Variação visual do logo'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do logo'
    },
    src: {
      control: 'text',
      description: 'URL da imagem'
    },
    alt: {
      control: 'text',
      description: 'Texto alternativo'
    }
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'medium',
  },
};

export const Header: Story = {
  args: {
    variant: 'header',
    size: 'small',
  },
};

export const Login: Story = {
  args: {
    variant: 'login',
    size: 'large',
  },
};

export const Small: Story = {
  args: {
    variant: 'default',
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    variant: 'default',
    size: 'large',
  },
};
